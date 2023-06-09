import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuList,
  MenuItem,
  Text,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Input,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import ProfileModal from './misc/ProfileModal';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './misc/ChatLoading';
import UserListItem from './misc/UserListItem';
import { getSender } from './config/GetSender';
import NotificationBadge, { Effect } from 'react-notification-badge'

const Header = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: 'Please enter name or email',
        status: 'warning',
        isClosable: 'true',
        duration: '2000',
        position: 'top-left',
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Couldn't get the search result",
        status: 'error',
        description: `${error.message}`,
        isClosable: 'true',
        duration: '2000',
        position: 'top-left',
      });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      handleSearch();
    }
  };

  const startChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          'Content-type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post('/api/chat', { userId }, config);

      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Couldn't get the chat",
        status: 'error',
        description: `${error.message}`,
        isClosable: 'true',
        duration: '2000',
        position: 'top-left',
      });
    }
  };

  const handleLogut = () => {
    localStorage.removeItem('userInfo');
    history.push('/');
    window.location.reload();
  };

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
        <Button variant={'ghost'} onClick={onOpen}>
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
            <MenuButton padding={1}>
              <NotificationBadge count={notification.length} effect={Effect.SCALE}/>
              <BellIcon boxSize={6} />
            </MenuButton>
            <MenuList padding={4}>
              {!notification.length && 'No new messages'}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n.chat.chatName !== notif.chat.chatName));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={handleLogut}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" paddingBottom={2}>
              <Input
                placeholder="Enter name or email"
                marginRight={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => startChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner marginLeft="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
