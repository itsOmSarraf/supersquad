// src/app/page.tsx
import { CreateEventForm } from "@/components/events/create-form";

export default function Home() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>
      <CreateEventForm />
    </main>
  );
}