'use client';

import Image from 'next/image'
import styles from './page.module.css'
import { ChangeEvent, useState } from 'react';
import { Button, Container, Input } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';

export default function Page() {
    let [formValues, setFormValues] = useState({
        namechat: "",
        members: "",
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
            Nome do chat:
            <Input
                value={formValues.namechat}
                name='namechat'
                placeholder='Nome do chat'
                onChange={handleChange}
                isInvalid={formValues.namechat.length < 1}
            />
            Membros:
            <Input
                value={formValues.members}
                name='members'
                placeholder='Membros'
                onChange={handleChange}
                isInvalid={formValues.members.length < 1}
            />
            <Button
                onClick={submitForm}
            >
                Criar
            </Button>
        </Container>


    )
    }
