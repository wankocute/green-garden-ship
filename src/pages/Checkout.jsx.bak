import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { tinhPhiVanChuyen } from "../shippingCalculator";
import pricing from "../pricing.json";
import { tinhThanh, suyRaKhuVuc, TINH_SHOP } from "../diaChinh";
import { apMaGiamGia, uocTinhThoiGian, danhSachMa } from "../khuyenMai";

function dinhDang(so) {
  return so.toLocaleString("vi-VN") + " đ";
}

export default function Checkout() {
  const { cart, tongTienHang, xoaHetGio } = useCart();
  const { currentUser, dungMa } = useAuth();
  const navigate = useNavigate();

  const [hoTen, setHoTen] = useState(currentUser?.name || "");
  const [sdt, setSdt] = useState("");
  const [tinh, setTinh] = useState(currentUser?.tinh || "Cần Thơ");
  const [diaChi, setDiaChi] = useState(currentUser?.diaChi || "");
  const [maDichVu, setMaDichVu] = useState("tieu_chuan");
  const [coCOD, setCoCOD] = useState(false);
  const [datThanhCong, setDatThanhCong] = useState(false);

  // Mã giảm giá
  const [maNhap, setMaNhap] = useState("");
  const [maDaAp, setMaDaAp] = useState(null);
  const [thongBaoMa, setThongBaoMa] = useState("");

  if (cart.length === 0 && !datThanhCong) {
    return (
      <div className="section center">
        <h3>Giỏ hàng trống, không có gì để thanh toán.</h3>
        <button className="btn-primary" onClick={() => navigate("/products")}>Mua sắm ngay</button>
      </div>
    );
  }

  // Suy ra khu vực + tính ship
  const maKhuVuc = suyRaKhuVuc(tinh);
  const tenKhuVuc = pricing.khuVuc[maKhuVuc].ten;
  const thoiGianGiao = uocTinhThoiGian(maKhuVuc, maDichVu);

  const tongKhoiLuong = cart.reduce((s, i) => s + i.weight * i.quantity, 0);
  const maxDim = cart.reduce(
    (m, i) => ({
      dai: Math.max(m.dai, i.dim.dai),
      rong: Math.max(m.rong, i.dim.rong),
      cao: Math.max(m.cao, i.dim.cao),
    }),
    { dai: 0, rong: 0, cao: 0 }
  );

  const kqShip = tinhPhiVanChuyen({
    khoiLuongThuc: tongKhoiLuong,
    dai: maxDim.dai,
    rong: maxDim.rong,
    cao: maxDim.cao,
    maKhuVuc,
    maDichVu,
    coCOD,
    giaTriDonHang: tongTienHang,
  });

  // Áp giảm giá (nếu có mã đã áp)
  const giamTien = maDaAp?.giamTien || 0;
  const giamShip = maDaAp?.giamShip || 0;
  const phiShipSauGiam = Math.max(0, kqShip.tongPhi - giamShip);
  const tongCuoiCung = Math.max(0, tongTienHang - giamTien) + phiShipSauGiam;

  // Mã trong ví của user (nếu đăng nhập)
  const viMa = currentUser?.vouchers || [];

  function thuApMa(ma) {
    const code = (ma || maNhap).trim().toUpperCase();
    if (!code) return;
    const kq = apMaGiamGia(code, tongTienHang, kqShip.tongPhi);
    if (kq.ok) {
      setMaDaAp({ ma: code, giamTien: kq.giamTien, giamShip: kq.giamShip });
      setThongBaoMa("✓ " + kq.message);
      setMaNhap(code);
    } else {
      setMaDaAp(null);
      setThongBaoMa("✗ " + kq.message);
    }
  }

  function goMa() {
    setMaDaAp(null);
    setMaNhap("");
    setThongBaoMa("");
  }

  function datHang() {
    if (!hoTen || !sdt || !diaChi || !tinh) {
      alert("Vui lòng điền đầy đủ họ tên, SĐT, tỉnh/thành và địa chỉ!");
      return;
    }
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push({
      id: "DH" + Date.now(),
      date: new Date().toLocaleDateString("vi-VN"),
      customerName: hoTen,
      phone: sdt,
      address: `${diaChi}, ${tinh}`,
      khuVuc: tenKhuVuc,
      items: cart,
      tienHang: tongTienHang,
      phiShip: phiShipSauGiam,
      maGiamGia: maDaAp?.ma || null,
      total: tongCuoiCung,
      userEmail: currentUser?.email || "khach",
    });
    localStorage.setItem("orders", JSON.stringify(orders));

    // Nếu dùng mã từ ví user thì gỡ mã đó đi
    if (maDaAp && viMa.includes(maDaAp.ma)) {
      dungMa(maDaAp.ma);
    }

    xoaHetGio();
    setDatThanhCong(true);
  }

  if (datThanhCong) {
    return (
      <div className="section center">
        <i className="fas fa-check-circle success-icon"></i>
        <h2>Đặt hàng thành công!</h2>
        <p>Cảm ơn bạn đã mua sắm tại Green Garden. Đơn hàng đang được xử lý.</p>
        <button className="btn-primary" onClick={() => navigate("/")}>Về trang chủ</button>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Thanh toán</h2>
      <div className="checkout-layout">
        {/* THÔNG TIN GIAO HÀNG */}
        <div className="checkout-form">
          <h5>Thông tin nhận hàng</h5>
          <label>Họ và tên</label>
          <input value={hoTen} onChange={(e) => setHoTen(e.target.value)} />
          <label>Số điện thoại</label>
          <input value={sdt} onChange={(e) => setSdt(e.target.value)} />

          <label>Tỉnh / Thành phố</label>
          <select value={tinh} onChange={(e) => setTinh(e.target.value)}>
            {tinhThanh.map((t) => (
              <option key={t.ten} value={t.ten}>{t.ten}</option>
            ))}
          </select>

          <label>Địa chỉ chi tiết</label>
          <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} placeholder="Số nhà, đường, phường/xã" />

          <div className="khu-vuc-auto">
            <i className="fas fa-route"></i> Giao từ <b>{TINH_SHOP}</b> đến <b>{tinh}</b>:
            <span className={`badge-kv kv-${maKhuVuc}`}>{tenKhuVuc}</span>
          </div>

          <h5 className="mt">Tùy chọn vận chuyển</h5>
          <label>Loại dịch vụ</label>
          <select value={maDichVu} onChange={(e) => setMaDichVu(e.target.value)}>
            {Object.entries(pricing.dichVu).map(([ma, dv]) => (
              <option key={ma} value={ma}>{dv.ten}</option>
            ))}
          </select>

          {/* Ước tính thời gian giao */}
          <div className="thoi-gian-giao">
            <i className="fas fa-clock"></i> Thời gian giao dự kiến: <b>{thoiGianGiao}</b>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={coCOD} onChange={(e) => setCoCOD(e.target.checked)} />
            Thanh toán khi nhận hàng (COD)
          </label>
        </div>

        {/* TÓM TẮT ĐƠN */}
        <div className="checkout-summary">
          <h5>Đơn hàng của bạn</h5>
          {cart.map((i) => (
            <div className="sum-item" key={i.id}>
              <span>{i.name} × {i.quantity}</span>
              <span>{dinhDang(i.price * i.quantity)}</span>
            </div>
          ))}
          <hr />

          {/* MÃ GIẢM GIÁ */}
          <div className="voucher-box">
            <div className="voucher-input">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                value={maNhap}
                onChange={(e) => setMaNhap(e.target.value)}
              />
              {maDaAp ? (
                <button className="btn-voucher go" onClick={goMa}>Gỡ</button>
              ) : (
                <button className="btn-voucher" onClick={() => thuApMa()}>Áp dụng</button>
              )}
            </div>
            {thongBaoMa && (
              <p className={`voucher-msg ${maDaAp ? "ok" : "err"}`}>{thongBaoMa}</p>
            )}

            {/* Ví mã của user */}
            {viMa.length > 0 && (
              <div className="vi-ma">
                <span className="vi-ma-title">Mã của bạn:</span>
                {viMa.map((ma) => (
                  <button key={ma} className="ma-chip" onClick={() => thuApMa(ma)} title={danhSachMa[ma]?.moTa}>
                    {ma}
                  </button>
                ))}
              </div>
            )}
          </div>

          <hr />
          <div className="sum-row"><span>Tạm tính</span><b>{dinhDang(tongTienHang)}</b></div>
          {giamTien > 0 && (
            <div className="sum-row giam"><span>Giảm giá ({maDaAp.ma})</span><b>− {dinhDang(giamTien)}</b></div>
          )}

          <div className="ship-detail">
            <div className="ship-head">
              <span>Phí vận chuyển ({tenKhuVuc})</span>
              <b className={giamShip > 0 ? "gach" : ""}>{dinhDang(kqShip.tongPhi)}</b>
            </div>
            {giamShip > 0 && (
              <div className="ship-freeship">Freeship: − {dinhDang(giamShip)} → còn {dinhDang(phiShipSauGiam)}</div>
            )}
            <div className="ship-rows">
              <div><span>KL tính phí</span><span>{kqShip.khoiLuongTinhPhi} kg</span></div>
              <div><span>Phí cơ bản</span><span>{dinhDang(kqShip.chiTiet.phiCoBan)}</span></div>
              {kqShip.chiTiet.phuPhiDichVu > 0 && <div><span>Phụ phí nhanh</span><span>{dinhDang(kqShip.chiTiet.phuPhiDichVu)}</span></div>}
              {kqShip.chiTiet.phuPhiCOD > 0 && <div><span>Phụ phí COD</span><span>{dinhDang(kqShip.chiTiet.phuPhiCOD)}</span></div>}
              {kqShip.chiTiet.phuPhiCongKenh > 0 && <div><span>Phụ phí cồng kềnh</span><span>{dinhDang(kqShip.chiTiet.phuPhiCongKenh)}</span></div>}
            </div>
          </div>

          <hr />
          <div className="sum-row total"><span>Tổng cộng</span><b>{dinhDang(tongCuoiCung)}</b></div>
          <button className="btn-primary full" onClick={datHang}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
}
