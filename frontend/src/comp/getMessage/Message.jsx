import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdEdit, MdDelete } from "react-icons/md";

function Message() {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [selectedMessageID, setSelectedMessageID] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchUsername, setSearchUsername] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchMessages = (username = '') => {
        const url = username 
            ? `https://ux1u8o8ej0.execute-api.eu-north-1.amazonaws.com/api/message/${username}`
            : 'https://ux1u8o8ej0.execute-api.eu-north-1.amazonaws.com/api/message';
        axios.get(url)
            .then(res => {
                setMessages(res.data.data);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage(err.response?.data?.data || 'Något gick fel, försök igen senare');
            });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchUsername.trim()) {
            setErrorMessage('Användarnamn får inte vara tomt');
            return
        }

        fetchMessages(searchUsername);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newMessage = { username, message };
        
        axios.post('https://ux1u8o8ej0.execute-api.eu-north-1.amazonaws.com/api/message', newMessage)
            .then(res => {
                setUsername('');
                setMessage('');
                fetchMessages();
                setIsModalOpen(false);
            })
            .catch(err => {
                setErrorMessage(err.response?.data?.data || 'Något gick fel, försök igen senare');
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedMessage = { username, message };

        axios.put(`https://ux1u8o8ej0.execute-api.eu-north-1.amazonaws.com/api/message/${selectedMessageID}`, updatedMessage)
            .then(res => {
                setUsername('');
                setMessage('');
                setSelectedMessageID('');
                fetchMessages();
                setIsModalOpen(false);
                setErrorMessage('');
            })
            .catch(err => {
                setErrorMessage(err.response?.data?.data || 'Något gick fel, försök igen senare');
            });
    };

    const handleEdit = (msg) => {
        setSelectedMessageID(msg.MessageID);
        setUsername();
        setMessage(msg.Message);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        axios.delete(`https://ux1u8o8ej0.execute-api.eu-north-1.amazonaws.com/api/message/${id}`)
            .then(res => {
                fetchMessages();
            })
            .catch(err => {
                console.error('Fel vid radering av meddelande:', err);
            });
    };

    useEffect(() => {
        fetchMessages();
    }, [searchUsername]);

    return (
        <div style={{ backgroundColor: '#f2f3f8', height: '100vh' }}>
            <header style={{ backgroundColor: 'white', padding: '1rem', color: '#627DFE', fontSize: '1.5rem', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h1>Messages</h1>
            </header>
            <main>
                {errorMessage && (
                    <div style={{ padding: '20px', backgroundColor: 'red', color: 'white', textAlign: 'center', margin: '10px 0 0 0', borderRadius: '5px' }}>
                        {errorMessage}
                    </div>
                )}
                <div>
                    <form onSubmit={handleSearch} style={{ padding: '20px 5px', display: 'flex' }}>
                        <input type="text" placeholder="Sök efter användarnamn" value={searchUsername} onChange={(e) => setSearchUsername(e.target.value)} required style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '100%', fontSize: '16px' }}/>
                        <button type="submit" style={{ marginLeft: '10px',cursor: 'pointer', padding: '15px 30px', backgroundColor: '#627DFE', color: 'white', border: 'none', borderRadius: '5px' }}>Sök</button>
                    </form>
                    {messages.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            <h4>Det verkar som att det inte finns några meddelanden än.</h4>
                        </div>
                    ) :
                        (
                            messages.map(message => (
                                <div key={message.MessageID} style={{ padding: '18px 15px 15px', marginBottom: '15px', width: '100%', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                                    <span style={{ color: '#666', fontSize: '0.9rem' }}>{message.CreatedAt}</span>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlock: '10px' }}>
                                        <h1 style={{ fontSize: '1.5rem' }}>Published by {message.Username}</h1>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <MdEdit size={18} style={{ cursor: 'pointer', marginRight: '10px' }} onClick={() => handleEdit(message)} />
                                            <MdDelete size={18} style={{ cursor: 'pointer' }} onClick={() => handleDelete(message.MessageID)} />
                                        </div>
                                    </div>
                                    <p style={{ color: '#999', lineHeight: '1.5', display: 'block', width: '100%', wordWrap: 'break-word' }}>{message.Message}</p>
                                    <div style={{ width: '100%', height: '1px', backgroundColor: '#f2f3f8', margin: '15px 0', }}></div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
                                        {message.lastupdated && (
                                            <h3 style={{ margin: 0 }}>Last updated by {message.lastupdated}</h3>
                                        )}
                                        {message.updatedAt && (
                                            <p style={{ backgroundColor: '#f2f3f8', color: '#666', padding: '8px 10px', borderRadius: '5px', marginLeft: '10px' }}>{message.updatedAt}</p>
                                        )}
                                    </div>
                                </div>
                            ))  
                        )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
                    <button onClick={()=> setIsModalOpen(true)} style={{ position: 'fixed', bottom: '20px', left: '50%', width: '60px', height: '60px', backgroundColor: '#627DFE', transform: 'translateX(-50%)', borderRadius: '50%', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.13)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', border: 'none', }}>
                        <span style={{ color: 'white', fontSize: '2rem', maringLeft: '2px', margintop: '-3px', }}>
                            +
                        </span>
                    </button>
                </div>
                {isModalOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,}}>
                        <form onSubmit={selectedMessageID ? handleUpdate : handleSubmit} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>
                            <input type="text" placeholder="Användarnamn" value={username || ''} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '17px' }}/>
                            <textarea placeholder="Skriv ditt meddelande" value={message || ''} onChange={(e) => setMessage(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontSize:'17px' }}></textarea>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <button type="submit" style={{ backgroundColor: '#627DFE', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                                    {selectedMessageID ? 'Uppdatera' : 'Skicka'}
                                </button>
                                <button type="button" onClick={() => {
                                    setIsModalOpen(false);
                                    setUsername('');
                                    setMessage('');
                                    setSelectedMessageID('');
                                }} style={{backgroundColor: 'red', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                                    Stäng
                                </button>
                            </div>
                            
                        </form>                 
                    </div>   
                )}             
            </main>
        </div>
    );
}

export default Message;