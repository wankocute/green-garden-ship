import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, doiSoLuong, xoaSanPham, tongTienHang } = useCart();

  if (cart.length === 0) {
    return (
      <div className="section center">
        <i className="fas fa-shopping-basket empty-icon"></i>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p>Hãy quay lại cửa hàng để chọn cho mình những chậu cây ưng ý nhé!</p>
        <Link to="/products" className="btn-primary">Quay lại cửa hàng</Link>
      </div>
    );
  }

  return (
    <div className="section">
      <h2>Giỏ hàng của bạn</h2>
      <div className="cart-layout">
        <div className="cart-items">
          <table className="cart-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td className="cart-prod">
                    <img src={item.image} alt={item.name} />
                    <Link to={`/product/${item.id}`}>{item.name}</Link>
                  </td>
                  <td>{item.price.toLocaleString("vi-VN")} đ</td>
                  <td>
                    <div className="qty-control small">
                      <button onClick={() => doiSoLuong(item.id, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => doiSoLuong(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td className="cart-total">{(item.price * item.quantity).toLocaleString("vi-VN")} đ</td>
                  <td>
                    <button className="btn-remove" onClick={() => xoaSanPham(item.id)}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-summary">
          <h5>Tổng Đơn Hàng</h5>
          <div className="sum-row">
            <span>Tạm tính:</span>
            <b>{tongTienHang.toLocaleString("vi-VN")} đ</b>
          </div>
          <p className="note">Phí vận chuyển sẽ được tính ở bước thanh toán.</p>
          <Link to="/checkout" className="btn-primary full">Tiến hành thanh toán</Link>
          <Link to="/products" className="btn-outline full">Tiếp tục mua sắm</Link>
        </div>
      </div>
    </div>
  );
}
