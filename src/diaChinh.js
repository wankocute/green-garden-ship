export const TINH_SHOP = "Cần Thơ";

// Danh sách 34 tỉnh thành + miền
export const tinhThanh = [
  // ----- MIỀN BẮC -----
  { ten: "Hà Nội", mien: "bac" },
  { ten: "Hải Phòng", mien: "bac" },
  { ten: "Quảng Ninh", mien: "bac" },
  { ten: "Bắc Ninh", mien: "bac" },
  { ten: "Hưng Yên", mien: "bac" },
  { ten: "Ninh Bình", mien: "bac" },
  { ten: "Phú Thọ", mien: "bac" },
  { ten: "Thái Nguyên", mien: "bac" },
  { ten: "Lạng Sơn", mien: "bac" },
  { ten: "Cao Bằng", mien: "bac" },
  { ten: "Tuyên Quang", mien: "bac" },
  { ten: "Lào Cai", mien: "bac" },
  { ten: "Lai Châu", mien: "bac" },
  { ten: "Điện Biên", mien: "bac" },
  { ten: "Sơn La", mien: "bac" },

  // ----- MIỀN TRUNG -----
  { ten: "Thanh Hóa", mien: "trung" },
  { ten: "Nghệ An", mien: "trung" },
  { ten: "Hà Tĩnh", mien: "trung" },
  { ten: "Huế", mien: "trung" },
  { ten: "Quảng Trị", mien: "trung" },
  { ten: "Đà Nẵng", mien: "trung" },
  { ten: "Quảng Ngãi", mien: "trung" },
  { ten: "Gia Lai", mien: "trung" },
  { ten: "Khánh Hòa", mien: "trung" },
  { ten: "Đắk Lắk", mien: "trung" },
  { ten: "Lâm Đồng", mien: "trung" },

  // ----- MIỀN NAM -----
  { ten: "TP. Hồ Chí Minh", mien: "nam" },
  { ten: "Đồng Nai", mien: "nam" },
  { ten: "Tây Ninh", mien: "nam" },
  { ten: "Đồng Tháp", mien: "nam" },
  { ten: "An Giang", mien: "nam" },
  { ten: "Vĩnh Long", mien: "nam" },
  { ten: "Cần Thơ", mien: "nam" },
  { ten: "Cà Mau", mien: "nam" },
];

// ---------------------------------------------------------------
// Chuẩn hoá tên tỉnh
// ---------------------------------------------------------------

// Rút gọn để so khớp: bỏ dấu, bỏ tiền tố hành chính, gom khoảng trắng.
// "TP. Hồ Chí Minh" -> "ho chi minh"   |   "Thành phố Huế" -> "hue"
function rutGon(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")   // bỏ dấu thanh
    .replace(/đ/g, "d")                 // đ không tách được bằng NFD
    .replace(/[.,\-_]/g, " ")
    .replace(/^\s*(tinh|thanh pho|tp)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Bí danh khách hay gõ. Cố tình KHÔNG thêm mã 2 chữ mơ hồ như
// "dn" (Đà Nẵng hay Đồng Nai?) hay "ct" — thà không nhận còn hơn nhận sai.
const BI_DANH = {
  "hcm": "TP. Hồ Chí Minh",
  "tphcm": "TP. Hồ Chí Minh",
  "ho chi minh": "TP. Hồ Chí Minh",
  "sai gon": "TP. Hồ Chí Minh",
  "sg": "TP. Hồ Chí Minh",
  "ha noi": "Hà Nội",
  "hn": "Hà Nội",
  "hai phong": "Hải Phòng",
  "hp": "Hải Phòng",
  "thua thien hue": "Huế",
  "da lat": "Lâm Đồng",
  "nha trang": "Khánh Hòa",
  "buon ma thuot": "Đắk Lắk",
  "daklak": "Đắk Lắk",
  "vinh": "Nghệ An",
};

// Trả về tên tỉnh ĐÚNG CHUẨN trong danh sách, hoặc null nếu không nhận ra.
export function chuanHoaTenTinh(ten) {
  const key = rutGon(ten);
  if (!key) return null;
  if (BI_DANH[key]) return BI_DANH[key];
  const t = tinhThanh.find((x) => rutGon(x.ten) === key);
  return t ? t.ten : null;
}

// Tra miền của một tỉnh theo tên (chấp nhận tên viết tắt / thiếu dấu)
export function layMien(tenTinh) {
  const chuan = chuanHoaTenTinh(tenTinh);
  if (!chuan) return null;
  const t = tinhThanh.find((x) => x.ten === chuan);
  return t ? t.mien : null;
}

export function suyRaKhuVuc(tinhKhach) {
  const chuan = chuanHoaTenTinh(tinhKhach);

  // Không nhận ra tỉnh => báo giá mức CAO NHẤT cho an toàn.
  // (Trước đây trả về noi_tinh — mức rẻ nhất — nên dễ tính thiếu tiền.)
  if (!chuan) return "lien_mien";
  if (chuan === TINH_SHOP) return "noi_tinh";

  const mienShop = layMien(TINH_SHOP);
  const mienKhach = layMien(chuan);
  if (mienKhach && mienKhach === mienShop) return "noi_mien";
  return "lien_mien";
}
