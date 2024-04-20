'use client'

import Link from "next/link";
import {BASE_URL, formatDateToLocal} from '@/app/lib/utils';
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'

export default function Page() {
    const [flashcards, setFlashcards] = useState(null)
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) {
            router.push('/login');
        }
        fetch(
            `${BASE_URL}/flashcards/flashcards/`, {
                headers: {
                  'Authorization': `Token ${token}`,
                },
                cache: 'no-store'
            })
            .then((res) => res.json())
            .then((data) => {
                setFlashcards(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])
    const onLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    }
    const onTakeLearningSession = () => {
        fetch(`${BASE_URL}/flashcards/learning-sessions/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        })
        .then(response => response.json())
        .then(data => {
            router.push(`/learning-session/${data.id}`);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    const onDelete = (id) => {
        fetch(`${BASE_URL}/flashcards/flashcards/${id}/`, {
            method: 'DELETE',
        })
        .then(() => {
            setFlashcards(flashcards.filter(flashcard => flashcard.id !== id));
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    return (
        <div>
            <div>
                <div>
                    <button onClick={onLogout}>Logout</button>
                </div>
                <div>
                    <button onClick={onTakeLearningSession}>Take a learning session</button>
                </div>
                <div>
                    {/*<input type="text" placeholder="Search flashcards ..."/>*/}
                    <Link href="/flashcards/create">Create flashcard +</Link>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                    <tr>
                        <th>front</th>
                        <th>back</th>
                        <th>created</th>
                        <th>actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        flashcards ? flashcards.map(flashcard => (
                            <tr key={flashcard.id}>
                                <td>{flashcard.front}</td>
                                <td>{flashcard.back}</td>
                                <td>{formatDateToLocal(flashcard.created)}</td>
                                <td><button onClick={() => onDelete(flashcard.id)}>delete</button></td>
                            </tr>
                        )) : <tr>
                            <td>Loading...</td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    );
}