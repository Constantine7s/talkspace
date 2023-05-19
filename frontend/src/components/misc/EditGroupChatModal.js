import { SettingsIcon } from '@chakra-ui/icons';
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useToast,
  Box,
  FormControl,
  Input,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import UserNameTag from './UserNameTag';
import axios from 'axios';
import UserListItem from './UserListItem';

const EditGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleAddUser = async (newUser) => {
    if (selectedChat.users.find((u) => u._id === newUser._id)) {
      toast({
        title: 'User already in group',
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top',
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: 'Only group admin can add new users!',
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top',
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

      const { data } = await axios.put(
        '/api/chat/groupadd',
        {
          chatId: selectedChat._id,
          userId: newUser._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
      setSearchResult([]);
      setSearch('');
    } catch (error) {
      toast({
        title: 'Something went wrong...',
        description: `${error.message}`,
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
      setLoading(false);
      return;
    }
  };
  const handleRemoveUser = async (removedUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removedUser._id !== user._id
    ) {
      toast({
        title: 'Only group admin can remove users!',
        status: 'error',
        isClosable: 'true',
        duration: '3000',
        position: 'top',
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

      const { data } = await axios.put(
        '/api/chat/groupremove',
        {
          chatId: selectedChat._id,
          userId: removedUser._id,
        },
        config
      );

      removedUser._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        '/api/chat/rename',
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );
      toast({
        title: 'Chat renamred sucessfully',
        status: 'success',
        isClosable: 'true',
        duration: '3000',
        position: 'top',
      });

      setSelectedChat(data);
      setGroupChatName('');
      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: 'Something went wrong...',
        description: `${error.message}`,
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
      setGroupChatName('');
      return;
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
      console.log(searchResult);
    } catch (error) {
      toast({
        title: 'Failed to load the search result',
        status: 'error',
        description: `${error.message}`,
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
    }
  };

  return (
    <div>
      <IconButton display="flex" icon={<SettingsIcon />} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="30px" display="flex" justifyContent="center">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box display="flex" flexWrap="wrap" width="100% " marginBottom={2}>
              {selectedChat.users.map((user) => (
                <UserNameTag
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemoveUser(user)}
                />
              ))}
            </Box>
            <FormControl display="flex">
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                marginRight={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button onClick={handleRename}>Rename</Button>
            </FormControl>
            <FormControl display="flex">
              <Input
                placeholder="Add Users"
                marginBottom={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" onClick={() => handleRemoveUser(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditGroupChatModal;
