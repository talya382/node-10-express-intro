// Express.js Intro - write your server here.
// Run it with: node index.js   (stop it with Ctrl + C)

// Part 1: create an express app, a GET /greet endpoint and app.listen(3000)

const express = require("express");
const app = express();

app.get('/greet', (req, res) => {
     const timestamp = new Date().toISOString();
  res.json({
    msg:`hi from get endpoint ${timestamp}`
  });
});



// Part 2: GET /greet/:name  and  GET /test (calls /greet/:name with fetch)
app.get("/greet/:name", (req, res) => {
  const { name } = req.params;
  console.log(`i got name: ${name}`);
  res.json({
    msg: `got name: ${name}`,
  });
});


app.get("/test", async (req, res) => {
  try {
    const r = await fetch("http://localhost:3000/greet/Bob");
    const data = await r.json();
    if (data.msg === "got name: Bob") {
      res.json({
        result: "ok",
      });
    } else {
      res.json({
        result: "fail",
      });
    }
  } catch (e) {
     res.json({ result: "fail" });
  }
});

// Part 3: POST /action  ("joke" / "cat fact", otherwise 400 "body is malformed")

app.use(express.json());

app.post("/action", async (req, res) => {
  if (
    !req.body ||
    Object.keys(req.body).length !== 1 ||
    !["joke", "cat fact"].includes(req.body.action)
  ) {
    return res.status(400).json({
      msg: "body is malformed",
    });
  }

  try {
    if (req.body.action === "joke") {
      const r = await fetch(
        "https://v2.jokeapi.dev/joke/Any?type=single&safe-mode"
      );

      const data = await r.json();
      const joke = data.joke.toUpperCase();

      return res.json({
        joke: joke,
      });

    } else if (req.body.action === "cat fact") {
      const r = await fetch(
        "https://api.thecatapi.com/v1/images/search?limit=11",
        {
          headers: {
            "x-api-key": process.env.CAT_API_KEY,
          },
        }
      );

      const data = await r.json();

      return res.json({
        length: String(data.length),
      });
    }
  } catch (e) {
    return res.status(502).json({
      msg: "upstream failed",
    });
  }
});


app.listen(3000)