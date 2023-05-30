'use client';
import { Heading } from '@chakra-ui/react'
export default function page({ params }: { params: { chatId: string } }) {
  return (
    <div>
        {params.chatId}
        <Heading>Chat</Heading>

    </div>
  )
}
