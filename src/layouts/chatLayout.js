import React, { useRef } from 'react'
import Chatlist from '../components/chatlist'
import Personlist from '../components/personlist'
import Conversation from '../components/conversation'
import { useEffect } from 'react'
import axios from 'axios'
import env from '../components/enviromentvariables'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { SignOut } from '@phosphor-icons/react'
import io from 'socket.io-client';

export default function ChatLayout() {
    const [user, setuser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const [persons, setpersons] = useState([]);
    const [conversations, setconversations] = useState([])
    const router = useNavigate();
    const socket = io('http://localhost:5000');
    const [onlineUsers, setonlineUsers] = useState([]);
    const [person_filter, setperson_filter] = useState('');
    const [conversation_filter, setconversation_filter] = useState('');
    let onlineuserlist = useRef(null);
    useEffect(() => {
        socket.on('connection', (user) => {
            console.log("socket connection established")
        });

        socket.emit('userconnected', user);
        socket.on('onlineusers', (online) => {
            onlineuserlist.current = online;
        })
        return
    }, [user, socket])

    useEffect(() => {
        if (!user) {
            router("/", { replace: true })
        }
    }, [])

    useEffect(() => {


        async function fetchAllUsers() {
            await axios.get(`${env.REACT_APP_API_BASE_URL}/users`).then((res) => {
                const users = res?.data?.user;
                const filteredUsers = users.filter((res) => {
                    return res?.id !== user?.id;
                });
                setpersons(filteredUsers);
            });
        }
        async function fetchconversation() {
            let headersList = {
                "Accept": "*/*",
            }

            let reqOptions = {
                url: `${env.REACT_APP_API_BASE_URL}/conversations/byUser/${user?.id}`,
                method: "GET",
                headers: headersList,
            }

            let response = await axios.request(reqOptions);
            response?.data?.data.forEach((data, index) => {
                const conversationPerson = data?.members?.filter((u, index) => {
                    if (u._id !== user.id) {
                        return u;
                    }
                })
                data.user = conversationPerson[0]
            });
            console.log(response?.data?.data)
            setconversations(response?.data?.data)
        }
        fetchAllUsers();
        fetchconversation();
    }, [user?.id])



    async function signout() {
        auth.signOut().then(async () => {
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }

            let bodyContent = {
                "activeStatus": false
            };

            let reqOptions = {
                url: `${env.REACT_APP_API_BASE_URL}/users/${user?.id}`,
                method: "PUT",
                headers: headersList,
                data: bodyContent,
            }

            await axios.request(reqOptions);
            socket.emit('disconnected', user)
            sessionStorage.removeItem('user');
            router("/", { replace: true })
        })
    }
    return (
        <div className="h-screen grid grid-cols-9">
            <div className="col-span-2 h-screen w-full border-r flex flex-col">
                <div className="h-16 bg-[#EFEFEF] flex items-center px-5 justify-between">
                    <img src={require("../images/finallogo.png")} alt="" className="h-12" />

                </div>
                <div className="h-12 bg-white border-t border-b p-2">
                    <input value={conversation_filter} onChange={(event) => setconversation_filter(event.target.value)} onBlur={() => setconversation_filter('')} className="h-full w-full bg-white shadow-sm rounded-md border appearance-none outline-none focus:border-[#4611ea] hover:border-[#4611ea] px-3 text-sm" placeholder='Search by person name' />
                </div>
                <div className="flex-1 h-full overflow-y-auto" id="thin-scrollbar">
                    {conversations?.filter(val => {
                        if (conversation_filter !== "") {
                            if (val?.user?.displayName?.toLowerCase().includes(conversation_filter.toLowerCase())) {
                                return val
                            }
                        }
                        else return val;
                    })?.map((con, index) =>
                        <Chatlist key={index} details={con} online={onlineuserlist} />
                    )}
                    {conversations?.length === 0 && <div className='pt-5 text-center'>No conversations present</div>}

                </div>
            </div>
            <div className="col-span-5 h-screen w-full">
                <Outlet />
            </div>
            <div className="col-span-2 h-screen w-full border-l flex flex-col">
                <div className="h-16 bg-white flex items-center px-5 justify-between">
                    <p className="text-2xl">Friends to chat</p>
                    <button className="h-10 w-10 flex items-center justify-center bg-[#dcdcdc] hover:bg-white shadow-md hover:border rounded-full cursor-pointer" onClick={() => signout()}>
                        <SignOut size={22} color='#121212' className='pl-1' />
                    </button>
                </div>
                <div className="h-12 bg-white border-t border-b p-2">
                    <input value={person_filter} onChange={(event) => setperson_filter(event.target.value)} onBlur={() => setperson_filter('')} className="h-full w-full bg-white shadow-sm rounded-md border appearance-none outline-none focus:border-[#4611ea] hover:border-[#4611ea] px-3 text-sm" placeholder='Search by person name' />
                </div>
                <div className="flex-1 h-full overflow-y-auto" id="thin-scrollbar">
                    {persons?.filter(val => {
                        if (person_filter !== "") {
                            if (val.displayName.toLowerCase().includes(person_filter.toLowerCase())) {
                                return val
                            }
                        }
                        else return val;
                    }).map((person, index) => (
                        <Personlist details={person} key={index} online={onlineuserlist} setconversations={setconversations} conversations={conversations} />
                    ))}

                    {persons?.length === 0 && <div className='pt-5 text-center'>No friends available</div>}
                </div>
            </div>
        </div>
    )
}
