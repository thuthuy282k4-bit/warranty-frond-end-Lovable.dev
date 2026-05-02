import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export type UpdateStatusValue = "processing" | "completed" | "rejected";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  requestId?: string;
  onSubmit: (status: UpdateStatusValue, note: string) => void;
};

export const UpdateStatusModal = ({ open, onOpenChange, requestId, onSubmit }: Props) => {
  const [status, setStatus] = useState<UpdateStatusValue>("processing");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setStatus("processing");
      setNote("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit(status, note);
    toast.success("Cập nhật trạng thái thành công!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 flex-row items-start justify-between space-y-0">
          <div>
            <DialogTitle className="text-lg font-semibold">Cập nhật trạng thái</DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Cập nhật tiến độ xử lý yêu cầu kỹ thuật
            </DialogDescription>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>

        <div className="px-6 pb-2 space-y-4">
          <div>
            <Label className="text-sm text-gray-700">Yêu cầu hiện tại</Label>
            <Input value={requestId ?? ""} readOnly className="mt-1.5 bg-gray-50 text-gray-700" />
          </div>

          <div>
            <Label className="text-sm text-gray-700">Trạng thái</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as UpdateStatusValue)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm text-gray-700">Ghi chú kỹ thuật</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Mô tả chi tiết quá trình xử lý, giải pháp đã thực hiện..."
              className="mt-1.5 min-h-[100px]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t bg-gray-50/60">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-neutral-900 text-white hover:bg-neutral-800"
          >
            Cập nhật trạng thái
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
