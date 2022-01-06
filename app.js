const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://stackoverflow.com/questions";

async function scrapeData() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $("#questions .question-summary");
        const stackdata = [];
        listItems.each((idx, el) => {
            const questions = {
                Question: "",
                Description: "",
                Views: "",

            };
            questions.Question = $(el).children(".summary").children("h3").children("a").text();
            questions.Description = $(el).children(".summary ").children(".excerpt ").text();
            questions.Views = $(el).children(".statscontainer ").children(".views ").text();
            stackdata.push(questions);
        });
        console.dir(stackdata);
        fs.writeFile("coutries.json", JSON.stringify(stackdata, null, 2), (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Successfully written data to file");
        });
    } catch (err) {
        console.error(err);
    }
}
scrapeData();