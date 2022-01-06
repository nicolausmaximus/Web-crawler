const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
var db = require('./dbconnect');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const csvWriter = createCsvWriter({
    path: 'data.csv',
    header: [
        { id: 'Question', title: 'Question' },
        { id: 'Description', title: 'Description' },
        { id: 'Views', title: 'Views' },
        { id: 'UpVotes', title: 'UpVotes' },
        { id: 'Answers', title: 'Answers' },
    ]
});

var scrapeData = async function(url) {
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
                Answers: "",
            };
            questions.Question = $(el).children(".summary").children("h3").children("a").text().trim();
            questions.Description = $(el).children(".summary ").children(".excerpt ").text().trim();
            questions.Views = $(el).children(".statscontainer ").children(".views ").text().trim().replace('views', '').replace('view', '');
            questions.UpVotes = $(el).children(".statscontainer ").children(".stats ").children(".vote ").children(".votes ").children(".vote-count-post ").text().trim();
            questions.Answers = $(el).children(".statscontainer ").children(".stats ").children(".status ").text().trim().replace('answers', '').replace('answer', '');
            stackdata.push(questions);
        });


        console.dir(stackdata);
        csvWriter
            .writeRecords(stackdata)
            .then(() => console.log('The CSV file was written successfully'));


        let values = stackdata.reduce((o, a) => {
            let ini = [];
            ini.push(a.Question);
            ini.push(a.Description);
            ini.push(a.Views);
            ini.push(a.UpVotes);
            ini.push(a.Answers);
            o.push(ini);
            return o;
        }, []);
        db.query('INSERT INTO stackquestion(question,Description,Views,Upvotes,Answers) VALUES ?', [values], (err, res) => {
            if (err) throw err;
        });
        db.end((err) => {});
    } catch (err) {
        console.error(err);
    }
}


module.exports = scrapeData;