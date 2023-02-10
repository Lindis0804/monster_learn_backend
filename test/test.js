const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
//connect database
mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected mongodb");
});
const { Question } = require("./questionModel");
const Quest = require("./questModel");
const { Course } = require("../models/courseModel");
const addQuestion = async () => {
  try {
    const quests = await Quest.find();
    for (var quest of quests) {
      if (!quest.chapter) quest.chapter = "Quiz 1";
      await quest.save();
      const course = await Course.findOne({
        title: quest.course,
      });
      if (!course.chapters) course.chapters = [];
      var i = course.chapters.map((item) => item.title).indexOf(quest.chapter);
      if (i === -1) {
        course.chapters.push({
          title: quest.chapter,
          questions: [],
        });
        i = course.chapters.length - 1;
      }
      if (!course.chapters[i].questions) course.chapters[i].questions = [];
      if (course.chapters[i].questions.indexOf(quest._id) === -1) {
        course.chapters[i].questions.push(quest._id);
        course.numOfQuestion += 1;
      }
      await course.save();
    }
  } catch (err) {
    console.log(err);
  }
};
//addQuestion();
const importData = async () => {
  const XLSX = require("xlsx");

  const parseExcel = (filename) => {
    const excelData = XLSX.readFile(filename);

    return Object.keys(excelData.Sheets).map((name) => ({
      name,
      data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
    }));
  };
  const arr = parseExcel("E:/monster_learn_data/computer_network.xlsx");
  arr[0].data.forEach(async (item) => {
    var choices = [];
    if (item.A) {
      choices.push(item.A);
    }
    if (item.B) {
      choices.push(item.B);
    }
    if (item.C) {
      choices.push(item.C);
    }
    if (item.D) {
      choices.push(item.D);
    }
    if (item.E) {
      choices.push(item.E);
    }
    if (item.F) {
      choices.push(item.F);
    }
    const quest = await Quest.create({
      course: item.course,
      chapter: item.chapter,
      quest: item.question,
      choices,
      answer: item.answer,
      type: item.type,
      level: item.level,
    });
    console.log(quest);
  });
};
const importData1=async()=>{
    const quests = await Question.find()
    for (var quest of quests){
      const choices = [quest.A,quest.B,quest.C,quest.D]
      var answer
      if (quest.Answer === "A") answer="0"
      if (quest.Answer === "B") answer="1"
      if (quest.Answer === "C") answer="2"
      if (quest.Answer === "D") answer="3"
      const quest1 = await Quest.create({
          course:quest.Course,
          quest:quest.Question,
          choices:choices,
          answer,
          type:quest.Type
      })
      console.log(quest1)
    }
  }
