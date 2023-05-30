'use client';
import CardChat from '@/components/card';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import { Button} from '@chakra-ui/react';

export interface ChatResponse {
  chats: Chat[]
} 

export interface Chat {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  members: Member[]
}

export interface Member {
  id: string
  chat_id: string
  user_id: string
  user: User
}

export interface User {
  username: string
  id: string
}

export default function page() {
  useEffect(() => {
    fetch('/api/chats').then(res => res.json()).then(chats => {
      setChats(chats.chats)
    })
  })

  const[chats, setChats] = useState<Chat[]>([])
    
  return (

    <div>
        {chats.map((chat) => (
          <Link href={'/chat/' + chat.id}>
            <CardChat chatName={chat.name} />
          </Link>
        ))}
        <Link href = '/newchat'>
          <Button >
            New Chat
          </Button>
        </Link>
    </div>
  )
}
