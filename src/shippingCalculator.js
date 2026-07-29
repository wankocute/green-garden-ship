import pricing from "./pricing.json";

const GRAM = 1000;

function soDuong(x, macDinh = 0) {
  const n = Number(x);
  return Number.isFinite(n) && n > 0 ? n : macDinh;
}

function lamTronTien(so) {
  const b = soDuong(pricing.lamTronPhi, 1);
  return Math.ceil(so / b) * b;
}

function heSoQuyDoi() {
  return soDuong(pricing.heSoQuyDoi, 6000);
}

function nguongCongKenh() {
  const ck = pricing.phuPhi.congKenh;
  return {
    phi: soDuong(ck.phi, 0),
    theTich: soDuong(ck.nguongTheTichKien ?? ck.nguongTheTich, Infinity),
    chieuDai: soDuong(ck.nguongChieuDaiCm, Infinity),
  };
}

export function layCauHinhKhuVuc(maKhuVuc) {
  return (
    pricing.khuVuc[maKhuVuc] ||
    pricing.khuVuc[pricing.macDinh?.khuVuc] ||
    Object.values(pricing.khuVuc)[0]
  );
}

export function layCauHinhDichVu(maDichVu) {
  return (
    pricing.dichVu[maDichVu] ||
    pricing.dichVu[pricing.macDinh?.dichVu] ||
    Object.values(pricing.dichVu)[0]
  );
}

// [API cũ] Hai hàm dưới không còn được tinhPhiVanChuyen gọi (nó tính theo
// tổng thể tích cả đơn). Giữ lại để Chatbot / demo / unit test dùng riêng.
export function tinhKhoiLuongQuyDoi(dai, rong, cao) {
  return (soDuong(dai) * soDuong(rong) * soDuong(cao)) / heSoQuyDoi();
}

export function layKhoiLuongTinhPhi(khoiLuongThuc, dai, rong, cao) {
  return Math.max(soDuong(khoiLuongThuc), tinhKhoiLuongQuyDoi(dai, rong, cao));
}

export function quyDoiTuTheTich(theTich) {
  return soDuong(theTich) / heSoQuyDoi();
}

export function theTichKien(dim) {
  if (!dim) return 0;
  return soDuong(dim.dai) * soDuong(dim.rong) * soDuong(dim.cao);
}

export function tinhTongTheTich(danhSach) {
  if (!Array.isArray(danhSach)) return 0;
  return danhSach.reduce(
    (tong, i) => tong + theTichKien(i?.dim) * Math.max(1, soDuong(i?.quantity, 1)),
    0
  );
}

export function tinhPhiCoBan(khoiLuongTinhPhi, maKhuVuc) {
  const kv = layCauHinhKhuVuc(maKhuVuc);
  const buocGram = Math.round(soDuong(pricing.buocKhoiLuong, 0.5) * GRAM);
  const gram = Math.round(soDuong(khoiLuongTinhPhi) * GRAM);

  const soBac = Math.max(1, Math.ceil(gram / buocGram));
  return kv.phiBac0 + (soBac - 1) * kv.phiMoiBacThem;
}

export function tinhPhuPhiDichVu(phiCoBan, maDichVu) {
  const dv = layCauHinhDichVu(maDichVu);
  return lamTronTien(soDuong(phiCoBan) * soDuong(dv.tiLePhuPhi));
}

export function kienBiCongKenh(dim) {
  const ck = nguongCongKenh();
  const dai = soDuong(dim?.dai);
  const rong = soDuong(dim?.rong);
  const cao = soDuong(dim?.cao);
  const canhDaiNhat = Math.max(dai, rong, cao);
  return dai * rong * cao > ck.theTich || canhDaiNhat > ck.chieuDai;
}

// [Quy tắc] Phụ phí cồng kềnh thu MỘT LẦN cho cả đơn nếu có ÍT NHẤT MỘT kiện
// vượt ngưỡng (thể tích hoặc cạnh dài nhất). Theo thông lệ các hãng VN:
// đây là phụ phí xử lý/bốc xếp của chuyến giao, không nhân theo số kiện.
export function tinhPhuPhiCongKenh(a, rong, cao) {
  const ck = nguongCongKenh();
  if (Array.isArray(a)) {
    return a.some((i) => kienBiCongKenh(i?.dim)) ? ck.phi : 0;
  }
  return kienBiCongKenh({ dai: a, rong, cao }) ? ck.phi : 0;
}

export function tinhPhuPhiCongKenhTheoTheTich(theTich) {
  const ck = nguongCongKenh();
  return soDuong(theTich) > ck.theTich ? ck.phi : 0;
}

export function tinhPhuPhiCOD(tienThuHo) {
  const cod = pricing.phuPhi.cod;
  const tien = soDuong(tienThuHo);
  if (tien <= 0) return 0;

  const tran = soDuong(cod.toiDa, Infinity);
  const phi = Math.min(Math.max(tien * cod.tiLe, cod.toiThieu), tran);
  return lamTronTien(phi);
}

export function tinhPhiVanChuyen(donHang = {}) {
  const {
    items,
    khoiLuongThuc,
    dai,
    rong,
    cao,
    theTich,
    maKhuVuc,
    maDichVu,
    coCOD = false,
    giaTriDonHang,
  } = donHang;

  const ds = Array.isArray(items) ? items : [];
  const canhBao = [];

  if (maKhuVuc && !pricing.khuVuc[maKhuVuc]) {
    canhBao.push(`Khu vực "${maKhuVuc}" không có trong bảng giá, đang dùng mức mặc định.`);
  }
  if (maDichVu && !pricing.dichVu[maDichVu]) {
    canhBao.push(`Dịch vụ "${maDichVu}" không có trong bảng giá, đang dùng mức mặc định.`);
  }

  const klThuc = ds.length
    ? ds.reduce(
        (s, i) => s + soDuong(i?.weight) * Math.max(1, soDuong(i?.quantity, 1)),
        0
      )
    : soDuong(khoiLuongThuc);

  let tongTheTich;
  if (ds.length) tongTheTich = tinhTongTheTich(ds);
  else if (theTich != null) tongTheTich = soDuong(theTich);
  else tongTheTich = soDuong(dai) * soDuong(rong) * soDuong(cao);

  const khoiLuongQuyDoi = quyDoiTuTheTich(tongTheTich);
  const khoiLuongTinhPhi = Math.max(klThuc, khoiLuongQuyDoi);

  const gioiHan = soDuong(pricing.khoiLuongToiDaKg, Infinity);
  const vuotGioiHan = khoiLuongTinhPhi > gioiHan;
  if (vuotGioiHan) {
    canhBao.push(
      `Đơn nặng ${khoiLuongTinhPhi.toFixed(1)}kg, vượt giới hạn ${gioiHan}kg. Vui lòng tách đơn hoặc liên hệ shop để báo giá riêng.`
    );
  }

  const phiCoBan = tinhPhiCoBan(khoiLuongTinhPhi, maKhuVuc);
  const phuPhiDichVu = tinhPhuPhiDichVu(phiCoBan, maDichVu);

  const phuPhiCongKenh = ds.length
    ? tinhPhuPhiCongKenh(ds)
    : theTich != null
    ? tinhPhuPhiCongKenhTheoTheTich(theTich)
    : tinhPhuPhiCongKenh(dai, rong, cao);

  const phiVanChuyen = phiCoBan + phuPhiDichVu + phuPhiCongKenh;

  const phuPhiCOD = coCOD ? tinhPhuPhiCOD(giaTriDonHang) : 0;

  return {
    khoiLuongThuc: Number(klThuc.toFixed(2)),
    khoiLuongQuyDoi: Number(khoiLuongQuyDoi.toFixed(2)),
    khoiLuongTinhPhi: Number(khoiLuongTinhPhi.toFixed(2)),
    phiVanChuyen,
    chiTiet: {
      phiCoBan,
      phuPhiDichVu,
      phuPhiCOD,
      phuPhiCongKenh,
    },
    tongPhi: phiVanChuyen + phuPhiCOD,
    canhBao,
    vuotGioiHan,
  };
}
