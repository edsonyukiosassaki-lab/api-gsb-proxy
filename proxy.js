const express = require("express");

const app = express();

app.use(express.json());

app.use("/gsb", async (req, res) => {
  try {
    const path = req.originalUrl.replace("/gsb/", "");
    const targetUrl = `http://api.gsbsoftware.com.br:50013/${path}`;

    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...req.headers
      },
      body: ["POST", "PUT", "PATCH"].includes(req.method)
        ? JSON.stringify(req.body)
        : undefined
    };

    const response = await fetch(targetUrl, options);
    const data = await response.text();

    res.status(response.status).send(data);
  } catch (err) {
    res.status(500).json({ error: "Erro no proxy", details: err.message });
  }
});

app.listen(3001, () => {
  console.log("Proxy rodando na porta 3001");
});
