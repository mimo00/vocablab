'use client'
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";
import {useEffect, useState} from "react";
import {Flashcard} from "@/app/lib/definitions";
import Form from "@/app/ui/flashcards/flashcard-form";


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
            <div className={'border p-10 rounded-2xl min-w-[500px]'}>
                <div className="text-center">
                    Edit flashcard
                </div>
                <Form onSubmit={onSubmit} initialFlashcard={flashcard}/>
            </div>
        </div>
    );
}