import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Box,
} from '@chakra-ui/react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import UserListItem from './UserListItem';
import UserNameTag from './UserNameTag';

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { user, chats, setChats } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    if (!selectedUsers || !groupChatName) {
      toast({
        title: 'Please fill all fields',
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/chat/group',
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      setSelectedUsers([]);
      setSearchResult([]);
      setGroupChatName();
    } catch (error) {}
  };

  const handleRemoveUser = (user) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
  };

  const handleGroup = (newUser) => {
    if (selectedUsers.includes(newUser)) {
      toast({
        title: 'User already added',
        status: 'warning',
        isClosable: 'true',
        duration: '3000',
        position: 'top-left',
      });
      return;
    }
    setSelectedUsers([...selectedUsers, newUser]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize="35px" display="flex" justifyContent="center">
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                marginBottom={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add Users"
                marginBottom={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display="flex" width="100%" flexWrap={'wrap'}>
              {selectedUsers.map((user) => (
                <UserNameTag
                  key={user._id}
                  user={user}
                  handleFunction={() => handleRemoveUser(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>Loading...</div>
            ) : (
              searchResult?.slice(0, 4).map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                );
              })
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
