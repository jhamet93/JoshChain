const express = require('express');
const bodyParser = require('body-parser');
const BlockChain = require('./Blockchain');

const app = express();
const blockchain = new BlockChain();

app.use(bodyParser.json());

app.get("/mine", (request, response) => {
    //Mine the last block by performing proof of work algorithm
    const lastHash = blockchain.lastBlock.proof;
    const proof = blockchain.mineBlock(lastHash);

    //Recieve my reward for mining
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
    blockchain.createTransaction(sender, recipient, amount)
    response.sendStatus(200);
});

app.listen(3000, () => console.log("JoshChain node is running..."));