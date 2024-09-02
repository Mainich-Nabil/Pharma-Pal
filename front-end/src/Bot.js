import React, { useState } from 'react';
import axios from 'axios';
import './Bot.css'

const ChatApp = () => {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [awaitingDrugInfo, setAwaitingDrugInfo] = useState(false);
    const [currentDrugName, setCurrentDrugName] = useState('');

    const sendMessage = async () => {
        if (userInput.trim() === "") return;

        setMessages([...messages, { text: userInput, type: 'user' }]);

        if (awaitingDrugInfo) {
            try {
                const response = await axios.post('/api/get_drug_info', {
                    drug_name: currentDrugName,
                    info_type: userInput
                });
                setMessages([...messages, { text: userInput, type: 'user' }, { text: response.data.response, type: 'bot' }]);
                setAwaitingDrugInfo(false);
                setCurrentDrugName('');
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            try {
                const response = await axios.post('/api/get_response', {
                    name: userInput
                });
                const newMessages = [...messages, { text: userInput, type: 'user' }, { text: response.data.response, type: 'bot' }];
                setMessages(newMessages);

                if (response.data.response.includes("Do you want uses or side effects?")) {
                    setAwaitingDrugInfo(true);
                    setCurrentDrugName(userInput);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        setUserInput('');
    };

    return (
        <div className="chat-container">
            <div className="chat-icon">💊</div>
            <h1>Drug Information Chatbot</h1>
            <div className="chat-box" id="chat-box">
                {messages.map((message, index) => (
                    <p key={index} className={message.type}>{message.text}</p>
                ))}
            </div>
            <input
                type="text"
                id="user-input"
                className="input-box"
                placeholder="Type your message here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
            />
            <button onClick={sendMessage} className="send-btn">Send</button>
        </div>
    );
};

export default ChatApp;
