const express = require("express");
const bodyParser= require('body-parser');
const app = express();
var MongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectID;
var port = '27017';
var host   = 'mahmodaferdous-finalproject-createcourse-6619183';
var db;

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs')

MongoClient.connect("mongodb://"+host
+":"+port,{ useNewUrlParser: true },function(error,client){
  if(!error){
    db = client.db('courses');
    app.listen(8080);
    console.log("DB connected");
  }else{
    console.log(error);             
  }
});

app.get("/", (req, res) => {
    db.collection('course_list').find().toArray(function(err, results) {
       res.render('/home/ubuntu/workspace/final_project/views/courses.ejs', {courses: results});
    })
});

app.get("/add_course", (req, res) => {
    res.sendFile('/home/ubuntu/workspace/final_project/views/add_course.html');
});

app.get("/enroll_student", (req, res) => {
  var course_id = req.query.cid ;
  db.collection('course_list').findOne({"_id": new ObjectId(course_id)}, function(err, course_details ) {
    db.collection('students_list').find({"cid": course_id}).toArray(function(err, students_details) {
      if ( students_details == null ) students_details = [];
      var temp = {} ;
      temp['course_details'] = course_details ;
      temp['students_details'] = students_details ;
      res.render('/home/ubuntu/workspace/final_project/views/enroll_student.ejs', {course_details: temp});
    });
  });
});

app.post('/create_course', (req, res) => {
  db.collection('course_list').insertOne(req.body, (err, result) => {
    console.log('saved to database');
    res.redirect('/enroll_student/?cid='+result.insertedId);
  });
})

app.post('/add_student', (req, res) => {
  db.collection('students_list').insertOne(req.body, (err, result) => {
    console.log('saved to database');
    res.redirect('/enroll_student/?cid='+req.body.cid);
  });
})

