import { Avatar, Box, Text } from '@chakra-ui/react';
import React from 'react';

function UserListItem({ user, handleFunction }) {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      background="#ECECEC"
      _hover={{
        background: '#486989',
        color: 'white',
      }}
      width="100%"
      display="flex"
      alignItems="center"
      color="black"
      paddingX={3}
      paddingy={3}
      marginBottom={2}
      borderRadius="6px"
    >
      <Avatar
        marginRight={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text marginTop={1}>{user.name}</Text>
        <Text fontSize="xs" marginBottom={2}>
          <b>Email: </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
}

export default UserListItem;
