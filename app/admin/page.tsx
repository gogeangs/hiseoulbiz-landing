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
}
