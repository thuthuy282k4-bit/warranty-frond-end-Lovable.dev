import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (value === "admin@anhsang.vn") {
      navigate("/admin/dashboard");
    } else if (value === "tech@anhsang.vn") {
      navigate("/tech/workspace");
    } else if (value === "customer@gmail.com") {
      navigate("/customer/portal");
    } else {
      toast.error("Email hoặc mật khẩu không chính xác. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại trang chủ
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold">
              W
            </div>
            <span className="font-bold text-neutral-900">WarrantyHub</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-neutral-900">Đăng nhập</h1>
          <p className="mt-2 mb-6 text-sm text-gray-500">
            Hệ thống quản lý bảo hành và hỗ trợ kỹ thuật
          </p>

          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label htmlFor="email" className="text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@anhsang.vn"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />

            <label htmlFor="password" className="mt-4 text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              placeholder="........"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-neutral-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
            />

            <button
              type="submit"
              className="mt-6 w-full rounded-lg bg-neutral-900 py-3 text-sm font-medium text-white hover:bg-neutral-800 transition-colors"
            >
              Đăng nhập hệ thống
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          © 2026 Công ty Cổ phần Giải pháp Công nghệ Ánh Sáng.
        </p>
      </div>
    </div>
  );
};

export default Login;
