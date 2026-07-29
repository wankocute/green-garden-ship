import { useState, useRef, useEffect } from "react";
import { products } from "./products";
import { tinhPhiVanChuyen, layCauHinhKhuVuc } from "./shippingCalculator";
import { tinhThanh, suyRaKhuVuc, TINH_SHOP } from "./diaChinh";
import { useAuth } from "./context/AuthContext";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function dinhDang(so) {
  return so.toLocaleString("vi-VN") + " đ";
}

/**
 * Đổi markdown thô của Gemini thành JSX cho 1 dòng text.
 *  **đậm**  -> <b>đậm</b>
 *  # tiêu đề, * lẻ, ` code -> dọn sạch
 * Không dùng dangerouslySetInnerHTML nên không lo XSS.
 */
function renderDong(dong) {
  const sach = dong
    .replace(/^\s*#{1,6}\s*/, "")   // bỏ ký hiệu tiêu đề đầu dòng
    .replace(/`/g, "");             // bỏ dấu backtick

  return sach
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((phan, k) =>
      phan.startsWith("**") && phan.endsWith("**") ? (
        <b key={k}>{phan.slice(2, -2)}</b>
      ) : (
        <span key={k}>{phan.replace(/\*/g, "")}</span>
      )
    );
}

async function goiGemini(prompt) {
  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

const DANH_MUC = [...new Set(products.map((p) => p.category))];
const DS_TINH = tinhThanh.map((t) => t.ten).join(", ");

export default function Chatbot() {
  const { currentUser } = useAuth();
  const tinhKhachMacDinh = currentUser?.tinh || null;

  const [moRong, setMoRong] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        `Xin chào! Mình là trợ lý của Green Garden 🌿 (shop ở ${TINH_SHOP}).\n` +
        (tinhKhachMacDinh
          ? `Mình thấy địa chỉ của bạn ở ${tinhKhachMacDinh}. `
          : "") +
        'Bạn cho mình biết muốn cây gì, ngân sách ship bao nhiêu nhé. VD: "cây để bàn, ship dưới 50k". Bạn cũng có thể nói gửi đi tỉnh khác.',
    },
  ]);
  const [input, setInput] = useState("");
  const [dangXuLy, setDangXuLy] = useState(false);
  const cuoiChat = useRef(null);

  useEffect(() => {
    cuoiChat.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, moRong]);

  async function guiTinNhan() {
    const cauHoi = input.trim();
    if (!cauHoi || dangXuLy) return;

    setMessages((m) => [...m, { role: "user", text: cauHoi }]);
    setInput("");
    setDangXuLy(true);

    try {
      const promptBocTach = `Bạn là bộ phân tích nhu cầu mua cây cảnh của shop Green Garden (shop đặt tại ${TINH_SHOP}).

CÁC DANH MỤC CÂY: ${DANH_MUC.join(", ")}
DANH SÁCH TỈNH/THÀNH HỢP LỆ: ${DS_TINH}

Câu của khách: "${cauHoi}"
${tinhKhachMacDinh ? `Địa chỉ mặc định của khách (từ tài khoản): ${tinhKhachMacDinh}` : "Khách chưa đăng nhập hoặc chưa có địa chỉ."}

Trả về DUY NHẤT một object JSON (không markdown):
{"danhMuc": "tên danh mục khách muốn hoặc null", "tinhKhach": "tên tỉnh khách muốn gửi tới - nếu khách CÓ nói tỉnh cụ thể thì lấy đúng tên trong danh sách hợp lệ; nếu khách KHÔNG nói thì để null", "maDichVu": "tieu_chuan hoặc nhanh", "nganSachShip": số tiền tối đa cho ship hoặc null, "coCOD": true/false}`;

      const raw = (await goiGemini(promptBocTach)).replace(/```json|```/g, "").trim();
      const nhuCau = JSON.parse(raw);

      const tinhDung = nhuCau.tinhKhach || tinhKhachMacDinh || TINH_SHOP;
      const maKhuVuc = suyRaKhuVuc(tinhDung);
      const maDichVu = nhuCau.maDichVu || "tieu_chuan";
      const tenKhuVuc = layCauHinhKhuVuc(maKhuVuc).ten;

      let danhSach = products;
      if (nhuCau.danhMuc) {
        danhSach = products.filter((p) =>
          p.category.toLowerCase().includes(nhuCau.danhMuc.toLowerCase())
        );
        if (danhSach.length === 0) danhSach = products;
      }

      const ketQua = danhSach.map((p) => {
        const kq = tinhPhiVanChuyen({
          khoiLuongThuc: p.weight,
          dai: p.dim.dai,
          rong: p.dim.rong,
          cao: p.dim.cao,
          maKhuVuc,
          maDichVu,
          coCOD: !!nhuCau.coCOD,
          giaTriDonHang: p.price,
        });
        return {
          ten: p.name,
          gia: p.price,
          phiShip: kq.phiVanChuyen, // cước thuần, KHÔNG gồm COD
          phiCOD: kq.chiTiet.phuPhiCOD,
        };
      });

      let loc = ketQua;
      if (nhuCau.nganSachShip) {
        loc = ketQua.filter((r) => r.phiShip <= nhuCau.nganSachShip);
      }
      loc.sort((a, b) => a.phiShip - b.phiShip);

      const bangKetQua = loc
        .map(
          (r) =>
            `${r.ten}: giá cây ${dinhDang(r.gia)}, phí ship ${dinhDang(r.phiShip)}` +
            (r.phiCOD > 0 ? `, phí thu hộ ${dinhDang(r.phiCOD)}` : "")
        )
        .join("\n");
      const promptTuVan = `Bạn là nhân viên tư vấn thân thiện của shop cây Green Garden, shop đặt tại ${TINH_SHOP}.

Khách yêu cầu: "${cauHoi}"
Giao hàng tới: ${tinhDung} (được xếp loại: ${tenKhuVuc} so với shop ở ${TINH_SHOP}).
${nhuCau.nganSachShip ? `Ngân sách ship tối đa: ${dinhDang(nhuCau.nganSachShip)}.` : ""}

DỮ LIỆU SHIP ĐÃ TÍNH SẴN (BẮT BUỘC dùng đúng số này, không bịa):
${bangKetQua || "(Không có cây nào phù hợp ngân sách ship)"}

Tư vấn ngắn gọn, thân thiện bằng tiếng Việt. Có nhắc tới việc giao hàng đi ${tinhDung} (${tenKhuVuc}). Gợi ý 2-3 cây hợp nhất (ưu tiên ship rẻ), nêu rõ phí ship từng cây. Nếu không cây nào trong ngân sách, nói thật và gợi ý cây ship thấp nhất. KHÔNG bịa thêm cây ngoài danh sách. Viết văn xuôi thuần tiếng Việt, KHÔNG dùng ký hiệu markdown (dấu sao, dấu thăng, gạch đầu dòng) và không kẻ bảng. Muốn liệt kê thì đánh số 1. 2. 3. bình thường.`;

      const traLoi = await goiGemini(promptTuVan);
      setMessages((m) => [...m, { role: "assistant", text: traLoi.trim() }]);
    } catch (err) {
      console.error(err);
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Có lỗi khi xử lý (kiểm tra API key/mạng). Bạn thử lại nhé!" },
      ]);
    }
    setDangXuLy(false);
  }

  return (
    <>
      <button className="chat-fab" onClick={() => setMoRong((v) => !v)}>
        <i className={`fas ${moRong ? "fa-times" : "fa-comment-dots"}`}></i>
      </button>

      {moRong && (
        <div className="chat-window">
          <div className="chat-window-head">
            <i className="fas fa-leaf"></i> Trợ lý AI gợi ý cây
          </div>
          <div className="chat-box">
            {messages.map((m, i) => (
              <div key={i} className={`chat-msg ${m.role}`}>
                {m.text.split("\n").map((d, j) => (
                  <div key={j}>{renderDong(d)}</div>
                ))}
              </div>
            ))}
            {dangXuLy && <div className="chat-msg assistant typing">Đang phân tích & tính phí...</div>}
            <div ref={cuoiChat} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={input}
              placeholder="VD: cây để bàn, ship dưới 50k, gửi ra Hà Nội"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && guiTinNhan()}
            />
            <button onClick={guiTinNhan} disabled={dangXuLy}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
}
