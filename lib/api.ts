import axios from "axios";
import { BASE_URL } from "./constants";
import { Configuration, OpenAIApi } from "openai";
import mixpanel from "mixpanel-browser";
mixpanel.init("d7fde14f85af300c3f01174f74590788", { debug: true });

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function saveFlaschards(
  user_id: number,
  is_public: boolean,
  name: string,
  flashcards: any,
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
export async function deleteFlaschard(id: number) {
  try {
    return await axios.delete(BASE_URL + `/flashcards/${id}`);
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

export async function credits(payload: any) {
  try {
    return await axios.patch(BASE_URL + `/credits`, payload);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

//OPEN AI API
export async function generateFlaschards(user_input: string) {
  mixpanel.track("Helped Flashcards Assignment");

  console.log(user_input);
  const response = await openai.createCompletion({
    model: "text-davinci-002",
    prompt: `We are creating flashcards from the infomation below:\n${user_input}\nCreate 7 key terms from above:\n1.`,
    temperature: 0,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const ansewerPrompt = `${response.data.choices[0].text}\nDefine the 7 key terms:\n1.`;

  const answers = await openai
    .createCompletion({
      model: "text-davinci-002",
      prompt: ansewerPrompt,
      temperature: 0,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 1.5,
    })
    .then((res) => {
      return res;
    });
  // console.log(response);
  // console.log(answers);
  console.log(
    `We are creating flashcards from the infomation below:\n${user_input}\nList 7 key words from above:\n1.`,
    response.data.choices[0].text,
    `\nDefine the vocabulary words:\n1.`,
    answers.data.choices[0].text,
  );
  return {
    questions: "\n1." + response.data.choices[0].text,
    answers: "\n1." + answers.data.choices[0].text,
  };
}
//
