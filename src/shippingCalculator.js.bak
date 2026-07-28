import pricing from "./pricing.json";
// Công thức chuẩn của các đơn vị vận chuyển: D x R x C / 6000
// Trả về đơn vị kg.
export function tinhKhoiLuongQuyDoi(dai, rong, cao) {
  return (dai * rong * cao) / 6000;
}

// So sánh khối lượng thực và khối lượng quy đổi, lấy giá trị LỚN HƠN.
export function layKhoiLuongTinhPhi(khoiLuongThuc, dai, rong, cao) {
  const quyDoi = tinhKhoiLuongQuyDoi(dai, rong, cao);
  return Math.max(khoiLuongThuc, quyDoi);
}

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

// Cộng thêm % trên phí cơ bản (tiêu chuẩn = 0%).
export function tinhPhuPhiDichVu(phiCoBan, maDichVu) {
  const dv = pricing.dichVu[maDichVu];
  return Math.round(phiCoBan * dv.tiLePhuPhi);
}

// COD tính theo % giá trị đơn hàng, nhưng không thấp hơn mức tối thiểu.
export function tinhPhuPhiCOD(giaTriDonHang) {
  const cod = pricing.phuPhi.cod;
  const phi = giaTriDonHang * cod.tiLe;
  return Math.round(Math.max(phi, cod.toiThieu));
}

// Nếu thể tích (D x R x C tính bằng cm3) vượt ngưỡng thì cộng phí cố định.
export function tinhPhuPhiCongKenh(dai, rong, cao) {
  const ck = pricing.phuPhi.congKenh;
  const theTich = dai * rong * cao;
  return theTich > ck.nguongTheTich ? ck.phi : 0;
}

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

  const khoiLuongQuyDoi = tinhKhoiLuongQuyDoi(dai, rong, cao);
  const khoiLuongTinhPhi = layKhoiLuongTinhPhi(khoiLuongThuc, dai, rong, cao);

  const phiCoBan = tinhPhiCoBan(khoiLuongTinhPhi, maKhuVuc);

  const phuPhiDichVu = tinhPhuPhiDichVu(phiCoBan, maDichVu);
  const phuPhiCOD = coCOD ? tinhPhuPhiCOD(giaTriDonHang) : 0;
  const phuPhiCongKenh = tinhPhuPhiCongKenh(dai, rong, cao);

  const tongPhi = phiCoBan + phuPhiDichVu + phuPhiCOD + phuPhiCongKenh;

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
