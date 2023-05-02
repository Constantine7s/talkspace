import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import SideMenu from '../components/misc/Header';
import MyChats from '../components/misc/MyChats';
import ChatBox from '../components/misc/ChatBox';

export const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: '100%' }}>
      {user && <SideMenu />}
      <Box display="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
