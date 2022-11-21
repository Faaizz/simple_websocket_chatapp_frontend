import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

import { useEffect, useState } from 'react'
let ws

export const isBrowser = typeof window !== "undefined"

const Home = () => {
  const [wsInstance, setWsInstance] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [online, setOnline] = useState([])
  const [username, setUsername] = useState("")
  const [usernameSet, setUsernameSet] = useState(false)
  const [targetUsername, setTargetUsername] = useState("")
  const [message, setMessage] = useState("")

  const checkOnline = () => {
    console.log("checking online users...")
    ws.send(JSON.stringify({
      'action': 'online',
    }))
  }

  const sendMessage = () => {
    console.log("sending message: ", message)
    ws.send(JSON.stringify({
      'action': 'message',
      'username': targetUsername,
      'message': message,
    }))
  }

  const updateMessage = (msg) => {
    setMsgs( msgs => [...msgs, msg] )
  }

  const onChangeHandlerUsername = (e) => {
    setUsername(e.target.value)
  }

  const onClickHandlerOnline = () => {
    checkOnline()
  }

  const onClickHandlerUsername = () => {
    console.log("setting username: ", username)
    ws.send(JSON.stringify({
      'action': 'username',
      'username': username,
    }))
    setUsernameSet(true)
  }

  const onChangeHandlerTarget = (e) => {
    setTargetUsername(e.target.value)
  }

  const onChangeHandlerMessage = (e) => {
    setMessage(e.target.value)
  }

  const onClickHandlerMessage = () => {
    sendMessage()
  }
  
  // setup websocket connection
  useEffect(() => {
    if(isBrowser) { 
      ws = new WebSocket('wss://wgqv74nka0.execute-api.eu-central-1.amazonaws.com/production')
      setWsInstance(ws)
      console.log(ws)

      ws.addEventListener('open', (event) => {
        console.log("connection opened")
        setWsConnected(true)
       })

      ws.addEventListener('message', (event) => {
        console.log("message received", event)
        const msgStr = event.data
        const msgStrs = msgStr.split(" ")
        
        // check if message
        if (msgStrs[0] == ":") {
          // online list
          console.log("online update: ", msgStrs[1])
          const msgData = JSON.parse(msgStrs[1])
          setOnline( msgData.map( ele => ele["username"]) )
        } else {
          // message
          updateMessage(msgStr)
        }
       })
    }
  
    return () => {
      // Cleanup on unmount if ws wasn't closed already
      if(ws?.readyState !== 3) { 
        ws.close()
      }
    }
  }, [])

  return (
  <>
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">Simple WebSocket Chat App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Container className='mt-5'>
      <Row>
        {wsConnected ? 
          <Col xs={3}><Badge bg="success">Connected</Badge>{' '}</Col>
        : <Col xs={3}><Badge bg="danger">Disconnected</Badge>{' '}</Col>
        }
      </Row>
      <Row className='mt-3'>
        <Col xs={12}><h3>Username</h3></Col>
        <Col xs={3}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control 
            type="text" placeholder="Enter username" value={username}
            onChange={onChangeHandlerUsername}
          />
        </Form.Group>
        </Col>
        <Col xs={3}>
          <Button variant="primary" onClick={onClickHandlerUsername}>Submit</Button>
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col xs={3}><h3>Online</h3></Col>
        <Col xs={3}>
          <Button disabled={!usernameSet} variant="primary" onClick={onClickHandlerOnline}>Update</Button>
        </Col>
      </Row>
      <Row className='mt-3'>
        <Col xs={6}>
          <ListGroup>
            {online.map((element, idx) => { return <ListGroup.Item key={idx}>{element}</ListGroup.Item> })}
          </ListGroup>
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col xs={12}><h3>Send Message</h3></Col>
        <Col xs={3}>
          <Form.Select onChange={onChangeHandlerTarget}>
            {online.map((element, idx) => { return <option key={idx} value={element}>{element}</option> })}
          </Form.Select>
        </Col>
        <Col xs={3}>
        <Form.Group className="mb-3">
          <Form.Control 
            type="text" placeholder="Message" value={message}
            onChange={onChangeHandlerMessage}
          />
        </Form.Group>
        </Col>
        <Col xs={3}>
            <Button disabled={(targetUsername == "")} variant="primary" onClick={onClickHandlerMessage}>Send</Button>
        </Col>
      </Row>
      <Row className='mt-5'>
        <Col xs={3}><h3>Messages</h3></Col>
      </Row>
      <Row>
        <Col xs={6}>
        <ListGroup>
          {msgs.map((element, idx) => { return <ListGroup.Item key={idx}>{element}</ListGroup.Item> })}
        </ListGroup>
        </Col>
      </Row>
    </Container>
  </>
  )
}

export default Home
