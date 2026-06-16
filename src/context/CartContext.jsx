import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Khởi tạo giỏ hàng từ localStorage (nếu có)
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Mỗi khi giỏ thay đổi -> lưu lại localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Thêm sản phẩm vào giỏ
  function themVaoGio(sanPham, soLuong = 1) {
    setCart((cu) => {
      const daCo = cu.find((i) => i.id === sanPham.id);
      if (daCo) {
        return cu.map((i) =>
          i.id === sanPham.id ? { ...i, quantity: i.quantity + soLuong } : i
        );
      }
      return [...cu, { ...sanPham, quantity: soLuong }];
    });
  }

  // Đổi số lượng (change = +1 hoặc -1)
  function doiSoLuong(id, change) {
    setCart((cu) =>
      cu.map((i) =>
        i.id === id ? { ...i, quantity: Math.max(1, i.quantity + change) } : i
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
