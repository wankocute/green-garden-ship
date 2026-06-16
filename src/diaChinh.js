// ============================================================
//  DỮ LIỆU HÀNH CHÍNH - 34 tỉnh thành sau sáp nhập (từ 1/7/2025)
//  Mỗi tỉnh gán 1 miền: "bac" | "trung" | "nam"
//  Dùng để suy ra khu vực ship dựa trên tỉnh shop và tỉnh khách.
// ============================================================

// Tỉnh đặt shop (điểm gửi hàng)
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

// Tra miền của một tỉnh theo tên
export function layMien(tenTinh) {
  const t = tinhThanh.find((x) => x.ten === tenTinh);
  return t ? t.mien : null;
}

// ============================================================
//  SUY RA KHU VỰC SHIP dựa trên tỉnh shop và tỉnh khách
//  - Cùng tỉnh với shop        -> noi_tinh
//  - Khác tỉnh nhưng cùng miền  -> noi_mien
//  - Khác miền                  -> lien_mien
// ============================================================
export function suyRaKhuVuc(tinhKhach) {
  if (!tinhKhach) return "noi_tinh";
  if (tinhKhach === TINH_SHOP) return "noi_tinh";

  const mienShop = layMien(TINH_SHOP);
  const mienKhach = layMien(tinhKhach);

  if (mienKhach === mienShop) return "noi_mien";
  return "lien_mien";
}
