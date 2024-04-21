'use client'
import {useState} from "react";
import {useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";
import Link from "next/link";

export default function Page() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepetition, setPasswordRepetition] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordRepetitionError, setPasswordRepetitionError] = useState('')
    const router = useRouter()
    const onButtonClick = () => {
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
        if (passwordRepetition !== password) {
            setPasswordError('Passwords')
            return
        }
        const data = {
            username: email,
            password
        }
        fetch(`${BASE_URL}/auth/users/`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(data),
        }).then((res) => {
            if (res.status !== 201) {
                return res.json().then(data => {
                    const error = new Error('Can not create an user');
                    error.data = data;
                    throw error;
                });
            }
            return res.json();
        }).then((data) => {
            router.push("/login");
        }).catch(error => {
            const data = JSON.stringify(error.data)
            console.error('Error:', data);
            window.alert(data);
        });
    }
    return (
        <div>
            Create an account
            <div>
                <div>
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={(ev) => setEmail(ev.target.value)}
                    />
                    <label>{emailError}</label>
                </div>
                <div>
                    <input
                        value={password}
                        type="password"
                        placeholder="Enter your password here"
                        onChange={(ev) => setPassword(ev.target.value)}
                    />
                    <label>{passwordError}</label>
                </div>
                <div>
                    <input
                        value={passwordRepetition}
                        type="password"
                        placeholder="Repeat your password here"
                        onChange={(ev) => setPasswordRepetition(ev.target.value)}
                    />
                    <label>{passwordRepetitionError}</label>
                </div>
                <div>
                    <input type="button" onClick={onButtonClick} value={'Create an account'}/>
                </div>
            </div>
            <div>
                <Link href="/">Cancel</Link>
            </div>
        </div>
    )
}