// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ILLMAgent {
    function receiveMessage(address sender, string memory message) external;
    function getPublicKey() view external; 
}

contract LLMAgent { 

    
    event MessageReceived(address indexed sender, string message);
   
    struct Message {
        address sender;
        string content;
    }
    
    mapping(address => Message[]) private receivedMessages;
    
    uint256 public callAgentFee;
    address public owner;
    string public public_key;

    constructor(uint256 _callAgentFee, string memory _public_key) {
        owner= msg.sender;
        callAgentFee = _callAgentFee;
        public_key= _public_key;
    }
    
    //Emit an event for sender and message after receiving a message
    function receiveMessage(address sender, string memory message) public {
        receivedMessages[sender].push(Message(sender, message));
        emit MessageReceived(sender, message);
    }
    
    //Used to call another agent with a given prompt by paying
    function callAgent(address payable agentAddress, string memory message) public payable {
        // require(msg.value == callAgentFee, "Insufficient Ether sent");
        ILLMAgent(agentAddress).receiveMessage(msg.sender, message);
    }
    
    //used to reply to the caller message so don't need to pay
    function sendMessage(address recipient, string memory message) public {
        ILLMAgent(recipient).receiveMessage(msg.sender, message);
    }
    
    //Get past received messages from the agent
    function getReceivedMessages(address payer_address) public view returns (Message[] memory) {
        return receivedMessages[payer_address];
    }

    //return public key for signature
    function getPublicKey() external view returns (string memory) {
        return public_key;
    }
    //Receive the pay from recipient
    function withdrawEther(address payable recipient) public {
        recipient.transfer(address(this).balance);
    }
}