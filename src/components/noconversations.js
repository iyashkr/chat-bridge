import { PaperPlaneRight, Paperclip } from '@phosphor-icons/react';
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import Senderchat from './senderchat';
import Receiverchat from './receiverchat';

export default function NoConversation() {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center">
            <div className="w-1/2">
                <img src="https://img.freepik.com/free-vector/online-friends-concept-illustration_114360-3166.jpg?w=740&t=st=1682043265~exp=1682043865~hmac=c039ac94ba73e475ec1041b7e8a9e38faecea52412d36fa9f56d0b6effbd5851" alt="chat" className="" />
            </div>
            <div className="">
                <p className="text-center text-xl">Click on any conversation to get started</p>
            </div>
        </div>
    )
}
