const { ethers } = require("ethers");
require("dotenv").config();

const openAI = require("@langchain/openai");
const EthCrypto = require("eth-crypto");
const fs = require("fs");
const network = process.env.ETHEREUM_NETWORK;
const provider = new ethers.InfuraProvider(network, process.env.INFURA_API_KEY);
const contractAddress = "0x7a44ee73ca394d9f50dc76e75a6904aab8f29587";
const privateKey = "0xac39546155b8c092c2baac7454a335d93fa906f974586408e90f8caa25baaae7";

const contractABI = [
    {
      inputs: [
        {
          internalType: "address payable",
          name: "agentAddress",
          type: "address",
        },
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "callAgent",
      outputs: [],
      stateMutability: "payable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "receiveMessage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_callAgentFee",
          type: "uint256",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "sender",
          type: "address",
        },
        {
          indexed: false,
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "MessageReceived",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "recipient",
          type: "address",
        },
        {
          internalType: "string",
          name: "message",
          type: "string",
        },
      ],
      name: "sendMessage",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address payable",
          name: "recipient",
          type: "address",
        },
      ],
      name: "withdrawEther",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "callAgentFee",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getReceivedMessages",
      outputs: [
        {
          components: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "string",
              name: "content",
              type: "string",
            },
          ],
          internalType: "struct LLMAgent.Message[]",
          name: "",
          type: "tuple[]",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ];
const simpleContract = new ethers.Contract(
    contractAddress,
    contractABI,
    provider
  );
  
  
  
const chatModel = new openAI.ChatOpenAI({
      model: "gpt-3.5-turbo",
      temperature: 0,
      });

const ragPrompt = (document,query) => `DOCUMENT:\
                                            ${document}\
                                            QUESTION: \
                                            ${query}\
                                            INSTRUCTIONS:\
                                            Answer the users QUESTION using the DOCUMENT text above.\
                                            Keep your answer ground in the facts of the DOCUMENT.`
  

  simpleContract.on("MessageReceived", async (sender, message, event) => {
    console.log("event triggered\n");
    console.log("Sender:", sender);
    encryptedMessage = EthCrypto.cipher.parse(message);
    console.log("Encrypted Message:", message);
    var doc = fs.readFileSync("doc.txt").toString();
    const decrpted_message =  await EthCrypto.decryptWithPrivateKey(privateKey,encryptedMessage);
    console.log("decrypted Message:", decrpted_message)
    console.log("-------\n");
    const promt = ragPrompt(doc,decrpted_message);
    const res = await chatModel.invoke(promt)
    console.log(res.content)
  });
  console.log("Listening for events...");

  