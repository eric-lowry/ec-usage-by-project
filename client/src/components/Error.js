import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function Error({ message, error }) {
  if (error) console.error(error);
  return (
    <>
      <NavBar />
      <Container>
        <Row className="mt-3">
          <h1>Error</h1>
        </Row>
        <Row className="mt-5 pt-5">
          <h2>{message}</h2>
        </Row>
      </Container>
    </>
  );
}
