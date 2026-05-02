import { X, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type RequestDetail = {
  id: string;
  status: "pending" | "processing" | "completed";
  product: string;
  productCode: string;
  purchaseDate: string;
  issueType: string;
  description: string;
  resolution?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  request?: RequestDetail | null;
};

const statusMeta = {
  pending: { label: "Chờ xử lý", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" },
  processing: { label: "Đang xử lý", className: "bg-blue-100 text-blue-700 hover:bg-blue-100" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-700 hover:bg-green-100" },
};

export const RequestDetailModal = ({ open, onOpenChange, request }: Props) => {
  if (!request) return null;
  const meta = statusMeta[request.status];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold">
              Chi tiết yêu cầu {request.id}
            </DialogTitle>
            <Badge className={meta.className}>{meta.label}</Badge>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* Product info */}
          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Thông tin sản phẩm
            </h3>
            <div className="rounded-lg border border-gray-200 bg-gray-50/60 p-4 space-y-2 text-sm">
              <Row label="Tên sản phẩm" value={request.product} />
              <Row label="Mã sản phẩm" value={request.productCode} />
              <Row label="Ngày mua" value={request.purchaseDate} />
            </div>
          </section>

          {/* Issue */}
          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Vấn đề phản hồi
            </h3>
            <div className="rounded-lg border border-gray-200 p-4 space-y-2 text-sm">
              <Row
                label="Phân loại"
                value={<Badge variant="secondary">{request.issueType}</Badge>}
              />
              <div>
                <p className="text-gray-500 text-xs mb-1">Mô tả</p>
                <p className="text-gray-800 leading-relaxed">{request.description}</p>
              </div>
            </div>
          </section>

          {/* Resolution */}
          <section>
            <h3 className="text-sm font-semibold text-neutral-900 mb-2">
              Quá trình xử lý
            </h3>
            <div className="rounded-lg border border-gray-200 p-4 text-sm">
              {request.status === "completed" && request.resolution ? (
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-green-700 font-medium">
                      Kết quả giải quyết: Đã sửa
                    </p>
                    <p className="text-gray-700 mt-1">{request.resolution}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  Yêu cầu của bạn đang được kỹ thuật viên xử lý...
                </p>
              )}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 text-xs">{label}</span>
    <span className="text-neutral-900 font-medium">{value}</span>
  </div>
);
