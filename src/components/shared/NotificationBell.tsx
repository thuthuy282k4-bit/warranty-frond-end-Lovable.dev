import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useNotificationStore,
  formatRelativeTime,
  type NotificationAudience,
} from "@/store/notificationStore";

type Props = {
  role: NotificationAudience;
  customerEmail?: string;
};

export const NotificationBell = ({ role, customerEmail }: Props) => {
  const [open, setOpen] = useState(false);
  const { forRole, unreadCount, markRoleRead } = useNotificationStore();
  const items = forRole(role, customerEmail);
  const unread = unreadCount(role, customerEmail);

  const handleOpenChange = (v: boolean) => {
    setOpen(v);
    if (v && unread > 0) markRoleRead(role);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className="relative h-9 w-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Thông báo"
        >
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] p-0 overflow-hidden"
      >
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-900">Thông báo</h3>
          {items.length > 0 && (
            <span className="text-xs text-gray-500">{items.length} mục</span>
          )}
        </div>
        <div className="max-h-[360px] overflow-y-auto">
          {items.length === 0 ? (
            <div className="py-10 flex flex-col items-center text-gray-400">
              <BellOff className="h-7 w-7 mb-2" />
              <p className="text-sm">Chưa có thông báo nào</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((n) => (
                <li
                  key={n.id}
                  className="px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <p className="text-sm text-neutral-800 leading-snug">
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatRelativeTime(n.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
