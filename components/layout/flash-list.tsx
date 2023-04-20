import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FlashcardList from "@/components/home/flashcard-list";

export default async function FlashList() {
  const session = await getServerSession(authOptions);
  return <FlashcardList session={session} />;
}
