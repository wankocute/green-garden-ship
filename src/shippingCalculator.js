import pricing from "./pricing.json";

// ============================================================
//  MODULE TÍNH PHÍ VẬN CHUYỂN
//  Tách riêng từng hàm để dễ kiểm thử (theo yêu cầu đề tài)
// ============================================================

// --- MỨC 2: Tính khối lượng quy đổi theo thể tích ---
// Công thức chuẩn của các đơn vị vận chuyển: D x R x C / 6000
// Trả về đơn vị kg.
export function tinhKhoiLuongQuyDoi(dai, rong, cao) {
  return (dai * rong * cao) / 6000;
}

// --- MỨC 2: Lấy khối lượng tính phí ---
// So sánh khối lượng thực và khối lượng quy đổi, lấy giá trị LỚN HƠN.
export function layKhoiLuongTinhPhi(khoiLuongThuc, dai, rong, cao) {
  const quyDoi = tinhKhoiLuongQuyDoi(dai, rong, cao);
  return Math.max(khoiLuongThuc, quyDoi);
}

// --- MỨC 3: Tính phí cơ bản theo bậc lũy tiến ---
// 0.5kg đầu tính giá "phiBac0", mỗi 0.5kg tiếp theo cộng "phiMoiBacThem".
// Số lẻ luôn làm tròn LÊN một bậc (vd 1.2kg -> tính như 1.5kg).
export function tinhPhiCoBan(khoiLuongTinhPhi, maKhuVuc) {
  const kv = pricing.khuVuc[maKhuVuc];
  const buoc = pricing.buocKhoiLuong; // 0.5

  // Tổng số bậc 0.5kg (làm tròn lên). Tối thiểu là 1 bậc.
  const soBac = Math.max(1, Math.ceil(khoiLuongTinhPhi / buoc));

  // Bậc đầu tính phiBac0, các bậc còn lại tính phiMoiBacThem.
  const soBacThem = soBac - 1;
  return kv.phiBac0 + soBacThem * kv.phiMoiBacThem;
}

// --- MỨC 2: Phụ phí dịch vụ nhanh ---
// Cộng thêm % trên phí cơ bản (tiêu chuẩn = 0%).
export function tinhPhuPhiDichVu(phiCoBan, maDichVu) {
  const dv = pricing.dichVu[maDichVu];
  return Math.round(phiCoBan * dv.tiLePhuPhi);
}

// --- MỨC 3: Phụ phí thu hộ COD ---
// Tính theo % giá trị đơn hàng, nhưng không thấp hơn mức tối thiểu.
export function tinhPhuPhiCOD(giaTriDonHang) {
  const cod = pricing.phuPhi.cod;
  const phi = giaTriDonHang * cod.tiLe;
  return Math.round(Math.max(phi, cod.toiThieu));
}

// --- MỨC 3: Phụ phí hàng cồng kềnh ---
// Nếu thể tích (D x R x C tính bằng cm3) vượt ngưỡng thì cộng phí cố định.
export function tinhPhuPhiCongKenh(dai, rong, cao) {
  const ck = pricing.phuPhi.congKenh;
  const theTich = dai * rong * cao;
  return theTich > ck.nguongTheTich ? ck.phi : 0;
}

// ============================================================
//  HÀM TỔNG: ghép tất cả lại
//  Nhận vào 1 object thông tin đơn hàng, trả về kết quả + chi tiết
// ============================================================
export function tinhPhiVanChuyen(donHang) {
  const {
    khoiLuongThuc,
    dai,
    rong,
    cao,
    maKhuVuc,
    maDichVu,
    coCOD,
    giaTriDonHang,
  } = donHang;

  // Bước 1: khối lượng tính phí (max giữa thực và quy đổi)
  const khoiLuongQuyDoi = tinhKhoiLuongQuyDoi(dai, rong, cao);
  const khoiLuongTinhPhi = layKhoiLuongTinhPhi(khoiLuongThuc, dai, rong, cao);

  // Bước 2: phí cơ bản theo bậc + khu vực
  const phiCoBan = tinhPhiCoBan(khoiLuongTinhPhi, maKhuVuc);

  // Bước 3: các phụ phí
  const phuPhiDichVu = tinhPhuPhiDichVu(phiCoBan, maDichVu);
  const phuPhiCOD = coCOD ? tinhPhuPhiCOD(giaTriDonHang) : 0;
  const phuPhiCongKenh = tinhPhuPhiCongKenh(dai, rong, cao);

  // Bước 4: tổng cộng
  const tongPhi = phiCoBan + phuPhiDichVu + phuPhiCOD + phuPhiCongKenh;

  // Trả về kèm bảng chi tiết (đảm bảo minh bạch theo yêu cầu đề)
  return {
    khoiLuongThuc,
    khoiLuongQuyDoi: Number(khoiLuongQuyDoi.toFixed(2)),
    khoiLuongTinhPhi: Number(khoiLuongTinhPhi.toFixed(2)),
    chiTiet: {
      phiCoBan,
      phuPhiDichVu,
      phuPhiCOD,
      phuPhiCongKenh,
    },
    tongPhi,
  };
}
