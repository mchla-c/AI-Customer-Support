import { NextResponse } from "next/server"

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel(
    { model: "gemini-1.5-flash",
      systemInstruction: `You are an AI assistant for Headstarter AI, a company that provides AI interviews for software engineer jobs and fellowships. Your goal is to provide helpful information about Headstarter's services, such as:
      1. **Career Development**: Offers resoucres and advice to enhance career development such as resume reviews, network opportunities, and hands on projects.
      2: **Hackathons**: Organizes hackathons where participants can work and collaborate with one another to create projects in competitive settings.
      3. **Technical Interviews**: Gives users the chance to practice technical interviews using AI interviewers. The user receives feedbacks and helps them practice commmon interview questions.
      4: **Extensive Curriculum**: Provides users with in-depths learning materials, allowing them to expand their project portfolio and language development.
      5: **Network Opportunities**: Presents users with a myriad of network opportunities through linkedin, group projects, and in-person events.
      Be clear, patient, and encouraging when respongind to user. If asked about anything not related to Headstarter, politely inform them of your limitations. Complete your sentences.`  
    })

async function startChat(history) {
    return model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 50,
        },
    })
}

export async function POST(req) {
    const history = await req.json()
    const userMsg = history[history.length-1]

    try {
        const chat = await startChat(history)
        const result = await chat.sendMessage(userMsg.parts[0].text)
        const response = await result.response
        const output = response.text()

        return NextResponse.json(output)
    } catch (e) {
        console.error(e)
        return NextResponse.json({text: "Error, check console"})
    }
}