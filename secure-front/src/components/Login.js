import React from 'react';
import { Container } from "react-bootstrap";
import styled from 'styled-components';
import axios from 'axios';
import NodeRSA from 'node-rsa';
import crypto from 'crypto';
import config from '../config/config.json';

const TextArea = styled.textarea`
  font-size: 0.8em;
`

const Main = styled.div`
  height: 100vh;
  justify-content: center;
  background-color: rgba(236, 236, 236, 0.92);
`

const DivBase = styled.div`
  background-color: white;
  padding-top: 60px;
  padding-bottom: 60px;
  padding-left: 50px;
  padding-right: 50px;
`

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keyInput: '',
      nameInput: '',
    };
  }

  nameInputChange(e) {
    this.setState({
      nameInput: e.target.value
    })
  }

  keyInputChange(e) {
    this.setState({
      keyInput: e.target.value
    })
  }

  async handleKeyPress(e) {
    if(e.key === 'Enter') {
      await this.login();
    }
  }

  async login() {
    const nickName = this.state.nameInput;
    const priKey = this.state.keyInput;

    console.log('nickName:', nickName);
    console.log(`http://${config.apiConfig.host}:${config.apiConfig.port}/code`);

    const res = await axios.get(`http://${config.apiConfig.host}:${config.apiConfig.port}/code`)
    const code = res.data.data.code;

    console.log('code:', code);

    const sign = crypto.createSign('RSA-SHA256');
    sign.update(code);
    sign.end();
    const signature = sign.sign(priKey).toString('hex');

    this.key = new NodeRSA(priKey);
    const pubKey= this.key.exportKey('public')

    const { data } = await axios.post(`http://${config.apiConfig.host}:${config.apiConfig.port}/auth`, { pubKey, nickName, code, signature })

    const message = data.message;
    if (message === 'Success') {
      sessionStorage.setItem('priKey', priKey);
      sessionStorage.setItem('nickName', nickName);
      sessionStorage.setItem('channels', JSON.stringify(data.data.channels));
      this.props.history.push('/chat');
    } else {
      this.props.history.push('/login');
      //  todo error msg
    }
  }

  render() {
    return (
      <Main>
        <Container style={{ paddingTop: '15%' }}>
          <div className="row justify-content-center">
            <DivBase className="col-5">
              {/*todo change layout*/}
              <div className="row">
                <div className="col-6" style={{ fontSize: "1.5em" }}>
                  Login
                </div>
                <div className="col-6 text-right align-self-end">
                  <a className="badge badge-info" href="/register">New? Register</a>
                </div>
              </div>
              <div className="row" style={{ paddingTop: '10px' }}>
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Private Key</span>
                  </div>
                  <TextArea id="priKey" className="form-control" rows="8"
                    // value={this.state.keyInput}
                    onChange={this.keyInputChange.bind(this)}
                    onKeyPress={this.handleKeyPress.bind(this)}
                  />
                </div>
              </div>
              <div className="row" style={{ paddingTop: '10px' }}>
                <div className="input-group mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text">Nickname</span>
                  </div>
                  <input id="name" type="text" className="form-control"
                     onChange={this.nameInputChange.bind(this)}
                     onKeyPress={this.handleKeyPress.bind(this)}
                  />
                </div>
              </div>
              <div className="row" style={{ paddingTop: '10px' }}>
                <button type="button" className="btn btn-success btn-block" onClick={this.login.bind(this)}>Enter</button>
              </div>
            </DivBase>
          </div>
        </Container>
      </Main>
    );
  }
}

export default Login;
