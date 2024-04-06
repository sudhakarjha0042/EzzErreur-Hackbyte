import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <>
        <div className="bg-black text-cyan-500 h-screen w-full ">
            <div className="w-full h-full flex flex-col justify-center items-center gap-10 p-4">
            <div className="w-fit">
                <h1 className="text-4xl font-bold">Welcome to EzzErreur</h1>
                <p className="mt-2 text-lg font-light">
                A place where you can store all your code snippets
                </p>
            </div>
                <div className="flex w-fit gap-5" >

                <Link   
                to={"/login"}
                >
                <div className="bg-white rounded px-3 py-2 text-black w-full " >Login Here!</div>
                </Link>

                <Link   
                to={"/signup"}
                >
                <div className="bg-white rounded px-3 py-2 text-black w-1/full " >New here? Join us now!</div>
                </Link>

                </div>
            </div>
            
            </div>
            </>
    )
}