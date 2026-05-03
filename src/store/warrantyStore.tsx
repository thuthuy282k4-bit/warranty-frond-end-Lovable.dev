import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WarrantyStatus = "pending" | "processing" | "completed";

export type WarrantyRequest = {
  id: string; // e.g. "WR-711407"
  customer: string;
  customerEmail?: string;
  product: string;
  productCode?: string;
  category: string;
  technician: string; // "Chưa phân công" when unassigned
  status: WarrantyStatus;
  createdAt: string; // dd/mm/yyyy
  description: string;
  issueType: string;
  solution?: string;
  completedAt?: string;
};

const STORAGE_KEY = "warrantyhub.requests.v1";

const seed: WarrantyRequest[] = [
  {
    id: "WR-711407",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "Dell XPS 15",
    productCode: "LAP-2023-002",
    category: "Phần cứng",
    technician: "Chưa phân công",
    status: "pending",
    createdAt: "02/05/2026",
    issueType: "Phần cứng",
    description:
      "Thiết bị không khởi động được sau khi cập nhật firmware. Đèn nguồn nhấp nháy 3 lần rồi tắt.",
  },
  {
    id: "WR-711408",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "Logitech MX Master 3S",
    productCode: "ACC-2024-011",
    category: "Phụ kiện",
    technician: "Nguyễn Văn Tech",
    status: "processing",
    createdAt: "01/05/2026",
    issueType: "Phụ kiện",
    description: "Con lăn không cuộn được, click trái đôi khi không nhận.",
  },
  {
    id: "WR-711409",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "Camera IP Dome",
    productCode: "SEC-2025-003",
    category: "An ninh",
    technician: "Nguyễn Văn Tech",
    status: "processing",
    createdAt: "30/04/2026",
    issueType: "Phần cứng",
    description: "Camera mất kết nối ngẫu nhiên, hình ảnh ban đêm bị nhiễu nặng.",
  },
  {
    id: "WR-711410",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "Dell U2723QE",
    productCode: "MON-2024-007",
    category: "Màn hình",
    technician: "Trần Văn Hardware",
    status: "processing",
    createdAt: "29/04/2026",
    issueType: "Phần cứng",
    description: "Màn hình bị sọc dọc khi bật ở độ phân giải 4K.",
  },
  {
    id: "WR-711411",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "MacBook Pro 14",
    productCode: "LAP-2024-021",
    category: "Phần cứng",
    technician: "Nguyễn Văn Tech",
    status: "completed",
    createdAt: "27/04/2026",
    issueType: "Phần cứng",
    description: "Pin chai sau 6 tháng sử dụng, máy nóng bất thường.",
    solution: "Thay pin mới, cập nhật macOS",
    completedAt: "29/04/2026",
  },
  {
    id: "WR-711412",
    customer: "Trần Thị Khách",
    customerEmail: "customer@gmail.com",
    product: "Keychron K2",
    productCode: "ACC-2024-019",
    category: "Phụ kiện",
    technician: "Lê Thị Support",
    status: "completed",
    createdAt: "25/04/2026",
    issueType: "Phụ kiện",
    description: "Một vài phím bị kẹt, đèn LED không sáng đều.",
    solution: "Vệ sinh switch, thay keycap",
    completedAt: "26/04/2026",
  },
];

type Ctx = {
  requests: WarrantyRequest[];
  addRequest: (
    r: Omit<WarrantyRequest, "id" | "status" | "technician" | "createdAt"> &
      Partial<Pick<WarrantyRequest, "id" | "status" | "technician" | "createdAt">>,
  ) => WarrantyRequest;
  updateRequest: (id: string, patch: Partial<WarrantyRequest>) => void;
  assignTechnician: (id: string, technician: string) => void;
  setStatus: (
    id: string,
    status: WarrantyStatus,
    extra?: { solution?: string; completedAt?: string },
  ) => void;
};

const WarrantyContext = createContext<Ctx | null>(null);

const load = (): WarrantyRequest[] => {
  if (typeof window === "undefined") return seed;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as WarrantyRequest[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seed;
    return parsed;
  } catch {
    return seed;
  }
};

export const WarrantyProvider = ({ children }: { children: ReactNode }) => {
  const [requests, setRequests] = useState<WarrantyRequest[]>(load);

  // Persist
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch {
      /* ignore */
    }
  }, [requests]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue) as WarrantyRequest[];
        if (Array.isArray(parsed)) setRequests(parsed);
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addRequest: Ctx["addRequest"] = useCallback((data) => {
    const newReq: WarrantyRequest = {
      id: data.id ?? `WR-${Math.floor(100000 + Math.random() * 900000)}`,
      status: data.status ?? "pending",
      technician: data.technician ?? "Chưa phân công",
      createdAt: data.createdAt ?? new Date().toLocaleDateString("vi-VN"),
      customer: data.customer,
      customerEmail: data.customerEmail,
      product: data.product,
      productCode: data.productCode ?? "—",
      category: data.category,
      description: data.description,
      issueType: data.issueType,
      solution: data.solution,
      completedAt: data.completedAt,
    };
    setRequests((prev) => [newReq, ...prev]);
    return newReq;
  }, []);

  const updateRequest: Ctx["updateRequest"] = useCallback((id, patch) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, []);

  const assignTechnician: Ctx["assignTechnician"] = useCallback((id, technician) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const next: WarrantyRequest = { ...r, technician };
        if (
          r.status === "pending" &&
          technician &&
          technician !== "Chưa phân công"
        ) {
          next.status = "processing";
        }
        return next;
      }),
    );
  }, []);

  const setStatus: Ctx["setStatus"] = useCallback((id, status, extra) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              solution: extra?.solution ?? r.solution,
              completedAt:
                status === "completed"
                  ? extra?.completedAt ?? new Date().toLocaleDateString("vi-VN")
                  : r.completedAt,
            }
          : r,
      ),
    );
  }, []);

  const value = useMemo<Ctx>(
    () => ({ requests, addRequest, updateRequest, assignTechnician, setStatus }),
    [requests, addRequest, updateRequest, assignTechnician, setStatus],
  );

  return (
    <WarrantyContext.Provider value={value}>{children}</WarrantyContext.Provider>
  );
};

export const useWarrantyStore = () => {
  const ctx = useContext(WarrantyContext);
  if (!ctx)
    throw new Error("useWarrantyStore must be used within WarrantyProvider");
  return ctx;
};
