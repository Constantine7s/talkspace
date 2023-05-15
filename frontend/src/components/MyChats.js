import React, { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './misc/ChatLoading';
import { getSender } from './config/GetSender';
import GroupChatModal from './misc/GroupChatModal';

const MyChats = () => {
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get('api/chat', config);
      setChats(data);
    } catch (error) {
      toast({
        title: 'Failed to load the chats',
        status: 'error',
        description: `${error.message}`,
        isClosable: 'true',
        duration: '2000',
        position: 'top-left',
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Box
      display={{ base: selectedChat ? 'none' : 'flex', md: 'flex' }}
      alignItems="center"
      flexDir="column"
      padding={3}
      marginRight={3}
      bg="white"
      width={{ base: '100%', md: '30%' }}
      borderRadius="5px"
      borderWidth="1px"
    >
      <Box
        paddingBottom={3}
        paddingX={3}
        fontSize="28px"
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: '17px', md: '10px', lg: '17px' }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        padding={3}
        width="100%"
        h="100%"
        borderRadius="5px"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                key={chat._id}
                cursor="pointer"
                background={selectedChat === chat ? '#486989' : '#ECECEC'}
                color={selectedChat === chat ? 'white' : 'black'}
                paddingX={3}
                paddingY={2}
                borderRadius="5px"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
