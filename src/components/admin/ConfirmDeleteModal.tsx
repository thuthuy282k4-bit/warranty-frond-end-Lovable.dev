import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  itemLabel?: string;
  onConfirm?: () => void;
};

export function ConfirmDeleteModal({ open, onOpenChange, itemLabel, onConfirm }: Props) {
  const handleConfirm = () => {
    onConfirm?.();
    toast.success(itemLabel ? `Đã xoá ${itemLabel}` : "Đã xoá thành công");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Xác nhận xoá</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-500 mt-1">
          Bạn không thể hoàn tác sau khi xoá.
        </p>

        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="px-4 py-2 rounded-md text-sm font-bold text-white bg-red-600 hover:bg-red-700 transition-colors"
          >
            Xoá ngay
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
