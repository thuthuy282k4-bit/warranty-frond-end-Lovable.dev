import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileBarChart,
  LogOut,
  Search,
  Filter,
  Plus,
  Laptop,
  Mouse,
  Camera,
  Printer,
  Trash2,
  Edit3,
  ImageOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { AddProductModal } from "@/components/admin/AddProductModal";

type Request = {
  id: string;
  icon: React.ReactNode;
  customer: string;
  product: string;
  category: string;
  technician: string;
  status: "resolved" | "processing" | "pending";
};

const requests: Request[] = [
  {
    id: "#WR-0001",
    icon: <Laptop className="h-5 w-5 text-neutral-600" />,
    customer: "Trần Thị Khách",
    product: "Dell XPS 15",
    category: "Phần cứng",
    technician: "Nguyễn Văn Tech",
    status: "resolved",
  },
  {
    id: "#WR-0002",
    icon: <Mouse className="h-5 w-5 text-neutral-600" />,
    customer: "Trần Thị Khách",
    product: "Logitech MX Master 3S",
    category: "Accessories",
    technician: "Chưa phân công",
    status: "processing",
  },
  {
    id: "#WR-0003",
    icon: <Camera className="h-5 w-5 text-neutral-600" />,
    customer: "Trần Thị Khách",
    product: "Camera IP Dome",
    category: "Điều khiển",
    technician: "Nguyễn Văn Tech",
    status: "pending",
  },
];

type Product = {
  code: string;
  name: string;
  customer: string;
  category: string;
  hasImage: boolean;
};

const PRODUCT_CATEGORIES = ["Laptop", "PC", "Accessories", "An Ninh Giám Sát"] as const;

const products: Product[] = [
  { code: "LAP-2023-002", name: "MacBook Pro M2 14-inch", customer: "Tran Thi Khach", category: "Laptop", hasImage: true },
  { code: "ACC-2023-001", name: "Logitech MX Master 3S", customer: "Tran Thi Khach", category: "Accessories", hasImage: true },
  { code: "SN123", name: "Laptop", customer: "Tran Thi Khach", category: "Laptop", hasImage: false },
  { code: "SN1", name: "SPI", customer: "Tran Thi Khach", category: "PC", hasImage: false },
  { code: "S/N: AX-P3245-2026-001", name: "Camera IP Dome AXIS P3245-V", customer: "Tran Thi Khach", category: "An Ninh Giám Sát", hasImage: true },
];

type Category = {
  name: string;
  description: string;
};

const categories: Category[] = [
  { name: "Laptop", description: "Laptop devices and notebooks" },
  { name: "PC", description: "Desktop computers and workstations" },
  { name: "Accessories", description: "Keyboards, mice, monitors, etc." },
  { name: "An Ninh Giám Sát", description: "Các loại camera" },
];

const statusConfig = {
  resolved: { label: "Đã giải quyết", className: "bg-green-100 text-green-700 hover:bg-green-100" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  pending: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100" },
};

const navItems = [
  { label: "Bảng điều khiển", icon: LayoutDashboard, active: true },
  { label: "Thành viên", icon: Users, active: false },
  { label: "Báo cáo", icon: FileBarChart, active: false },
];

const StatCard = ({
  title,
  value,
  badgeText,
  badgeClass,
  children,
}: {
  title: string;
  value: string;
  badgeText?: string;
  badgeClass?: string;
  children?: React.ReactNode;
}) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <p className="text-sm text-neutral-500 font-medium">{title}</p>
    <p className="text-3xl font-bold text-neutral-900 mt-2">{value}</p>
    {badgeText && (
      <span className={`inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
        {badgeText}
      </span>
    )}
    {children}
  </div>
);

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<string[]>([]);
  const [addProductOpen, setAddProductOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        r.id.toLowerCase().includes(q) ||
        r.customer.toLowerCase().includes(q) ||
        r.product.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.technician.toLowerCase().includes(q),
    );
  }, [search]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    return products.filter((p) => {
      const matchesSearch =
        !q ||
        p.code.toLowerCase().includes(q) ||
        p.name.toLowerCase().includes(q) ||
        p.customer.toLowerCase().includes(q);
      const matchesCategory =
        productCategoryFilter.length === 0 || productCategoryFilter.includes(p.category);
      return matchesSearch && matchesCategory;
    });
  }, [productSearch, productCategoryFilter]);

  const toggleCategory = (cat: string) => {
    setProductCategoryFilter((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  };

  return (
    <div className="h-screen flex flex-row bg-[#F9FAFB]">
      {/* Sidebar */}
      <aside className="w-[260px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center text-white font-bold text-lg">
              W
            </div>
            <span className="font-bold text-neutral-900">Ánh Sáng Warranty</span>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-neutral-200 flex items-center justify-center text-sm font-semibold text-neutral-700">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-neutral-900 truncate">System Admin</p>
              <p className="text-xs text-neutral-500 truncate">admin@anhsang.vn</p>
            </div>
            <button
              onClick={() => navigate("/login")}
              className="p-2 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              aria-label="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Chào System Admin,</h1>
              <p className="text-neutral-500 mt-1">Quản lý hệ thống bảo hành Ánh Sáng.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="border-gray-300">
                Thêm tài khoản
              </Button>
              <Button
                className="bg-black text-white hover:bg-neutral-800"
                onClick={() => setAddProductOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Sản phẩm
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Tổng yêu cầu"
              value="6"
              badgeText="Tất cả yêu cầu"
              badgeClass="bg-blue-100 text-blue-700"
            />
            <StatCard
              title="Đang xử lý"
              value="3"
              badgeText="Đang kiểm tra"
              badgeClass="bg-orange-100 text-orange-700"
            />
            <StatCard
              title="Hoàn thành"
              value="2"
              badgeText="Đã hoàn tất"
              badgeClass="bg-green-100 text-green-700"
            />
            <StatCard title="Tỷ lệ giải quyết" value="33.3%">
              <Progress value={33.3} className="h-2 mt-3" />
            </StatCard>
          </div>

          {/* Table card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <Tabs defaultValue="requests">
              <TabsList className="bg-neutral-100">
                <TabsTrigger value="requests">Yêu cầu</TabsTrigger>
                <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                <TabsTrigger value="categories">Danh mục</TabsTrigger>
              </TabsList>

              <TabsContent value="requests" className="mt-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Tìm kiếm mã phiếu, khách hàng..."
                      className="pl-9 bg-neutral-50 border-gray-200"
                    />
                  </div>
                  <Button variant="outline" className="border-gray-300">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                        <TableHead>ID</TableHead>
                        <TableHead>Ảnh/Video</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead>Sản phẩm</TableHead>
                        <TableHead>Phân loại</TableHead>
                        <TableHead>Kỹ thuật viên</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((r) => {
                        const s = statusConfig[r.status];
                        return (
                          <TableRow key={r.id}>
                            <TableCell className="font-medium text-neutral-900">{r.id}</TableCell>
                            <TableCell>
                              <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center">
                                {r.icon}
                              </div>
                            </TableCell>
                            <TableCell className="text-neutral-700">{r.customer}</TableCell>
                            <TableCell className="text-neutral-700">{r.product}</TableCell>
                            <TableCell className="text-neutral-600">{r.category}</TableCell>
                            <TableCell className="text-neutral-600">{r.technician}</TableCell>
                            <TableCell>
                              <Badge className={`rounded-full font-medium ${s.className}`}>
                                {s.label}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  className="p-2 rounded-md border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                                  aria-label="Print"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                                <button
                                  className="p-2 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                                  aria-label="Delete"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8 text-neutral-500">
                            Không tìm thấy kết quả phù hợp.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="products" className="mt-6">
                <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-neutral-900">Kho sản phẩm</h3>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                      {filteredProducts.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-1 justify-end min-w-[280px]">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                      <Input
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Tìm theo mã, tên SP, khách hàng..."
                        className="pl-9 bg-neutral-50 border-gray-200"
                      />
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-gray-300">
                          <Filter className="h-4 w-4" />
                          Bộ lọc
                          {productCategoryFilter.length > 0 && (
                            <span className="ml-1 text-xs font-medium px-1.5 py-0.5 rounded-full bg-neutral-900 text-white">
                              {productCategoryFilter.length}
                            </span>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Lọc theo danh mục</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <DropdownMenuCheckboxItem
                            key={cat}
                            checked={productCategoryFilter.includes(cat)}
                            onCheckedChange={() => toggleCategory(cat)}
                            onSelect={(e) => e.preventDefault()}
                          >
                            {cat}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      className="bg-black text-white hover:bg-neutral-800"
                      onClick={() => setAddProductOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Thêm
                    </Button>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                        <TableHead>Ảnh</TableHead>
                        <TableHead>Mã SP</TableHead>
                        <TableHead>Tên sản phẩm</TableHead>
                        <TableHead>Danh mục</TableHead>
                        <TableHead>Khách hàng</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((p) => (
                        <TableRow key={p.code}>
                          <TableCell>
                            <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-400">
                              {p.hasImage ? (
                                <Laptop className="h-5 w-5 text-neutral-500" />
                              ) : (
                                <div className="flex flex-col items-center justify-center">
                                  <ImageOff className="h-3.5 w-3.5" />
                                  <span className="text-[9px] leading-none mt-0.5">No pic</span>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium text-neutral-900">{p.code}</TableCell>
                          <TableCell className="text-neutral-700">{p.name}</TableCell>
                          <TableCell className="text-neutral-600">{p.category}</TableCell>
                          <TableCell className="text-neutral-600">{p.customer}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                                aria-label="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 rounded-md border border-red-200 text-red-400 hover:bg-red-50 transition-colors"
                                aria-label="Print"
                              >
                                <Printer className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredProducts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                            Không tìm thấy sản phẩm phù hợp.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="mt-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-semibold text-neutral-900">Danh mục sản phẩm</h3>
                  <Button className="bg-black text-white hover:bg-neutral-800">
                    <Plus className="h-4 w-4" />
                    Thêm
                  </Button>
                </div>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-neutral-50 hover:bg-neutral-50">
                        <TableHead>Tên danh mục</TableHead>
                        <TableHead>Mô tả</TableHead>
                        <TableHead className="text-right">Thao tác</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((c) => (
                        <TableRow key={c.name}>
                          <TableCell className="font-medium text-neutral-900">{c.name}</TableCell>
                          <TableCell className="text-neutral-600">{c.description}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                className="p-2 rounded-md border border-neutral-200 text-neutral-600 hover:bg-neutral-50 transition-colors"
                                aria-label="Edit"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                className="p-2 rounded-md border border-red-300 text-red-500 hover:bg-red-50 transition-colors"
                                aria-label="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <AddProductModal
        open={addProductOpen}
        onOpenChange={setAddProductOpen}
        existingCodes={products.map((p) => p.code)}
        categories={[...PRODUCT_CATEGORIES]}
      />
    </div>
  );
}
