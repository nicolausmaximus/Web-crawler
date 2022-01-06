const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        { id: 'Question', title: 'Question' },
        { id: 'Description', title: 'Description' },
        { id: 'Views', title: 'Views' },
    ]
});


const url = "https://stackoverflow.com/questions?tab=Active";

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
                UpVotes: "",
            };
            questions.Question = $(el).children(".summary").children("h3").children("a").text().trim();
            questions.Description = $(el).children(".summary ").children(".excerpt ").text().trim();
            questions.Views = $(el).children(".statscontainer ").children(".views ").text().trim();
            questions.UpVotes = $(el).children(".statscontainer ").children(".stats ").children(".vote ").children(".votes ").children(".vote-count-post ").text().trim();
            stackdata.push(questions);
        });


        console.dir(stackdata);
        fs.writeFile("data.csv", stackdata, 'utf8', (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Successfully written data to file");
        });
        csvWriter
            .writeRecords(stackdata)
            .then(() => console.log('The CSV file was written successfully'));


    } catch (err) {
        console.error(err);
    }
}
scrapeData();