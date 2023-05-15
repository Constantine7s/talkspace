import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box } from '@chakra-ui/react';

const ChatBox = () => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? 'flex' : 'none', md: 'flex' }}
      flexDir="column"
      width='100%'
      padding={3}
      background="white"
      borderRadius="5px"
      alignItems="center"
    >
      Single Chat
    </Box>
  );
};

export default ChatBox;
