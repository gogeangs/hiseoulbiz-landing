import { TIMELINE_STEPS } from "@/lib/constants";

export default function Timeline() {
  return (
    <section id="timeline" className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          선발 일정
        </h2>
        <p className="mb-12 text-center text-gray-600">
          신청부터 인턴 시작까지의 전체 일정
        </p>

        <div className="mx-auto max-w-3xl">
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-0.5 bg-primary-200 md:left-1/2 md:-translate-x-px" />

            {TIMELINE_STEPS.map((step, idx) => (
              <div key={step.label} className="relative mb-8 last:mb-0">
                <div
                  className={`flex items-start gap-4 md:items-center ${
                    idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  <div className="hidden w-[calc(50%-20px)] md:block">
                    <div
                      className={`rounded-xl border p-4 ${
                        step.status === "active"
                          ? "border-primary-300 bg-primary-50"
                          : "border-gray-100 bg-white"
                      } ${idx % 2 === 0 ? "text-right" : "text-left"}`}
                    >
                      <p className="font-semibold text-primary-900">{step.label}</p>
                      <p className="text-sm text-gray-600">{step.date}</p>
                      {step.detail && (
                        <p className="text-xs text-gray-400">{step.detail}</p>
                      )}
                    </div>
                  </div>

                  <div
                    className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${
                      step.status === "active"
                        ? "border-primary-600 bg-primary-600 text-white"
                        : "border-primary-300 bg-white text-primary-400"
                    }`}
                  >
                    <span className="text-sm font-bold">{idx + 1}</span>
                  </div>

                  <div className="hidden w-[calc(50%-20px)] md:block" />

                  <div className="block md:hidden">
                    <p className="font-semibold text-primary-900">{step.label}</p>
                    <p className="text-sm text-gray-600">{step.date}</p>
                    {step.detail && (
                      <p className="text-xs text-gray-400">{step.detail}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
