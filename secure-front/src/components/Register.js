import React from 'react';
import {Button, Container, Modal} from "react-bootstrap";
import styled from 'styled-components'
import NodeRSA from 'node-rsa';
import { useHistory } from 'react-router-dom';
import config from '../config/config.json';

const Html = styled.html`
  height: 100vh;
`

const Body = styled.body`
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

function generateKeys() {
  const key = new NodeRSA({b: 512});
  const file = new Blob([key.exportKey('private')], {type: 'text/plain'});
  const element = document.createElement("a");
  element.href = URL.createObjectURL(file);
  element.download = "pri-key.pem";
  document.body.appendChild(element);
  element.click();
}

function KeyGenerateModal(props) {
  const history = useHistory();
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Successfully generated keys
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h3>Your keys are generated!</h3>
        <h2>Please download and keep the private key safe.</h2>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => history.push('/login')}>Login</Button>
        {/*<Button><a className="badge badge-info" href="/login">Login</a></Button>*/}
        {/*<a className="badge badge-info" href="/login">Login</a>*/}
      </Modal.Footer>
    </Modal>
  );
}

function Register() {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <Html>
      <head>
        <title>Chat - Register</title>
      </head>
      <Body>
        <Container style={{ "padding-top": "15%" }}>
          <div className="row justify-content-center">
            <DivBase className="col-5">
              <div className="row">
                <div className="col-6" style={{ "font-size": "1.5em" }}>
                  Register
                </div>
                <div className="col-6 text-right align-self-end">
                  <a class="badge badge-info" href="/login">Have key? Login</a>
                </div>
              </div>
              <div className="row" style={{ "padding-top": "30px" }}>
                {/* onClick={() => setModalShow(true)}*/}
                <button type="button" className="btn btn-primary btn-block btn-success" onClick={() => {
                  generateKeys();
                  setModalShow(true);
                }}>
                  Generate Keys
                </button>
              </div>
              <KeyGenerateModal
                show={modalShow}
                onHide={() => setModalShow(false)}
              />
            </DivBase>
          </div>
        </Container>
      </Body>
    </Html>

  );
}

export default Register;
