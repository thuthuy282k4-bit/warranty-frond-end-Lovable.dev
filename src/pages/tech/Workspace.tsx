import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardList,
  LogOut,
  Clock,
  Loader2,
  CheckCircle2,
  ListTodo,
  Printer,
  Laptop,
  Mouse,
  Camera,
  Monitor,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RequestDetailModal, type WarrantyRequestDetail } from "@/components/shared/RequestDetailModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import { UpdateStatusModal, type UpdateStatusValue } from "@/components/tech/UpdateStatusModal";
import { PrintReceiptModal, type WarrantyReceiptData } from "@/components/shared/PrintReceiptModal";

type Status = "pending" | "processing" | "completed";

type Task = {
  id: string;
  icon: React.ReactNode;
  customer: string;
  product: string;
  category: string;
  createdAt: string;
  status: Status;
  solution?: string;
  completedAt?: string;
};

const initialTasks: Task[] = [
  {
    id: "WR-711407",
    icon: <Laptop className="h-4 w-4 text-neutral-600" />,
    customer: "Trần Thị Khách",
    product: "Dell XPS 15",
    category: "Phần cứng",
    createdAt: "02/05/2026",
    status: "pending",
  },
  {
    id: "WR-711408",
    icon: <Mouse className="h-4 w-4 text-neutral-600" />,
    customer: "Nguyễn Văn A",
    product: "Logitech MX Master 3S",
    category: "Phụ kiện",
    createdAt: "01/05/2026",
    status: "processing",
  },
  {
    id: "WR-711409",
    icon: <Camera className="h-4 w-4 text-neutral-600" />,
    customer: "Lê Thị B",
    product: "Camera IP Dome",
    category: "An ninh",
    createdAt: "30/04/2026",
    status: "processing",
  },
  {
    id: "WR-711410",
    icon: <Monitor className="h-4 w-4 text-neutral-600" />,
    customer: "Phạm Văn C",
    product: "Dell U2723QE",
    category: "Màn hình",
    createdAt: "29/04/2026",
    status: "processing",
  },
  {
    id: "WR-711411",
    icon: <Laptop className="h-4 w-4 text-neutral-600" />,
    customer: "Hoàng Thị D",
    product: "MacBook Pro 14",
    category: "Phần cứng",
    createdAt: "27/04/2026",
    status: "completed",
    solution: "Thay pin mới, cập nhật macOS",
    completedAt: "29/04/2026",
  },
  {
    id: "WR-711412",
    icon: <Mouse className="h-4 w-4 text-neutral-600" />,
    customer: "Vũ Văn E",
    product: "Keychron K2",
    category: "Phụ kiện",
    createdAt: "25/04/2026",
    status: "completed",
    solution: "Vệ sinh switch, thay keycap",
    completedAt: "26/04/2026",
  },
];

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

const TechWorkspace = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<Status>("pending");
  const [updateTarget, setUpdateTarget] = useState<string | null>(null);
  const [printTarget, setPrintTarget] = useState<WarrantyReceiptData | null>(null);
  const [detailTarget, setDetailTarget] = useState<WarrantyRequestDetail | null>(null);

  const buildDetail = (t: Task): WarrantyRequestDetail => ({
    id: t.id,
    customer: {
      name: t.customer,
      phone: "0909 000 333",
      email: `${t.customer.split(" ").pop()?.toLowerCase()}@gmail.com`,
      address: "123 Lê Lợi, Quận 1, TP.HCM",
    },
    product: {
      name: t.product,
      category: t.category,
      serial: `SN-${t.id.replace(/\D/g, "")}`,
      warrantyUntil: "20/05/2027",
    },
    issue: {
      type: t.category,
      description:
        "Thiết bị không khởi động được sau khi cập nhật firmware. Đèn nguồn nhấp nháy 3 lần rồi tắt. Đã thử rút sạc và khởi động lại nhưng không thành công.",
      media: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&q=70",
        "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&q=70",
      ],
    },
  });

  const counts = useMemo(
    () => ({
      pending: tasks.filter((t) => t.status === "pending").length,
      processing: tasks.filter((t) => t.status === "processing").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      total: tasks.length,
    }),
    [tasks]
  );

  const accept = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "processing" } : t))
    );
    toast.success(`Đã tiếp nhận yêu cầu ${id}`);
    setActiveTab("processing");
  };

  const handleUpdate = (status: UpdateStatusValue, note: string) => {
    if (!updateTarget) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== updateTarget) return t;
        if (status === "completed") {
          return {
            ...t,
            status: "completed",
            solution: note || "Đã xử lý",
            completedAt: new Date().toLocaleDateString("vi-VN"),
          };
        }
        if (status === "rejected") {
          return { ...t, status: "pending" };
        }
        return t;
      })
    );
  };

  const pendingList = tasks.filter((t) => t.status === "pending");
  const processingList = tasks.filter((t) => t.status === "processing");
  const completedList = tasks.filter((t) => t.status === "completed");

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
            <ClipboardList className="h-4 w-4" />
            Danh sách công việc
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
            <h1 className="text-base font-semibold text-neutral-900">
              Quản lý yêu cầu kỹ thuật
            </h1>
            <p className="text-xs text-gray-500">Tiếp nhận và xử lý yêu cầu bảo hành</p>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-neutral-900 text-white text-xs font-semibold flex items-center justify-center">
              N
            </div>
            <span className="text-sm font-medium text-neutral-900">Nguyen Van Tech</span>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <StatCard
              label="Tổng yêu cầu"
              value={counts.total}
              icon={ListTodo}
              iconBg="bg-neutral-100"
              iconColor="text-neutral-700"
            />
          </div>

          {/* Tabs */}
          <div className="rounded-xl border border-gray-200 bg-white">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Status)}>
              <div className="px-5 pt-4">
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="pending">Chờ xử lý ({counts.pending})</TabsTrigger>
                  <TabsTrigger value="processing">
                    Đang xử lý ({counts.processing})
                  </TabsTrigger>
                  <TabsTrigger value="completed">
                    Hoàn thành ({counts.completed})
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Pending */}
              <TabsContent value="pending" className="p-5 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã YC</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-8">
                          Không có yêu cầu chờ xử lý
                        </TableCell>
                      </TableRow>
                    ) : (
                      pendingList.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.id}</TableCell>
                          <TableCell>{t.customer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {t.icon}
                              {t.product}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{t.category}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{t.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <TooltipProvider delayDuration={150}>
                              <div className="flex items-center justify-end gap-2">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => setDetailTarget(buildDetail(t))}
                                      className="inline-flex items-center justify-center h-9 w-9 rounded-md border border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition"
                                      aria-label="Xem chi tiết"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>Xem chi tiết</TooltipContent>
                                </Tooltip>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => accept(t.id)}
                                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                  Tiếp nhận
                                </Button>
                              </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Processing */}
              <TabsContent value="processing" className="p-5 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã YC</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {processingList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-8">
                          Không có yêu cầu đang xử lý
                        </TableCell>
                      </TableRow>
                    ) : (
                      processingList.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.id}</TableCell>
                          <TableCell>{t.customer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {t.icon}
                              {t.product}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{t.category}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{t.createdAt}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setUpdateTarget(t.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              Cập nhật
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>

              {/* Completed */}
              <TabsContent value="completed" className="p-5 pt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã YC</TableHead>
                      <TableHead>Khách hàng</TableHead>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Giải pháp</TableHead>
                      <TableHead>Ngày hoàn thành</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {completedList.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-sm text-gray-500 py-8">
                          Chưa có yêu cầu hoàn thành
                        </TableCell>
                      </TableRow>
                    ) : (
                      completedList.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell className="font-medium">{t.id}</TableCell>
                          <TableCell>{t.customer}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {t.icon}
                              {t.product}
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600 max-w-[240px] truncate">
                            {t.solution}
                          </TableCell>
                          <TableCell className="text-gray-600">{t.completedAt}</TableCell>
                          <TableCell className="text-right">
                            <button
                              onClick={() =>
                                setPrintTarget({
                                  type: "receipt",
                                  refId: t.id,
                                  customerName: t.customer,
                                  customerPhone: "0909 000 333",
                                  productName: t.product,
                                  productModel: t.product,
                                  serial: `SN-${t.id.replace(/\D/g, "")}`,
                                  expiry: "20/05/2027",
                                  isValid: true,
                                })
                              }
                              className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition"
                            >
                              <Printer className="h-4 w-4" />
                            </button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <UpdateStatusModal
        open={!!updateTarget}
        onOpenChange={(v) => !v && setUpdateTarget(null)}
        requestId={updateTarget ?? undefined}
        onSubmit={handleUpdate}
      />
      <PrintReceiptModal
        open={!!printTarget}
        onOpenChange={(v) => !v && setPrintTarget(null)}
        data={printTarget}
      />
    </div>
  );
};

export default TechWorkspace;
