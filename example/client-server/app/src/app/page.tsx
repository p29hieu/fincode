import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link href="/payment">Go to payment page</Link>
        <Link href="/apple-pay">Go to apple-pay page</Link>
      </div>
    </main>
  );
}
