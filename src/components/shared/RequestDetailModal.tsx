import { X, User, Phone, Mail, MapPin, Package, Tag, Hash, ShieldCheck, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type WarrantyRequestDetail = {
  id: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
  };
  product: {
    name: string;
    category: string;
    serial: string;
    warrantyUntil: string;
  };
  issue: {
    type: string;
    description: string;
    media: string[];
  };
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  request?: WarrantyRequestDetail | null;
  /** Show "Tiếp nhận yêu cầu" CTA (technician view only) */
  showAccept?: boolean;
  onAccept?: (id: string) => void;
};

const Field = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-neutral-900 break-words">{value}</p>
    </div>
  </div>
);

const SectionCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-lg border border-gray-200 bg-white">
    <div className="px-4 py-3 border-b border-gray-200">
      <h3 className="text-sm font-semibold text-neutral-900">{title}</h3>
    </div>
    <div className="p-4">{children}</div>
  </section>
);

export const RequestDetailModal = ({
  open,
  onOpenChange,
  request,
  showAccept,
  onAccept,
}: Props) => {
  if (!request) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-gray-200 flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold">
              Chi tiết yêu cầu {request.id}
            </DialogTitle>
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              Chờ xử lý
            </Badge>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto bg-gray-50/40">
          <SectionCard title="Thông tin khách hàng">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={User} label="Họ và tên" value={request.customer.name} />
              <Field icon={Phone} label="Số điện thoại" value={request.customer.phone} />
              <Field icon={Mail} label="Email" value={request.customer.email} />
              <Field icon={MapPin} label="Đơn vị / Địa chỉ" value={request.customer.address} />
            </div>
          </SectionCard>

          <SectionCard title="Thông tin thiết bị">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={Package} label="Tên sản phẩm" value={request.product.name} />
              <Field icon={Tag} label="Danh mục" value={request.product.category} />
              <Field icon={Hash} label="Mã Serial" value={request.product.serial} />
              <Field icon={ShieldCheck} label="Thời hạn bảo hành" value={request.product.warrantyUntil} />
            </div>
          </SectionCard>

          <SectionCard title="Nội dung phản hồi">
            <div className="space-y-4">
              <Field
                icon={AlertTriangle}
                label="Phân loại sự cố"
                value={<Badge variant="secondary">{request.issue.type}</Badge>}
              />
              <div>
                <p className="text-xs text-gray-500 mb-1.5">Mô tả lỗi chi tiết</p>
                <p className="text-sm text-neutral-800 leading-relaxed bg-gray-50 border border-gray-200 rounded-md p-3">
                  {request.issue.description}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-2">Ảnh / Video đính kèm</p>
                <div className="flex flex-wrap gap-2">
                  {request.issue.media.map((src, i) => (
                    <div
                      key={i}
                      className="h-20 w-20 rounded-md overflow-hidden border border-gray-200 bg-gray-100"
                    >
                      <img
                        src={src}
                        alt={`attachment-${i}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="px-6 py-4 border-t border-gray-200 bg-white flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          {showAccept && (
            <Button
              onClick={() => {
                onAccept?.(request.id);
                onOpenChange(false);
              }}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Tiếp nhận yêu cầu
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
