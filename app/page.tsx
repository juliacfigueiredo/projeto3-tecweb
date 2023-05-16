'use client';

import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from '@chakra-ui/react'
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession()

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      {
        session ? (
          <Button onClick={() => signOut()}>Sign out</Button>
        ) : (
          <>
            <Button colorScheme="blue" onClick={() => {
              signIn()
            }}>Login</Button>
            <Link href={'/register'}>
              <Button colorScheme="blackAlpha">Criar conta</Button>
            </Link>
          </>
        )
      }
    </div>
  )
}
