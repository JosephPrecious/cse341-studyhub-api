const app = require("./app");
const mongodb = require("./data/database");
require("dotenv").config({ quiet: true });

const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  }
});
