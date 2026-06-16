import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { dangNhap } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loi, setLoi] = useState("");

  function handleSubmit() {
    if (!email || !pass) {
      setLoi("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }
    const kq = dangNhap(email, pass);
    if (kq.ok) {
      navigate("/");
    } else {
      setLoi(kq.message);
    }
  }

  return (
    <div className="section center-narrow">
      <div className="auth-card">
        <div className="auth-head">
          <i className="fas fa-user-circle"></i>
          <h3>Đăng Nhập</h3>
        </div>
        {loi && <p className="auth-error">{loi}</p>}
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Mật khẩu</label>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button className="btn-primary full" onClick={handleSubmit}>Đăng Nhập</button>
        <p className="auth-foot">Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link></p>
      </div>
    </div>
  );
}
