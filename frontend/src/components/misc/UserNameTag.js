import { Box, CloseButton } from '@chakra-ui/react';
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
      colorScheme="blue"
      cursor="pointer"
      variant="solid"
      onClick={handleFunction}
    >
      {user.name}
      {CloseButton}
    </Box>
  );
};

export default UserNameTag;
