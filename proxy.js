const express = require("express");
const http = require("http");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "api-gsb-proxy" });
});

app.use("/gsb", (req, res) => {
  const path = req.originalUrl.replace("/gsb", "");
  const options = {
    hostname: "api.gsbsoftware.com.br",
    port: 50013,
    path: path,
    method: req.method,
    headers: { "Content-Type": "application/json" }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = "";
    proxyRes.on("data", (chunk) => data += chunk);
    proxyRes.on("end", () => {
      res.status(proxyRes.statusCode).send(data);
    });
  });

  proxyReq.on("error", (err) => {
    res.status(500).json({ error: "Erro no proxy", details: err.message });
  });

  proxyReq.end();
});

app.listen(PORT, () => {
  console.log(`Proxy rodando na porta ${PORT}`);
});
