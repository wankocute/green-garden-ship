import { createContext, useContext, useState, useEffect } from "react";
import { products } from "../products";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const SL_TOI_DA = 99;

  // Giỏ trong localStorage có thể là bản CŨ, thiếu dim/weight (hoặc giá đã đổi).
  // Thiếu dim => thể tích = 0 => khối lượng quy đổi = 0 => TÍNH THIẾU phí ship.
  // Nên mỗi lần khởi động ta lấy lại thông số gốc từ products.js theo id,
  // chỉ giữ lại số lượng của khách.
  const [cart, setCart] = useState(() => {
    let saved;
    try {
      saved = JSON.parse(localStorage.getItem("cart"));
    } catch {
      saved = null;
    }
    if (!Array.isArray(saved)) return [];

    return saved
      .map((i) => {
        const goc = products.find((p) => p.id === i?.id);
        if (!goc) return null; // sản phẩm đã gỡ khỏi shop
        const sl = Math.floor(Number(i?.quantity));
        return {
          ...goc,
          quantity: Number.isFinite(sl) && sl > 0 ? Math.min(SL_TOI_DA, sl) : 1,
        };
      })
      .filter(Boolean);
  });
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ
  function themVaoGio(sanPham, soLuong = 1) {
    setCart((cu) => {
      const daCo = cu.find((i) => i.id === sanPham.id);
      if (daCo) {
        return cu.map((i) =>
          i.id === sanPham.id
            ? { ...i, quantity: Math.min(SL_TOI_DA, i.quantity + soLuong) }
            : i
        );
      }
      return [...cu, { ...sanPham, quantity: soLuong }];
    });
  }

  // Đổi số lượng
  function doiSoLuong(id, change) {
    setCart((cu) =>
      cu.map((i) =>
        i.id === id
          ? { ...i, quantity: Math.min(SL_TOI_DA, Math.max(1, i.quantity + change)) }
          : i
      )
    );
  }

  // Xóa 1 sản phẩm
  function xoaSanPham(id) {
    setCart((cu) => cu.filter((i) => i.id !== id));
  }

  // Xóa sạch giỏ (sau khi đặt hàng)
  function xoaHetGio() {
    setCart([]);
  }

  // Tổng số lượng (cho badge trên navbar)
  const tongSoLuong = cart.reduce((s, i) => s + i.quantity, 0);

  // Tổng tiền hàng (chưa gồm ship)
  const tongTienHang = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        themVaoGio,
        doiSoLuong,
        xoaSanPham,
        xoaHetGio,
        tongSoLuong,
        tongTienHang,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
