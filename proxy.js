const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "api-gsb-proxy" });
});

// Proxy GSB
app.use("/gsb", async (req, res) => {
  try {
    const path = req.originalUrl.replace("/gsb/", "");
    const targetUrl = `http://api.gsbsoftware.com.br:50013/${path}`;

    const options = {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(req.headers["authorization"] && {
          "Authorization": req.headers["authorization"]
        })
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

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
