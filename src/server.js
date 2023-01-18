import express from 'express';

const server = express();

server.use(express.json())

server.get("/status", (req, res) => {
    res.sendStatus(200)
})

server.listen(4000, () => console.log("Ola! Estou de olho na porta: " + "4000"))