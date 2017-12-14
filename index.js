const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('./Blockchain');
const request = require('request');

const app = express();
const blockchain = new BlockChain();

app.use(bodyParser.json());

app.get("/mine", (request, response) => {

    const lastHash = blockchain.lastBlock.proof;
    const proof = blockchain.mineBlock(lastHash);

    blockchain.createTransaction("0", "jhamet93", 1);
    blockchain.createBlock(proof);

    response.sendStatus(200);
});

app.get("/chain", (request, response) => {
    response.send(JSON.stringify(blockchain.chain));
});

app.post("/transaction", (request, response) => {
    const {
        sender,
        recipient,
        amount
    } = request.body;

    const transaction = blockchain.createTransaction(sender, recipient, amount);
    blockchain.nodes.forEach(node => request.post(`node/transaction`, { body: JSON.stringify(request.body) }));

    response.sendStatus(200);
});

app.post("/register", (request, response) => {
    blockchain.registerNode(request.ip);
    response.sendStatus(200);
});

app.post("/resolve", (request, response) => {
    blockchain.resolveChain();
    response.sendStatus(200);
});

app.listen(3000, () => console.log("JoshChain node is running..."));