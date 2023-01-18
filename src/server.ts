import express from 'express';
import { test } from './controllers/app.js'

const server = express();

server.use(express.json())

server.get("/status", (req, res) => {
    res.sendStatus(200)
})

server.get('/teste/:value', test)

server.listen(4000, () => console.log("Ola! Estou de olho na porta: " + "4000"))