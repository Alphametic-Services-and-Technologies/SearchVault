import { useEffect, useRef, useState } from 'react';
import useStreamChatResponse, { getLastMessage } from './hooks/useStreamChatResponse';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import MessageBoxForm from './components/MessageBoxForm';
import Skeleton from '@mui/material/Skeleton';

import useAnimatedText from './hooks/useAnimatedText';

function Chat() {
   // Temp states
   const [token, setToken] = useState('');
   const [tenantId, setTenantId] = useState('');

   const { messages, sendMessage, isStreaming, isLoading } = useStreamChatResponse(
      () => {},
      token,
      tenantId
   );

   const messagesEndRef = useRef<HTMLDivElement>(null);

   const animatedText = useAnimatedText(getLastMessage(messages)?.content || '');

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

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

         <Box display="flex" flexDirection="column" height="100%" p={2}>
            {/* Messages */}
            <Paper elevation={3} sx={{ flex: 1, overflowY: 'auto', p: 2, mb: 2 }}>
               {messages.length === 0 && (
                  <Box display="flex" justifyContent="center" alignItems="end" height="50%">
                     <Typography variant="h5" textAlign="center">
                        Enter a message to start the chat
                     </Typography>
                  </Box>
               )}

               <List>
                  {messages.map((msg, index) => {
                     const isLastAssistant =
                        msg.role === 'assistant' && index === messages.length - 1 && isStreaming;
                     return (
                        <ListItem key={index}>
                           <ListItemText
                              sx={{
                                 display: 'flex',
                                 justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                 minWidth: '40%',
                              }}
                              primary={
                                 isLoading && index === messages.length - 1 ? (
                                    <Skeleton
                                       width={35}
                                       height={50}
                                       sx={{ borderRadius: '100%' }}
                                    />
                                 ) : (
                                    <Typography
                                       variant="body1"
                                       sx={{
                                          bgcolor: isLastAssistant
                                             ? '#ffecec'
                                             : msg.role === 'user'
                                             ? '#1976d2'
                                             : '#e0e0e0',
                                          color: msg.role === 'user' ? '#fff' : '#000',
                                          px: 2,
                                          py: 1,
                                          borderRadius: 2,
                                          minWidth: msg.role === 'assistant' ? '100%' : undefined,
                                          wordBreak: 'break-word',
                                       }}
                                    >
                                       {isLastAssistant ? animatedText : msg.content}
                                    </Typography>
                                 )
                              }
                           />
                        </ListItem>
                     );
                  })}
                  <div ref={messagesEndRef} />
               </List>
            </Paper>

            <MessageBoxForm
               onFormSubmit={({ message }) => {
                  sendMessage(message);
               }}
               disableSubmit={isLoading || isStreaming}
            />
         </Box>
      </>
   );
}

export default Chat;
