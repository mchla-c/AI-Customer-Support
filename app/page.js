'use client'

import { useState, useRef, useEffect } from "react";
import {Box, Stack, TextField, Typography, Button} from '@mui/material';

export default function Home() {
  const [history, setHistory] = useState ([

  ])

  const firstMessage = "Hi there! I'm the Headstarter virtual asisstance. How can I help?"

  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true)
    setMessage('')
    setHistory((history) => 
      [...history, {role: "user", parts: [{text: message}]}]
    )

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify([...history, {role: "user", parts: [{text: message}]}])
    })

    const data = await response.json()

    setHistory((history) =>
      [...history, {role: "model", parts: [{text: data}]}]
    )

    setIsLoading(false)
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [history])

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
    > 
      <Stack
        direction={'column'}
        justifyContent={'flex-end'}
        width={'50%'}
        height={'80%'}
        maxHeight={'80%'}
        border={'2px solid black'}
        borderRadius={5}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          overflow={'auto'}
          mb={2}
        >
          <Box
            display={'flex'}
            justifyContent={'flex-end'}
            bgcolor={'secondary.main'}
            borderRadius={10}
            p={2}
          >
            <Typography
              bgcolor={'secondary.main'}
              color={'white'}
            >
              {firstMessage}
            </Typography>
          </Box>
            {history.map((textObject, index) => (
              <Box
                key={index}
                display={'flex'}
                justifyContent={textObject.role ==='user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  bgcolor={textObject.role === 'user' ? 'primary.main' : 'secondary.main'}
                  color={'white'}
                  borderRadius={10}
                  p={2}
                >
                  {textObject.parts[0].text}
                </Box>
              </Box>
            ))}

            <div ref={messagesEndRef}/>

        </Stack>
        <Stack
          direction={'row'}
          spacing={2}
          
        >
            <TextField
              label='Message'
              value={message}
              onChange={(e => setMessage(e.target.value))}
              fullWidth
              display={'flex'}
              alignItems={'center'}
              justifyContent={'center'}
              onKeyPress={handleKeyPress}
            >
            </TextField>
            
            <Button
              variant='contained'
              onClick={sendMessage}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
          
        </Stack>
      </Stack>
    </Box>  


  );
}
