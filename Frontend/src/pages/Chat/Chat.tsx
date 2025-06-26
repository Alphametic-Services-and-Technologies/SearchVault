import { useEffect, useRef, useState } from 'react';
import useStreamChatResponse from './hooks/useStreamChatResponse';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';

function Chat() {
   // const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
   const [input, setInput] = useState('');

   // const controllerRef = useRef<AbortController | null>(null);
   // const assistantMessageRef = useRef<string>('');

   // Temp states
   const [token, setToken] = useState('');
   const [tenantId, setTenantId] = useState('');

   const { messages, sendMessage, isStreaming, isLoading } = useStreamChatResponse(
      () => setInput(''),
      token,
      tenantId
   );

   console.log({ messages });

   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);
   // const handleSend = async () => {
   //    if (!token || !tenantId) return;

   //    if (!input.trim()) return;

   //    const userMessage = { role: 'user' as const, content: input };
   //    setMessages((prev) => [...prev, userMessage]);
   //    setInput('');

   //    const assistantMessage = { role: 'assistant' as const, content: '' };
   //    setMessages((prev) => [...prev, assistantMessage]);

   //    controllerRef.current?.abort();
   //    const controller = new AbortController();
   //    controllerRef.current = controller;

   //    try {
   //       const response = await fetch('https://searchvault-middleware.ast-lb.com/chat', {
   //          method: 'POST',
   //          headers: {
   //             'Content-Type': 'application/json',
   //             Accept: 'text/event-stream',
   //             Authorization: `Bearer ${token}`,
   //          },
   //          body: JSON.stringify({
   //             question: input,
   //             tenantId,
   //          }),
   //          signal: controller.signal,
   //       });

   //       const reader = response.body?.getReader();

   //       const decoder = new TextDecoder('utf-8');

   //       let buffer = '';

   //       while (true) {
   //          const { value, done } = await reader!.read();

   //          if (done) break;

   //          buffer += decoder.decode(value, { stream: true });

   //          const lines = buffer.split('\n');

   //          console.log({ lines });

   //          buffer = lines.pop() || '';

   //          for (const line of lines) {
   //             if (line.startsWith('data:')) {
   //                const chunk = line.replace(/^data:\s*/, '');

   //                assistantMessageRef.current += chunk;

   //                // Update the assistant's message incrementally
   //                setMessages((prev) => {
   //                   const updated = [...prev];

   //                   const last = updated[updated.length - 1];

   //                   if (last.role === 'assistant') {
   //                      // last.content += chunk;
   //                      last.content = assistantMessageRef.current;
   //                   }

   //                   return [...updated];
   //                });
   //             }
   //          }
   //       }
   //    } catch (err) {
   //       console.error('Stream error:', err);
   //    }
   // };

   return (
      <>
         <input
            type="text"
            placeholder="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
         />

         <input
            type="text"
            placeholder="tenantId"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
         />

         {isLoading && <>Loading....</>}

         {isStreaming && <>Streaming....</>}

         <Box display="flex" flexDirection="column" height="100%" p={2}>
            {/* Messages */}
            <Paper elevation={3} sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2 }}>
               <List>
                  {messages.map((msg, index) => (
                     <ListItem
                        key={index}
                        sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
                     >
                        <ListItemText
                           primary={
                              <Typography
                                 variant="body1"
                                 sx={{
                                    bgcolor: msg.role === 'user' ? '#1976d2' : '#e0e0e0',
                                    color: msg.role === 'user' ? '#fff' : '#000',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 2,
                                    maxWidth: '70%',
                                    wordBreak: 'break-word',
                                 }}
                              >
                                 {msg.content}
                              </Typography>
                           }
                        />
                     </ListItem>
                  ))}
                  <div ref={messagesEndRef} />
               </List>
            </Paper>

            {/* Input */}
            <Box display="flex" gap={1}>
               <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  // onKeyPress={handleKeyPress}
               />
               <IconButton
                  onClick={() => sendMessage(input)}
                  color="primary"
                  disabled={!input.trim() || isStreaming || isLoading}
               >
                  <SendIcon />
               </IconButton>
            </Box>
         </Box>

         {/* <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div
               style={{
                  padding: 16,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  height: 400,
                  // height: '100%',
                  overflowY: 'auto',
               }}
            >
               {messages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                     <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
                  </div>
               ))}
            </div>

            {isStreaming && <>Streaming....</>}

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  // handleSend();
                  sendMessage(input);
               }}
               style={{ marginTop: 16, display: 'flex', gap: 8 }}
            >
               <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  style={{ flex: 1, padding: 8 }}
                  placeholder="Type a message..."
               />
               <button type="submit">Send</button>
            </form>
         </div> */}
      </>
   );
}

export default Chat;
