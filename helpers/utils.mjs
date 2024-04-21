import OpenAI from "openai"
import "dotenv/config"
import inquirer from "inquirer"

const openai = new OpenAI()

const beautifyResult = (res) => {
    return JSON.stringify(
        res,
        null,
        2
    )
}

export const createAssistant = async (name, model, ins, tools) => {
    const assistant = await openai.beta.assistants.create({
        model: model,
        instructions: ins,
        name: name,
        tools: tools.map(t => ({ type: t }))
    })
    return assistant
}
// createAssistant("smart ai assistant",
//     "gpt-3.5-turbo",
//     "You are AI assistant that help user in various task and you write and run code if needed",
//     ["code_interpreter"])


export const createThread = async () => {
    const thread = await openai.beta.threads.create()
    return thread
}

export const createMessage = async (threadId, text) => {
    const message = await openai.beta.threads.messages.create(threadId, {
        content: text,
        role: "user"
    })
    return message
}

export const createRunAndPoll = async (assistantId, threadId) => {
    const run = await openai.beta.threads.runs.createAndPoll(threadId, {
        assistant_id: assistantId,
    })
    return run
}

export const listMessages = async (threadId, message) => {
    const messages = await openai.beta.threads.messages.list(threadId, {
        order: "asc",
    })
    // console.log(beautifyResult(messages));
    return messages
}

export const lastMessage = async (threadId, message) => {
    const messages = await openai.beta.threads.messages.list(threadId, {
        order: "asc",
        after: message.id // can be used for pagination
    })
    // console.log(messages.data[0].content[0].text);
    // console.log(beautifyResult(messages));
    return messages
}
// lastMessage(threadId, {
//     "id": "msg_MU2I6QOwyVg0P2VcZL2k4e4f",
//     "object": "thread.message",
//     "created_at": 1712473973,
//     "assistant_id": null,
//     "thread_id": "thread_ET2n7aIVg7X9BefNqqjD81kM",
//     "run_id": null,
//     "role": "user",
//     "content": [
//         {
//             "type": "text",
//             "text": {
//                 "value": "hey can you tell me what is 9+",
//                 "annotations": []
//             }
//         }
//     ],
//     "file_ids": [],
//     "metadata": {}
// })


export const chat = async (assistantId, threadId, text) => {
    const message = await createMessage(threadId, text)
    // console.log(beautifyResult(message));
    const run = await createRunAndPoll(assistantId, threadId)
    // console.log(beautifyResult(run));
    const res = await lastMessage(threadId, message)
    console.log(beautifyResult(res));
    // console.log(res.data[0].content[0].text);
    return res.data[0].content[0].text.value

}

// chat("can you help me to solve what is 999-998")

export const askMan = (assistantId, threadId) => {
    const ask = (query) => {
        inquirer
            .prompt([
                {
                    name: 'query',
                    message: query ?? "What you want to ask? to exit prompt enter 0 \n"
                }
            ])
            .then(async (answers) => {
                // console.log(answers.query);
                const res = await chat(assistantId, threadId, answers.query)
                // console.log(res);
                const ans = res

                if (answers.query != 0) {
                    ask(`${ans} \n `)
                }
            })
    }
    ask()
}

// const assistantId = "asst_tjDzHPYRPgbEUc4vuGdMFtvy"
// const threadId = "thread_ET2n7aIVg7X9BefNqqjD81kM"

// askMan(assistantId, threadId)
