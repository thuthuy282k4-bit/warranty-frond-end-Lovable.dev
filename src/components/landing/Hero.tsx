import { ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Hero = () => {
  return (
    <section className="container grid gap-12 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
      <div className="flex flex-col justify-center">
        <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Giải pháp <em className="font-bold italic">Bảo hành</em>
          <br />
          Thông minh & Tin cậy
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Tra cứu thông tin bảo hành tức thì và theo dõi tiến độ xử lý yêu cầu kỹ thuật trực tuyến. Công ty Cổ phần Giải pháp Công nghệ Ánh Sáng.
        </p>
        <div className="mt-8">
          <Button asChild className="rounded-full px-6 py-6 text-sm group">
            <Link to="/login">
              Truy cập Dashboard
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-card p-8 shadow-[var(--hero-shadow)] border border-border/50">
          <h3 className="text-center text-xl font-semibold text-foreground">Tra cứu nhanh</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Nhập mã sản phẩm để xem thời hạn bảo hành
          </p>
          <div className="mt-6 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="VD: ASUS-RTX4090-001"
                className="pl-9 h-11 bg-secondary/60 border-border/60"
              />
            </div>
            <Button className="h-11 rounded-lg px-5">Tra cứu</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
