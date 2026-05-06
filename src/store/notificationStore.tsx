import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type NotificationAudience = "admin" | "tech" | "customer";

export type AppNotification = {
  id: string;
  message: string;
  createdAt: number; // epoch ms
  audience: NotificationAudience[]; // who should see it
  customerEmail?: string; // when targeted to a specific customer
  read: boolean;
};

const STORAGE_KEY = "warrantyhub.notifications.v1";
const READ_KEY = "warrantyhub.notifications.read.v1"; // per-role read map

type ReadMap = Partial<Record<NotificationAudience, number>>; // role -> last read timestamp

type Ctx = {
  notifications: AppNotification[];
  notify: (
    n: Omit<AppNotification, "id" | "createdAt" | "read">,
  ) => AppNotification;
  forRole: (
    role: NotificationAudience,
    customerEmail?: string,
  ) => AppNotification[];
  unreadCount: (role: NotificationAudience, customerEmail?: string) => number;
  markRoleRead: (role: NotificationAudience) => void;
};

const NotificationContext = createContext<Ctx | null>(null);

const loadNotifs = (): AppNotification[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const loadRead = (): ReadMap => {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? (JSON.parse(raw) as ReadMap) : {};
  } catch {
    return {};
  }
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadNotifs);
  const [readMap, setReadMap] = useState<ReadMap>(loadRead);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch {
      /* ignore */
    }
  }, [notifications]);

  useEffect(() => {
    try {
      window.localStorage.setItem(READ_KEY, JSON.stringify(readMap));
    } catch {
      /* ignore */
    }
  }, [readMap]);

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as AppNotification[];
          if (Array.isArray(parsed)) setNotifications(parsed);
        } catch {
          /* ignore */
        }
      }
      if (e.key === READ_KEY && e.newValue) {
        try {
          setReadMap(JSON.parse(e.newValue) as ReadMap);
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const notify: Ctx["notify"] = useCallback((n) => {
    const created: AppNotification = {
      ...n,
      id: `N-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: Date.now(),
      read: false,
    };
    setNotifications((prev) => [created, ...prev].slice(0, 50));
    return created;
  }, []);

  const forRole: Ctx["forRole"] = useCallback(
    (role, customerEmail) =>
      notifications.filter((n) => {
        if (!n.audience.includes(role)) return false;
        if (role === "customer" && n.customerEmail) {
          return n.customerEmail === customerEmail;
        }
        return true;
      }),
    [notifications],
  );

  const unreadCount: Ctx["unreadCount"] = useCallback(
    (role, customerEmail) => {
      const lastRead = readMap[role] ?? 0;
      return forRole(role, customerEmail).filter((n) => n.createdAt > lastRead)
        .length;
    },
    [forRole, readMap],
  );

  const markRoleRead: Ctx["markRoleRead"] = useCallback((role) => {
    setReadMap((prev) => ({ ...prev, [role]: Date.now() }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({ notifications, notify, forRole, unreadCount, markRoleRead }),
    [notifications, notify, forRole, unreadCount, markRoleRead],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationStore = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx)
    throw new Error("useNotificationStore must be used within NotificationProvider");
  return ctx;
};

export const formatRelativeTime = (ts: number) => {
  const diff = Date.now() - ts;
  const s = Math.floor(diff / 1000);
  if (s < 60) return "Vừa xong";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} ngày trước`;
  return new Date(ts).toLocaleDateString("vi-VN");
};
