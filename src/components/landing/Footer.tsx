import { Logo } from "./Header";

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
        <Logo name="WarrantyHub" />
        <p className="text-xs text-muted-foreground md:text-sm">
          © 2026 Công ty Cổ phần Giải pháp Công nghệ Ánh Sáng. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
