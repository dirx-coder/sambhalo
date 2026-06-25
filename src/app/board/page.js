import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import BoardHeader from "@/components/BoardHeader";
import KanbanBoard from "@/components/KanbanBoard";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Board — Sambhalo",
};

export default async function BoardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-[#111113] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <BoardHeader user={session.user} />
        <KanbanBoard />
      </div>
    </div>
  );
}
