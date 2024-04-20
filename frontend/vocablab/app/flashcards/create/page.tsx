'use client'
import Link from "next/link";
import {redirect, useRouter} from "next/navigation";
import {BASE_URL} from "@/app/lib/utils";


export default function Page() {
    const router = useRouter()
    const token = localStorage.getItem('token');
    const onSubmit = (formData) => {
        console.log(formData);
        const fleshcardData = {
            front: formData.get('front'),
            back: formData.get('back')
        }
        fetch(`${BASE_URL}/flashcards/flashcards/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(fleshcardData),
        }).then((response) => {
            router.push("/flashcards");
        }).catch(error => {
            console.error('Error:', error);
        });
    }
    return (
        <div>
            <div className="mb-2">
                Create flashcard
            </div>
            <form action={onSubmit}>
                <div className='mb-2'>
                    <input
                        id="front"
                        name="front"
                        type="text"
                        placeholder="Enter front of the fleshcard"
                        className="w-full"
                    />
                </div>
                <div className='mb-2'>
                    <input
                        id="back"
                        name="back"
                        type="text"
                        placeholder="Enter back of the fleshcard"
                        className="w-full"
                    />
                </div>
                <div className="flex justify-end gap-4">
                    <div>
                        <Link href="/flashcards">Cancel</Link>
                    </div>
                    <div>
                        <button type="submit">Create</button>
                    </div>
                </div>
            </form>
        </div>
    );
}