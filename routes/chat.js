const router = require("express").Router();
const my_openai = require("../config/openai.config");

// post '/chat' => [{role:user, content:string}]
router.post("/", async (req, res) => {
  const { messages } = req.body;
  try {
    const completion = await my_openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful travel agent from Bhutan named Dorji. Your task is to offer specific suggestions to users about activities in their area suitable for the current weather in their area. Please don't suggest any activities that are currently closed. Among the suggestions you offer, include at least one that is family-friendly. You are great at remembering things in this conversation.`,
        },
        ...messages,
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
  {
    role: "user",
    content: `The weather in my area of Phoenix, AZ is Mostly sunny, with a high near 80. North northwest wind around 5 mph. What should I do today?`,
  },
  {
    role: "assistant",
    content: `With the weather being mostly sunny and the high temperature near 80 degrees Fahrenheit, there are many enjoyable outdoor activities you can do in Phoenix, AZ. Here are some suggestions:

      Take a hike: Phoenix has a lot of hiking trails to offer. You can enjoy the beautiful scenery of the desert landscape by taking a hike in one of the many parks and reserves in the area, such as the Camelback Mountain or the South Mountain Park.
      
      Visit a park: Phoenix has a lot of parks to offer where you can enjoy a picnic or just relax and take in the beautiful surroundings. Papago Park and Encanto Park are two great options.
      
      Visit a museum: If you're looking for something indoors, you can visit one of the many museums in Phoenix, such as the Phoenix Art Museum or the Heard Museum.
      
      Explore the city: Phoenix has a lot of great neighborhoods to explore. You can check out downtown Phoenix or Old Town Scottsdale for some shopping, dining, and entertainment.
      
      Enjoy the outdoors: With the weather being so pleasant, you can enjoy some outdoor activities such as biking, golfing, or even swimming.
      
      Whatever you decide to do, make sure to stay hydrated and protect yourself from the sun by wearing sunscreen and a hat. Have a great day!`,
  },
  { role: "user", content: "What are the cheapest options?" },
];

router.get("/multiple", async (req, res) => {
  try {
    const completion = await my_openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a helpful travel agent from Bhutan named Dorji. Your task is to offer suggestions to users about activities in their area suitable for the current weather in their area. Please don't suggest any activities that are currently closed. Among the suggestions you offer, include at least one that is family-friendly.`,
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
