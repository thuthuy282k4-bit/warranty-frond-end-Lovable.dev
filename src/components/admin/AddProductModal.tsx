import { useMemo, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingCodes: string[];
  categories: string[];
  customers?: string[];
};

const DEFAULT_CUSTOMERS = ["Trần Thị Khách", "Nguyễn Văn A", "Lê Thị B"];
const WARRANTY_OPTIONS = ["6", "12", "18", "24", "36"];

export function AddProductModal({
  open,
  onOpenChange,
  existingCodes,
  categories,
  customers = DEFAULT_CUSTOMERS,
}: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customer, setCustomer] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warranty, setWarranty] = useState("");

  useEffect(() => {
    if (!open) {
      setCode("");
      setName("");
      setCategory("");
      setCustomer("");
      setPurchaseDate("");
      setWarranty("");
    }
  }, [open]);

  const codeExists = useMemo(() => {
    const c = code.trim().toLowerCase();
    if (!c) return false;
    return existingCodes.some((e) => e.toLowerCase() === c);
  }, [code, existingCodes]);

  const allFilled =
    code.trim() && name.trim() && category && customer && purchaseDate && warranty;
  const canSubmit = !!allFilled && !codeExists;

  const handleSubmit = () => {
    if (!canSubmit) return;
    toast.success("Thêm sản phẩm thành công!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm</DialogTitle>
          <DialogDescription>Vui lòng nhập đầy đủ thông tin</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {/* Mã SP */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Mã sản phẩm <span className="text-red-500">*</span>
            </Label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: SN-12345"
              className={cn(codeExists && "border-red-500 focus-visible:ring-red-500")}
            />
            {codeExists && (
              <p className="text-xs text-red-500">
                Mã sản phẩm này đã tồn tại trên hệ thống!
              </p>
            )}
          </div>

          {/* Tên SP */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Tên sản phẩm <span className="text-red-500">*</span>
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên sản phẩm"
            />
          </div>

          {/* Danh mục */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Danh mục <span className="text-red-500">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Khách hàng */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Khách hàng sở hữu <span className="text-red-500">*</span>
            </Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn khách hàng" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ngày mua */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Ngày mua <span className="text-red-500">*</span>
            </Label>
            <Input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
            />
          </div>

          {/* Bảo hành */}
          <div className="space-y-1.5">
            <Label className="text-sm">
              Bảo hành (tháng) <span className="text-red-500">*</span>
            </Label>
            <Select value={warranty} onValueChange={setWarranty}>
              <SelectTrigger>
                <SelectValue placeholder="12" />
              </SelectTrigger>
              <SelectContent>
                {WARRANTY_OPTIONS.map((w) => (
                  <SelectItem key={w} value={w}>
                    {w} tháng
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "px-4 py-2 rounded-md text-sm transition-all",
              canSubmit
                ? "bg-black text-white font-bold opacity-100 cursor-pointer hover:bg-neutral-800"
                : "bg-neutral-400 text-white font-medium opacity-50 cursor-not-allowed",
            )}
          >
            Thêm sản phẩm
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
