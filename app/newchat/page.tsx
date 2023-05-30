'use client';

import { ChangeEvent, useState } from 'react';
import { Button, Container, Input } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Page() {
    let [formValues, setFormValues] = useState({
        namechat: "",
      });

      let [isLoading, setIsLoading] = useState(false);
      const router = useRouter()

      const submitForm = async () => {
        setIsLoading(true);
        const response = await fetch('/api/newchat', {
            method: 'POST',
            body: JSON.stringify({
                namechat: formValues.namechat,
            })
        })
        setFormValues({
            namechat: "",
        })
        router.push('/chat')
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
            <Button
                onClick={submitForm}
            >
                Criar
            </Button>
        </Container>


    )
    }
