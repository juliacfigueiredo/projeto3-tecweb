'use client';

import { RoomEvent, RoomProvider, useBroadcastEvent, useEventListener, useOthers } from '@/liveblocks.config';
import { Button, Heading, Input } from '@chakra-ui/react'
import { Chat, Message, User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { ChangeEvent, EventHandler, KeyboardEventHandler, useEffect, useState } from 'react';

export default function ChatPage({ params }: { params: { chatId: string } }) {
  const session = useSession()

  return (
    <div>
      <RoomProvider id={params.chatId} initialPresence={{ username: session.data?.user?.name! }}>
        <ChatRoom chatId={params.chatId} />
            </RoomProvider>
      </div>
  )
}

function ChatRoom({
  chatId
}: {
  chatId: string
}) {
  const [chatName, setChatName] = useState<string | null>('')
  const [chatMessages, setChatMessages] = useState<({ text: string, username: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const session = useSession()

  const [isSendingMessage, setIsSendingMessage] = useState(false)

  const [message, setMessage] = useState('')

  useEventListener((event) => {
    setChatMessages((messages) => [...messages, event.event.message])
  })

  useEffect(() => {
    function updateMessages() {
      fetch(`/api/chats/${chatId}`).then((res) => res.json()).then((data: Chat & { messages: (Message & { user: User })[] }) => {
        setChatName(data.name)
        setChatMessages(data.messages.map(m => ({ text: m.text, username: m.user.username })))
        setIsLoading(false)
        console.log(data)
      })
    }

    updateMessages()
  }, [])

  const broadcast = useBroadcastEvent()

  const handleKeyDown: KeyboardEventHandler = (event) => {

    if (event.key === 'Enter') {
      setIsSendingMessage(true)
      broadcast({
        message: {
          text: message,
          username: session.data?.user?.name!,
        }
      })
      setChatMessages((messages) => [...messages, { text: message, username: session.data?.user?.name! }])
      setMessage('')
      setIsSendingMessage(false)
      fetch(`/api/chats/${chatId}/message`, {
        method: 'POST',
        body: JSON.stringify({ text: message }),
      })
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setMessage(value);
  };

  const addMember = () => {
    const user = prompt('Digite o nome do usuário')
    fetch(`/api/chats/${chatId}/member`, {
      method: 'POST',
      body: JSON.stringify({ username: user }),
    })
  }

  return (
    <>
      <Heading>#{chatName?.replaceAll(' ', '-')}</Heading>
      <OthersDisplay selfUsername={session.data?.user?.name!} />
      <div>
        <Button onClick={addMember}>
          Adicionar membro
        </Button>
      </div>
      <ul>
        {chatMessages.map((message, i) => (
          <li key={i}><strong>{`<${message.username}>`}:</strong> {message.text}</li>
        ))}
      </ul>
      <Input
        isDisabled={isSendingMessage}
        name='message'
        value={message}
        placeholder='Mensagem'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </>
  )
}

function OthersDisplay({ selfUsername }: { selfUsername: string }) {
  const others = useOthers();

  return <>
    Online agora: {[...new Set(others.map(o => o.presence.username)).values()].filter(u => u !== selfUsername).join(', ')}
  </>
}