/** Meta Pixel 전환 이벤트 트래킹 */
export function trackLead() {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq("track", "Lead");
  }
}

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}
