import Link from "next/link";
import { createFlashcard } from '@/app/lib/actions';


export default async function Page() {
    return (
        <div>
            <div></div>
            Form to add flashcard
            <div>
                <Link href="/flashcards">Cancel</Link>
            </div>
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
                    <button type="submit">Create fleshcard</button>
                </div>
            </form>
        </div>
    );
}