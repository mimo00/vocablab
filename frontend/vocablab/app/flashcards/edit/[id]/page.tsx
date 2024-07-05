'use client'
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";
import {useEffect, useState} from "react";
import {Flashcard} from "@/app/lib/definitions";


export default function Page({params}: { params: { id: string } }) {
    const [flashcard, setFlashcard] = useState<Flashcard>({
        back: "",
        created: "",
        example: "",
        front: "",
        id: ""
    })
    const router = useRouter()
    const token = localStorage.getItem('token');
    useEffect(() => {
        fetch(`${BASE_URL}/flashcards/flashcards/${params.id}/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setFlashcard(data)
            })
    }, [])

    const onSubmit = (formData: FormData) => {
        const token = localStorage.getItem('token');
        const fleshcardData = {
            front: formData.get('front'),
            back: formData.get('back'),
            example: formData.get('example'),
        }
        fetch(`${BASE_URL}/flashcards/flashcards/${params.id}/`, {
            method: 'PUT',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fleshcardData),
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(JSON.stringify(data));
                });
            }
            router.push("/flashcards");
        }).catch(error => {
            window.alert(error);
            console.error('Error:', error);
        });
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFlashcard({ ...flashcard, [name]: value });
    };
    return (
        <div className={'flex justify-center h-full items-center'}>
            <div className={'border p-10 rounded-2xl'}>
                <div className="text-center">
                    Edit flashcard
                </div>
                <form action={onSubmit} className={'mt-3'}>
                    <div className='mb-2'>
                        <input
                            id="front"
                            value={flashcard.front}
                            name="front"
                            type="text"
                            placeholder="Front"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='mb-2'>
                        <input
                            id="back"
                            value={flashcard.back}
                            name="back"
                            type="text"
                            placeholder="Back"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className='mb-2'>
                        <input
                            id="example"
                            value={flashcard.example}
                            name="example"
                            type="text"
                            placeholder="Example"
                            onChange={handleInputChange}
                        />
                    </div>
                    <button className={'flex justify-center my-3 rounded-lg bg-stone-900 text-white py-3 w-full'}
                            type="submit">
                        Edit
                    </button>
                    <div className={'text-center'}>
                        <Link href="/flashcards">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}