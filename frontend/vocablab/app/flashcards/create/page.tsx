'use client'
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";
import Form from '@/app/ui/flashcards/flashcard-form';
import {Flashcard} from "@/app/lib/definitions";


export default function Page() {
    const router = useRouter()
    const onSubmit = (formData: FormData) => {
        const token = localStorage.getItem('token');
        const fleshcardData = {
            front: formData.get('front'),
            back: formData.get('back'),
            example: formData.get('example'),
        }
        fetch(`${BASE_URL}/flashcards/flashcards/`, {
            method: 'POST',
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
    const initialFlashcard: Flashcard = {
        front: "", back: "", created: "", example: "",  id: ""
    }
    return (
        <div className={'flex justify-center h-full items-center'}>
            <div className={'border p-10 rounded-2xl min-w-[500px]'}>
                <div className="text-center">
                    Create flashcard
                </div>
                <Form onSubmit={onSubmit} initialFlashcard={initialFlashcard}/>
            </div>
        </div>
    );
}