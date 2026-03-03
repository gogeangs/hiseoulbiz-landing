import { GraduationCap, Wallet, Briefcase } from "lucide-react";
import { BENEFITS } from "@/lib/constants";

const iconMap = {
  GraduationCap,
  Wallet,
  Briefcase,
};

export default function Benefits() {
  return (
    <section id="benefits" className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="mb-4 text-center text-2xl font-bold text-primary-900 md:text-3xl">
          참여 혜택
        </h2>
        <p className="mb-12 text-center text-gray-600">
          배우면서 수당까지, 수료 후 취업까지
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {BENEFITS.map((benefit) => {
            const Icon = iconMap[benefit.icon];
            return (
              <div
                key={benefit.label}
                className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-7 w-7 text-primary-700" />
                </div>
                <p className="mb-1 text-sm font-medium text-gray-500">
                  {benefit.label}
                </p>
                <p className="mb-3 text-3xl font-bold text-primary-800">
                  {benefit.value}
                </p>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
