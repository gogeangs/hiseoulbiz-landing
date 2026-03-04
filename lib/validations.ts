import { z } from "zod";
import { BONUS_TARGETS } from "./constants";

export const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구",
] as const;

const BONUS_TARGETS_ENUM = BONUS_TARGETS as unknown as readonly [string, ...string[]];

export const applicationSchema = z.object({
  name: z
    .string()
    .min(2, "이름을 입력해 주세요.")
    .max(20, "이름은 20자 이내로 입력해 주세요."),
  phone: z
    .string()
    .regex(
      /^01[016789]-?\d{3,4}-?\d{4}$/,
      "올바른 휴대전화 번호를 입력해 주세요. (예: 010-1234-5678)"
    ),
  email: z
    .string()
    .email("올바른 이메일 주소를 입력해 주세요."),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 생년월일을 입력해 주세요.")
    .refine((val) => {
      const d = new Date(val + "T00:00:00");
      return !isNaN(d.getTime()) && d.toISOString().startsWith(val);
    }, "존재하지 않는 날짜입니다."),
  district: z
    .enum(SEOUL_DISTRICTS, { message: "거주 지역을 선택해 주세요." }),
  bonusTargets: z
    .array(z.enum(BONUS_TARGETS_ENUM))
    .optional(),
  privacyConsent: z
    .literal(true, { message: "개인정보 수집·이용에 동의해 주세요." }),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
