import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { products } from "../products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { themVaoGio } = useCart();
  const [soLuong, setSoLuong] = useState(1);
  const [daThem, setDaThem] = useState(false);

  const sp = products.find((p) => p.id === Number(id));

  if (!sp) {
    return (
      <div className="section center">
        <h2>Không tìm thấy sản phẩm!</h2>
        <Link to="/products" className="btn-primary">Quay lại cửa hàng</Link>
      </div>
    );
  }

  const lienQuan = products
    .filter((p) => p.category === sp.category && p.id !== sp.id)
    .slice(0, 4);

  function handleThem() {
    themVaoGio(sp, soLuong);
    setDaThem(true);
    setTimeout(() => setDaThem(false), 1200);
  }

  return (
    <div className="section">
      <div className="detail">
        <div className="detail-img">
          <img src={sp.image} alt={sp.name} />
        </div>
        <div className="detail-info">
          <h2>{sp.name}</h2>
          <p className="detail-price">{sp.price.toLocaleString("vi-VN")} đ</p>
          <p className="detail-cat">Danh mục: <b>{sp.category}</b></p>
          <div className="detail-specs">
            <span>Khối lượng: <b>{sp.weight} kg</b></span>
            <span>Kích thước: <b>{sp.dim.dai}×{sp.dim.rong}×{sp.dim.cao} cm</b></span>
          </div>

          <div className="qty-row">
            <div className="qty-control">
              <button onClick={() => setSoLuong((s) => Math.max(1, s - 1))}>−</button>
              <span>{soLuong}</span>
              <button onClick={() => setSoLuong((s) => s + 1)}>+</button>
            </div>
            <button className={`btn-primary ${daThem ? "added" : ""}`} onClick={handleThem}>
              {daThem ? <><i className="fas fa-check"></i> Đã thêm</> : <><i className="fas fa-cart-plus"></i> Thêm vào giỏ</>}
            </button>
          </div>
        </div>
      </div>

      {lienQuan.length > 0 && (
        <div className="related">
          <h3>Sản Phẩm Liên Quan</h3>
          <div className="product-grid">
            {lienQuan.map((p) => (
              <div className="product-card" key={p.id}>
                <Link to={`/product/${p.id}`}>
                  <img src={p.image} alt={p.name} />
                </Link>
                <div className="product-body">
                  <Link to={`/product/${p.id}`} className="product-name">{p.name}</Link>
                  <p className="product-price">{p.price.toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
