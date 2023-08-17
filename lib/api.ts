import axios from "axios";
import { BASE_URL } from "./constants";
import { Configuration, OpenAIApi } from "openai";

import { z } from "zod";
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import {
  StructuredOutputParser,
  OutputFixingParser,
} from "langchain/output_parsers";

import mixpanel from "mixpanel-browser";
import { PromptTemplate } from "langchain";
mixpanel.init("d7fde14f85af300c3f01174f74590788", { debug: true });

const llm = new ChatOpenAI({
  openAIApiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  modelName: "gpt-4",
  temperature: 0,
});

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

  const outputParser = StructuredOutputParser.fromZodSchema(
    z
      .array(
        z.object({
          term: z.string().describe("The key term"),
          definition: z.string().describe("The key term's definition"),
        }),
      )
      .describe("An array of Terms and Definition about the topic."),
  );

  const outputFixingParser = OutputFixingParser.fromLLM(llm, outputParser);

  const prompt = new PromptTemplate({
    template: `We are creating flashcards from the infomation,${user_input}:\n{format_instructions}\n{query}`,
    inputVariables: ["query"],
    partialVariables: {
      format_instructions: outputFixingParser.getFormatInstructions(),
    },
  });

  const answerFormattingChain = new LLMChain({
    llm,
    prompt,
    outputKey: "records",
    outputParser: outputFixingParser,
  });

  console.log(user_input);

  const result = await answerFormattingChain.call({
    query: "List 12 terms",
  });
  const flashcards = result.records

  return flashcards;
}
//
