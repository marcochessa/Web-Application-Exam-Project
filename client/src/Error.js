import { Container, Row, Col, Badge } from 'react-bootstrap';
import { ReactComponent as HalfLogo } from './halfLogo.svg';
import { ReactComponent as Logo } from './logo.svg';
import { useNavigate } from 'react-router-dom';

function Error() {
    const navigate = useNavigate();

    return <Container fluid className='myLogCol' style={{ height: "100vh", color: "white" }} >
        <Row className='pt-5 text-center'>
            <Col><h1><strong>Error - 404 Page not found</strong></h1></Col>
        </Row>
        <Row>
            <Col className='mt-5 text-center'>
                <Row>
                    <Col className='mt-5'>
                        <Logo className='App-logo m-1' />
                    </Col>
                </Row>
                <Row>
                    <Col className='my-3'>
                        <h2>
                            <Badge bg="light" text='dark' style={{ cursor: "pointer" }} onClick={() => navigate('/')}>
                                Go to HomePage
                            </Badge>
                        </h2>
                    </Col>
                </Row>
            </Col>
            <Col align='right' className='p-0'><HalfLogo style={{ opacity: "0.1", height: "35rem" }} /></Col>
        </Row>

    </Container>
}

export default Error;