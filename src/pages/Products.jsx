import { useState } from "react";
import { Link } from "react-router-dom";
import { products } from "../products";
import { useCart } from "../context/CartContext";

const DANH_MUC = ["all", ...new Set(products.map((p) => p.category))];

export default function Products() {
  const { themVaoGio } = useCart();
  const [danhMuc, setDanhMuc] = useState("all");
  const [timKiem, setTimKiem] = useState("");

  const loc = products.filter((p) => {
    const hopDanhMuc = danhMuc === "all" || p.category === danhMuc;
    const hopTim = p.name.toLowerCase().includes(timKiem.toLowerCase());
    return hopDanhMuc && hopTim;
  });

  return (
    <div className="section">
      <h2>Tất Cả Sản Phẩm</h2>

      <div className="shop-layout">
        {/* SIDEBAR LỌC */}
        <aside className="sidebar">
          <div className="filter-box">
            <h5>Tìm kiếm</h5>
            <input
              type="text"
              placeholder="Tên cây..."
              value={timKiem}
              onChange={(e) => setTimKiem(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <h5>Danh Mục</h5>
            {DANH_MUC.map((dm) => (
              <label key={dm} className="radio-row">
                <input
                  type="radio"
                  name="danhmuc"
                  checked={danhMuc === dm}
                  onChange={() => setDanhMuc(dm)}
                />
                {dm === "all" ? "Tất cả sản phẩm" : dm}
              </label>
            ))}
          </div>
        </aside>

        {/* LƯỚI SẢN PHẨM */}
        <div className="shop-main">
          <p className="count">Đang hiển thị {loc.length} sản phẩm</p>
          <div className="product-grid">
            {loc.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} />
                </Link>
                <div className="product-body">
                  <Link to={`/product/${p.id}`} className="product-name">{p.name}</Link>
                  <p className="product-price">{p.price.toLocaleString("vi-VN")} đ</p>
                  <button className="btn-outline" onClick={() => themVaoGio(p)}>
                    <i className="fas fa-cart-plus"></i> Thêm giỏ hàng
                  </button>
                </div>
              </div>
            ))}
            {loc.length === 0 && <p className="empty">Không tìm thấy sản phẩm nào phù hợp!</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
