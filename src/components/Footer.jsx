export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h5><i className="fas fa-leaf"></i> Green Garden</h5>
          <p>Mang màu xanh đến không gian sống của bạn.</p>
        </div>
        <div className="footer-col">
          <h5>Liên Hệ</h5>
          <p><i className="fas fa-map-marker-alt"></i> 123 Đường 3/2, Ninh Kiều, Cần Thơ</p>
          <p><i className="fas fa-phone"></i> 0123 456 789</p>
          <p><i className="fas fa-envelope"></i> hotro@greengarden.com</p>
        </div>
        <div className="footer-col">
          <h5>Kết Nối</h5>
          <div className="socials">
            <a href="#"><i className="fab fa-facebook"></i></a>
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Green Garden. All rights reserved.</p>
      </div>
    </footer>
  );
}
