import OpenAI, {Configuration, OpenAIApi} from "openai"
require("dotenv").config();
import axios from 'axios';
const apikey= process.env.OPENAI_API_KEY



//bearer method. its weird.
/*
const client=axios.create({
    headers:{
        Authorization: "Bearer " + apikey
    }
});
const params={
    prompt: "You are an expert chef with 2000 years of experience. Based on the user's pantry items, what recipes can be made? Please describe them.",
    model: "gpt-4o-mini",
    max_tokens: 10,
    temperature: 2,
};
client
    .post("https://api.openai.com/v1/chat/completions", params)
    .then((result)=> {
        console.log(result.data.choices[0].text)
    })
    .catch((error)=>{
        console.log(error)
    }
    )*/

 //artifact 2
const openAIClient=new OpenAI({
    apiKey: apikey, dangerouslyAllowBrowser: true
});
async function getResponse(prompt){
    try{
        const response= await openAIClient.chat.completions.create({
            model: "gpt-4o-mini",
            messages:
                [{
                    "role": "system", 
                    "content": prompt}]
            }
            );
            return response.choices[0].message.content;
        }
    catch(error){
        console.error('Error generating response:', error);
        return 'Error generating response.';
    }
}
module.exports = { getResponse };
/*artifact
export default async function handler(req,res){
    try{
        const prompt= req.body.prompt
        console.log(prompt)
        const gptResponse= await openai.createChatCompletion({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system", 
                    "content": "You are an expert chef with 2000 years of experience. Based on the user's pantry items, what recipes can be made? Please describe them."},
                {
                    role: "user", content: prompt
                }]
        });
        console.log(gptResponse)
        return res.status(200).json({message: "Success", data: gptResponse.data.choices[0].message.content})
    }
    catch{
        console.log(error);
        return res.status(500).json({error: "Internal Server error"});
    }

}*/


/* checking a postman thingy, dont worry about this
import { NextResponse } from "next/server";
import { headers } from "next/headers";
export async function GET(){
    return NextResponse.json({
        hello: result.data.choices[0].text,
    });
}*/
