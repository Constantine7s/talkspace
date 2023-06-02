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
import Lottie from 'react-lottie';
import animationData from '../animations/typing.json';

const ENDPOINT = 'http://localhost:8000';
let socket = io(ENDPOINT);
let selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    socket.emit('setup', user);
    socket.on('connected', () => setSocketConnected(true));
    socket.on('typing', () => setIsTyping(true));
    socket.on('stop typing', () => setIsTyping(false));
  });

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
    socket.on('message received', (newMessage) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessage.chat._id
      ) {
        if (!notification.includes(newMessage)) {
          setNotification([newMessage, ...notification]);
          setFetchAgain(!fetchAgain);
          let id = 'test-toast';
          if (!toast.isActive(id)) {
            toast({
              id,
              title: 'You got a new message',
              status: 'info',
              isClosable: 'true',
              variant: 'left-accent',
              duration: '3000',
              position: 'top-right',
            });
          }
        }
      } else {
        console.log(newMessage);
        setMessages([...messages, newMessage]);
      }
    });
  });

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      socket.emit('stop typing', selectedChat._id);
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
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
    let lastTimeTyping = new Date().getTime();
    let timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTimeTyping;
      if (timeDiff >= timerLength && typing) {
        socket.emit('stop typing', selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
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
                {isTyping ? (
                  <Lottie
                    options={defaultOptions}
                    width={70}
                    height={50}
                    style={{ margin: 5 }}
                  />
                ) : (
                  <div />
                )}
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
