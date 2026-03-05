'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <h2 className="text-2xl font-bold mb-4 italic tracking-tighter">FATAL CRITICAL ERROR</h2>
        <p className="max-w-md text-red-500 text-center mb-8 font-mono text-sm">
           {error.message || "An irreversible error occurred in the system core."}
        </p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 rounded-full border border-neutral-800 hover:bg-neutral-900 transition-colors font-medium text-xs"
        >
          ATTEMPT SYSTEM RESTORE
        </button>
      </body>
    </html>
  )
}
