import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="container py-16">
      <div className="rounded-3xl bg-neutral-900 px-6 py-24 text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">Sẵn sàng bắt đầu?</h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-neutral-300">
          Đăng nhập bây giờ để truy cập hệ thống quản lý bảo hành
        </p>
        <Button
          variant="secondary"
          className="mt-8 rounded-full bg-white px-6 py-6 text-sm font-medium text-neutral-900 hover:bg-neutral-100 group"
        >
          Đăng nhập ngay
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default CTA;
