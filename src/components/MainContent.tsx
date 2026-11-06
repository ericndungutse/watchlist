import { getCurrentUser } from "@/lib/auth";
import SeriesDashboard from "@/components/SeriesDashboard";
import LandingHero from "@/components/LandingHero";

export default async function MainContent() {
  const user = await getCurrentUser();

  if (!user) {
    return <LandingHero />;
  }

  return <SeriesDashboard />;
}
