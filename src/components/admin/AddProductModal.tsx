import { useMemo, useState, useEffect, useRef, type DragEvent } from "react";
import { UploadCloud, X as XIcon } from "lucide-react";
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

        {/* Image upload */}
        <div className="space-y-1.5 mt-4">
          <Label className="text-sm">Hình ảnh sản phẩm (có thể chọn nhiều)</Label>
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            className={cn(
              "flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
              dragOver
                ? "border-neutral-900 bg-neutral-100"
                : "border-gray-300 bg-gray-50 hover:bg-gray-100",
            )}
          >
            <UploadCloud className="h-7 w-7 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mt-2">
              Kéo thả ảnh vào đây hoặc nhấp để tải lên
            </p>
            <p className="text-xs text-gray-500 mt-1">
              PNG, JPG, GIF lên đến 5MB (Có thể chọn nhiều ảnh)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>

          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between text-xs bg-neutral-50 border border-gray-200 rounded px-2 py-1"
                >
                  <span className="truncate text-neutral-700">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-neutral-400 hover:text-red-500"
                    aria-label="Remove"
                  >
                    <XIcon className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
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
