"use client";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-2xl font-bold mb-4 text-danger">Something went wrong!</h2>
      <button onClick={() => reset()} className="bg-primary-600 text-white px-4 py-2 rounded">Try again</button>
    </div>
  );
}