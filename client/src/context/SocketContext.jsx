import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);
  const messageListenersRef = useRef([]);
  const notificationListenersRef = useRef([]);
  const appointmentListenersRef = useRef([]);

  useEffect(() => {
    if (!token || !user) {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
        setConnected(false);
      }
      return;
    }

    const backendOrigin = import.meta.env.VITE_API_URL || '';
    const socketUrl = backendOrigin ? `${backendOrigin}/ws` : `${window.location.protocol === 'https:' ? 'https:' : 'http:'}//${window.location.host}/ws`;

    const client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: () => {},
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setConnected(true);

        // 1. Subscribe to personal notifications
        client.subscribe(`/topic/notifications/${user.id}`, (message) => {
          try {
            const notification = JSON.parse(message.body);
            notificationListenersRef.current.forEach((cb) => cb(notification));
          } catch (e) {
            console.error('Error parsing WS notification:', e);
          }
        });

        // 2. Subscribe to personal direct messages
        client.subscribe(`/topic/messages/${user.id}`, (message) => {
          try {
            const chatMsg = JSON.parse(message.body);
            messageListenersRef.current.forEach((cb) => cb(chatMsg));
          } catch (e) {
            console.error('Error parsing WS chat message:', e);
          }
        });

        // 3. Subscribe to appointment updates
        client.subscribe(`/topic/appointments/${user.id}`, (message) => {
          try {
            const appt = JSON.parse(message.body);
            appointmentListenersRef.current.forEach((cb) => cb(appt));
          } catch (e) {
            console.error('Error parsing WS appointment:', e);
          }
        });
      },
      onDisconnect: () => {
        setConnected(false);
      },
      onStompError: (frame) => {
        console.warn('Broker reported error: ' + frame.headers['message']);
      },
    });

    client.activate();
    stompClientRef.current = client;

    return () => {
      if (client) client.deactivate();
    };
  }, [token, user]);

  const subscribeToChat = (conversationId, callback) => {
    if (!stompClientRef.current || !stompClientRef.current.connected) return null;
    return stompClientRef.current.subscribe(`/topic/chat/${conversationId}`, (msg) => {
      try {
        const parsed = JSON.parse(msg.body);
        callback(parsed);
      } catch (err) {
        console.error('Chat sub error', err);
      }
    });
  };

  const registerNotificationListener = (callback) => {
    notificationListenersRef.current.push(callback);
    return () => {
      notificationListenersRef.current = notificationListenersRef.current.filter((cb) => cb !== callback);
    };
  };

  const registerMessageListener = (callback) => {
    messageListenersRef.current.push(callback);
    return () => {
      messageListenersRef.current = messageListenersRef.current.filter((cb) => cb !== callback);
    };
  };

  const registerAppointmentListener = (callback) => {
    appointmentListenersRef.current.push(callback);
    return () => {
      appointmentListenersRef.current = appointmentListenersRef.current.filter((cb) => cb !== callback);
    };
  };

  const sendChatMessage = (messageObj) => {
    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish({
        destination: '/app/chat.send',
        body: JSON.stringify(messageObj),
      });
    }
  };

  const value = {
    connected,
    subscribeToChat,
    registerNotificationListener,
    registerMessageListener,
    registerAppointmentListener,
    sendChatMessage,
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
