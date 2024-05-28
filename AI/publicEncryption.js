const EthCrypto = require("eth-crypto");

// Encryption function
async function encryptMessage(message, recipientPublicKey) {
  const encryptedMessage = await EthCrypto.encryptWithPublicKey(
    recipientPublicKey,
    message
  );
  return encryptedMessage;
}

// Decryption function
async function decryptMessage(encryptedMessage, privateKey) {
  const decryptedMessage = await EthCrypto.decryptWithPrivateKey(
    privateKey,
    encryptedMessage
  );
  return decryptedMessage;
}

const RecipientpublicKey = "76eaf19bdbef28ff7c86509306d3e72f589b8754af09f30b56fdd730e8594fb2a247b607010762a3a82e5b1a8150be78e38197b804d670d928f9daab5b12210b";
const RecipientprivateKey = "0xac39546155b8c092c2baac7454a335d93fa906f974586408e90f8caa25baaae7";
console.log("pk: "+ RecipientpublicKey)

console.log("sk: "+ RecipientprivateKey)

const message = "What is XTrace and what problem is it solving?";
//Testing with an example
// Encrypt the message and decrypt
encryptMessage(message, RecipientpublicKey)
  .then((encryptedMessage) => {
    console.log("Encrypted message:", EthCrypto.cipher.stringify(encryptedMessage));
    return decryptMessage(encryptedMessage, RecipientprivateKey);
  })
  .then((decryptMessage) => {
    console.log("Decrypted message:", decryptMessage);
  })
  .catch((error) => {
    console.log("error", error);
  });
