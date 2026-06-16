import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { tongSoLuong } = useCart();
  const { currentUser, dangXuat } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-inner">
        <Link to="/" className="brand">
          <i className="fas fa-leaf"></i> Green Garden
        </Link>

        <ul className="nav-links">
          <li><NavLink to="/" end>Trang chủ</NavLink></li>
          <li><NavLink to="/products">Sản phẩm</NavLink></li>
        </ul>

        <div className="nav-right">
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            <span className="cart-badge">{tongSoLuong}</span>
          </Link>

          {currentUser ? (
            <div className="user-menu">
              <span className="user-name">
                <i className="fas fa-user-circle"></i> {currentUser.name}
              </span>
              <button onClick={dangXuat} className="btn-logout">Đăng xuất</button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Đăng nhập</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
