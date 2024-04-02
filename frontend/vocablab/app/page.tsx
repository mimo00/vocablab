import Link from 'next/link';

export default function Page() {
  return (
    <main>
    <div>
      Welcome
      <div>
        <Link href="/flashcards">Flashcards</Link>
      </div>
    </div>
    </main>
  );
}
