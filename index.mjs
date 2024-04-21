import OpenAI from "openai";
import "dotenv/config"
import fs from "fs"

const openai = new OpenAI()

export const assitant_detail = {
    "id": "asst_tjDzHPYRPgbEUc4vuGdMFtvy",
    "object": "assistant",
    "created_at": 1712393268,
    "name": "Math Tutor",
    "description": null,
    "model": "gpt-3.5-turbo",
    "instructions": "You are a personal math tutor. Write and run code to answer math questions.",
    "tools": [
        {
            "type": "code_interpreter"
        }
    ],
    "file_ids": [],
    "metadata": {}
}

export const thread_details = {
    "id": "thread_ET2n7aIVg7X9BefNqqjD81kM",
    "object": "thread",
    "created_at": 1712396243,
    "metadata": {}
}

const run_details = {
    "id": "run_XuyAmfS8YYJn5OeQ0kCafAq7",
    "object": "thread.run",
    "created_at": 1712396747,
    "assistant_id": "asst_tjDzHPYRPgbEUc4vuGdMFtvy",
    "thread_id": "thread_ET2n7aIVg7X9BefNqqjD81kM",
    "status": "queued",
    "started_at": null,
    "expires_at": 1712397347,
    "cancelled_at": null,
    "failed_at": null,
    "completed_at": null,
    "required_action": null,
    "last_error": null,
    "model": "gpt-3.5-turbo",
    "instructions": "You are a personal math tutor. Write and run code to answer math questions.",
    "tools": [
        {
            "type": "code_interpreter"
        }
    ],
    "file_ids": [],
    "metadata": {},
    "temperature": 1,
    "usage": null
}

const msg_details = {
    "id": "msg_Ul2nelAOY3g5368tP373IR8Z",
    "object": "thread.message",
    "created_at": 1712396400,
    "assistant_id": null,
    "thread_id": "thread_ET2n7aIVg7X9BefNqqjD81kM",
    "run_id": null,
    "role": "user",
    "content": [
        {
            "type": "text",
            "text": {
                "value": "what is 123456789 * 987654321",
                "annotations": []
            }
        }
    ],
    "file_ids": [],
    "metadata": {}
}

const createAssistant = async () => {
    const assistant = await openai.beta.assistants.create({
        name: "Math Tutor",
        instructions: "You are a personal math tutor. Write and run code to answer math questions.",
        tools: [{ type: "code_interpreter" }],
        model: "gpt-3.5-turbo"
    });
    console.log(JSON.stringify(assistant, null, 2));
}

// createAssistant();

const creatThreads = async () => {
    const thread = await openai.beta.threads.create()
    console.log(JSON.stringify(thread, null, 2));
}
// creatThreads()

const createMessage = async () => {
    const message = await openai.beta.threads.messages.create(thread_details.id, {
        role: "user",
        content: "what is the answer of 123456789 * 987654321?",
    })
    console.log(JSON.stringify(message, null, 2));
}
// createMessage()

const createRun = async () => {
    const run = await openai.beta.threads.runs.create(thread_details.id, {
        assistant_id: assitant_detail.id,
    })
    const id = run.id
    const status = run.status // "queued" , "completed", "in_progress" , "required_action"
    console.log(JSON.stringify(run, null, 2));
}
// createRun()

const retrieveRun = async () => {
    const run = await openai.beta.threads.runs.retrieve(thread_details.id, run_details.id)
    console.log(run.status);
}
// retrieveRun()

const messagesList = async () => {
    const messages = await openai.beta.threads.messages.list(thread_details.id)
    for (const message of messages.data) {
        const text = message.content[0].text
        console.log(text);
    }
}
// messagesList()
// we create a msg > create run > messages list

const runSteps = async () => {
    const steps = await openai.beta.threads.runs.steps.list(thread_details.id, run_details.id)
}
// runSteps()

const deleteAssistant = async (id) => {
    const response = await openai.beta.assistants.del(id)
    console.log(response);
}
// deleteAssistant("asst_EvutG0ymJLHiJ1rEtqT6ho8T")

const listAssistant = async () => {
    const assistants = await openai.beta.assistants.list({ order: "desc", limit: 20 })
    // console.log(JSON.stringify(assistants.data, null, 2));
    for (const assistant of assistants.data) {
        console.log(assistant.name, assistant.id);
        // await deleteAssistant(assistant.id)
    }
}
// listAssistant()

const listThreads = async () => {
    const url = "https://api.openai.com/v1/threads";
    const headers = {
        "Openai-Organization": `${process.env.OPENAI_ORG_KEY}`,
        "OpenAI-Beta": "assistants=v1",
        "Authorization": `Bearer ${process.env.OPENAI_SESSION_KEY}`,
    }

    const res = await fetch(url, {
        method: "GET",
        headers: headers
    })
    const data = await res.json()
    console.log(data);

}
// listThreads()

const readFileFromAssistant = async () => {
    // {
    //     "id": "msg_QS5Iu6uDwMxZVBYPkRsM4HPY",
    //     "object": "thread.message",
    //     "created_at": 1712475716,
    //     "assistant_id": "asst_tjDzHPYRPgbEUc4vuGdMFtvy",
    //     "thread_id": "thread_ET2n7aIVg7X9BefNqqjD81kM",
    //     "run_id": "run_5rEjO6NjjWuTj5vQ7buW3oMm",
    //     "role": "assistant",
    //     "content": [
    //       {
    //         "type": "text",
    //         "text": {
    //           "value": "You have 60.9 rs left in your pocket after spending on the jacket, coffee with friends, and booking the hotel.\n\nI have created an Excel file with columns for items, expenses, and remaining money. You can download the file from the following link: [Download expenses.xlsx](sandbox:/mnt/data/expenses.xlsx)\n\nIf you need any more help or have any other questions, feel free to ask!",
    //           "annotations": [
    //             {
    //               "type": "file_path",
    //               "text": "sandbox:/mnt/data/expenses.xlsx",
    //               "start_index": 272,
    //               "end_index": 303,
    //               "file_path": {
    //                 "file_id": "file-9Gdrb5tF4cLWUkufAmkhst7w"
    //               }
    //             }
    //           ]
    //         }
    //       }
    //     ],
    //     "file_ids": [
    //       "file-9Gdrb5tF4cLWUkufAmkhst7w"
    //     ],
    //     "metadata": {}
    //   }

    const file = await openai.files.content("file-9Gdrb5tF4cLWUkufAmkhst7w")
    const buffer = await file.arrayBuffer()
    const file_data_buffer = Buffer.from(buffer);
    console.log(file_data_buffer);
    fs.writeFileSync("./data.xlsx", file_data_buffer);
    // to know the file type you should check type by retriving msg by msg id 
}
// readFileFromAssistant()