import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { normalizeText } from "./textUtils.js";

let botResponses = {};

export const loadBotResponses = () => {
  return new Promise((resolve, reject) => {
    const csvFilePath = path.resolve(process.cwd(), "botResponses.csv");
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        const question = normalizeText(row.question);
        const response = row.response?.trim();
        if (question && response) {
          botResponses[question] = response;
        }
      })
      .on("end", () => {
        console.log(`Bot responses loaded from CSV. Total questions: ${Object.keys(botResponses).length}`);
        resolve(botResponses);
      })
      .on("error", (err) => reject(err));
  });
};

export const getBotResponses = () => botResponses;
