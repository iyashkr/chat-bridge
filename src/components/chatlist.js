import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment'
export default function Chatlist({ details, online }) {
    const [user, setuser] = useState(JSON.parse(sessionStorage.getItem('user')))
    const [chatPerson, setchatPerson] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const conversationPerson = details?.members?.filter((u, index) => {
            if (u._id !== user.id) {
                return u;
            }
        })

        setchatPerson(conversationPerson[0])
    }, [details?.users, user?.id])



    return (
        <div className="h-20 w-full flex hover:bg-[#efefef] cursor-pointer select-none" onClick={() => navigate("/chats/" + details?._id)}>
            <div className="h-20 aspect-square  flex items-center justify-center">
                <div className="h-12 w-12">
                    <img src={chatPerson?.photoUrl ?? `https://ui-avatars.com/api/?name=${chatPerson?.displayName}`} alt="" className="rounded-full object-cover h-full w-full border" />
                </div>
            </div>
            <div className="flex-1 h-20 w-full py-2 flex flex-col justify-center">
                <p className="">{chatPerson?.displayName}</p>
                <div className="flex justify-between pr-5">
                    <div className="flex items-center gap-3">
                        <div className={`h-2 w-2   ${online.current?.includes(details?._id) ? "bg-[#11ea59]" : "bg-[#ea9011]"} rounded-full mt-[2px]`}></div>
                        <div className="text-sm">{online.current?.includes(details?._id) ? "Online" : "Away"}</div>
                    </div>
                    <p className="text-xs tracking-wide">{moment(details?.createdAt).startOf('seconds').fromNow()}</p>
                </div>
            </div>
        </div>
    )
}
