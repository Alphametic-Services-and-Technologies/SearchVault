import { useRef, useState } from 'react';
import { API_URL } from '../../../consts/apiUrl';

const sanitizeMessage = (message: string) => {
   return message.trim();
};

const getRequestHeaders = (token: string) => ({
   'Content-Type': 'application/json',
   Accept: 'text/event-stream',
   Authorization: `Bearer ${token}`,
});

const getRequestBody = (input: string, tenantId: string) => {
   return JSON.stringify({ question: input, tenantId });
};

interface ChatMessage {
   role: 'user' | 'assistant';
   content: string;
}

// The token and the tenantId here is temporary we are going to be fetching it from the user's local storage, after he is logged in

const useStreamChatResponse = (onMessageSend: () => void, token: string, tenantId: string) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [isStreaming, setIsStreaming] = useState(false);
   const [isLoading, setIsLoading] = useState(false);

   const assistantMessageRef = useRef<string>('');
   const controllerRef = useRef<AbortController | null>(null);

   const sendMessage = async (message: string) => {
      const sanitizedMessage = sanitizeMessage(message);

      const userMessage: ChatMessage = { role: 'user', content: sanitizedMessage };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      // used to reset user input, or perform any other actions after the input is acquired by the hook
      onMessageSend();

      const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      // Reset controller state
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
         setIsLoading(true);

         const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: getRequestHeaders(token),
            body: getRequestBody(sanitizedMessage, tenantId),
            signal: controller.signal,
         });

         setIsLoading(false);

         const reader = response.body?.getReader();

         const decoder = new TextDecoder('utf-8');

         let buffer = '';

         while (true) {
            setIsStreaming(true);
            const { value, done } = await reader!.read();

            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');

            buffer = lines.pop() || '';

            for (const line of lines) {
               if (!line.startsWith('data:')) continue;

               const chunk = line.replace(/^data:\s*/, '');

               assistantMessageRef.current += ` ${chunk}`;

               setMessages((prevMessages) => {
                  const updatedMessages = [...prevMessages];

                  const lastMessage = updatedMessages[updatedMessages.length - 1];

                  if (lastMessage.role === 'assistant')
                     lastMessage.content = assistantMessageRef.current;

                  return [...updatedMessages];
               });
            }
         }

         setIsStreaming(false);
         assistantMessageRef.current = '';
      } catch (e) {
         console.log('Stream message error: ', e);
         setIsLoading(false);
         setIsStreaming(false);
      }
   };

   return { messages, sendMessage, isStreaming, isLoading };
};

export const getLastMessage = (messages: ChatMessage[]): ChatMessage | null => {
   if (messages.length === 0) return null;

   const lastMessage = messages[messages.length - 1];

   if (lastMessage.role === 'assistant') return lastMessage;

   return null;
};

export default useStreamChatResponse;
