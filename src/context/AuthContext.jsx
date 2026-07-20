import { createContext, useContext, useState, useEffect } from "react";
import { MA_TANG_ACC_MOI } from "../khuyenMai";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  // Đăng ký: có tỉnh + địa chỉ, và TẶNG 2 MÃ cho tài khoản mới
  function dangKy(name, email, pass, tinh, diaChi) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.email === email)) {
      return { ok: false, message: "Email này đã được đăng ký!" };
    }
    users.push({
      name,
      email,
      password: pass,
      tinh,
      diaChi,
      vouchers: [...MA_TANG_ACC_MOI],
    });
    localStorage.setItem("users", JSON.stringify(users));
    return { ok: true, message: "Đăng ký thành công! Bạn được tặng 2 mã giảm giá." };
  }

  function dangNhap(email, pass) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === pass);
    if (!user) {
      return { ok: false, message: "Email hoặc mật khẩu không đúng!" };
    }
    setCurrentUser({
      name: user.name,
      email: user.email,
      tinh: user.tinh || "",
      diaChi: user.diaChi || "",
      vouchers: user.vouchers || [],
    });
    return { ok: true, message: `Chào mừng ${user.name}!` };
  }

  function dangXuat() {
    setCurrentUser(null);
  }

  // Gỡ 1 mã khỏi ví user sau khi dùng (cả trong currentUser và users)
  function dungMa(ma) {
    if (!currentUser) return;
    const viMoi = (currentUser.vouchers || []).filter((m) => m !== ma);
    setCurrentUser({ ...currentUser, vouchers: viMoi });

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const idx = users.findIndex((u) => u.email === currentUser.email);
    if (idx !== -1) {
      users[idx].vouchers = viMoi;
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, dangKy, dangNhap, dangXuat, dungMa }}>
      {children}
    </AuthContext.Provider>
  );
}
