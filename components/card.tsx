'use client';

import { Card, CardHeader, CardBody, CardFooter,Text } from '@chakra-ui/react';

type CardChatProps = {
    chatName: string
}

export default function CardChat({ chatName }: CardChatProps) {

    return (

        <Card>
            <CardBody>
                <Text>{chatName}</Text>
            </CardBody>
        </Card>
    )
}