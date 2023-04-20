import axios from "axios";
import { BASE_URL } from "./constants";

export async function saveFlaschards(
    user_id: number,
    is_public: boolean,
    name: string,
    flashcards: any
  ) {
    try {
      return await axios.post(BASE_URL + `/flashcards`, {
        user_id,
        public: is_public,
        name,
        flashcards,
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export async function getMyFlashcards(id: number) {
    try {
      return await axios.get(BASE_URL + `/myflashcards?user_id=${id}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export async function getFlaschard(id: number) {
    try {
      return await axios.get(BASE_URL + `/flashcards/${id}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  export async function getFlaschards() {
    try {
      return await axios.get(BASE_URL + `/public_flashcards`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }