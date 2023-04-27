import moment from 'moment'
import React from 'react'

export default function Receiverchat({ message }) {
    return (
        <div className="bg-[#fafafa] border shadow-md  w-fit max-w-[300px] p-2 rounded-md flex justify-between items-end my-2">
            <p className="text-black text-sm tracking-wide flex-1 break-words">{message?.message}</p>
            <p className="text-black text-[10px] tracking-wide pl-5">{moment(message?.createdAt).format('LT')}</p>
        </div>
    )
}
