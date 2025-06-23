import { useRef, useState } from 'react';

function Chat() {
   const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
   const [input, setInput] = useState('');
   const [token, setToken] = useState('');
   const [tenantId, setTenantId] = useState('');

   const controllerRef = useRef<AbortController | null>(null);

   const handleSend = async () => {
      if (!token || !tenantId) return;

      if (!input.trim()) return;

      const userMessage = { role: 'user' as const, content: input };
      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      const assistantMessage = { role: 'assistant' as const, content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;

      try {
         const response = await fetch('https://searchvault-middleware.ast-lb.com/chat', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'text/event-stream',
               Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
               question: input,
               tenantId,
            }),
            signal: controller.signal,
         });

         const reader = response.body?.getReader();
         const decoder = new TextDecoder('utf-8');
         let buffer = '';

         while (true) {
            const { value, done } = await reader!.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
               if (line.startsWith('data:')) {
                  const chunk = line.replace(/^data:\s*/, '');

                  // Update the assistant's message incrementally
                  setMessages((prev) => {
                     const updated = [...prev];

                     const last = updated[updated.length - 1];

                     if (last.role === 'assistant') {
                        last.content += chunk;
                     }

                     return [...updated];
                  });
               }
            }
         }
      } catch (err) {
         console.error('Stream error:', err);
      }
   };

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

         <div style={{ maxWidth: 600, margin: '0 auto' }}>
            <div
               style={{
                  padding: 16,
                  border: '1px solid #ccc',
                  borderRadius: 8,
                  height: 400,
                  overflowY: 'auto',
               }}
            >
               {messages.map((msg, idx) => (
                  <div key={idx} style={{ marginBottom: 12, whiteSpace: 'pre-wrap' }}>
                     <strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong> {msg.content}
                  </div>
               ))}
            </div>

            <form
               onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
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
         </div>
      </>
   );
}

export default Chat;
