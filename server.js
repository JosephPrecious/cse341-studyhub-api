const express = require("express");
const session = require("express-session");
const passport = require("passport");
const mongodb = require("./data/database");
const coursesRoutes = require("./routes/courses");
const assignmentsRoutes = require("./routes/assignments");
const usersRoutes = require("./routes/users");
const groupsRoutes = require("./routes/groups");
const authRoutes = require("./routes/auth");
const swaggerDocs = require("./swagger");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "studyhub-dev-secret",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", authRoutes);
app.use("/courses", coursesRoutes);
app.use("/assignments", assignmentsRoutes);
app.use("/users", usersRoutes);
app.use("/groups", groupsRoutes);

swaggerDocs(app);

app.get("/", (req, res) => {
  res.send("StudyHub API Running");
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
