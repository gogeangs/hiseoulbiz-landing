export const PROGRAM = {
  title: "2026 글로벌 이커머스 & 세일즈 기획 실무 과정",
  organizer: "(사)하이서울기업협회",
  project: "매력일자리 사업",
  period: "2026년 4월 13일(월) ~ 6월 24일(수)",
  totalDays: 50,
  dailyHours: 7,
  totalHours: 350,
  time: "10:00 ~ 18:00",
  location: "서울 강서구 SBA 글로벌마케팅센터",
  locationDetail: "9호선 등촌역 2분 거리",
  capacity: 20,
  targetAge: "만 18세 이상 ~ 만 39세 이하",
  deadline: "2026년 3월 31일(화) 23:59",
  interviewDate: "2026년 4월 2일(목)",
  resultDate: "2026년 4월 9일(목)",
  startDate: "2026년 4월 13일(월)",
  endDate: "2026년 6월 24일(수)",
  internStart: "2026년 7월",
  internEnd: "2026년 10월",
  internMonths: 3,
  internSalary: "2,533,280",
  dailyAllowance: "25,000",
  contact: {
    department: "교육사업부",
    phone: "070-5067-0623",
    email: "hiseoulbiz@naver.com",
  },
};

export const BENEFITS = [
  {
    label: "실무 중심 교육",
    value: "350시간",
    description: "현직자 강사진의 실전 프로젝트 기반 커리큘럼",
    icon: "GraduationCap" as const,
  },
  {
    label: "교육 수당 지급",
    value: "일 25,000원",
    description: "80% 이상 출석 시 지급 (최대 약 125만원)",
    icon: "Wallet" as const,
  },
  {
    label: "유급 인턴 연계",
    value: "3개월",
    description: "우수 수료자 대상 월 253만원 유급 인턴십",
    icon: "Briefcase" as const,
  },
];

export const CURRICULUM = [
  {
    title: "글로벌 이커머스 플랫폼 운영·마케팅 실무",
    hours: 126,
    percentage: 36,
  },
  {
    title: "취업 준비 교육",
    subtitle: "스마트워크, 이력서, 자기소개서 등",
    hours: 70,
    percentage: 20,
  },
  {
    title: "팀·개인 프로젝트",
    hours: 49,
    percentage: 14,
  },
  {
    title: "이커머스 및 무역 실무",
    hours: 42,
    percentage: 12,
  },
  {
    title: "디지털 마케팅 전략 및 성과 분석",
    hours: 35,
    percentage: 10,
  },
  {
    title: "이커머스 플랫폼 콘텐츠 기획 및 제작",
    hours: 28,
    percentage: 8,
  },
];

export const ELIGIBILITY = [
  "만 18세 이상 ~ 만 39세 이하",
  "서울시 거주 구직자 (졸업 예정자 가능, 재학생 지원 불가)",
  "글로벌 세일즈 & 이커머스 분야 취업 희망자",
  "개인 노트북 필수 지참 (전 과정 노트북 활용 교육 & 실습 진행)",
];

export const BONUS_TARGETS = [
  "장애인",
  "여성세대주",
  "취업지원대상자(국가유공자등)",
  "결혼이주자",
  "북한이탈주민",
  "위탁부모/위탁가정/위탁아동(청년)",
  "청년취업사관학교 AI교육 수료생",
];

export const TIMELINE_STEPS = [
  { label: "신청 접수", date: "~ 3월 31일(화) 23:59", status: "active" as const },
  { label: "선발 면접", date: "4월 2일(목)", status: "upcoming" as const },
  { label: "결과 발표", date: "4월 9일(목)", detail: "개별 통보 (이메일/문자)", status: "upcoming" as const },
  { label: "교육 시작", date: "4월 13일(월)", status: "upcoming" as const },
  { label: "교육 종료", date: "6월 24일(수)", status: "upcoming" as const },
  { label: "인턴 시작", date: "7월~", detail: "우수 수료자 대상", status: "upcoming" as const },
];

export const FAQ_ITEMS = [
  {
    question: "교육비가 정말 무료인가요?",
    answer:
      "네, 교육비는 전액 무료입니다. 별도의 수강료나 교재비 없이 총 350시간의 실무 교육을 받으실 수 있습니다.",
  },
  {
    question: "교육 참여 수당은 어떻게 지급되나요?",
    answer:
      "전체 교육 기간 중 80% 이상 출석하신 분께 1일 25,000원의 교육 참여 수당이 지급됩니다. 최대 약 125만원을 수령하실 수 있습니다.",
  },
  {
    question: "인턴십은 모든 수료자가 참여할 수 있나요?",
    answer:
      "인턴십은 80% 이상 출석한 우수 수료자를 대상으로 선발합니다. 3개월간(7월~10월) 세전 월 2,533,280원의 인턴 수당이 지급되며, 연차휴가 미사용 수당은 별도 지급됩니다.",
  },
  {
    question: "졸업 예정자도 지원 가능한가요?",
    answer:
      "네, 졸업 예정자는 지원 가능합니다. 다만 현재 재학 중인 학생은 지원이 불가합니다.",
  },
  {
    question: "노트북 사양에 제한이 있나요?",
    answer:
      "특별한 사양 제한은 없으나, 웹 브라우저와 기본 오피스 프로그램이 원활하게 동작하는 수준이면 충분합니다. 교육 시 개인 노트북을 반드시 지참해 주세요.",
  },
  {
    question: "교육 장소는 어디인가요?",
    answer:
      "서울 강서구에 위치한 SBA 글로벌마케팅센터 내 교육장에서 진행됩니다. 지하철 9호선 등촌역에서 도보 약 2분 거리입니다.",
  },
  {
    question: "다른 교육과 병행할 수 있나요?",
    answer:
      "본 과정은 평일 10:00~18:00에 진행되는 전일제 교육이므로, 다른 교육이나 직장과의 병행은 어렵습니다. 80% 이상 출석이 수당 지급 및 인턴십 참여 조건입니다.",
  },
];
