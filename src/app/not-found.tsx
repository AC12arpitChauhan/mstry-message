import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white px-4">
      <h2 className="text-4xl font-bold mb-4">404</h2>
      <p className="text-xl font-semibold mb-2">Page Not Found</p>
      <p className="text-neutral-400 mb-8 max-w-md text-center">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" passHref>
        <Button
          variant="default"
          className="bg-white text-black hover:bg-neutral-200"
        >
          Return Home
        </Button>
      </Link>
    </div>
  )
}
