import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const thought = req.body.thought || '';
  if (thought.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid thought",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(thought),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(thought) {
  return getPrompt(thought);
}

function getPrompt(thought) {
  return `Brooks: Hello, I have just landed on a website written by Brooks Roley for the purpose of practicing web development and machine learning.
  I would like to converse with the user of my SPA that will act as my public facing internet presence and resume.
  The user will be prompted to provide a topic which we should respond to with wit, charm, and compassion.
  Suggest three rhymes for a simple statement from the perspective of a therapist giving compassionate advice.
  User: ${thought}
  Brooks:`;
}