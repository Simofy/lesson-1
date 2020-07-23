import { useEffect, useMemo } from 'react';

export default function useWebSocket(onUpdate) {
  const socket = useMemo(() => new WebSocket('ws://localhost:8080/ws'), []);

  useEffect(() => {
    socket.addEventListener('open', (event) => {
      socket.send('Hello Server!');
    });

    // Listen for messages
    socket.addEventListener('message', (event) => {
      console.log('Message from server ', event.data);
      onUpdate(event.data);
    });
  }, []);

  return [socket];
}
