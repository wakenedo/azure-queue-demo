// server.js
import express from "express";
import { QueueClient } from "@azure/storage-queue";
import cors from "cors";

const app = express();
app.use(cors()); // libera acesso para seu frontend
app.use(express.json());

const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=stocn2;AccountKey=dwy/Hdrjn+a/0CrqO8JIe0nd2Yh4bcIb9kZwWo6cTRGB8G/xt1rzjxalOayj0pUQUeg3QQzCJHas+AStXnvUWQ==;EndpointSuffix=core.windows.net";
const queueName = "demo-queue";
const queueClient = new QueueClient(connectionString, queueName);

// Enviar mensagem
app.post("/send", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send({ error: "Mensagem vazia" });

  await queueClient.sendMessage(message);
  res.send({ success: true });
});

// Receber mensagens
app.get("/messages", async (req, res) => {
  const response = await queueClient.receiveMessages({ numberOfMessages: 5 });
  res.send(response.receivedMessageItems || []);
});

// Deletar mensagem
app.post("/delete", async (req, res) => {
  const { messageId, popReceipt } = req.body;
  if (!messageId || !popReceipt)
    return res.status(400).send({ error: "Dados faltando" });

  await queueClient.deleteMessage(messageId, popReceipt);
  res.send({ success: true });
});

app.listen(3001, () => {
  console.log("Backend rodando na porta 3001");
});
