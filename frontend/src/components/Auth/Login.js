import {
  FormControl,
  VStack,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleShow = () => {
    setShow(!show);
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!password || !email) {
      toast({
        title: 'Please fill in all required information',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Content-type': 'application/json',
        },
      };
      const data = await axios.post(
        '/api/user/login/',
        { email, password },
        config
      );

      toast({
        title: 'Login Successful',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });

      localStorage.setItem('userInfo', JSON.stringify(data));

      setLoading(false);

      history.push('/chats');
    } catch (error) {
      toast({
        title: 'Unexpected error',
        description: error.response.data.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <VStack spacing="5px">
        <FormControl id="login-email">
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="login-password">
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              placeholder="Enter your password"
              value={password}
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
          isLoading={loading}
          onClick={handleSubmit}
        >
          Login
        </Button>
        <Button
          width="100%"
          style={{ marginTop: 25 }}
          isLoading={loading}
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
