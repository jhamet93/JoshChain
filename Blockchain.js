const sha256 = require('sha256');

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
    }

    get lastBlock(){
        return this.chain[this.chain.length - 1]
    }

    /**
     * Creates a new block and adds it to the blockchain
     */
    createBlock(proofOfWork){
        const block = {
            index: this.chain[this.chain.length - 1].index + 1,
            timestamp: Date.now(),
            transactions: this.currentTransactions,
            proof: proofOfWork,
            previousHash: this.chain[this.chain.length - 1].proof
        }
        this.chain.append(block);
        this.currentTransactions = [];
    }

    /**
     * Solves the proof of work algorithm required to mine bitcoins
     * @param {string} proof 
     */
    mineBlock(proof){
        let nonce = 0;
        while(sha256(`${proof}${nonce}`).slice(3) !== "0000"){
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
    }

}

module.exports = BlockChain;