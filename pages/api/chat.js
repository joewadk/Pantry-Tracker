import OpenAI, {Configuration, OpenAIApi} from "openai"
const configuration= new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    });
const openai=new OpenAIApi(configuration);
export default async function handler(req,res){
    if(req.method !== "POST"){
        return res.status(405).json({error: "Method no allowed, please use POST"})
    }
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

}
