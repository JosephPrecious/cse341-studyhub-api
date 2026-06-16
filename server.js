const express = require("express");
const mongodb = require("./data/database");
const coursesRoutes = require("./routes/courses");
const assignmentsRoutes = require("./routes/assignments");
const swaggerDocs = require("./swagger");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/courses", coursesRoutes);
app.use("/assignments", assignmentsRoutes);

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