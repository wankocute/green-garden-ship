// ============================================================
//  HỆ THỐNG MÃ GIẢM GIÁ (VOUCHER)
// ============================================================
// loai: "giam_tien" (giảm vào tiền hàng) | "freeship" (giảm phí ship)
// donToiThieu: đơn hàng (tiền hàng) phải >= mức này mới áp được
// giaTri: số tiền giảm (với freeship: số tiền ship được giảm tối đa)

export const danhSachMa = {
  GIAM30K: {
    ma: "GIAM30K",
    loai: "giam_tien",
    giaTri: 30000,
    donToiThieu: 200000,
    moTa: "Giảm 30.000đ cho đơn từ 200.000đ",
  },
  GIAM50K: {
    ma: "GIAM50K",
    loai: "giam_tien",
    giaTri: 50000,
    donToiThieu: 400000,
    moTa: "Giảm 50.000đ cho đơn từ 400.000đ",
  },
  FREESHIP: {
    ma: "FREESHIP",
    loai: "freeship",
    giaTri: 30000, // miễn tối đa 30k tiền ship
    donToiThieu: 150000,
    moTa: "Miễn phí ship (tối đa 30.000đ) cho đơn từ 150.000đ",
  },
  FREESHIPXL: {
    ma: "FREESHIPXL",
    loai: "freeship",
    giaTri: 100000, // miễn tối đa 100k tiền ship
    donToiThieu: 500000,
    moTa: "Miễn phí ship (tối đa 100.000đ) cho đơn từ 500.000đ",
  },
};

// 2 mã tặng khi tạo tài khoản mới
export const MA_TANG_ACC_MOI = ["GIAM30K", "FREESHIP"];

// ============================================================
//  Kiểm tra & áp mã
//  Trả về { ok, message, giamTien, giamShip }
// ============================================================
export function apMaGiamGia(ma, tienHang, phiShip) {
  const voucher = danhSachMa[ma];

  if (!voucher) {
    return { ok: false, message: "Mã giảm giá không tồn tại!", giamTien: 0, giamShip: 0 };
  }

  if (tienHang < voucher.donToiThieu) {
    const thieu = voucher.donToiThieu - tienHang;
    return {
      ok: false,
      message: `Đơn cần tối thiểu ${voucher.donToiThieu.toLocaleString("vi-VN")}đ (còn thiếu ${thieu.toLocaleString("vi-VN")}đ)`,
      giamTien: 0,
      giamShip: 0,
    };
  }

  if (voucher.loai === "giam_tien") {
    return {
      ok: true,
      message: `Áp dụng thành công: ${voucher.moTa}`,
      giamTien: voucher.giaTri,
      giamShip: 0,
    };
  }

  // freeship: giảm phí ship, tối đa bằng giaTri (không giảm quá phí ship thực tế)
  const giamShip = Math.min(phiShip, voucher.giaTri);
  return {
    ok: true,
    message: `Áp dụng thành công: ${voucher.moTa}`,
    giamTien: 0,
    giamShip,
  };
}

// ============================================================
//  ƯỚC TÍNH THỜI GIAN GIAO theo khu vực + loại dịch vụ
// ============================================================
export function uocTinhThoiGian(maKhuVuc, maDichVu) {
  // Số ngày giao [tiêu chuẩn] theo khu vực
  const bang = {
    noi_tinh: { tieu_chuan: "1 - 2 ngày", nhanh: "trong 24 giờ" },
    noi_mien: { tieu_chuan: "2 - 3 ngày", nhanh: "1 - 2 ngày" },
    lien_mien: { tieu_chuan: "3 - 5 ngày", nhanh: "2 - 3 ngày" },
  };
  return bang[maKhuVuc]?.[maDichVu] || "3 - 5 ngày";
}
