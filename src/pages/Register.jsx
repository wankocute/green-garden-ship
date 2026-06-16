import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tinhThanh } from "../diaChinh";

export default function Register() {
  const { dangKy } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tinh, setTinh] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [loi, setLoi] = useState("");

  function handleSubmit() {
    if (!name || !email || !pass || !tinh || !diaChi) {
      setLoi("Vui lòng điền đầy đủ thông tin, gồm cả tỉnh/thành và địa chỉ!");
      return;
    }
    if (pass.length < 6) {
      setLoi("Mật khẩu phải từ 6 ký tự trở lên!");
      return;
    }
    if (pass !== confirm) {
      setLoi("Mật khẩu xác nhận không khớp!");
      return;
    }
    const kq = dangKy(name, email, pass, tinh, diaChi);
    if (kq.ok) {
      alert("Đăng ký thành công! Mời bạn đăng nhập.");
      navigate("/login");
    } else {
      setLoi(kq.message);
    }
  }

  return (
    <div className="section center-narrow">
      <div className="auth-card">
        <div className="auth-head">
          <i className="fas fa-user-plus"></i>
          <h3>Đăng Ký Tài Khoản</h3>
        </div>
        {loi && <p className="auth-error">{loi}</p>}
        <label>Họ và tên</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label>Tỉnh / Thành phố</label>
        <select value={tinh} onChange={(e) => setTinh(e.target.value)}>
          <option value="">-- Chọn tỉnh/thành --</option>
          {tinhThanh.map((t) => (
            <option key={t.ten} value={t.ten}>{t.ten}</option>
          ))}
        </select>
        <label>Địa chỉ chi tiết (số nhà, đường, phường/xã)</label>
        <input value={diaChi} onChange={(e) => setDiaChi(e.target.value)} placeholder="VD: 123 Đường 3/2, P. Xuân Khánh" />
        <label>Mật khẩu</label>
        <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} />
        <label>Xác nhận mật khẩu</label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <button className="btn-primary full" onClick={handleSubmit}>Đăng Ký</button>
        <p className="auth-foot">Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
      </div>
    </div>
  );
}
