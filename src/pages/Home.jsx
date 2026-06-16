import { Link } from "react-router-dom";
import { products } from "../products";
import { useCart } from "../context/CartContext";

export default function Home() {
  const { themVaoGio } = useCart();
  const noiBat = products.slice(0, 4);

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>Mang Thiên Nhiên Vào Ngôi Nhà Của Bạn</h1>
          <p>Khám phá bộ sưu tập cây cảnh tuyệt đẹp giúp làm sạch không khí và xoa dịu tâm hồn.</p>
          <Link to="/products" className="btn-primary">Mua Ngay</Link>
        </div>
      </section>

      {/* CÂY NỔI BẬT */}
      <section className="section">
        <div className="section-head">
          <h2>Sản Phẩm Nổi Bật</h2>
          <Link to="/products" className="link-more">Xem tất cả <i className="fas fa-arrow-right"></i></Link>
        </div>
        <div className="product-grid">
          {noiBat.map((p) => (
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
        </div>
      </section>

      {/* WHY US */}
      <section className="section why-us">
        <h2>Tại Sao Chọn Chúng Tôi?</h2>
        <div className="why-grid">
          <div className="why-item">
            <i className="fas fa-truck"></i>
            <h4>Giao Hàng Tận Nơi</h4>
            <p>Đảm bảo cây xanh luôn tươi tốt khi đến tay bạn.</p>
          </div>
          <div className="why-item">
            <i className="fas fa-headset"></i>
            <h4>Hỗ Trợ 24/7</h4>
            <p>Tư vấn cách chăm sóc cây miễn phí trọn đời.</p>
          </div>
          <div className="why-item">
            <i className="fas fa-undo-alt"></i>
            <h4>1 Đổi 1 Trong 7 Ngày</h4>
            <p>Hoàn tiền hoặc đổi trả nếu cây bị héo úa do vận chuyển.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
