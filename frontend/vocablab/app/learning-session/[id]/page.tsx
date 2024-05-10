'use client'
import {useEffect, useState} from "react";
import {BASE_URL} from "@/app/lib/utils";
import {useRouter} from 'next/navigation'
import Link from "next/link";
import clsx from 'clsx';
import {Flashcard} from "@/app/lib/definitions";

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
            <div className={'border p-10 rounded-2xl'}>
                <div className={'border-b'}>
                    <div className={'text-center'}>
                        {flashcards[learningFlashcardIndex].front}
                    </div>
                    <div className="flex gap-4 my-6">
                        {flashcardsToShow && flashcardsToShow.map(flashcard =>
                            (<button
                                key={flashcard.id}
                                style={{backgroundColor: getColor(flashcard.id)}}
                                onClick={() => handleClick(flashcard.id)}
                                className={'border p-5 rounded-xl'}
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
