import Hero from "@/components/hero";
import MoodForm from "@/components/mood-form";
import ShowcaseRow from "@/components/showcase-row";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <MoodForm />
      <ShowcaseRow />
    </main>
  );
}
