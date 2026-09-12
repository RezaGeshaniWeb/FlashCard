import { redirect } from 'next/navigation';

import { LandingHero } from '@/components/landing/LandingHero';
import { ROUTES } from '@/constants';
import { getSession } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSession();
  if (session) {
    redirect(ROUTES.DASHBOARD);
  }

  return <LandingHero />;
}
