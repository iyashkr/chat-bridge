import { CircleNotch } from '@phosphor-icons/react';
import axios from 'axios';
import React, { useRef } from 'react'
import { useState } from 'react';

export default function Personlist({ details, setconversations, conversations, online }) {
    const [currentUser, setcurrentUser] = useState(JSON.parse(sessionStorage.getItem('user')));
    const loadingRef = useRef(false);

    async function createConversations() {
        if (loadingRef.current) {
            console.log("api is working on");
            return;
        }
        try {
            loadingRef.current = true;
            let headersList = {
                "Accept": "*/*",
                "Content-Type": "application/json"
            }

            let bodyContent = JSON.stringify({
                "members": [
                    currentUser?.id,
                    details?.id
                ]
            });

            let reqOptions = {
                url: "http://localhost:8080/conversations",
                method: "POST",
                headers: headersList,
                data: bodyContent,
            }
            let response = await axios.request(reqOptions);
            if (response?.data?.message === "Conversation already exists") {
                console.log(response?.data?.data)
                loadingRef.current = false;
                return
            }
            setconversations([...conversations, response?.data?.data])
        } catch (error) {
            console.log(error)
        } finally {
            loadingRef.current = false;
        }

    }
    return (
        <div className="h-20 w-full flex hover:bg-[#efefef] cursor-pointer select-none" onClick={() => createConversations()}>
            <div className="h-20 aspect-square  flex items-center justify-center">
                <div className="h-12 w-12 flex items-center justify-center">
                    {loadingRef.current === true ?
                        <CircleNotch color='black' size={28} weight='bold' className='animate-spin' />
                        :
                        <img src={details?.photoURL ?? `https://ui-avatars.com/api/?name=${details?.displayName}`} alt="" className="rounded-full object-cover h-full w-full border" />
                    }
                </div>
            </div>
            <div className="flex-1 h-20 w-full py-2 flex flex-col justify-center">
                <p className="">{details?.displayName}</p>
                <div className="flex gap-1 items-center ">
                    <div className={`h-2 w-2   ${online.current?.includes(details?._id) ? "bg-[#11ea59]" : "bg-[#ea9011]"} rounded-full mt-[2px]`}></div>
                    <div className="text-sm">{online.current?.includes(details?._id) ? "Online" : "Away"}</div>
                </div>
            </div>
        </div>
    )
}
