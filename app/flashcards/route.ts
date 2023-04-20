import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(req:any) {
  const user_input = req.body.response;
  const user_id = req.body.userID;
  // console.log(user_id, req.body.response);

  try {
    const response = await openai
      .createCompletion({
        model: "text-davinci-002",
        prompt: `We are creating flashcards from the infomation below:\n${user_input}\nCreate 5 key terms from above:\n1.`,
        temperature: 0,
        max_tokens: 200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: user_id,
      })
      .then((res) => {
        return res;
      });
    // const ansewerPrompt = `${user_input}\nList 5 key words from above:\n1.${response.data.choices[0].text}\nDefine the vocabulary words:\n1.`;
    const ansewerPrompt = `${response.data.choices[0].text}\nDefine the 5 key terms:\n1.`;
    // console.log(ansewerPrompt);
    const answers = await openai
      .createCompletion({
        model: "text-davinci-002",
        prompt: ansewerPrompt,
        temperature: 0,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 1.5,
        user: user_id,
      })
      .then((res) => {
        return res;
      });
    console.log(
      `We are creating flashcards from the infomation below:\n${user_input}\nList 5 key words from above:\n1.`,
      response.data.choices[0].text,
      `\nDefine the vocabulary words:\n1.`,
      answers.data.choices[0].text,
    );
    return NextResponse.json({
      questions: "\n1." + response.data.choices[0].text,
      answers: "\n1." + answers.data.choices[0].text,
    });
    // res.status(200).json({
    //   questions: "\n1." + response.data.choices[0].text,
    //   answers: "\n1." + answers.data.choices[0].text,
    // });
  } catch (err) {
    return NextResponse.json({error: "failed to load data!"})
  }
}

// Answer the following in a super short summary for the user to answer on their own in bullet points

// What can strategic leaders do to develop and sustain an effective organizational culture? What actions can a strategic leader take to establish and maintain ethical practices within a firm?

// Here are 3 short bullet points:

// -Strategic leaders can develop and sustain an effective organizational culture by establishing clear goals and expectations, communicating regularly, and modeling desired behav

//  prompt: `Answer the following in a super short summary for the user to answer on their own in bullet points\n${user_input}\nHere are 1 short bullet points:\n`,
