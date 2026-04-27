import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Logo = ({ name = "Ánh Sáng Warranty" }: { name?: string }) => (
  <div className="flex items-center gap-2.5">
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background font-bold text-lg">
      W
    </div>
    <span className="font-bold text-foreground tracking-tight">{name}</span>
  </div>
);

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-8">
          <a href="#features" className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block">
            Tính năng
          </a>
          <a href="#modules" className="hidden text-sm text-muted-foreground hover:text-foreground transition-colors md:block">
            Về hệ thống
          </a>
          <Button asChild className="rounded-full px-5">
            <Link to="/login">Đăng nhập</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export { Logo };
export default Header;
