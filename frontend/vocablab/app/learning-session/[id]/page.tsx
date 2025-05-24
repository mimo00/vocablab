'use client'
import {useEffect, useState} from "react";
import {BASE_URL} from "@/app/lib/utils";
import {useRouter} from 'next/navigation'
import Link from "next/link";
import clsx from 'clsx';
import {Flashcard} from "@/app/lib/definitions";
import { PlayIcon } from "@heroicons/react/24/solid";


export default function Page({params}: { params: { id: string } }) {
    const [flashcards, setFlashcards] = useState<Flashcard[]>([])
    const [flashcardsToShow, setFlashcardsToShow] = useState<Flashcard[]>([])
    const [learningFlashcardIndex, setLearningFlashcardIndex] = useState(0)
    const [selectedId, setSelectedId] = useState<null | string>(null)
    const token = localStorage.getItem('token');

    const router = useRouter()
    useEffect(() => {
        fetch(`${BASE_URL}/flashcards/learning-sessions/${params.id}/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setFlashcards(data.flashcards)
                setFlashcardsToShow(data.flashcards)
                setLearningFlashcardIndex(0)
            })
    }, [])
    const isRightAnswer = () => {
        return selectedId !== null && learningFlashcardIndex !== null && flashcards !== null && flashcards[learningFlashcardIndex].id == selectedId
    }
    const isLastAnswer = () => {
        return learningFlashcardIndex == flashcards.length - 1
    }
    const handleClick = (selected: string) => {
        setSelectedId(selected)
    }
    const getColor = (flashcardId: string) => {
        if (selectedId != flashcardId)
            return 'white';
        else {
            return isRightAnswer() ? 'green' : 'red'
        }
    }
    const shuffleArray = (array: Flashcard[]) => {
        const arrayCopy = [...array];
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }
    const onNext = () => {
        if (!isLastAnswer()) {
            setLearningFlashcardIndex(learningFlashcardIndex + 1)
            setFlashcardsToShow(shuffleArray(flashcardsToShow))
            setSelectedId(null)
        } else {
            fetch(`${BASE_URL}/flashcards/learning-sessions-completed-event/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    learning_session: params.id,
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            router.push("/flashcards")
        }

    }

    if (flashcards.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className={'flex justify-center h-full items-center'}>
            <div className={'md:border md:p-10 rounded-2xl w-full md:w-auto'}>
                <div className={'border-b'}>
                    <div className={'text-center text-base md:text-xl'}>
                        {flashcards[learningFlashcardIndex].front}
                        <button onClick={() => {
                            const flashcard = flashcards[learningFlashcardIndex];
                            if (flashcard.pronunciation) {
                                const audio = new Audio(flashcard.pronunciation);
                                audio.play().catch(error => console.error('Error playing audio:', error));
                            } else {
                                alert('No pronunciation link available');
                            }
                        }} className={'mr-3'}>
                            <PlayIcon className="h-5"/>
                        </button>
                    </div>
                    <div className={clsx('text-center text-xs md:text-xl italic', {'invisible': !isRightAnswer()})}>
                        {flashcards[learningFlashcardIndex].example}
                    </div>
                    <div className="flex flex-col gap-4 my-6">
                        {flashcardsToShow && flashcardsToShow.map(flashcard =>
                            (<button
                                key={flashcard.id}
                                style={{backgroundColor: getColor(flashcard.id)}}
                                onClick={() => handleClick(flashcard.id)}
                                className={'border p-5 rounded-xl text-xs md:text-lg'}
                            >
                                {flashcard.back}
                            </button>)
                        )}
                    </div>
                </div>
                <button
                    className={clsx(
                        'flex justify-center w-full my-3 rounded-lg  text-white py-3',
                        {
                            'bg-stone-900': isRightAnswer(),
                            'bg-stone-400': !isRightAnswer()
                        }
                        )}
                    onClick={onNext}
                    disabled={!isRightAnswer()}
                >
                    {isLastAnswer() ? 'Finish' : 'Next'}
                </button>
                <div className={'text-center'}>
                    <Link href="/flashcards">Cancel</Link>
                </div>
            </div>
        </div>
    );
}
