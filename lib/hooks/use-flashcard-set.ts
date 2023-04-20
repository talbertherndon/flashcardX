import { useCallback, useEffect, useState } from "react";

export default function useFlashcard(id: number) {
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    console.log(id)
  }, [id]);

  return flashcards;
}
