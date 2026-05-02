import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  Plus,
  Clock,
  Loader2,
  CheckCircle2,
  ListTodo,
  ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { NewRequestModal, type NewRequestPayload } from "@/components/customer/NewRequestModal";
import {
  RequestDetailModal,
  type RequestDetail,
} from "@/components/customer/RequestDetailModal";

const initialRequests: RequestDetail[] = [
  {
    id: "WR-880001",
    status: "completed",
    product: "Dell XPS 15",
    productCode: "LAP-2023-002",
    purchaseDate: "12/03/2025",
    issueType: "Phần cứng",
    description: "Pin chai sau 6 tháng sử dụng, máy nóng bất thường khi chạy tác vụ nhẹ.",
    resolution: "Đã thay pin chính hãng và vệ sinh tản nhiệt. Máy hoạt động ổn định.",
  },
  {
    id: "WR-880002",
    status: "processing",
    product: "Logitech MX Master 3S",
    productCode: "ACC-2024-011",
    purchaseDate: "20/01/2026",
    issueType: "Phụ kiện",
    description: "Con lăn không cuộn được, click trái đôi khi không nhận.",
  },
  {
    id: "WR-880003",
    status: "pending",
    product: "Camera IP Dome",
    productCode: "SEC-2025-003",
    purchaseDate: "05/04/2026",
    issueType: "Phần cứng",
    description: "Camera mất kết nối ngẫu nhiên, hình ảnh ban đêm bị nhiễu nặng.",
  },
];

const statusMeta = {
  pending: { label: "Chờ xử lý", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

const StatCard = ({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-neutral-900 mt-1">{value}</p>
    </div>
    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${iconBg}`}>
      <Icon className={`h-5 w-5 ${iconColor}`} />
    </div>
  </div>
);

const CustomerPortal = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<RequestDetail[]>(initialRequests);
  const [openNew, setOpenNew] = useState(false);
  const [detail, setDetail] = useState<RequestDetail | null>(null);

  const counts = useMemo(
    () => ({
      total: requests.length,
      pending: requests.filter((r) => r.status === "pending").length,
      processing: requests.filter((r) => r.status === "processing").length,
      completed: requests.filter((r) => r.status === "completed").length,
    }),
    [requests]
  );

  const handleCreate = (data: NewRequestPayload) => {
    const id = `WR-${Math.floor(100000 + Math.random() * 900000)}`;
    setRequests((prev) => [
      {
        id,
        status: "pending",
        product: data.product,
        productCode: "—",
        purchaseDate: new Date().toLocaleDateString("vi-VN"),
        issueType: data.issueType,
        description: data.description,
      },
      ...prev,
    ]);
  };

  const today = new Date().toLocaleDateString("vi-VN");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-5 h-16 flex items-center gap-2.5 border-b border-gray-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black text-white font-bold text-lg">
            W
          </div>
          <span className="font-bold text-neutral-900 tracking-tight">WarrantyHub</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium bg-neutral-900 text-white">
            <LayoutDashboard className="h-4 w-4" />
            Bảng điều khiển
          </button>
        </nav>

        <div className="p-3 border-t border-gray-200">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-base font-semibold text-neutral-900">Bảo hành của bạn</h1>
            <p className="text-xs text-gray-500">
              Theo dõi và quản lý các yêu cầu bảo hành
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setOpenNew(true)}
              className="bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Yêu cầu bảo hành mới
            </Button>
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center">
                T
              </div>
              <span className="text-sm font-medium text-neutral-900">Tran Thi Khach</span>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Tổng yêu cầu"
              value={counts.total}
              icon={ListTodo}
              iconBg="bg-neutral-100"
              iconColor="text-neutral-700"
            />
            <StatCard
              label="Chờ xử lý"
              value={counts.pending}
              icon={Clock}
              iconBg="bg-amber-50"
              iconColor="text-amber-600"
            />
            <StatCard
              label="Đang xử lý"
              value={counts.processing}
              icon={Loader2}
              iconBg="bg-blue-50"
              iconColor="text-blue-600"
            />
            <StatCard
              label="Hoàn thành"
              value={counts.completed}
              icon={CheckCircle2}
              iconBg="bg-green-50"
              iconColor="text-green-600"
            />
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-neutral-900">
                Danh sách yêu cầu bảo hành
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Tất cả yêu cầu bảo hành bạn đã gửi
              </p>
            </div>
            <div className="p-5 pt-2">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã yêu cầu</TableHead>
                    <TableHead>Ảnh/Video</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Vấn đề</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium">{r.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <ImageIcon className="h-4 w-4" />
                          <Video className="h-4 w-4" />
                        </div>
                      </TableCell>
                      <TableCell>{r.product}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{r.issueType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusMeta[r.status].className}>
                          {statusMeta[r.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600">{r.purchaseDate}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDetail(r)}
                        >
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      <NewRequestModal
        open={openNew}
        onOpenChange={setOpenNew}
        onSubmit={handleCreate}
      />
      <RequestDetailModal
        open={!!detail}
        onOpenChange={(v) => !v && setDetail(null)}
        request={detail}
      />
    </div>
  );
};

export default CustomerPortal;
