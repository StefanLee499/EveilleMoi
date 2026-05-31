import { Suspense } from "react";
import { getServices } from "@/lib/store";
import ContactClient from "./ContactClient";

export const metadata = { title: "Contact & Booking — EveilleMoi" };
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const services = await getServices();
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || process.env.CALENDLY_URL || "";
  return (
    <Suspense fallback={<div className="container-x py-32" />}>
      <ContactClient services={services} calendlyUrl={calendlyUrl} />
    </Suspense>
  );
}
