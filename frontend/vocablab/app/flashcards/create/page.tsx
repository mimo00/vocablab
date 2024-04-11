import Link from "next/link";
import { createFlashcard } from '@/app/lib/actions';


export default async function Page() {
    return (
        <div>
            <div className="mb-2">
                Create flashcard
            </div>
            <form action={createFlashcard}>
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