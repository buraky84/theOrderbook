import {useEffect} from 'react';
import useWebSocket, {ReadyState} from 'react-use-websocket';
import {SOCKET_URL} from '../config/consts';

const WebSocketService: any = (startStreamCallBack: {(): void}) => {
  const webSocket = useWebSocket(SOCKET_URL, {
    shouldReconnect: () => true, //auto reconnect on closed state
    reconnectInterval: 1000,
    onOpen: () => {
      startStreamCallBack();
    },
  });
  const {readyState} = webSocket;
  // @ts-ignore
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  useEffect(() => {
    console.log('ready state => ', connectionStatus);
  }, [connectionStatus]);

  return webSocket;
};

export default WebSocketService;
