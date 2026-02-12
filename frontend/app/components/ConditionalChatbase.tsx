"use client";

import { usePathname } from "next/navigation";
import ChatbaseWidget from "./ChatbaseWidget";
import { useEffect, useState } from "react";

export default function ConditionalChatbase() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // hide for admin/seller areas or admin/seller roles
    const pathHide = pathname?.startsWith("/admin") || pathname?.startsWith("/seller");
    let roleHide = false;
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem("auth");
        const parsed = raw ? JSON.parse(raw) : null;
        const role = parsed?.user?.role?.toLowerCase();
        roleHide = role === "admin" || role === "seller";
      } catch {
        roleHide = false;
      }
    }
    setShow(!pathHide && !roleHide);
  }, [pathname]);

  if (!show) return null;
  return <ChatbaseWidget />;
}
