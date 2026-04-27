import { Users, Shield, Zap, CheckCircle2, type LucideIcon } from "lucide-react";

type Module = {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  title: string;
  items: string[];
};

const modules: Module[] = [
  {
    icon: Users,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "Phân hệ khách hàng",
    items: ["Tra cứu thông tin bảo hành", "Gửi yêu cầu bảo hành/hỗ trợ", "Theo dõi tiến độ xử lý"],
  },
  {
    icon: Shield,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    title: "Phân hệ Quản trị viên",
    items: ["Quản lý thông tin khách hàng", "Quản lý danh mục sản phẩm", "Báo cáo và thống kê chi tiết"],
  },
  {
    icon: Zap,
    iconBg: "bg-orange-100",
    iconColor: "text-orange-500",
    title: "Phân hệ Kỹ thuật viên",
    items: ["Tra cứu sản phẩm/khách hàng", "Tiếp nhận yêu cầu hỗ trợ", "Cập nhật trạng thái xử lý"],
  },
];

const Modules = () => {
  return (
    <section id="modules" className="container py-20 lg:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">Ba phân hệ tích hợp</h2>
        <p className="mt-4 text-muted-foreground">Hệ thống được thiết kế cho ba loại người dùng khác nhau</p>
      </div>

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {modules.map((m) => (
          <div key={m.title} className="flex flex-col">
            <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${m.iconBg}`}>
              <m.icon className={`h-6 w-6 ${m.iconColor}`} strokeWidth={2} />
            </div>
            <h3 className="mt-6 text-lg font-bold text-foreground">{m.title}</h3>
            <ul className="mt-4 space-y-3">
              {m.items.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground/80">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-green-500" strokeWidth={2} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Modules;
