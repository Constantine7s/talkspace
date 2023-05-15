import { CloseIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import React from 'react';

const UserNameTag = ({ user, handleFunction }) => {
  return (
    <Box
      paddingX={2}
      paddingY={1}
      borderRadius="3px"
      margin={1}
      marginBottom={2}
      fontSize={12}
      backgroundColor="#486989"
      _hover={{ backgroundColor: 'crimson' }}
      color="white"
      cursor="pointer"
      variant="solid"
      onClick={handleFunction}
    >
      {user.name}
      <CloseIcon paddingLeft={1} />
    </Box>
  );
};

export default UserNameTag;
