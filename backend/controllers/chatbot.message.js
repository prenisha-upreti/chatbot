import Bot from "../models/bot.model.js";
import User from "../models/user.model.js";
import { getBotResponses } from "../utils/loadBotResponses.js";
import { normalizeText } from "../utils/textUtils.js";
import stringSimilarity from "string-similarity";

export const Message = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // Save user message
    const user = await User.create({
      sender: "user",
      text,
    });

    const botResponses = getBotResponses();
    const normalizedText = normalizeText(text);

    // Use string similarity to find best matching question key
    const questions = Object.keys(botResponses);
    const { bestMatch, bestMatchIndex } = stringSimilarity.findBestMatch(normalizedText, questions);


    // Threshold can be adjusted, e.g. 0.6 or 0.7
    let botResponse = "Sorry, I don't understand that!!!";
    if (bestMatch.rating >= 0.6) {
      botResponse = botResponses[questions[bestMatchIndex]];
    }

    // Save bot response
    const bot = await Bot.create({
      sender: "bot",
      text: botResponse,
    });
  console.log("Bot response text:", botResponse);
    return res.status(200).json({
      userMessage: user.text,
      botMessage: bot.text,
    });
  
  } catch (error) {
    console.error("Error in Message Controller:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
