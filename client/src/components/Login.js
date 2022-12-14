import { useRef } from 'react';
import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Login({ onLogin, loginError }) {
  const userRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = ev => {
    ev.preventDefault();
    onLogin(userRef.current.value, passwordRef.current.value);
  };

  return (
    <>
      <NavBar />
      <Container>
        <Row className="mt-5">
          <Col className=""></Col>
          <Col>
            <div className="mt-5 p-3 rounded-3 border shadow-sm">
              <h4>Login</h4>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mt-4">
                  <Form.Label>User</Form.Label>
                  <Form.Control
                    type="text"
                    name="user"
                    required
                    ref={userRef}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    required
                    ref={passwordRef}
                  />
                </Form.Group>
                <div className="mt-3 d-flex flex-row-reverse">
                  <Button type="submit">Login</Button>{' '}
                  <span className="text-danger me-3 mt-2">{loginError}</span>
                </div>
              </Form>
            </div>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col />
          <Col>
            <div className='mt-4'>
              <strong>Notice:</strong> This usage report is not a supported Elastic product. If
              you need help, please contact your Elastic Cloud administrator.
            </div>
          </Col>
          <Col />
        </Row>
      </Container>
    </>
  );
}
