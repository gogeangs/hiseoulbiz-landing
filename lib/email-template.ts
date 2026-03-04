import { PROGRAM } from "./constants";

export function buildApplicationGuideEmail(applicantName: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Apple SD Gothic Neo','Noto Sans KR',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;">
    <tr>
      <td style="background:#1e3a5f;padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;font-size:20px;margin:0;">(사)하이서울기업협회</h1>
        <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">${PROGRAM.title}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;">
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
          <strong>${applicantName}</strong>님, 안녕하세요.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 24px;">
          <strong>${PROGRAM.title}</strong>에 신청해 주셔서 감사합니다.<br>
          신청이 정상적으로 접수되었음을 안내드립니다.
        </p>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
          <p style="font-size:14px;color:#1e3a5f;font-weight:600;margin:0 0 8px;">
            서울시청 제출용 신청서 안내
          </p>
          <p style="font-size:13px;color:#475569;line-height:1.7;margin:0;">
            서울시청에 제출할 신청서를 <strong>24시간 이내</strong>에
            기재해 주신 이메일로 별도 발송해 드릴 예정입니다.<br>
            수신 후 안내에 따라 작성하여 회신해 주시기 바랍니다.
          </p>
        </div>

        <table width="100%" style="font-size:13px;color:#475569;border-collapse:collapse;margin:0 0 24px;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;width:100px;">교육 기간</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${PROGRAM.period}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">교육 시간</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${PROGRAM.time} (총 ${PROGRAM.totalHours}시간)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">교육 장소</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${PROGRAM.location}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:600;">면접 일정</td>
            <td style="padding:8px 0;">${PROGRAM.interviewDate} (개별 안내)</td>
          </tr>
        </table>

        <p style="font-size:13px;color:#94a3b8;margin:0;">
          문의: ${PROGRAM.contact.department} ${PROGRAM.contact.phone} / ${PROGRAM.contact.email}
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="font-size:12px;color:#94a3b8;margin:0;">
          &copy; (사)하이서울기업협회 | 본 메일은 발신 전용입니다.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
