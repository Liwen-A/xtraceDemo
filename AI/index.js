import { ChatOpenAI } from "@langchain/openai";
import { Web3 } from 'web3';
// Set up a connection to the Ganache network
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:7545'));

const chatModel = new ChatOpenAI({
	model: "gpt-3.5-turbo",
	temperature: 0,
	});
	
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "from_",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "msg",
        "type": "string"
      }
    ],
    "name": "messageUpdate",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "changeCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "pubKey",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "theMessage",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_newMessage",
        "type": "string"
      }
    ],
    "name": "receiveMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "callAgent",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "message",
        "type": "string"
      }
    ],
    "name": "sendMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// const res = await chatModel.invoke("write me a poem");
// console.log(res.content);
const deployedAddress = "0xdBAb18B07C4a25eD76E2AE2CC1E835D198827884";
const Messenger= new web3.eth.Contract(abi, deployedAddress);
Messenger.handleRevert = true;
const providersAccounts = await web3.eth.getAccounts();
const defaultAccount = providersAccounts[0];
// const receipt = await Messenger.methods.updateTheMessage(res.content).send({
// 	from: defaultAccount,
// 	gas: 1000000,
// 	gasPrice: '10000000000',
// });

// console.log('Transaction Hash: ' + receipt.transactionHash);



setInterval(() => {
    // Event listening functionality
    Messenger.events["messageUpdate"]({}, (error, event) => {
        if (error) {
            console.error("Error:", error);
            return;
        }

        console.log("New event received:");
        console.log(event.returnValues);
    })
    .on("connected", () => {
        console.log("Connected to the blockchain");
    })
    .on("changed", (event) => {
        console.log("Event changed:", event.returnValues);
    })
    .on("error", (error) => {
        console.error("Event error:", error);
    });

    console.log("End of routine");
}, 5000);



