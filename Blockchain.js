const sha256 = require('sha256');
const request = require('request');

/**
 * Represents a single node in the blockchain
 */
class BlockChain{

    constructor(){
        this.chain = [{
            index: 0,
            timestamp: Date.now(),
            transactions: [],
            proof: "0",
            previousHash: -1
        }];
        this.currentTransactions = [];
        this.nodes = new Set();
    }

    get lastBlock(){
        return this.chain[this.chain.length - 1]
    }

    resolveChain(){

        let maxLength = this.chain.length;
        let maxChain = null;

        //TODO: Handle timing of multiple nodes
        for (const node of this.nodes){
            const chain = request.get(`${node}/chain`)
                            .on('response', response => {
                                const chain = JSON.parse(response);

                                let validChain = true;
                                for (let i = 1; i < chain.length; i++){
                                    const previousBlock = chain[i - 1]
                                    const currentBlock = chain[i];

                                    if (sha256(JSON.stringify(previousBlock)) !== currentBlock.previousBlock){
                                        validChain = false;
                                        break;
                                    }

                                    if (sha256(`${previousBlock.proof}${currentBlock.proof}`).slice(0,4) !== "0000"){
                                        validChain = false;
                                        break;
                                    }
                                }

                                if (validChain && chain.length > myChainLength){
                                    maxLength = chain.length;
                                    maxChain = chain;
                                }
                            });

        }

        if (maxChain)
            this.chain = maxChain;
    }

    /**
     * Registers a peer node
     * @param {string} address 
     */
    registerNode(address){
        this.nodes.add(address);
    }

    /**
     * Creates a new block and adds it to the blockchain
     */
    createBlock(proofOfWork){

        const lastBlock = this.lastBlock;
        const blockString = JSON.stringify(lastBlock);

        const block = {
            index: lastBlock.index + 1,
            timestamp: Date.now(),
            transactions: this.currentTransactions,
            proof: proofOfWork,
            previousHash: sha256(blockString)
        }
        this.chain.push(block);
        this.currentTransactions = [];
    }

    /**
     * Solves the proof of work algorithm required to mine bitcoins
     * @param {string} proof 
     */
    mineBlock(proof){
        let nonce = 0;
        while(sha256(`${proof}${nonce}`).slice(0,4) !== "0000"){
            nonce++;
        }
        return nonce;
    }

    /**
     * Creates a new transaction to go into the next mined block
     * @param {string} sender
     * @param {string} recipient 
     * @param {string} amount 
     */
    createTransaction(sender, recipient, amount){
        this.currentTransactions.push({
            sender,
            recipient,
            amount
        });
        return this.currentTransactions[this.currentTransactions.length - 1];
    }

}

module.exports = BlockChain;