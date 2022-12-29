# Simple Websocket Chat App- Frontend

## Bugs
- [ ] "Send" button does not activate until more than one other user is online

## Deployment (Docker)
### Build
```shell
docker build --build-arg WEBSOCKET_URL="wss://api.faaizz.com/example-ws" -t simple_websocket_chatapp_frontend .
```
### Launch
```shell
docker run -ti --rm -p "3000:3000" simple_websocket_chatapp_frontend
```

## References
- [https://blog.logrocket.com/implementing-websocket-communication-next-js/](https://blog.logrocket.com/implementing-websocket-communication-next-js/)
- [https://stackoverflow.com/questions/68263036/using-websockets-with-next-js](https://stackoverflow.com/questions/68263036/using-websockets-with-next-js)
