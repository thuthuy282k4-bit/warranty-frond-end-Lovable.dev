import { useEffect, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type NewRequestPayload = {
  product: string;
  issueType: string;
  description: string;
  files: File[];
};

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: NewRequestPayload) => void;
};

const products = [
  "Dell XPS 15",
  "MacBook Pro 14",
  "Logitech MX Master 3S",
  "Camera IP Dome",
  "Dell U2723QE",
];
const issueTypes = ["Phần cứng", "Phần mềm", "Phụ kiện", "Khác"];

export const NewRequestModal = ({ open, onOpenChange, onSubmit }: Props) => {
  const [product, setProduct] = useState("");
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setProduct("");
      setIssueType("");
      setDescription("");
      setFiles([]);
    }
  }, [open]);

  const handleFiles = (list: FileList) => {
    const accepted = Array.from(list).filter(
      (f) => f.type.startsWith("image/") || f.type.startsWith("video/")
    );
    setFiles((prev) => [...prev, ...accepted]);
  };

  const valid = product && issueType && description.trim().length > 0;

  const handleSubmit = () => {
    if (!valid) return;
    onSubmit({ product, issueType, description, files });
    toast.success("Gửi yêu cầu bảo hành thành công!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-row items-start justify-between space-y-0">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Tạo yêu cầu bảo hành mới
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Vui lòng cung cấp đầy đủ thông tin để chúng tôi hỗ trợ tốt nhất
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4 max-h-[65vh] overflow-y-auto">
          <div>
            <Label className="text-sm text-gray-700">Chọn sản phẩm</Label>
            <Select value={product} onValueChange={setProduct}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="-- Chọn sản phẩm --" />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-700">Loại vấn đề</Label>
            <Select value={issueType} onValueChange={setIssueType}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="-- Chọn loại vấn đề --" />
              </SelectTrigger>
              <SelectContent>
                {issueTypes.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-700">Mô tả lỗi chi tiết</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả tình trạng và biểu hiện lỗi..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>

          <div>
            <Label className="text-sm text-gray-700">Hình ảnh/Video mô tả lỗi</Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
              }}
              className={cn(
                "mt-1.5 cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center text-center transition",
                dragOver && "bg-neutral-100 border-gray-400"
              )}
            >
              <UploadCloud className="h-7 w-7 text-gray-400" />
              <p className="text-sm font-medium text-gray-700 mt-2">
                Kéo thả tệp vào đây hoặc nhấp để tải lên
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, MP4 lên đến 20MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
              />
            </div>
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="text-xs flex items-center justify-between bg-gray-50 border rounded px-2 py-1"
                  >
                    <span className="truncate">{f.name}</span>
                    <button
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, idx) => idx !== i))
                      }
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50/60">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!valid}
            className="bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-gray-300 disabled:text-gray-500"
          >
            Gửi yêu cầu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
