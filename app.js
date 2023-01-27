const express = require("express");
const bodyParser = require("body-parser");
const app = express();
require("dotenv").config();

const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: process.env.API_KEY,
  server: "us21",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  console.log(req.body);
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  async function run() {
    console.log("inside run");
    console.log("list id is: " + process.env.LIST_ID);
    const listId = process.env.LIST_ID;
    try {
      console.log("inside run - try");
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });
      console.log("inside run - try - got response");

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
      res.sendFile(__dirname + "/success.html");
    } catch (e) {
      if (e.status === 404) {
        console.error(`This email is not subscribed to this list`, e);
        res.sendFile(__dirname + "/failure.html");
      }
    }
  }

  run();
});

app.listen(3000, () => {
  console.log("server is running on 3000...");
});
