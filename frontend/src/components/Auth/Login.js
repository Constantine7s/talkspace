import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react';
import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };
  const handleSubmit = () => {};

  return (
    <div>
      <VStack spacing="5px">
        <FormControl id="email">
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your password"
              type={show ? 'text' : 'password'}
              onInput={(e) => {
                setPassword(e.target.value);
              }}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleShow}>
                {show ? 'Hide' : 'Show'}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <Button
          width="100%"
          colorScheme="blue"
          style={{ marginTop: 25 }}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <Button
          width="100%"
          style={{ marginTop: 25 }}
          onClick={() => {
            setEmail('guest@example.com');
            setPassword('guest123');
            handleSubmit();
          }}
        >
          Continue as Guest
        </Button>
      </VStack>
    </div>
  );
};

export default Login;
