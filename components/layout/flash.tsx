import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import FlashcardGenerator from "@/components/home/flashcard-generator";

export default async function Flash({ id }: { id: number }) {
  console.log(id)
  const session = await getServerSession(authOptions);
  return <FlashcardGenerator session={session} id={id} />;
}
