"use client";

import { usePathname } from "next/navigation";
import ChatbaseWidget from "./ChatbaseWidget";

export default function ConditionalChatbase() {
  const pathname = usePathname();
  const hide = pathname?.startsWith("/admin") || pathname?.startsWith("/seller");
  if (hide) return null;
  return <ChatbaseWidget />;
}
