import { Box } from '@chakra-ui/react';
import { ChatState } from '../context/ChatProvider';
import MyChats from '../components/misc/MyChats';
import ChatBox from '../components/misc/ChatBox';
import Header from '../components/misc/Header';


export const ChatPage = () => {
  const { user } = ChatState();
  return (
    <div style={{ width: '100%' }}>
      {user && <Header />}
      <Box display="flex" justifyContent="space-between" w="100%" h="90vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
