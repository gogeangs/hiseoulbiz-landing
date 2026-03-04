import { z } from "zod";

export const SEOUL_DISTRICTS = [
  "강남구", "강동구", "강북구", "강서구", "관악구",
  "광진구", "구로구", "금천구", "노원구", "도봉구",
  "동대문구", "동작구", "마포구", "서대문구", "서초구",
  "성동구", "성북구", "송파구", "양천구", "영등포구",
  "용산구", "은평구", "종로구", "중구", "중랑구",
] as const;

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
    .min(1, "생년월일을 입력해 주세요."),
  district: z
    .string()
    .min(1, "거주 지역을 선택해 주세요."),
  motivation: z
    .string()
    .min(50, "지원동기를 50자 이상 입력해 주세요.")
    .max(1000, "지원동기는 1000자 이내로 입력해 주세요."),
  experience: z
    .string()
    .max(1000, "관련 경험은 1000자 이내로 입력해 주세요.")
    .optional()
    .or(z.literal("")),
  goals: z
    .string()
    .min(30, "희망 진로를 30자 이상 입력해 주세요.")
    .max(1000, "희망 진로는 1000자 이내로 입력해 주세요."),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;
