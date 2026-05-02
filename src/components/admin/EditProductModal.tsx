import { useEffect, useRef, useState, type DragEvent } from "react";
import { UploadCloud, X as XIcon, ImageIcon } from "lucide-react";
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

export type EditProductData = {
  code: string;
  name: string;
  category: string;
  customer: string;
  purchaseDate?: string;
  warranty?: string;
  existingImages?: string[];
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product: EditProductData | null;
  categories: string[];
  customers?: string[];
};

const DEFAULT_CUSTOMERS = ["Trần Thị Khách", "Nguyễn Văn A", "Lê Thị B"];
const WARRANTY_OPTIONS = ["6", "12", "18", "24", "36"];

export function EditProductModal({
  open,
  onOpenChange,
  product,
  categories,
  customers = DEFAULT_CUSTOMERS,
}: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customer, setCustomer] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warranty, setWarranty] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && product) {
      setCode(product.code);
      setName(product.name);
      setCategory(product.category);
      setCustomer(product.customer);
      setPurchaseDate(product.purchaseDate ?? "2024-01-15");
      setWarranty(product.warranty ?? "12");
      setExistingImages(product.existingImages ?? ["product-image-1.jpg"]);
      setFiles([]);
      setDragOver(false);
    }
  }, [open, product]);

  const handleFiles = (list: FileList) => {
    const imgs = Array.from(list).filter((f) => f.type.startsWith("image/"));
    setFiles((prev) => [...prev, ...imgs]);
  };

  const canSubmit = !!(code.trim() && name.trim() && category && customer && purchaseDate && warranty);

  const handleSubmit = () => {
    if (!canSubmit) return;
    toast.success("Cập nhật sản phẩm thành công!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Sửa sản phẩm</DialogTitle>
          <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-sm">Mã sản phẩm <span className="text-red-500">*</span></Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Tên sản phẩm <span className="text-red-500">*</span></Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Danh mục <span className="text-red-500">*</span></Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue placeholder="Chọn danh mục" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Khách hàng sở hữu <span className="text-red-500">*</span></Label>
            <Select value={customer} onValueChange={setCustomer}>
              <SelectTrigger><SelectValue placeholder="Chọn khách hàng" /></SelectTrigger>
              <SelectContent>
                {customers.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Ngày mua <span className="text-red-500">*</span></Label>
            <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Bảo hành (tháng) <span className="text-red-500">*</span></Label>
            <Select value={warranty} onValueChange={setWarranty}>
              <SelectTrigger><SelectValue placeholder="12" /></SelectTrigger>
              <SelectContent>
                {WARRANTY_OPTIONS.map((w) => <SelectItem key={w} value={w}>{w} tháng</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5 mt-4">
          <Label className="text-sm">Hình ảnh sản phẩm</Label>

          {existingImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {existingImages.map((img, i) => (
                <div
                  key={`${img}-${i}`}
                  className="relative w-16 h-16 rounded-md border border-gray-200 bg-neutral-100 flex items-center justify-center group"
                >
                  <ImageIcon className="h-5 w-5 text-neutral-400" />
                  <button
                    type="button"
                    onClick={() => setExistingImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1.5 -right-1.5 bg-white border border-gray-200 rounded-full p-0.5 text-neutral-500 hover:text-red-500 shadow-sm"
                    aria-label="Remove"
                  >
                    <XIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              setDragOver(false);
              if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
            }}
            className={cn(
              "flex flex-col items-center justify-center w-full p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
              dragOver ? "border-neutral-900 bg-neutral-100" : "border-gray-300 bg-gray-50 hover:bg-gray-100",
            )}
          >
            <UploadCloud className="h-7 w-7 text-gray-400" />
            <p className="text-sm font-medium text-gray-700 mt-2">Kéo thả ảnh vào đây hoặc nhấp để tải lên</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF lên đến 5MB (Có thể chọn nhiều ảnh)</p>
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
                <li key={`${f.name}-${i}`} className="flex items-center justify-between text-xs bg-neutral-50 border border-gray-200 rounded px-2 py-1">
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
                ? "bg-black text-white font-bold hover:bg-neutral-800"
                : "bg-neutral-400 text-white opacity-50 cursor-not-allowed",
            )}
          >
            Cập nhật
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
