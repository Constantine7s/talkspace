import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/GetSender';
import ProfileModal from './misc/ProfileModal';
import EditGroupChatModal from './misc/EditGroupChatModal';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client';

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const toast = useToast();

  const ENDPOINT = 'http://localhost:8000';
  let socket, selectedChatCompare;

  socket = io(ENDPOINT);

  const fetchMesseges = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: 'Failed to load the messages',
        status: 'error',
        description: `${error.message}`,
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
    }
  };

  

  useEffect(() => {
    fetchMesseges();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.emit('setup', user);
    socket.on('connection', () => {
      setSocketConnected(true);
    });
  }, []);
  
  useEffect(() => {
    socket.on('message received', (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        console.log('notification');
      } else {
        console.log(newMessage);
        setMessages([...messages, newMessage]);
      }
    });
  }, [socket]);

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage('');

        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit('new message', data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: 'Failed to send the message',
          status: 'error',
          description: `${error.message}`,
          isClosable: 'true',
          duration: '3000',
          position: 'top-left',
        });
      }
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            fontSize="30px"
            width="100%"
            marginBottom={4}
          >
            <IconButton
              display="flex"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat('')}
            ></IconButton>

            {selectedChat.isGroupChat ? (
              <>
                {selectedChat.chatName}
                <EditGroupChatModal
                  setFetchAgain={setFetchAgain}
                  fetchAgain={fetchAgain}
                  fetchMesseges={fetchMesseges}
                />
              </>
            ) : (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            padding={3}
            background="#E8E8E8"
            width="100%"
            height="100%"
            overflowY="hidden"
            borderRadius="5px"
            margin="6px"
          >
            {loading ? (
              <Spinner size="xl" alignSelf="center" margin="auto" />
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  overflowY: 'scroll',
                  scrollbarWidth: 'none',
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
              <Input
                variant="outline"
                placeholder="Enter a message..."
                background="#E0E0E0"
                onChange={handleTyping}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
          margin={2}
        >
          <Text fontSize="3xl" padding={3} color="gray.600">
            Select a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
}

export default SingleChat;