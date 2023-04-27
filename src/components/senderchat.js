import moment from 'moment'
import React from 'react'

export default function Senderchat({ message }) {
    console.log()
    return (
        <div className="flex justify-end">
            <div className="bg-[#121212] w-fit max-w-[300px] p-2 rounded-md flex justify-between items-end my-2">
                <p className="text-white text-sm tracking-wide flex-1 break-words">{message?.message}</p>
                <p className="text-white text-[10px] tracking-wide pl-5">{moment(message?.createdAt).format('LT')}</p>
            </div>
        </div>
    )
}
