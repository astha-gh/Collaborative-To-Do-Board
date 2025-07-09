import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_BACKEND_URL, {
    transports: ['websocket'], 
    withCredentials: true
});

export default socket;
