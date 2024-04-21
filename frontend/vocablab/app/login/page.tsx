'use client'
import {useState} from "react";
import {BASE_URL} from "@/app/lib/utils";
import {useRouter} from "next/navigation";

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
        <div>
            Login
            <div>
                <div>
                    <input
                        value={email}
                        placeholder="Enter your email here"
                        onChange={(ev) => setEmail(ev.target.value)}
                        className={'inputBox'}
                    />
                    <label className="errorLabel">{emailError}</label>
                </div>
                <div>
                    <input
                        value={password}
                        type="password"
                        placeholder="Enter your password here"
                        onChange={(ev) => setPassword(ev.target.value)}
                        className={'inputBox'}
                    />
                    <label className="errorLabel">{passwordError}</label>
                </div>
                <div className={'inputContainer'}>
                    <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'}/>
                </div>
            </div>
        </div>
    );
}