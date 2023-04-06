const { Configuration, OpenAIApi } = require("openai");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const config = new Configuration({
  organization: process.env.ORGANIZATION,
  apiKey: process.env.API_KEY,
});

const my_openai = new OpenAIApi(config);

module.exports = my_openai;
