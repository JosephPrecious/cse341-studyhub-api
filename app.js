const express = require("express");
const session = require("express-session");
const passport = require("passport");
const coursesRoutes = require("./routes/courses");
const assignmentsRoutes = require("./routes/assignments");
const usersRoutes = require("./routes/users");
const groupsRoutes = require("./routes/groups");
const authRoutes = require("./routes/auth");
const swaggerDocs = require("./swagger");
require("dotenv").config({ quiet: true });

const app = express();
const allowedOrigins = [
  "http://localhost:3000",
  "https://cse341-studyhub-api.onrender.com"
];

app.set("trust proxy", 1);

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "studyhub-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    }
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

module.exports = app;
