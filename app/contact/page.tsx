import { Suspense } from "react";
import { getServices } from "@/lib/store";
import ContactClient from "./ContactClient";

export const metadata = { title: "Contact & Booking — EveilleMoi" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const services = await getServices();
  const calendlyUrl = "https://calendly.com/your-handle/30min"; // <-- Replace with your actual Calendly URL
  return (
    <Suspense fallback={<div className="container-x py-32" />}>
      <ContactClient services={services} calendlyUrl={calendlyUrl} />
    </Suspense>
  );
}
