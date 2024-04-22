'use client'

import Link from "next/link";
import {BASE_URL, formatDateToLocal} from '@/app/lib/utils';
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import {PlusIcon} from "@heroicons/react/24/solid";

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
                    <Link
                        href="/flashcards/create"
                        className={'flex h-10 items-center max-w-xs rounded-lg bg-stone-900 px-4 text-white'}
                    >
                        <span>Create flashcard</span>
                        <PlusIcon className="h-5" />
                    </Link>
                </div>
            </div>
            <div className={'bg-gray-100 rounded-lg p-3'}>
                <table className={'min-w-full text-gray-900'}>
                    <thead className={'text-left'}>
                    <tr>
                        <th className={'font-medium px-4 py-5'}>front</th>
                        <th className={'font-medium px-4 py-5'}>back</th>
                        <th className={'font-medium px-4 py-5'}>created</th>
                        <th className={'font-medium px-4 py-5'}>actions</th>
                    </tr>
                    </thead>
                    <tbody className={'bg-white'}>
                    {
                        flashcards ? flashcards.map(flashcard => (
                            <tr className={'w-full py-3 border-b'} key={flashcard.id}>
                                <td className={'whitespace-nowrap pl-3 py-3'}>{flashcard.front}</td>
                                <td className={'whitespace-nowrap pl-3 py-3'}>{flashcard.back}</td>
                                <td className={'whitespace-nowrap pl-3 py-3'}>{formatDateToLocal(flashcard.created)}</td>
                                <td className={'whitespace-nowrap pl-3 py-3'}><button onClick={() => onDelete(flashcard.id)}>delete</button></td>
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