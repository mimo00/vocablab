import Link from "next/link";
import { createFlashcard } from '@/app/lib/actions';


export default async function Page() {
    return (
        <div>
            <div>Create flashcard</div>
            <form action={createFlashcard}>
                <div>
                    <input
                        id="front"
                        name="front"
                        type="text"
                        placeholder="Enter front of the fleshcard"
                        className=""
                    />
                </div>
                <div>
                    <input
                        id="back"
                        name="back"
                        type="text"
                        placeholder="Enter back of the fleshcard"
                        className=""
                    />
                </div>
                <div>
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