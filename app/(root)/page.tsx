// app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // Root automatically sends user to Join Us page
  redirect("/join-us");
}
