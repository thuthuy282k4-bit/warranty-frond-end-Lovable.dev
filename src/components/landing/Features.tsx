import { Users, Shield, Zap, CheckCircle, type LucideIcon } from "lucide-react";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Users, title: "Quản lý khách hàng", desc: "Tra cứu thông tin bảo hành, gửi yêu cầu và theo dõi tiến độ xử lý" },
  { icon: Shield, title: "Quản lý Admin", desc: "Quản lý sản phẩm, khách hàng, báo cáo và phân quyền người dùng" },
  { icon: Zap, title: "Xử lý kỹ thuật", desc: "Tiếp nhận, cập nhật trạng thái và xử lý yêu cầu hỗ trợ nhanh chóng" },
  { icon: CheckCircle, title: "Ghi chép dễ dàng", desc: "Ghi chép tất cả quá trình bảo hành từ tiếp nhận đến hoàn thành" },
];

const Features = () => {
  return (
    <section id="features" className="container py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Tính năng chính</h2>
        <p className="mt-4 text-muted-foreground">
          Một giải pháp toàn diện cho quản lý bảo hành và hỗ trợ kỹ thuật
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)]"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary">
              <f.icon className="h-5 w-5 text-foreground" strokeWidth={2} />
            </div>
            <h3 className="mt-6 font-bold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
