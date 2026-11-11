"use client";
import { useEffect } from "react";

// Best-effort, client-side content protection. Mitigates certain actions such as
// disabling image drag/select and blocking context menu on images. It cannot fully
// prevent screenshots or screen recording, and the supported sharing flow for the
// PDF is the print export (see /print) rather than browser capture.

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
