import express from "express";
import { QueueClient } from "@azure/storage-queue";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config(); // carrega variáveis do .env

const app = express();
app.use(cors()); // libera acesso do frontend
app.use(express.json());

const connectionString = process.env.AZURE_CONNECTION_STRING;
const queueName = process.env.AZURE_QUEUE_NAME;
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
