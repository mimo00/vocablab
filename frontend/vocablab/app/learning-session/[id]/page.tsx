'use client'
import {useEffect, useState} from "react";
import {BASE_URL} from "@/app/lib/utils";
import { useRouter } from 'next/navigation'
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
    const [flashcards, setFlashcards] = useState(null)
    const [flashcardsToShow, setFlashcardsToShow] = useState(null)
    const [learningFlashcardIndex, setLearningFlashcardIndex] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const router = useRouter()
    useEffect(() => {
        fetch(`${BASE_URL}/flashcards/learning-sessions/${params.id}/`)
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
    const handleClick = (selected) => {
        setSelectedId(selected)
    }
    const getColor = (flashcardId) => {
        if (selectedId != flashcardId)
            return 'white';
        else {
            return isRightAnswer() ? 'green' : 'red'
        }
    }
    const shuffleArray = (array) => {
        const arrayCopy = [...array];
        for (let i = arrayCopy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrayCopy[i], arrayCopy[j]] = [arrayCopy[j], arrayCopy[i]];
        }
        return arrayCopy;
    }
    const onNext = () => {
        if (!isLastAnswer()){
            setLearningFlashcardIndex(learningFlashcardIndex + 1)
            setFlashcardsToShow(shuffleArray(flashcardsToShow))
            setSelectedId(null)
        } else {
            fetch(`${BASE_URL}/flashcards/learning-sessions-completed-event/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

    if (flashcards === null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div>
                <Link href="/flashcards">Cancel</Link>
            </div>
            <div>
                {flashcards[learningFlashcardIndex].front}
            </div>
            <div>
                <div className="flex gap-4">
                    {flashcardsToShow && flashcardsToShow.map(flashcard =>
                        (<button
                            key={flashcard.id}
                            style={{backgroundColor: getColor(flashcard.id)}}
                            onClick={() => handleClick(flashcard.id)}
                        >
                            {flashcard.back}
                        </button>)
                    )}
                </div>
                <button onClick={onNext} disabled={selectedId != flashcards[learningFlashcardIndex].id}>
                    {isLastAnswer() ? 'Finish' : 'Next'}
                </button>
            </div>
        </div>
    );
}