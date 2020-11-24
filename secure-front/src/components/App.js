import React from 'react';
import styled from 'styled-components';
import io from "socket.io-client";
import NodeRSA from 'node-rsa';
import crypto from "crypto";
import config from '../config/config.json';


const Main = styled.div`
  display: flex;
  // justify-content: space-between;
`

const Left = styled.div`
  width: 79%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 10px;
  padding-right: 10px;
`

const Mid = styled.div`
  width: 2%;
  background: rgba(0, 0, 0, 0.36);;
`

const Right = styled.div`
  width: 19%;
  padding: 5px;

`

const MsgArea = styled.div`
  flex-grow: 1;
`

const MsgInput = styled.div`
  background: rgba(0, 0, 0, 0.36);;
  padding: 8px;
  height: 6vh;
  // display: flex;
  // align-items: flex-end;
  width: 100%;
`

const Ul = styled.ul`
  padding: 0;
  list-style-type: none;
  margin: 0;
`

const Li = styled.li`
  padding-top: 8px;
  padding-right: 8px;
  padding-left: 8px;
  &:nth-child(odd) {
    background: #eee;
  }
`

const Cli = styled.li`
  display: flex;
  justify-content: space-between;
  &:nth-child(odd) {
    background: #eee;
  }
`

const FindUserInput = styled.div`
  margin-top: 20px;
  display: flex;
  width: 100%;
`

class App extends React.Component {

  constructor(props){
    super(props);

    this.key = new NodeRSA(sessionStorage.getItem('priKey'));
    this.pubKey= this.key.exportKey('public')
    this.nickName = sessionStorage.getItem('nickName');
    const hash = crypto.createHash('sha256');
    hash.update(this.pubKey);
    this.id = hash.digest('hex');

    const unreadMessages = JSON.parse(sessionStorage.getItem('channels'));
    Object.keys(unreadMessages).forEach((key) => {
      unreadMessages[key].msg = unreadMessages[key].msg.map((m) => (
        {
          msg: this.key.decrypt(m.msg, 'utf8'),
          direction: m.direction,
        }
      ))
    });

    this.state = {
      channels: {
        ...unreadMessages,
        defaultID: {
          nickName: '',
          unread: 0, //number of unread messages
          pubKey: '',
          msg: [],
        },
      },
      currentOpponentID: 'defaultID',
      msgInput: '',
      idInput: '',
    };

    const endpoint = `http://${config.apiConfig.host}:${config.apiConfig.port}/chat`;
    this.socket = io(endpoint);

    // socket event handlers
    this.socket.on('msg', (data) => {
      const { msg, fromID } = data;
      const text = this.key.decrypt(msg, 'utf8');
      const channels = this.state.channels;

      channels[fromID].msg.push({
        direction: 0, // 1 for send; 0 for receive
        msg: text,
      });

      if (this.state.currentOpponentID !== fromID) {
        channels[fromID].unread +=1;
      }

      this.setState({
        channels,
      });
    });

    this.socket.on('buildSuccess', (data) => {
      const { pubKey, nickName, id } = data;
      const channels = this.state.channels;
      channels[id] = {
        nickName,
        unread: 0, //number of unread messages
        pubKey,
        msg: [],
      };

      this.setState({ currentOpponentID: id, channels });
    });

    this.socket.on('newCon', (data) => {
      const { pubKey, nickName, id } = data;
      const channels = this.state.channels;
      channels[id] = {
        nickName,
        unread: 0, //number of unread messages
        pubKey,
        msg: [],
      };
      this.setState({ channels });
    });

    this.socket.on('fail', () => {
      console.log('Opponent not exist or offline');
    });

    this.socket.on('disconnect', () => {
      console.log('disconnected!');
    });
  }

  // run only once
  componentDidMount() {
    this.socket.emit('init', { id: this.id, pubKey: this.pubKey, nickName: this.nickName })
  }

  connect() {
    const id = this.state.idInput;
    this.setState({
      idInput: '',
    });
    // function of build event of socket could be placed here
    this.socket.emit('build', { fromID: this.id, toID: id })
    return false;
  }

  switch(e) {
    const id = e.target.value;
    const channels = this.state.channels;
    channels[id].unread = 0;
    this.setState({ currentOpponentID: id, channels });
    return false;
  }

  send() {
    const text = this.state.msgInput;
    const channels = this.state.channels;
    const toID = this.state.currentOpponentID;

    channels[toID].msg.push({
      direction: 1, // 1 for send; 0 for receive
      msg: text,
    });

    this.setState({
      channels,
      msgInput: '',
    });

    const msg = crypto.publicEncrypt(channels[toID].pubKey, Buffer.from(text, 'utf8')).toString('base64');
    // console.log('Send encrypted msg:',msg);
    this.socket.emit('msg', { fromID: this.id, toID, msg })

    // console.dir(this.state.channels);
    return false;
  }

  logOff() {
    this.socket.emit('logOff', { id: this.id });
    sessionStorage.clear();
    this.props.history.push('/login');
    return false;
  }

  msgInputChange(e) {
    this.setState({
      msgInput: e.target.value
    })
  }

  idInputChange(e) {
    this.setState({
      idInput: e.target.value
    })
  }

  handleKeyPress(e) {
    if(e.key === 'Enter') {
      this.send();
    }
  }

  render() {
    return (
      <Main>
        <Left>
          <h3>{this.state.channels[this.state.currentOpponentID].nickName}</h3>
          <MsgArea>
            <Ul>
              {this.state.channels[this.state.currentOpponentID].msg.map((msg, index) => {
                if (msg.direction === 1) {
                  return <Li style={{textAlign: 'right'}} key={index}><span>{msg.msg}</span></Li>
                }
                return <Li key={index}><span>{msg.msg}</span></Li>
              })}
            </Ul>
          </MsgArea>
          <MsgInput className="input-group mb-3">
            <input type="text" id="text" className="form-control"
                   value={this.state.msgInput}
                   onChange={this.msgInputChange.bind(this)}
                   onKeyPress={this.handleKeyPress.bind(this)}
            />
              <div className="input-group-append">
                <button className="btn btn-success" type="button" id="button-addon2"
                        onClick={() => this.send()}
                >Send</button>
              </div>
          </MsgInput>
        </Left>
        <Mid></Mid>
        <Right>
          <Ul>
            {Object.keys(this.state.channels).map((key, index) => {
              if (key !== 'defaultID') {
                return (<Cli key={index}>
                  <span>{this.state.channels[key].nickName}: {this.state.channels[key].unread} unread messages</span>
                  <button className="btn btn-primary" type="button" value={key} onClick={this.switch.bind(this)}>Chat</button>
                </Cli>)
              } else {
                return;
              }
            })}
          </Ul>
          <FindUserInput className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">ID</span>
            </div>
            <input type="text" id="userID" className="form-control"
               value={this.state.idInput}
               onChange={this.idInputChange.bind(this)}
            />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={() => this.connect()}>Chat</button>
            </div>
          </FindUserInput>
          <div>
            <span>Your ID:</span>
          </div>
          <div>
            <span>{this.id}</span>
          </div>
          <button className="btn btn-danger btn-block" type="button" style={{marginTop: '10px'}} onClick={() => this.logOff()}>Log Off</button>
        </Right>
      </Main>
    );
  }
}

export default App;
