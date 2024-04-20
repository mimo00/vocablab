import Link from 'next/link';

export default function Page() {
  return (
    <main>
    <div>
      Welcome
      <div>
        <Link href="/login">Login</Link>
      </div>
    </div>
    </main>
  );
}
