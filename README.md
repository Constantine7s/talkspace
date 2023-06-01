# TalkSpace
Welcome to TalkSpace, a feature-rich messaging application designed with efficiency and performance in mind. This app leverages the power of MongoDB, Express.js, React.js, and Node.js to create a seamless, real-time communication experience for users. It also utilizes Socket.io for real-time bidirectional event-based communication.

![](https://i.imgur.com/Yop8ST4.png)

## Features
* User Authentication: Utilizes JWT (JSON Web Tokens) for secure user authentication and protecting routes.

* Real-time Communication: Users can send and receive messages instantly using Socket.io.
* Group Chat: Create, join, and communicate in group chats with multiple users.
* Direct Messaging: Communicate directly with any other user on the platform.
* Persistent Storage: All conversations are stored in MongoDB and can be retrieved and continued at any time.
* Responsive Design: Built with React.js and Chakra UI, TalkSpace is designed to look great on all devices and screen sizes.

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
* Node.js and npm installed on your local machine.
* MongoDB installed locally or MongoDB Atlas (Cloud version).

### Installation
1. Clone the git repository 
```bash
  git clone https://github.com/Constantine7s/talkspace
```

2. Install NPM packages for both the server and client

```bash
  cd talkspace
  npm install
  cd frontend/
  npm install
```


3. Create a .env file in the root directory and set your environment variables for your MongoDB URI, JWT Secret and port

```bash
  PORT=8000
  MONGO_URI=your_mongodb_uri
  JWT_SECRET=your_jwt_secret
```

4. Start the server and client concurrently

```bash
  npm run start
```

```bash
  //open new terminal
  cd frontend
  npm start
```

Now, you should be able to view the application on localhost:3000.

### Usage
Register as a new user or use the guest user credentials, login, and start chatting. You can create new chat groups, join existing ones, and send direct messages to users. 
