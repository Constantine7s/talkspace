import React from 'react';
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

export const Homepage = () => {
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
        <Tabs  isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Login</TabPanel>
            <TabPanel>Sign Up</TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};
