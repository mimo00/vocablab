"use client";

import Link from "next/link";
import {BASE_URL, formatDateToLocal} from '@/app/lib/utils';
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation'
import {PlusIcon, ArrowLeftOnRectangleIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import {Flashcard, LearningStatistics} from '@/app/lib/definitions';
import { useDebouncedCallback } from 'use-debounce';


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
    const [flashcardsFiltered, setFlashcardsFiltered] = useState<Flashcard[]>([])
    const [learningStatistics, setLearningStatistics] = useState<LearningStatistics>({
        flashcards_created: 0,
        flashcards_created_last_seven_days: 0,
        flashcards_created_today: 0,
        learning_sessions_completed_last_seven_days: 0,
        learning_sessions_completed_today: 0,
    })
    const router = useRouter();

    useEffect(() => {
        console.log("USE EFFECT")
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
                setFlashcardsFiltered(data)
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
    const handleSearch = useDebouncedCallback((term) => {
        const lowerCaseTerm = term.toLowerCase();
        const filtered = flashcards.filter(flashcard =>
            flashcard.front.toLowerCase().includes(lowerCaseTerm) ||
            flashcard.back.toLowerCase().includes(lowerCaseTerm) ||
            flashcard.example.toLowerCase().includes(lowerCaseTerm)
        );
        setFlashcardsFiltered(filtered);
    }, 300);
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
    const onEdit = (id: string) => {
        router.push(`/flashcards/edit/${id}`);
    }

    return (
        <div>
            <div>
                <div className={'flex justify-between mt-3'}>
                    <button
                        onClick={onTakeLearningSession}
                        className={'flex h-10 items-center rounded-lg bg-stone-900 px-4 text-white'}
                    >
                        Learn
                    </button>
                    <button onClick={onLogout}>
                        <div className={'flex'}>
                            <span>Logout</span>
                            <ArrowLeftOnRectangleIcon className={'h-5'}/>
                        </div>
                    </button>
                </div>
                <div className={'grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-3'}>
                    <Card title="Flashcards created"
                          value={learningStatistics.flashcards_created}/>
                    <Card title="Flashcards created today" value={learningStatistics.flashcards_created_today}/>
                    <Card title="Flashcards created last 7 days"
                          value={learningStatistics.flashcards_created_last_seven_days}/>
                    <Card title="Learning sessions completed today"
                          value={learningStatistics.learning_sessions_completed_today}/>
                </div>
            </div>
            <div className={'flex mt-5'}>
                <input
                    className="w-full mr-5 rounded-md border border-gray-200 text-sm  placeholder:text-gray-500"
                    placeholder={'Search flashcards'}
                    onChange={(e) => {
                      handleSearch(e.target.value);
                    }}
                />
                <Link
                    href="/flashcards/create"
                    className={'flex h-10 items-center rounded-lg bg-stone-900 px-4 text-white'}
                >
                    <span className={'whitespace-nowrap'}>Create flashcard</span>
                    <PlusIcon className="h-5"/>
                </Link>
            </div>
            <div className={'hidden mt-5 bg-gray-100 rounded-lg p-3 md:table min-w-full'}>
                <table className={'min-w-full text-gray-900'}>
                    <thead className={'text-left'}>
                    <tr>
                        <th className={'font-medium px-4 py-5'}>front</th>
                        <th className={'font-medium px-4 py-5'}>back</th>
                        <th className={'font-medium px-4 py-5'}>example</th>
                        <th className={'font-medium px-4 py-5'}>created</th>
                        <th className={'font-medium px-4 py-5'}>actions</th>
                    </tr>
                    </thead>
                    <tbody className={'bg-white'}>
                    {
                        flashcards ? flashcardsFiltered.map(flashcard => (
                            <tr className={'w-full py-3 border-b'} key={flashcard.id}>
                                <td className={'whitespace-nowrap pl-3 py-3'}>{flashcard.front}</td>
                                <td className={'pl-3 py-3'}>{flashcard.back}</td>
                                <td className={'pl-3 py-3'}>{flashcard.example}</td>
                                <td className={'whitespace-nowrap pl-3 py-3'}>{formatDateToLocal(flashcard.created)}</td>
                                <td className={'whitespace-nowrap pl-3 py-3'}>
                                    <button onClick={() => onEdit(flashcard.id)} className={'mr-3'}>
                                        <PencilIcon className="h-5"/>
                                    </button>
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
            <div className="md:hidden mt-5">
                {
                    flashcards ? flashcards.map(flashcard => (
                        <div className="border p-5 rounded-2xl mt-3" key={flashcard.id}>
                            <div>{flashcard.front}</div>
                            <div>{flashcard.back}</div>
                            <div>{flashcard.example}</div>
                            <div>{formatDateToLocal(flashcard.created)}</div>
                            <div>
                                <button onClick={() => onEdit(flashcard.id)} className={'mr-3'}>
                                    <PencilIcon className="h-5"/>
                                </button>
                                <button onClick={() => onDelete(flashcard.id)}>
                                    <TrashIcon className="h-5"/>
                                </button>
                            </div>
                        </div>
                    )) : <div>Loading...</div>
                }
            </div>
        </div>
    );
}