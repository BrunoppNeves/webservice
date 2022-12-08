const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");
const port = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/post", async (req, res) => {
  const [moeda, valor] = [req.query.moeda, req.query.valor];
  if (!moeda || !valor) return res.status(404).json({ error: "moeda ou valor não informado" });
  if (isNaN(valor)) return res.status(404).json({ error: "valor não é um número" });
  const moedaConvertida = moeda === "dolar" ? "USDBRL" : moeda === "euro" ? "EURBRL" : "BTCBRL";
  try {
    const response = await axios.get("https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL");
    const conversao = (response.data[moedaConvertida].high * valor).toFixed(2);
    res.status(200).json({
      valor: valor,
      moeda: moedaConvertida.substring(0, 3),
      cotação: response.data[moedaConvertida].high,
      valorConvertido: conversao,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

app.listen(port, () => console.log(`Example app listening http://localhost:${port}!`));