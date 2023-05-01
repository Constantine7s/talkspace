import React, { useEffect } from 'react';
import Signup from '../components/Auth/Signup';
import Login from '../components/Auth/Login';
import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';

export const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userInfo'));

    if (!user) history.push('/chats');
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={4}
        bg="whitesmoke"
        w="100%"
        borderRadius="5px"
        m="40px 0 40px 0"
      >
        <Text
          align="center"
          fontSize="4xl"
          fontFamily="Alfa Slab One"
          color="black"
        >
          TalkSpace
        </Text>
      </Box>
      <Box p={4} bg="whitesmoke" w="100%" borderRadius="5px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
