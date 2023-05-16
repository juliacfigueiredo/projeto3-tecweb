'use client';

import Image from 'next/image'
import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import { Button, Container, Input } from '@chakra-ui/react';
import { Router, useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function Page() {
  let [formValues, setFormValues] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });

  let [isLoading, setIsLoading] = useState(false);

  const submitForm = async () => {
    setIsLoading(true);
    const response = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        username: formValues.username,
        password: formValues.password,
      })
    })
    setFormValues({
      password: "",
      passwordConfirmation: "",
      username: "",
    })
    signIn('credentials', formValues)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  return (
    <Container>
      Usuário:
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

      Repita a senha:
      <Input
        isDisabled={isLoading}
        value={formValues.passwordConfirmation}
        name='passwordConfirmation'
        placeholder='Repita a senha'
        type='password'
        onChange={handleChange}
        isInvalid={formValues.passwordConfirmation.length < 1 || formValues.password != formValues.passwordConfirmation}
      />
      <Button
        isLoading={isLoading}
        isDisabled={formValues.password.length < 1 || formValues.username.length < 1 || formValues.password != formValues.passwordConfirmation}
        onClick={submitForm}
      >
        Criar conta
      </Button>
    </Container>
  )
}
