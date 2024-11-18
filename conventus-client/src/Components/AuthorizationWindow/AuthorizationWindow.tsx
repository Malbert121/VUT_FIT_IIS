import React from "react";
import { useState } from "react";
import { postSignIn, postSignUp } from "../../api";
import { RegisterData } from '../../data';

interface Props{
    actionToClose:(flag:boolean)=>void;
};

const AuthorizationWindow: React.FC<Props> = ({actionToClose}) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSignIn, setIsSignIn] = useState<boolean>(true);  // default sign in
    
    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state
        try{
            await postSignIn(username,  password);
            alert("Authorization successful!");
        }
        catch(err){
            setError("Authorization failed. Please try again.");
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Reset error state

        const registerData: RegisterData = { username, email, password };
        try{
            await postSignUp(registerData);
            alert("Registration successful!");
        }
        catch(err){
            setError("Registration failed. Please try again.");
        }
    };

    return (
        <div className=" fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="relative bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
            <button
                onClick={()=>{actionToClose(false)}}
                className="absolute top-5 right-5 hover:text-gray-800"
            >
                ✕
            </button>
                {/*<h2 className="text-2xl font-bold text-center mb-6">{isSignIn?'SignIn':"SignUp"}</h2>*/}
                <form onSubmit={isSignIn?handleSignIn:handleSignUp}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Username"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    {!isSignIn &&(
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />    
                        </div>)
                    }
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {isSignIn?"SignIn":"SignUp"}
                    </button>
                    {error && <p className="mt-4 text-center text-red-500">{error}</p>}
                </form>
                <button 
                    className="block mx-auto mt-4 text-blue-500 hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-400"
                    onClick={() => setIsSignIn(!isSignIn)}>
                        {isSignIn?"SignUp":"SignIn"}
                </button>
            </div>
        </div>
    );
};

export default AuthorizationWindow;