import OpenAI from "openai"
import "dotenv/config"
import { createAssistant, createThread, chat, askMan } from "./helpers/utils.mjs"
import fs from "fs"

const openai = new OpenAI()

const assistantId = "asst_tjDzHPYRPgbEUc4vuGdMFtvy"
const threadId = "thread_ET2n7aIVg7X9BefNqqjD81kM"


// createAssistant("smart ai assistant",
//     "gpt-3.5-turbo", 
//     "You are AI assistant that help user in various task and you write and run python code if needed",
//     ["code_interpreter"])

// createThread()

// const text = "can you help me to solve what is 999-998"
// chat(assistantId, threadId, text)

// askMan(assistantId,threadId)