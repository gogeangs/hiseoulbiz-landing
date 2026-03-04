import { getApplications, getApplicationStats } from "@/lib/db";
import AdminHeader from "./components/AdminHeader";
import StatsCards from "./components/StatsCards";
import ApplicationTable from "./components/ApplicationTable";

interface AdminPageProps {
  searchParams: Promise<{ search?: string; district?: string }>;
}

export const dynamic = "force-dynamic";

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;

  try {
    const [applications, stats] = await Promise.all([
      getApplications({ search: params.search, district: params.district }),
      getApplicationStats(),
    ]);

    return (
      <>
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <StatsCards stats={stats} />
          <ApplicationTable
            applications={applications}
            initialSearch={params.search}
            initialDistrict={params.district}
          />
        </main>
      </>
    );
  } catch (error) {
    console.error("Admin page data fetch error:", error);
    return (
      <>
        <AdminHeader />
        <main className="mx-auto max-w-7xl px-4 py-8">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <p className="text-red-600">
              데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 새로고침해 주세요.
            </p>
          </div>
        </main>
      </>
    );
  }
}
