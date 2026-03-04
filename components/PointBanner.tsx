import Image from "next/image";

export default function PointBanner() {
  return (
    <div className="relative h-48 overflow-hidden md:h-64">
      <Image
        src="/images/banner-education.jpg"
        alt="교육 현장"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-primary-900/70" />
      <div className="relative flex h-full flex-col items-center justify-center px-4 text-center text-white">
        <p className="mb-2 text-lg font-medium text-white/80 md:text-xl">
          현직 전문가와 함께하는
        </p>
        <p className="text-2xl font-bold md:text-4xl">
          350시간 실무 교육 + 3개월 유급 인턴십
        </p>
      </div>
    </div>
  );
}
