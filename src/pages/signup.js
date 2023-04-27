import { CircleNotch, GoogleLogo } from "@phosphor-icons/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import axios from "axios";
import env from "../components/enviromentvariables";

export default function Signup() {
    const router = useNavigate();
    const [showpassword, setshowpassword] = useState(false);
    const [loading, setloading] = useState(false)
    const [userdata, setuserdata] = useState({
        name: "",
        email: '',
        password: ''
    });


    async function signinwithemail() {
        if (userdata.name.length < 2) {
            return alert("please add a valid name");
        }
        if (userdata.email.length < 6) {
            return alert("please add a valid email");
        }
        if (userdata.password.length < 8) {
            return alert("password must be min of 8 characters");
        }
        setloading(true)
        await createUserWithEmailAndPassword(auth, userdata.email.trim(), userdata.password.trim())
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user)
                const data = {
                    accessToken: user.accessToken,
                    displayName: userdata.name.trim(),
                    email: user.email,
                    activeStatus: false,
                    emailVerified: user.emailVerified,
                    isAnonymous: user.isAnonymous,
                    phoneNumber: user.phoneNumber,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    metadata: user.metadata,
                    _id: user.uid,
                    id: user.uid
                }
                await axios.get(`${env.REACT_APP_API_BASE_URL}/users/${user.uid}`).then(async (res) => {
                    if (res?.data?.user === null) {
                        await axios.request({ url: `${env.REACT_APP_API_BASE_URL}/users`, method: "POST", headers: { "Accept": "*/*", }, data: data }).then(async response => {
                            sessionStorage.setItem("user", JSON.stringify(response?.data?.user))
                            setloading(false);
                            router("/chats")
                            return
                        }).catch(err => console.log(err));
                    } else {
                        alert("user already exist, please login to continue");
                        setloading(false);
                        router("/")
                        return
                    }
                })
            })
            .catch((error) => {
                alert(error.message)
                setloading(false);
            });
        // router("/chats")
    }
    async function signinwithgoogle() {
        const provider = new GoogleAuthProvider();
        setloading(true);
        signInWithPopup(auth, provider)
            .then(async (result) => {
                const user = result.user;
                const data = {
                    accessToken: user.accessToken,
                    displayName: user.displayName,
                    activeStatus: false,
                    email: user.email,
                    emailVerified: user.emailVerified,
                    isAnonymous: user.isAnonymous,
                    phoneNumber: user.phoneNumber,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    metadata: user.metadata,
                    _id: user.uid,
                    id: user.uid
                }

                await axios.get(`${env.REACT_APP_API_BASE_URL}/users/${user.uid}`).then(async (res) => {
                    if (res?.data?.user === null) {
                        await axios.request({ url: `${env.REACT_APP_API_BASE_URL}/users`, method: "POST", headers: { "Accept": "*/*", }, data: data }).then(async response => {
                            sessionStorage.setItem("user", JSON.stringify(response?.data?.user));
                            router("/chats")
                            setloading(false);
                            return
                        }).catch(err => console.log(err));
                    } else {
                        alert("user already exist, please login to continue");
                        setloading(false);
                        router("/")
                        return
                    }

                })
            }).catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage)
                setloading(false);
            });

    }
    return (
        <div className="h-screen w-full grid grid-cols-2">
            <div className="w-full h-full bg-gradient-to-b from-[#472B44] via-[#985C68] to-[#E39088] flex items-center justify-center">
                <img
                    src="https://img.freepik.com/premium-photo/crazy-robot-chef-presenting-food-holding-pot-big-spoon-ov_124717-1744.jpg?size=626&ext=jpg&ga=GA1.1.479685971.1681864938&semt=ais"
                    alt="Pic"
                    className="h-full w-full object-cover"
                />
            </div>
            <div className="w-full h-full ">
                <div className="w-2/3 max-w-[520px] space-y-5 mt-10 mx-auto">
                    <div className="flex justify-center">
                        <img src={require("../images/finallogo.png")} alt="logo" className="h-16" />
                    </div>
                    <div className="">
                        <p className="text-center text-[#0F172A] text-2xl mb-3 font-medium">Sign up</p>
                        <p className="text-center text-[#64748B]">Create your account to start chatting</p>
                    </div>
                    <div className="">
                        <div className="w-full">
                            <p className="">Full Name</p>
                            <input
                                type="text"
                                placeholder="ex: Jhon Doe"
                                onChange={(event) => setuserdata({ ...userdata, name: event.target.value })}
                                className="focus:border-[#494b4e] px-5 h-12 w-full border-[2px] rounded-[0.25rem]  border-[#F0F3F7] bg-transparent text-[0.875rem] leading-[1.25rem] focus:outline-none block"
                            />
                        </div>
                        <div className="w-full">
                            <p className="">Email</p>
                            <input
                                type="text"
                                placeholder="abx@xyz.com"
                                onChange={(event) => setuserdata({ ...userdata, email: event.target.value })}
                                className="focus:border-[#494b4e] px-5 h-12 w-full border-[2px] rounded-[0.25rem]  border-[#F0F3F7] bg-transparent text-[0.875rem] leading-[1.25rem] focus:outline-none block"
                            />
                        </div>
                        <div className="w-full mt-5">
                            <p className="">Password</p>
                            <input
                                type="password"
                                placeholder=""
                                onChange={(event) => setuserdata({ ...userdata, password: event.target.value })}
                                className="focus:border-[#494b4e] px-5 h-12 w-full border-[2px] rounded-[0.25rem]  border-[#F0F3F7] bg-transparent text-[0.875rem] leading-[1.25rem] focus:outline-none block"
                            />
                        </div>
                        <div className="mt-5">
                            <button onClick={() => signinwithemail()} className="bg-[#0F172A] hover:bg-[#0F172A] text-white font-medium py-2 px-4 rounded relative w-full flex items-center justify-center">
                                {loading === true ? <CircleNotch size={28} color="white" weight="bold" className="animate-spin" /> : "Sign Up"}
                                <span className="absolute top-[-4px] left-[-4px] right-[-4px] bottom-[-4px] border-transparent border-2 hover:border-[#3F4555] rounded-md"></span>
                            </button>
                        </div>
                        <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                            <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                                Or continue with
                            </div>
                        </div>
                    </div>
                    <div className="">

                        <div className="mt-5">
                            <button onClick={() => signinwithgoogle()} className="bg-[#0F172A] hover:bg-[#0F172A] text-white font-medium py-2 px-4 rounded relative w-full flex items-center justify-center gap-8">
                                {loading === true ? <CircleNotch size={28} color="white" weight="bold" className="animate-spin" /> : <><GoogleLogo size={20} weight="bold" color="white" />  Sign up with Google</>}

                                <span className="absolute top-[-4px] left-[-4px] right-[-4px] bottom-[-4px] border-transparent border-2 hover:border-[#3F4555] rounded-md"></span>
                            </button>
                        </div>
                        <div className="flex justify-center mt-10">
                            <button className="" onClick={() => router("/")}>
                                ALREADY HAVE AN ACCOUNT? <span className="font-semibold" >SIGN IN</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
