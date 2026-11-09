"use client";
import { useEffect } from "react";

export default function ContentProtection() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") return; // jangan ganggu landing page

    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.tagName === "IMG") {
        e.preventDefault();
      }
    };
    document.addEventListener("contextmenu", handler);

    const style = document.createElement("style");
    style.textContent = "img { -webkit-user-drag: none; user-select: none; }";
    document.head.appendChild(style);

    return () => {
      document.removeEventListener("contextmenu", handler);
      style.remove();
    };
  }, []);
  return null;
}
