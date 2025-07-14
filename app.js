const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");

const { static } = require("express");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  var firstName = req.body.firstName;
  var secondName = req.body.secondName;
  var email = req.body.email;

  var userData = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: secondName,
        },
      },
    ],
  };
  mailchimp.setConfig({
    apiKey: "",
    server: "us1",
  });

  const run = async () => {
    try {
      const response = await mailchimp.lists.batchListMembers(
        "fe7b771d25",
        userData
      );
      if (response.error_count > 0) {
        res.sendFile(__dirname + "/failure.html");
      } else {
        res.sendFile(__dirname + "/success.html");
      }
    } catch (error) {
      res.sendFile(__dirname + "/failure.html");
    }
  };
  run();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});

//list fe7b771d25
