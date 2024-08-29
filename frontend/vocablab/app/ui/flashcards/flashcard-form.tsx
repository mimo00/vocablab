import {Flashcard} from "@/app/lib/definitions";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function Form({ initialFlashcard, onSubmit }: { initialFlashcard: Flashcard, onSubmit: ((formData: FormData) => void)}) {
    const [flashcard, setFlashcard] = useState(initialFlashcard);
    useEffect(() => {
        setFlashcard(initialFlashcard);
        }, [initialFlashcard]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFlashcard({ ...flashcard, [name]: value });
    };
    return (
        <form action={onSubmit} className={'mt-3'}>
            <div className='mb-2'>
                <input
                    id="front"
                    value={flashcard.front}
                    className="w-full"
                    name="front"
                    type="text"
                    placeholder="Front"
                    onChange={handleInputChange}
                />
            </div>
            <div className='mb-2'>
                <textarea
                    id="back"
                    value={flashcard.back}
                    className="w-full"
                    name="back"
                    placeholder="Back"
                    onChange={handleInputChange}
                />
            </div>
            <div className='mb-2'>
                <textarea
                    id="example"
                    value={flashcard.example}
                    className="w-full"
                    name="example"
                    placeholder="Example"
                    onChange={handleInputChange}
                />
            </div>
            <button className={'flex justify-center my-3 rounded-lg bg-stone-900 text-white py-3 w-full'}
                    type="submit">
                Submit
            </button>
            <div className={'text-center'}>
                <Link href="/flashcards">Cancel</Link>
            </div>
        </form>
    )
}