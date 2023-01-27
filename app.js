const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const app = express();

const mailchimp = require("@mailchimp/mailchimp_marketing");
mailchimp.setConfig({
  apiKey: "ffc0e602944e28552fbde27d3798d759-us21",
  server: "us21",
});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  // res.send("app is working");
  res.sendFile(__dirname + "/signup.html");
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  async function run() {
    const listId = "ee04adb789";
    try {
      const response = await mailchimp.lists.addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      });

      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
      res.sendFile(__dirname + "/success.html");
      // res.send("Yay, it's all rainbows and unicorns");
    } catch (e) {
      if (e.status === 404) {
        console.error(`This email is not subscribed to this list`, e);
        // res.send("Something't not okay, try again later");
        res.sendFile(__dirname + "/failure.html");
      }
    }
  }
  run();
});

app.listen(3000, () => {
  console.log("server is running on 3000...");
});

// API Key
// ffc0e602944e28552fbde27d3798d759-us21

// List ID
// ee04adb789
