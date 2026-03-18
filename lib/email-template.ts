import { PROGRAM } from "./constants";

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hiseoulbiz-landing.vercel.app";

function emailLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f7f7f7;font-family:'Apple SD Gothic Neo','Noto Sans KR',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#fff;">
    <tr>
      <td style="background:#1e3a5f;padding:32px 24px;text-align:center;">
        <h1 style="color:#fff;font-size:20px;margin:0;">(사)하이서울기업협회</h1>
        <p style="color:#93c5fd;font-size:14px;margin:8px 0 0;">${title}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 24px;">
        ${body}
        <p style="font-size:13px;color:#94a3b8;margin:24px 0 0;">
          문의: ${PROGRAM.contact.department} ${PROGRAM.contact.phone} / ${PROGRAM.contact.email}
        </p>
      </td>
    </tr>
    <tr>
      <td style="background:#f8fafc;padding:20px 24px;text-align:center;border-top:1px solid #e2e8f0;">
        <a href="${SITE_URL}" style="display:inline-block;background:#1e3a5f;color:#fff;font-size:14px;font-weight:600;text-decoration:none;padding:10px 24px;border-radius:8px;margin:0 0 12px;">과정 상세 보기</a>
        <p style="font-size:12px;color:#94a3b8;margin:0;">
          &copy; (사)하이서울기업협회 | 본 메일은 발신 전용입니다.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function buildApplicationGuideEmail(applicantName: string): string {
  const name = escapeHtml(applicantName);
  return emailLayout(PROGRAM.title, `
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
          <strong>${name}</strong>님, 안녕하세요.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 24px;">
          <strong>${PROGRAM.title}</strong>에 신청해 주셔서 감사합니다.<br>
          신청이 정상적으로 접수되었음을 안내드립니다.
        </p>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 16px;">
          <p style="font-size:14px;color:#1e3a5f;font-weight:600;margin:0 0 8px;">
            참여신청서 작성 및 제출 안내
          </p>
          <p style="font-size:13px;color:#475569;line-height:1.7;margin:0;">
            본 과정은 서울시에서 주최하는 취업연계(매력일자리) 사업으로,
            서울시 민관기업 참여형 매력일자리 사업 참여 여부 확인을 위해
            <strong>첨부된 참여신청서를 작성하여 제출</strong>해 주셔야 합니다.<br><br>
            또한 선발 면접 진행을 위해
            <strong>자기소개서</strong>를
            함께 제출해 주시기 바랍니다.<br><br>
            첨부파일에는 <strong>참여신청서, 개인정보제공동의서, 자기소개 양식</strong>이
            포함되어 있습니다.
          </p>
        </div>

        <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
          <p style="font-size:14px;color:#92400e;font-weight:600;margin:0 0 8px;">
            중요 안내
          </p>
          <p style="font-size:13px;color:#78350f;line-height:1.7;margin:0;">
            첨부파일(참여신청서 + 개인정보제공동의서 + 자기소개서) 제출까지 완료하셔야
            <strong>최종 접수가 완료</strong>되며,
            이후 <strong>면접일정 안내</strong>를 받으실 수 있습니다.<br>
            회신처: <strong>${PROGRAM.contact.email}</strong>
          </p>
        </div>

        <table width="100%" style="font-size:13px;color:#475569;border-collapse:collapse;margin:0 0 0;">
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
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">서류 마감</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;color:#dc2626;font-weight:600;">${PROGRAM.deadline}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:600;">면접 일정</td>
            <td style="padding:8px 0;">${PROGRAM.interviewDate} (개별 안내)</td>
          </tr>
        </table>
  `);
}

export function buildCompletionConfirmEmail(applicantName: string): string {
  const name = escapeHtml(applicantName);
  return emailLayout(PROGRAM.title, `
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
          <strong>${name}</strong>님, 안녕하세요.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 24px;">
          제출해 주신 서류를 확인하였습니다.<br>
          <strong>${PROGRAM.title}</strong>에 관심을 가져 주셔서 감사합니다.
        </p>

        <div style="background:#ecfdf5;border-left:4px solid #10b981;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 16px;">
          <p style="font-size:14px;color:#065f46;font-weight:600;margin:0 0 8px;">
            서류 제출 확인 완료
          </p>
          <p style="font-size:13px;color:#047857;line-height:1.7;margin:0;">
            참여신청서, 개인정보제공동의서, 자기소개서가 정상적으로 접수되었습니다.
          </p>
        </div>

        <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 24px;">
          <p style="font-size:14px;color:#1e3a5f;font-weight:600;margin:0 0 8px;">
            면접 일정 안내
          </p>
          <p style="font-size:13px;color:#475569;line-height:1.7;margin:0;">
            면접은 <strong>${PROGRAM.interviewDate}</strong>에 진행될 예정이며,
            구체적인 면접 시간 및 장소는 담당자가 별도로 이메일을 통해 안내드릴 예정입니다.<br>
            안내 메일을 꼭 확인해 주시기 바랍니다.
          </p>
        </div>

        <table width="100%" style="font-size:13px;color:#475569;border-collapse:collapse;margin:0 0 0;">
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;width:100px;">면접 일정</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${PROGRAM.interviewDate} (개별 안내)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;font-weight:600;">결과 발표</td>
            <td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">${PROGRAM.resultDate} (개별 통보)</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-weight:600;">교육 시작</td>
            <td style="padding:8px 0;">${PROGRAM.startDate}</td>
          </tr>
        </table>
  `);
}

export function buildAdminNotifyEmail(data: { name: string; phone: string; email: string; utmSource?: string }): string {
  const name = escapeHtml(data.name);
  const phone = escapeHtml(data.phone);
  const email = escapeHtml(data.email);
  const source = data.utmSource ? escapeHtml(data.utmSource) : "직접 유입";
  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return emailLayout("신규 신청 알림", `
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
          새로운 교육 신청이 접수되었습니다.
        </p>

        <table width="100%" style="font-size:14px;color:#475569;border-collapse:collapse;margin:0 0 16px;">
          <tr>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;width:100px;">이름</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;">${name}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;">연락처</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;">이메일</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;">${email}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;">유입 경로</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;">${source}</td>
          </tr>
          <tr>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;font-weight:600;background:#f8fafc;">접수 시각</td>
            <td style="padding:10px 12px;border:1px solid #e2e8f0;">${now}</td>
          </tr>
        </table>
  `);
}

export function buildReminderEmail(applicantName: string, daysLeft: number): string {
  const name = escapeHtml(applicantName);
  const urgency = daysLeft <= 3;
  const borderColor = urgency ? "#ef4444" : "#f59e0b";
  const bgColor = urgency ? "#fef2f2" : "#fef3c7";
  const textColor = urgency ? "#991b1b" : "#92400e";
  const subTextColor = urgency ? "#b91c1c" : "#78350f";

  return emailLayout(PROGRAM.title, `
        <p style="font-size:16px;color:#1e293b;margin:0 0 16px;">
          <strong>${name}</strong>님, 안녕하세요.
        </p>
        <p style="font-size:14px;color:#475569;line-height:1.8;margin:0 0 24px;">
          <strong>${PROGRAM.title}</strong>에 신청해 주셔서 감사합니다.<br>
          아직 서류 제출이 완료되지 않아 안내드립니다.
        </p>

        <div style="background:${bgColor};border-left:4px solid ${borderColor};padding:16px 20px;border-radius:0 8px 8px 0;margin:0 0 16px;">
          <p style="font-size:14px;color:${textColor};font-weight:600;margin:0 0 8px;">
            서류 제출 마감까지 ${daysLeft}일 남았습니다
          </p>
          <p style="font-size:13px;color:${subTextColor};line-height:1.7;margin:0;">
            서류 제출 마감: <strong>${PROGRAM.deadline}</strong><br>
            아래 서류를 <strong>${PROGRAM.contact.email}</strong>으로 제출해 주세요.
          </p>
        </div>

        <div style="background:#f8fafc;padding:16px 20px;border-radius:8px;margin:0 0 24px;">
          <p style="font-size:14px;color:#1e293b;font-weight:600;margin:0 0 8px;">
            제출 서류 안내
          </p>
          <ul style="font-size:13px;color:#475569;line-height:1.8;margin:0;padding-left:20px;">
            <li>참여신청서 (최초 안내 이메일에 첨부된 양식)</li>
            <li>개인정보제공동의서</li>
            <li>자기소개서</li>
          </ul>
        </div>

        <p style="font-size:13px;color:#64748b;line-height:1.7;margin:0;">
          이미 제출하셨다면 본 안내를 무시해 주세요.<br>
          서류 제출이 완료되어야 <strong>면접 일정 안내</strong>를 받으실 수 있습니다.
        </p>
  `);
}
