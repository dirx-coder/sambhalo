import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import HomeClient from "@/components/HomeClient";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // If already logged in, go straight to the board
  if (session) {
    redirect("/board");
  }

  return <HomeClient />;
}
