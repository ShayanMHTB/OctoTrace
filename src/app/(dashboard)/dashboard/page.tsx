'use client';

import ProfileHeader from '@/components/dashboard/ProfileHeader';
import OverviewStats from '@/components/dashboard/OverviewStats';
import ContributionCalendar from '@/components/dashboard/ContributionCalendar';
import TopLanguages from '@/components/dashboard/TopLanguages';
import RecentActivity from '@/components/dashboard/RecentActivity';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <OverviewStats />
      <ContributionCalendar />
      <div className="grid gap-6 lg:grid-cols-2">
        <TopLanguages />
        <RecentActivity />
      </div>
    </div>
  );
}
