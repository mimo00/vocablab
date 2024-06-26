"use client";

import Link from "next/link";
import {BASE_URL, formatDateToLocal} from '@/app/lib/utils';
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import {PlusIcon, ArrowLeftOnRectangleIcon, TrashIcon} from "@heroicons/react/24/solid";
import {Flashcard, LearningStatistics} from '@/app/lib/definitions';


function Card({
  title,
  value,
}: {
  title: string;
  value: number | string;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

export default function Page() {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [learningStatistics, setLearningStatistics] = useState<LearningStatistics>({
        flashcards_created_last_seven_days: 0,
        flashcards_created_today: 0,
        learning_sessions_completed_last_seven_days: 0,
        learning_sessions_completed_today: 0,
    })
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/');
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
        fetch(
            `${BASE_URL}/flashcards/statistics/`, {
                headers: {
                  'Authorization': `Token ${token}`,
                },
                cache: 'no-store'
            })
            .then((res) => res.json())
            .then((data) => {
                setLearningStatistics(data)
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, [])
    const onLogout = () => {
        localStorage.removeItem('token');
        router.push('/');
    }
    const onTakeLearningSession = () => {
        const token = localStorage.getItem('token');
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
    const onDelete = (id: string) => {
        const token = localStorage.getItem('token');
        fetch(`${BASE_URL}/flashcards/flashcards/${id}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,
            }
        })
        .then(() => {
            if (flashcards) {
                setFlashcards(flashcards.filter(flashcard => flashcard.id !== id));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    return (
        <div>
            <div>
                <div className={'flex justify-end'}>
                    <button onClick={onLogout}>
                        <div className={'flex'}>
                            <span>Logout</span>
                            <ArrowLeftOnRectangleIcon className={'h-5'}/>
                        </div>
                    </button>
                </div>
                <div className={'flex justify-between mt-3'}>
                    <button
                        onClick={onTakeLearningSession}
                        className={'flex h-10 items-center rounded-lg bg-stone-900 px-4 text-white'}
                    >
                        Learn
                    </button>
                    <Link
                        href="/flashcards/create"
                        className={'flex h-10 items-center rounded-lg bg-stone-900 px-4 text-white'}
                    >
                        <span>Create flashcard</span>
                        <PlusIcon className="h-5"/>
                    </Link>
                </div>
                <div className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-3'}>
                    <Card title="Flashcards created today" value={learningStatistics.flashcards_created_today}/>
                    <Card title="Flashcards created last 7 days"
                          value={learningStatistics.flashcards_created_last_seven_days}/>
                    <Card title="Learning sessions completed today"
                          value={learningStatistics.learning_sessions_completed_today}/>
                    <Card title="Learning sessions completed last 7 days"
                          value={learningStatistics.learning_sessions_completed_last_seven_days}/>
                </div>
            </div>
            <div className={'hidden mt-5 bg-gray-100 rounded-lg p-3 md:table min-w-full'}>
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
                                <td className={'whitespace-nowrap pl-3 py-3'}>
                                    <button onClick={() => onDelete(flashcard.id)}>
                                        <TrashIcon className="h-5"/>
                                    </button>
                                </td>
                            </tr>
                        )) : <tr>
                            <td>Loading...</td>
                        </tr>
                    }
                    </tbody>
                </table>
            </div>
            <div className={'flex justify-center mt-6'}>

            </div>
        </div>
    );
}