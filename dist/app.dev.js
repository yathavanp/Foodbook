"use strict";

//Initializing dependancies
var express = require("express");

var bodyParser = require("body-parser");

var ejs = require("ejs");

var _ = require("lodash");

var mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-yaddy:Test123@cluster0.ennyk.gcp.mongodb.net/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var blogSchema = {
  name: String,
  msg: String
};
var Blog = mongoose.model("Blog", blogSchema);
var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express["static"]("public"));
var homeStartingContent = "Foodbook like facebook, is a social media application where food enthusiasts of every background can unite! Here, you can read and share your own recipes as well as tips and tricks used in the kictchen, amongst eachother. Scroll down to see what others have shared or type '/compose' at the end of the url to compose your own post and share your food related activity!";
var aboutContent = "At Foodbook we have our very own in-house professional chefs. These chefs are very active on Foodbook, sharing their own personal recipes and tips that they use when making delicous dishes.";
var contactContent = "If you have any questions about our services or would just like to say hello, feel free to shoot us a message!";
var posts = [];
app.get("/", function (req, res) {
  Blog.find(function (err, found) {
    if (err) {
      console.log(err);
    } else {
      posts = found;
      res.render("home.ejs", {
        pagePost: homeStartingContent,
        allPosts: posts
      });
    }
  });
});
app.get("/about", function (req, res) {
  res.render("about.ejs", {
    pagePost: aboutContent
  });
});
app.get("/contact", function (req, res) {
  res.render("contact.ejs", {
    pagePost: contactContent
  });
});
app.get("/compose", function (req, res) {
  res.render("compose.ejs", {});
});
app.get("/clear", function (req, res) {
  res.render("clear.ejs", {});
});
app.get("/posts/:postName", function (req, res) {
  var found = false;
  posts.forEach(function (post) {
    if (_.lowerCase(req.params.postName) === _.lowerCase(post.name)) {
      found = true;
      res.render("post.ejs", {
        reqPost: post
      });
    }
  });

  if (found == false) {
    res.render("notFound.ejs");
  }
});
app.post("/compose", function (req, res) {
  var match = false;
  var newPost = new Blog({
    name: req.body.postTitle,
    msg: req.body.postContent
  });
  posts.forEach(function (post) {
    if (_.lowerCase(req.body.postTitle) === _.lowerCase(post.name)) {
      match = true;
      console.log(post.name);
    }
  });

  if (match === true) {
    console.log("Post with same title already exists!");
  } else {
    newPost.save();
    res.redirect("/");
  }
});
app.post("/delete", function (req, res) {
  var deletePost = req.body.deleteRequest;
  Blog.deleteOne({
    name: deletePost
  }, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});
app.post("/clear", function (req, res) {
  Blog.deleteMany({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
}); //Initializing Server

var port = process.env.PORT;

if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server running on Port:" + port + "...");
});