'use client';

import Image from 'next/image'
import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import { Button, Container, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Page() {
  let [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  let [isLoading, setIsLoading] = useState(false);

  const submitForm = async () => {
    setIsLoading(true);
    signIn('credentials', formValues)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Container>
      Usuário
      <Input
        isDisabled={isLoading}
        value={formValues.username}
        name='username'
        placeholder='Usuário'
        onChange={handleChange}
        isInvalid={formValues.username.length < 1}
      />

      Senha:
      <Input
        isDisabled={isLoading}
        value={formValues.password}
        name='password'
        placeholder='Senha'
        type='password'
        onChange={handleChange}
        isInvalid={formValues.password.length < 1}
      />

      <Button
        isLoading={isLoading}
        isDisabled={formValues.password.length < 1 || formValues.username.length < 1}
        onClick={submitForm}
      >
        Login
      </Button>
    </Container>
  )
}
