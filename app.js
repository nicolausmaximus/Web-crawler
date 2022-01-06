const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const url = "https://stackoverflow.com/questions";

async function scrapeData() {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const listItems = $("#questions .question-summary .statscontainer");
        const stackdata = [];
        listItems.each((idx, el) => {
            const questions = { Views: "" };
            questions.Views = $(el).children(".views").text();
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
// Invoke the above function
scrapeData();