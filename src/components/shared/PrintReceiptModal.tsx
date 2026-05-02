import { X, Printer } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export type WarrantyReceiptData = {
  type: "receipt" | "warranty"; // BIÊN NHẬN or PHIẾU BẢO HÀNH
  refId: string; // WR-... or LAP-...
  customerName?: string;
  customerPhone?: string;
  productName?: string;
  productModel?: string;
  serial?: string;
  expiry?: string; // "20/05/2026"
  isValid?: boolean;
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  data?: WarrantyReceiptData | null;
};

export const PrintReceiptModal = ({ open, onOpenChange, data }: Props) => {
  if (!data) return null;

  const title = data.type === "receipt" ? "BIÊN NHẬN" : "PHIẾU BẢO HÀNH";
  const isValid = data.isValid ?? true;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] p-0 gap-0 overflow-hidden print:shadow-none print:max-w-full print:border-0">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex items-center justify-between border-b print:hidden">
          <h2 className="text-lg font-semibold">Xuất phiếu bảo hành / Biên nhận</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-4 print:p-0">
          {/* Alert */}
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 flex items-center justify-between gap-3 print:hidden">
            <p className="text-sm text-red-700">
              <span className="font-semibold">BẢN CẬP NHẬT MỚI (V6)</span> — Mẫu phiếu đã được cập nhật. Vui lòng kiểm tra trước khi in.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
              >
                Đóng
              </Button>
              <Button
                size="sm"
                onClick={handlePrint}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                <Printer className="h-3.5 w-3.5 mr-1.5" />
                In ngay
              </Button>
            </div>
          </div>

          {/* Printable area */}
          <div
            id="print-area"
            className="rounded-lg border-2 border-dashed border-gray-300 p-6 bg-white print:border-0 print:p-0"
          >
            {/* Top */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-200">
              <div>
                <p className="text-blue-600 font-bold text-xl tracking-tight">
                  AS-LIGHTING
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Giải pháp Công nghệ Ánh Sáng
                </p>
              </div>
              <div className="text-right text-[11px] text-gray-600 leading-relaxed">
                <p>123 Nguyễn Văn Linh, Q.7, TP.HCM</p>
                <p>Hotline: 1900 6868</p>
                <p>support@anhsang.vn</p>
              </div>
            </div>

            {/* Title */}
            <div className="text-center py-5">
              <h3 className="text-2xl font-bold tracking-wide text-neutral-900">
                {title}
              </h3>
              <p className="text-blue-600 font-semibold text-sm mt-1">
                #{data.refId}
              </p>
            </div>

            {/* Split content */}
            <div className="grid grid-cols-2 gap-6 pb-5">
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Khách hàng
                </h4>
                <div className="space-y-1.5 text-sm">
                  <Row label="Tên" value={data.customerName ?? "—"} />
                  <Row label="SĐT" value={data.customerPhone ?? "—"} />
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Thiết bị
                </h4>
                <div className="space-y-1.5 text-sm">
                  <Row label="Model" value={data.productModel ?? data.productName ?? "—"} />
                  <Row label="Serial" value={data.serial ?? "—"} />
                  <Row label="Hạn BH" value={data.expiry ?? "—"} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div
              className={`rounded-md px-4 py-3 text-center text-sm font-semibold tracking-wide ${
                isValid ? "bg-neutral-900 text-white" : "bg-red-700 text-white"
              }`}
            >
              {isValid
                ? `HỢP LỆ — HẾT HẠN ${data.expiry ?? "—"}`
                : `HẾT HIỆU LỰC BẢO HÀNH (${data.expiry ?? "—"})`}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50/60 print:hidden">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-neutral-900 text-white hover:bg-neutral-800"
          >
            <Printer className="h-4 w-4 mr-1.5" />
            In ngay
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-baseline gap-2">
    <span className="text-gray-500 text-xs w-14 shrink-0">{label}:</span>
    <span className="text-neutral-900 font-medium">{value}</span>
  </div>
);
