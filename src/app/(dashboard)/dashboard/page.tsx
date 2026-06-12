'use client';

import { useRef } from 'react';
import { FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfileHeader from '@/components/dashboard/ProfileHeader';
import OverviewStats from '@/components/dashboard/OverviewStats';
import ContributionCalendar from '@/components/dashboard/ContributionCalendar';
import TopLanguages from '@/components/dashboard/TopLanguages';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { downloadPdf } from '@/lib/export';

export default function DashboardPage() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            ref.current && downloadPdf(ref.current, 'octotrace-overview')
          }
        >
          <FileDown className="size-4" />
          Export PDF
        </Button>
      </div>

      <div ref={ref} className="space-y-6">
        <ProfileHeader />
        <OverviewStats />
        <ContributionCalendar />
        <div className="grid gap-6 lg:grid-cols-2">
          <TopLanguages />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
