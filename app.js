//Initializing dependancies
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

//Initilaizing MongoDB and Schema
mongoose.connect(process.env.DB_ROUTE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const blogSchema = {
  name: String,
  msg: String,
};

const Blog = mongoose.model("Blog", blogSchema);

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Iintializing Page Content and Post Array
const homeStartingContent =
  "Foodbook like facebook, is a social media application where food enthusiasts of every background can unite! Here, you can read and share your own recipes as well as tips and tricks used in the kictchen, amongst eachother. Scroll down to see what others have shared or type '/compose' at the end of the url to compose your own post and share your food related activity!";

const aboutContent =
  "At Foodbook we have our very own in-house professional chefs. These chefs are very active on Foodbook, sharing their own personal recipes and tips that they use when making delicous dishes.";

const contactContent =
  "If you have any questions about our services or would just like to say hello, feel free to shoot us a message!";

let posts = [];

//GET and POST Methods
app.get("/", function (req, res) {
  Blog.find(function (err, found) {
    if (err) {
      console.log(err);
    } else {
      posts = found;
      res.render("home.ejs", {
        pagePost: homeStartingContent,
        allPosts: posts,
      });
    }
  });
});

app.get("/our-chefs", function (req, res) {
  res.render("about.ejs", {
    pagePost: aboutContent,
  });
});

app.get("/contact", function (req, res) {
  res.render("contact.ejs", {
    pagePost: contactContent,
  });
});

app.get("/compose", function (req, res) {
  res.render("compose.ejs", {});
});

app.get("/clear", function (req, res) {
  res.render("clear.ejs", {});
});

app.get("/posts/:postName", function (req, res) {
  let found = false;
  posts.forEach(function (post) {
    if (_.lowerCase(req.params.postName) === _.lowerCase(post.name)) {
      found = true;
      res.render("post.ejs", {
        reqPost: post,
      });
    }
  });
  if (found == false) {
    res.render("notFound.ejs");
  }
});

app.post("/compose", function (req, res) {
  let match = false;
  const newPost = new Blog({
    name: req.body.postTitle,
    msg: req.body.postContent,
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
  const deletePost = req.body.deleteRequest;

  Blog.deleteOne({ name: deletePost }, function (err) {
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
});

//Initializing Server
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server running on Port:" + port + "...");
});
