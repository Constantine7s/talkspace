import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';

const SideMenu = () => {
  const { user } = ChatState(); 
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Button variant={'ghost'}>
          <i class="fas fa-search"></i>
          <Text p={4} display={{ base: 'none', md: 'flex' }}>
            Search User
          </Text>
        </Button>
        <Text fontSize="2xl" fontFamily="Alfa Slab One">
          TalkSpace
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <BellIcon boxSize={6} />
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} />
            </MenuButton>
          </Menu>
        </div>
      </Box>
    </>
  );
};

export default SideMenu;
