import OpenAI from "openai";
import "dotenv/config"
import inquirer from "inquirer"

const openai = new OpenAI();


const word_definations = (word, defination_options) => {
    console.log(word);
    let str = `\nplease select one option from below for "${word}" \n`
    defination_options.forEach((element, i) => {
        str += "option " + i + ": " + element + "\n"
    });
    return str
}

const selectChoice = (num, defination_options) => {
    return defination_options[num]
}

const createAssistant = async () => {
    const instructions = "You help to create a quiz, you will provide a random word and then multiple definition options of the word where only one option is correct.You will be given user's answer then determin if the answer is correct or wrong.";
    const thread = await openai.beta.assistants.create({
        instructions: instructions,
        model: "gpt-4-turbo",
        tools: [
            {
                type: "function",
                function: {
                    name: "word_definations",
                    parameters: {
                        type: "object",
                        properties: {
                            word: {
                                type: "string",
                                description: "A random word",
                            },
                            definition_options: {
                                type: "array",
                                items: {
                                    type: "string",
                                    description: "An array of strings of definitions , where only one is correct defination of the word.",
                                },
                            },
                        },
                        required: ["word", "definition_options"],
                    },
                },
            }
        ]
    })
    console.log(thread);
}

// createAssistant()
const assistant_id = "asst_67AHEx1PVRKrQfqq4er8uoml"
const thread_id = "thread_m3Hm4L9VHeloRtBdOoMMIznk"

const creatThread = async () => {
    const thread = await openai.beta.threads.create()
    console.log(thread);
}

// creatThread()

const createAndPoll = async () => {
    const run = await openai.beta.threads.runs.createAndPoll(thread_id, {
        assistant_id: assistant_id
    })
    console.log(run);
    console.log(run.status);

}

// createAndPoll(thread_id, assistant_id)

const createMessage = async (message_content) => {
    const messages = await openai.beta.threads.messages.create(thread_id, {
        content: message_content,
        role: "user",
    })
    console.log(messages);
    await createAndPoll()
}

const retrieveRun = async (run_id) => {
    const run = await openai.beta.threads.runs.retrieve(thread_id, run_id)
    console.log(run);
    console.log(run.required_action.submit_tool_outputs.tool_calls[0]);
    return run.required_action.submit_tool_outputs.tool_calls[0]
}

// retrieveRun()


const submitTool = async (run_id) => {
    const function_tool = await retrieveRun(run_id)
    const arug = JSON.parse(function_tool.function.arguments)
    const str = word_definations(arug.word, arug.definition_options)
    const questions = [
        {
            type: 'input',
            name: 'choice',
            message: str,
        },
    ];
    const answer = await inquirer.prompt(questions)
    const res = selectChoice(+answer.choice, arug.definition_options)
    console.log(res);


    const run = await openai.beta.threads.runs.submitToolOutputsAndPoll(thread_id, run_id, {
        tool_outputs: [{
            tool_call_id: function_tool.id,
            output: res
        }]
    })
    console.log(run);
}



const listMessages = async (run_id) => {
    await submitTool()
    const messages = await openai.beta.threads.messages.list(
        thread_id, {
        // order: "asc",
    })
    console.log(JSON.stringify(messages, null, 2));
    console.log(messages.data[0].content[0].text.value);
    return messages
}

// createMessage("create a new quiz.")
// listMessages("run_LBsEpelXu7DEozPQuv7jlPJd")