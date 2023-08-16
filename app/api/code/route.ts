import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
  role: "system",
  content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explenations."
}

export async function POST(req:Request) {
    try{
        const {userId} =await auth();
        const body = await req.json();
        const {messages} = body;

        if(!userId){
            return new NextResponse("Unauthorized at api", {status: 401});
        }
        if(!configuration.apiKey){
            return new NextResponse("OpenAI Api Key Not Configured", {status: 500});
        }
        if(!messages){
            return new NextResponse("Messages are required", {status: 400});
        }

        const response = await openai.createChatCompletion({
            model:"gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        })

        // // // // // // // // // // // // // Sample GPT Response // // // // // // // // // // // 
        // const response = {data:{
        //     "choices": [
        //       {
        //         "finish_reason": "stopasd",
        //         "index": 0,
        //         "message": {
        //           "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
        //           "role": "assistant"
        //         }
        //       }
        //     ],
        //     "created": 1677664795,
        //     "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
        //     "model": "gpt-3.5-turbo-0613",
        //     "object": "chat.completion",
        //     "usage": {
        //       "completion_tokens": 17,
        //       "prompt_tokens": 57,
        //       "total_tokens": 74
        //     }
        //   }}

        return NextResponse.json(response.data.choices[0].message);
    }
    catch (error){
        console.log("CODE_ERROR",error);
        return new NextResponse("Internal Error", {status:500});
    }
}