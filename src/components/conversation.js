import { PaperPlaneRight, Paperclip } from '@phosphor-icons/react';
import React, { useEffect, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Senderchat from './senderchat';
import Receiverchat from './receiverchat';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { io } from 'socket.io-client';

export default function Conversation() {
    const [user, setuser] = useState(JSON.parse(sessionStorage.getItem('user')))
    const { id } = useParams();
    const [conversationData, setconversationData] = useState({});
    const [createdAt, setcreatedAt] = useState(0)
    const [message, setmessage] = useState('');

    const [messages, setmessages] = useState([])
    let chatref = useRef(null)
    const socket = io('http://localhost:5000');

    useEffect(() => {
        socket.emit('joinroom', id);
        async function getconversationData() {
            let headersList = {
                "Accept": "*/*",
            }

            let reqOptions = {
                url: `http://localhost:8080/conversations/${id}`,
                method: "GET",
                headers: headersList,
            }

            let response = await axios.request(reqOptions);
            const conversationPerson = response?.data?.members?.filter((u, index) => {
                if (u._id !== user.id) {
                    return u;
                }
            })
            setcreatedAt(response?.data?.createdAt)
            setconversationData(conversationPerson[0]);

        }
        async function getMessages() {
            let headersList = {
                "Accept": "*/*",
            }

            let reqOptions = {
                url: `http://localhost:8080/messages/ofConversations/${id}`,
                method: "GET",
                headers: headersList,
            }

            let response = await axios.request(reqOptions);
            setmessages(response?.data?.data ?? []);
            setTimeout(() => {
                if (chatref.current) {
                    chatref.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }

        getconversationData();
        getMessages();
    }, [id])



    async function addmessage() {
        let headersList = {
            "Accept": "*/*",
        }

        let bodyContent = {
            senderId: user?._id,
            message: message,
            conversationId: id,
            createdAt: Date.now()
        }

        let reqOptions = {
            url: "http://localhost:8080/messages",
            method: "POST",
            headers: headersList,
            data: bodyContent
        }
        socket.emit('sendmessage', bodyContent)
        await axios.request(reqOptions);
        setmessage('');
    }

    const handleKeyDown = (event) => {
        if (event.keyCode === 13) {
            event.preventDefault(); // prevent default behavior of Enter key
            addmessage();
        }
    };


    useEffect(() => {
        socket.on('newmessage', (message) => {
            setmessages((prevMessages) => [...prevMessages, message])
            console.log(`${message?.message} : ${message?.createdAt}`);
            setTimeout(() => {
                if (chatref.current) {
                    chatref.current.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        });
    }, [socket])

    return (
        <div className="h-full w-full flex flex-col justify-between">
            <div className="h-16 w-full flex bg-[#efefef] border-b">
                <div className="h-16 aspect-square  flex items-center justify-center">
                    <div className="h-10 w-10">
                        <img src={conversationData?.photoURL ?? `https://ui-avatars.com/api/?name=${conversationData?.displayName}`} alt="" className="rounded-full object-cover h-full w-full border" />
                    </div>
                </div>
                <div className="flex-1 h-16 w-full py-2 flex flex-col justify-center">
                    <p className="">{conversationData?.displayName}</p>
                    <div className="flex justify-between pr-5">
                        <p className="text-sm">@{conversationData?._id}</p>
                        <p className="text-xs tracking-wide">{moment(createdAt).startOf('seconds').fromNow()}</p>
                    </div>
                </div>
            </div>
            <div className="flex-1 h-full w-full overflow-y-auto bg-[#ffffff] p-5 " id="thin-scrollbar">
                {messages?.sort((a, b) => a.createdAt - b.createdAt)?.map((msg, index) => (
                    <div className="" key={index} ref={chatref}>
                        {msg?.senderId === user?.id ? <Senderchat message={msg} /> : <Receiverchat message={msg} />}
                    </div>
                ))}
            </div>
            <div className="min-h-[64px] w-full flex items-center justify-between bg-[#efefef] border-b p-3 gap-8">
                <div className="cursor-pointer">
                    <Paperclip size={28} color="#121212" />
                </div>
                <TextareaAutosize value={message} onKeyDown={handleKeyDown} onChange={(event) => setmessage(event.target.value)} className="min-h-[40px] w-full bg-white shadow-md rounded-md appearance-none  outline-none p-1 px-3 max-h-[100px]" id="thin-scrollbar" />
                <div className="cursor-pointer" onClick={() => addmessage()}>
                    <PaperPlaneRight size={28} color="#121212" weight='fill' />
                </div>
            </div>
        </div>
    )
}
