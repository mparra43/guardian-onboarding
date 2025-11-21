'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

export function BackButton() {
  const router = useRouter()
  
  return (
    <Button
      onClick={() => router.back()}
      variant="ghost"
      className="mb-6"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Volver
    </Button>
  )
}
