import { getPublishedServices } from "@/lib/store";
import ServicesClient from "./ServicesClient";

export const metadata = { title: "Services — EveilleMoi" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await getPublishedServices();
  return <ServicesClient services={services} />;
}
