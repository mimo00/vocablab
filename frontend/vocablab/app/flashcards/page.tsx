import Link from "next/link";
import {BASE_URL, formatDateToLocal} from '@/app/lib/utils';

export default async function Page() {
    const flashcardsResponse = await fetch(`${BASE_URL}/flashcards/flashcards/`, {cache: 'no-store'});
    const flashcards = await flashcardsResponse.json()
    return (
        <div>
            <div>
                <div>
                    {/*<input type="text" placeholder="Search flashcards ..."/>*/}
                    <Link href="/flashcards/create">Create flashcard +</Link>
                </div>
            </div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>front</th>
                            <th>back</th>
                            <th>created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            flashcards.map(flashcard => (
                                <tr key={flashcard.id}>
                                    <td>{flashcard.front}</td>
                                    <td>{flashcard.back}</td>
                                    <td>{formatDateToLocal(flashcard.created)}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    );
}