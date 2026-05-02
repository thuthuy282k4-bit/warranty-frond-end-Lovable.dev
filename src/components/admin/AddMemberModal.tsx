import { useEffect, useState } from "react";
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
};

const ROLES = ["CUSTOMER", "ADMIN", "TECHNICIAN"];
const STATUSES = ["Hoạt động", "Tạm khoá"];

export function AddMemberModal({ open, onOpenChange }: Props) {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Hoạt động");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!open) {
      setFullName(""); setRole(""); setEmail(""); setPhone("");
      setPassword(""); setStatus("Hoạt động"); setCompany(""); setAddress("");
    }
  }, [open]);

  const canSubmit = !!(fullName.trim() && role && email.trim() && password.trim());

  const handleSubmit = () => {
    if (!canSubmit) return;
    toast.success("Thêm người dùng thành công!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm thành viên</DialogTitle>
          <DialogDescription>Tạo tài khoản mới cho hệ thống</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          <div className="space-y-1.5">
            <Label className="text-sm">Họ và tên <span className="text-red-500">*</span></Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nguyễn Văn A" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Vai trò <span className="text-red-500">*</span></Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue placeholder="Chọn vai trò" /></SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Email <span className="text-red-500">*</span></Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="user@example.com" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Điện thoại</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0901 234 567" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Mật khẩu <span className="text-red-500">*</span></Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Trạng thái</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm">Công ty</Label>
            <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Tên công ty" />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-sm">Địa chỉ</Label>
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Số nhà, đường, quận, thành phố" />
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
                ? "bg-black text-white font-bold hover:bg-neutral-800"
                : "bg-neutral-400 text-white opacity-50 cursor-not-allowed",
            )}
          >
            Thêm người dùng
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
