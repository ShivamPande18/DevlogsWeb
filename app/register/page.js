'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { googleProvider, githubProvider, signInWithProvider } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter } from "next/navigation";

export default function SignUp() {

    const [user, setUser] = useState(null);
    const [success, setSuccess] = useState(false)
    const [timeLeft, setTimeLeft] = useState('');


    useEffect(() => {
        console.log(user)
        const launchDate = new Date('2025-02-01T10:00:00');
        const interval = setInterval(() => {
            const now = new Date();
            const timeDifference = launchDate - now;

            if (timeDifference <= 0) {
                setTimeLeft('The launch has started!');
                clearInterval(interval);
                return;
            }
            const days = String(Math.floor(timeDifference / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((timeDifference / (1000 * 60 * 60)) % 24)).padStart(2, '0');
            const minutes = String(Math.floor((timeDifference / (1000 * 60)) % 60)).padStart(2, '0');
            const seconds = String(Math.floor((timeDifference / 1000) % 60)).padStart(2, '0');

            setTimeLeft(`${days}d :${hours}h : ${minutes}m : ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);


    const handleSignIn = async (provider) => {
        try {
            const result = await signInWithProvider(provider);
            const userData = {
                userId: result.uid,
                phoneNumber: result.phoneNumber,
                username: result.displayName,
                email: result.email,
                photoURL: result.photoURL,
                langs: [],
                lastSeen: new Date().toLocaleDateString('en-US'),
                logs: [],
                projects: [],
                maxTime: 0,
                productivity: 0,
                streak: 1,
            };

            // Check if the email already exists in Firestore
            const userDocRef = doc(db, 'users', result.uid); // Use email as the document ID
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // Add user to Firestore if not exists
                await setDoc(userDocRef, userData);
                console.log('User added to Firestore:', userData);
            } else {
                console.log('User already exists in Firestore:', userDocSnap.data());
            }

            // Update local state
            setUser(userData);
            console.log(userData)
            setSuccess(true); // Indicate successful login
        } catch (error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                alert("Try another method: User already signed in with a different method");
            } else {
                console.error('Unexpected error during sign-in:', error);
                setSuccess(false); // Mark as unsuccessful
            }
        }
    };

    useEffect(() => {
        if (user) {
            // Perform any actions needed when the user state is updated
            console.log('User state updated:', user.username);
        }
    }, [user]);

    const router = useRouter();



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
            {
                success ?
                    <div className='flex flex-col gap-y-10'>
                        <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
                            <div className="text-center">

                                <p className="text-lg mb-6">Time left until launch:</p>
                                <div className="text-4xl font-bold bg-gray-700 text-white py-4 px-6 rounded-lg shadow-lg inline-block">
                                    {timeLeft}
                                </div>
                                <p className="text-sm text-gray-400 mt-4">
                                    The launch is scheduled for February 1, 2025, at 10:00 AM.
                                </p>
                            </div>
                        </div>
                        <div className="w-full max-w-lg p-8 bg-gray-800 rounded-lg shadow-lg">
                            <div className="text-center">
                                <h1 className="text-3xl font-bold mb-4">Welcome {user ? user.username : ""}!</h1>
                                <div className='flex flex-row justify-center items-center mt-10'>
                                    <h2 className="py-3 px-5 bg-white text-black rounded-l-md">{user.userId}</h2>
                                    <button className='bg-purple-500 rounded-r-md py-3 hover:bg-purple-700'
                                        onClick={() => {
                                            navigator.clipboard.writeText(user.userId);
                                            alert('Token copied to clipboard!');
                                        }}
                                        style={{ flex: 1 }}
                                    >
                                        Copy Token
                                    </button>


                                </div>

                                <button
                                    onClick={() => router.push(`/dashboard?uid=${user.userId}`)}
                                    className='bg-purple-500 rounded-md py-3 w-full hover:bg-purple-700 mt-5'
                                >
                                    Go to Dashboard
                                </button>


                            </div>
                        </div>
                    </div> :
                    <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-lg">
                        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>
                        <p className="text-center mb-4 text-gray-400">
                            Join the DevsLOG community and supercharge your coding sessions.
                        </p>
                        <div className="flex flex-col space-y-4">
                            <button
                                className="w-full flex items-center justify-center bg-white text-black px-4 py-2 rounded-lg shadow hover:bg-gray-200 transition"
                                onClick={() => handleSignIn(googleProvider)}
                            >
                                Sign Up with Google
                            </button>
                            <button
                                className="w-full flex items-center justify-center bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-600 transition"
                                onClick={() => handleSignIn(githubProvider)}
                            >
                                Sign Up with GitHub
                            </button>
                        </div>
                    </div>
            }

        </div >
    );
}
