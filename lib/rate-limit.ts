const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

/**
 * 간단한 인메모리 Rate Limiter (serverless 환경에서 인스턴스 단위로 동작)
 * @returns true = 요청 허용, false = 제한 초과
 */
export function checkRateLimit(
  ip: string,
  { maxRequests, windowMs }: { maxRequests: number; windowMs: number }
): boolean {
  const now = Date.now();
  const entry = ipRequestMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return false;
  }

  return true;
}

// 오래된 항목 정리 (메모리 누수 방지)
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of ipRequestMap) {
    if (now > entry.resetAt) {
      ipRequestMap.delete(ip);
    }
  }
}, 60_000);
