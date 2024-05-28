//SPDX-License-Identifier: MIT
pragma solidity >=0.8.1 <0.9.0;

contract Messenger {
    uint public changeCounter;

    address public owner;

    string public theMessage;

    constructor() {
        owner = msg.sender;
    }

    event messageUpdate(address from_, string msg);

    function receiveMessage(string memory _newMessage) public {

        theMessage = _newMessage;
        changeCounter++;
        emit messageUpdate(msg.sender, _newMessage);

    }

    function callAgent(address payable to, string memory message, uint amount) public payable{
        // call receiveMessage of contract of address to 
        require(msg.sender == owner);
        Messenger(to).receiveMessage(message);
        to.transfer(amount);
    }

    function sendMessage(address to, string memory message) public{
        require(msg.sender == owner);
        Messenger(to).receiveMessage(message);
    }

    
}