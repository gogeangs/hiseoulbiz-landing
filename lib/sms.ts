const ALIGO_SEND_URL = "https://apis.aligo.in/send/";

interface SendSmsParams {
  receiver: string;
  name: string;
}

export function buildSmsMessage(name: string): string {
  return `[하이서울기업협회] 안녕하세요, ${name}님.\n2026 글로벌 이커머스 & 세일즈 기획 실무 과정에 신청해 주셔서 감사합니다.\n서류 제출 안내 이메일을 발송해 드렸으니, 메일함을 확인해 주세요.\n(스팸함에 들어갈 수 있으니 함께 확인 부탁드립니다)\n문의: 070-5067-0623 / contact@itso.co.kr / hiseoulbiz@naver.com`;
}

export async function sendSms({ receiver, name }: SendSmsParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.ALIGO_API_KEY;
  const userId = process.env.ALIGO_USER_ID;
  const sender = process.env.ALIGO_SENDER;

  if (!apiKey || !userId || !sender) {
    return { success: false, error: "ALIGO 환경변수 미설정" };
  }

  const msg = buildSmsMessage(name);

  const formData = new URLSearchParams();
  formData.append("key", apiKey);
  formData.append("user_id", userId);
  formData.append("sender", sender);
  formData.append("receiver", receiver.replace(/-/g, ""));
  formData.append("msg", msg);
  formData.append("msg_type", "LMS");
  formData.append("title", "[하이서울기업협회] 신청 접수 안내");

  const res = await fetch(ALIGO_SEND_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  const data = await res.json();

  if (data.result_code === "1") {
    return { success: true };
  }

  return { success: false, error: data.message || `알리고 오류 (${data.result_code})` };
}
