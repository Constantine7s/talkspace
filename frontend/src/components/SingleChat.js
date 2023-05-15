import React from 'react';
import { ChatState } from '../context/ChatProvider';
import { Box, IconButton, Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/GetSender';
import ProfileModal from './misc/ProfileModal';
import EditGroupChatModal from './misc/EditGroupChatModal';

function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat } = ChatState();

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
                <EditGroupChatModal setFetchAgain={setFetchAgain}/>
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
          ></Box>
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
