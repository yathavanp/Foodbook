//Initializing dependancies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://admin-yaddy:Test123@cluster0.ennyk.gcp.mongodb.net/blogDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const blogSchema = {
  name: String,
  msg: String,
};

const Blog = mongoose.model("Blog", blogSchema);

const app = express();
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const homeStartingContent =
  "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Pariatur at quaerat nobis amet cum quibusdam, neque deserunt? Aliquid, explicabo adipisci soluta, aliquam, inventore debitis laborum amet sapiente dignissimos repellat deleniti! Abos sit amet consectetur adipisicing elit. Pariatur at quaerat nobis amet cum quibusdam, neque deserunt? Aliquid, explicabo adipisci soluta, aliquam, inventore debitis laborum amet sapiente dignissimos.";

const aboutContent =
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.";

const contactContent =
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.";

let posts = [];

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

app.get("/about", function (req, res) {
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
app.listen(3000, function () {
  console.log("Server running on Port:3000...");
});
