import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { messageAPI } from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const ChatBox = ({
  recipientUser,
  conversationId,
  height = 520,
}) => {
  const { user } = useAuth();
  const { subscribeToChat, sendChatMessage, registerMessageListener } = useSocket();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!recipientUser) return;
    setLoading(true);

    const loadHistory = async () => {
      try {
        const res = await messageAPI.getWithUser(recipientUser.id);
        if (res.success) {
          setMessages(res.data || []);
          if (conversationId) {
            messageAPI.markAsRead(conversationId);
          }
        }
      } catch (err) {
        console.error('Error loading chat history:', err);
      } finally {
        setLoading(false);
        setTimeout(scrollToBottom, 100);
      }
    };

    loadHistory();

    // Listen for live messages for this conversation
    const unsubscribe = registerMessageListener((newMsg) => {
      if (
        (newMsg.senderId === recipientUser.id && newMsg.recipientId === user.id) ||
        (newMsg.senderId === user.id && newMsg.recipientId === recipientUser.id)
      ) {
        setMessages((prev) => [...prev, newMsg]);
        setTimeout(scrollToBottom, 50);
      }
    });

    return unsubscribe;
  }, [recipientUser, user, conversationId, registerMessageListener]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !recipientUser) return;

    const content = inputText.trim();
    setInputText('');

    const optimisticMsg = {
      id: 'temp-' + Date.now(),
      senderId: user.id,
      senderName: user.name,
      recipientId: recipientUser.id,
      recipientName: recipientUser.name,
      content: content,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setTimeout(scrollToBottom, 50);

    try {
      // Send via REST API
      const res = await messageAPI.send({
        recipientId: recipientUser.id,
        content: content,
        conversationId: conversationId,
      });

      if (res.success && res.data) {
        setMessages((prev) =>
          prev.map((m) => (m.id === optimisticMsg.id ? res.data : m))
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        height: height,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        border: (theme) => `1px solid ${theme.palette.divider}`,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
        }}
      >
        <Avatar
          src={recipientUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${recipientUser?.name}`}
          sx={{ width: 40, height: 40 }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {recipientUser?.name || 'Chat Conversation'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'success.main', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
            Online & Secure Consultation
          </Typography>
        </Box>
      </Box>

      {/* Messages Scroll Area */}
      <Box
        sx={{
          flexGrow: 1,
          p: 2.5,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#0E131F' : '#F8FAFC'),
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress size={30} />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', m: 'auto', color: 'text.secondary' }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              No messages yet.
            </Typography>
            <Typography variant="caption">
              Send a supportive message to start the counseling conversation.
            </Typography>
          </Box>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user.id;
            return (
              <Box
                key={msg.id || index}
                sx={{
                  display: 'flex',
                  justifyContent: isMe ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-end',
                  gap: 1,
                }}
              >
                {!isMe && (
                  <Avatar
                    src={recipientUser?.avatar}
                    sx={{ width: 28, height: 28, mb: 0.5 }}
                  />
                )}
                <Box
                  sx={{
                    maxWidth: '75%',
                    p: 1.5,
                    px: 2,
                    borderRadius: 3,
                    borderBottomRightRadius: isMe ? 4 : 20,
                    borderBottomLeftRadius: !isMe ? 4 : 20,
                    background: isMe
                      ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)'
                      : (theme) => (theme.palette.mode === 'dark' ? '#1E293B' : '#FFFFFF'),
                    color: isMe ? '#FFFFFF' : 'text.primary',
                    boxShadow: isMe
                      ? '0 4px 12px rgba(2, 132, 199, 0.25)'
                      : '0 2px 6px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <Typography variant="body2" sx={{ wordBreak: 'break-word', lineHeight: 1.5 }}>
                    {msg.content}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      mt: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontSize: '0.65rem',
                        color: isMe ? 'rgba(255,255,255,0.7)' : 'text.disabled',
                      }}
                    >
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </Typography>
                    {isMe && (
                      <DoneAllIcon
                        sx={{
                          fontSize: 12,
                          color: msg.read ? '#38BDF8' : 'rgba(255,255,255,0.6)',
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Field */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          p: 1.5,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 1,
          alignItems: 'center',
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
            },
          }}
        />
        <IconButton
          color="primary"
          type="submit"
          disabled={!inputText.trim()}
          sx={{
            bgcolor: 'primary.main',
            color: '#FFFFFF',
            '&:hover': { bgcolor: 'primary.dark' },
            '&.Mui-disabled': { bgcolor: 'action.disabledBackground' },
          }}
        >
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
    </Paper>
  );
};
export default ChatBox;
