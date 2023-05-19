import React, { useState } from 'react';
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

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();

  const sendMessage = async (e) => {
    if (e.key === 'Enter' && newMessage) {
      try {
        const config = {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          '/api/message',
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage('');
        setMessages([...messages, data])
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
                <EditGroupChatModal setFetchAgain={setFetchAgain} />
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
              <></>
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
