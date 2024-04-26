'use client'
import Link from 'next/link';
import {useState} from "react";
import {useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";

export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const router = useRouter()
    const onButtonClick = () => {
        // Set initial error values to empty
        setEmailError('')
        setPasswordError('')
        // Check if the user has entered both fields correctly
        if ('' === email) {
            setEmailError('Please enter your email')
            return
        }
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email')
            return
        }
        if ('' === password) {
            setPasswordError('Please enter a password')
            return
        }
        if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer')
            return
        }
        const data = {
            username: email,
            password
        }
        fetch(`${BASE_URL}/auth/token/login/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(data),
        }).then((res) => {
            if (res.status !== 200) {
                throw new Error('Wrong email or password');
            }
            return res.json();
        }).then((data) => {
            localStorage.setItem('token', data.auth_token);
            router.push("/flashcards");
        }).catch(error => {
            console.error('Error:', error);
            window.alert('Wrong email or password');
        });
    }
    return (
        <main className={'flex justify-evenly items-center h-full'}>
            <div>
                <div className={'text-5xl'}>Vocablab</div>
                <div>Extend your vocabulary. Collect, manage & learn.</div>
            </div>
            <div className={'border p-10 rounded-2xl'}>
                <div className={'border-b'}>
                    <div>
                        <input
                            value={email}
                            placeholder="Email"
                            onChange={(ev) => setEmail(ev.target.value)}
                        />
                        <label>{emailError}</label>
                    </div>
                    <div className={'mt-3'}>
                        <input
                            value={password}
                            type="password"
                            placeholder="Password"
                            onChange={(ev) => setPassword(ev.target.value)}
                        />
                        <label>{passwordError}</label>
                    </div>
                    <button
                        className={'flex justify-center my-3 rounded-lg bg-stone-900 text-white py-3 w-full'}
                        type="button"
                        onClick={onButtonClick}
                    >
                        Log in
                    </button>
                </div>
                <div className={'flex justify-center mt-3'}>
                    <Link href="/register">Create new account</Link>
                </div>
            </div>
        </main>
    );
}
