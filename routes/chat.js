const router = require("express").Router();
const my_openai = require("../config/openai.config");

// post '/chat' => {message:{user:string, content:string}}
router.post("/", async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await my_openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Whenever you answer a question, please do it in the form of a rhyming poem.`,
        },
        message,
      ],
    });
    res.json({ completion: completion.data.choices[0].message });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error });
  }
});

router.get("/test", async (req, res) => {
  try {
    const completion = await my_openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "What is 1 + 1?" }],
    });
    res.json({ completion: completion.data.choices[0].message });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error });
  }
});

const dummy_message_history = [
  { role: "user", content: `What is 1 + 1?` },
  {
    role: "assistant",
    content:
      "When someone asks 'what's one plus one?' the answer's 'two!' Now ain't that fun?",
  },
  { role: "user", content: "Should we learn React or Node?" },
];

router.get("/multiple", async (req, res) => {
  try {
    const completion = await my_openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Whenever you answer a question, please do it in the form of a rhyming poem.`,
        },
        ...dummy_message_history,
      ],
    });
    res.json({ completion: completion.data.choices[0].message });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({ error });
  }
});

module.exports = router;
