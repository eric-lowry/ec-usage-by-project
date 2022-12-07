import NavBar from './NavBar';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

export default function Loading() {
  return (
    <>
      <NavBar />
      <Container>
        <Row className="mt-3">
          <h1>Billing by project</h1>
        </Row>
        <Row className="mt-5 pt-5">
          <h2>Loading usage breakdown...</h2>
        </Row>
      </Container>
    </>
  );
}
