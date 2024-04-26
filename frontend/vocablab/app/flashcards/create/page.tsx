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
        <div className={'flex justify-center h-full items-center'}>
            <div className={'border p-10 rounded-2xl'}>
                <div className="text-center">
                    Create flashcard
                </div>
                <form action={onSubmit} className={'mt-3'}>
                    <div className='mb-2'>
                        <input
                            id="front"
                            name="front"
                            type="text"
                            placeholder="Front"
                        />
                    </div>
                    <div className='mb-2'>
                        <input
                            id="back"
                            name="back"
                            type="text"
                            placeholder="Back"
                        />
                    </div>
                    <button className={'flex justify-center my-3 rounded-lg bg-stone-900 text-white py-3 w-full'} type="submit">
                        Create
                    </button>
                    <div className={'text-center'}>
                        <Link href="/flashcards">Cancel</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}