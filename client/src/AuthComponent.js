import { useState } from 'react';
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from './API'
import { ReactComponent as Logo } from './logo.svg';
import { ReactComponent as HalfLogo } from './halfLogo.svg';

function LoginForm(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const [errMsg, setErrMsg] = useState('');

    /**
    * Using the function below, the login request is submitted and navigation to the homepage is performed
    */
    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await API.postLogin(username, password);
        if (response.error !== undefined) {
            setErrMsg(response.error)
            props.setUserLogged(() => '');
        } else {
            props.setUserLogged(() => response);
            props.setCareer(() => response.type);
            navigate('/');
        }
    };

    return (
        <Container fluid style={{ height: "100vh" }}>
            <Row style={{ height: "100vh" }}>
                <Col xs={12} md={5} className="m-1 mt-5">
                    <Row className='text-center pt-5'>
                        <h3>
                            Login to
                            <Logo className='App-logo mx-4' />
                        </h3>
                    </Row>
                    <Form onSubmit={handleSubmit} className=' p-0 p-sm-5'>
                        <Form.Group className="my-4" controlId='username'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} required={true} />
                        </Form.Group>

                        <Form.Group className="my-4" controlId='password'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} required={true} minLength={6} />
                        </Form.Group>
                        <Row className="d-flex mt-4 pb-4">
                            <Col>
                                <Button variant='danger' onClick={() => navigate('/')} style={{ width: "10rem" }}>Back to Home</Button>

                            </Col>
                            <Col className="d-flex justify-content-end">
                                <Button variant='primary' type="submit" style={{ width: "10rem" }}>Login</Button>
                            </Col>
                        </Row>
                        <Row className="d-flex m-0">
                            {errMsg && <Alert variant='danger'>{errMsg}</Alert>}
                        </Row>
                    </Form>
                </Col>
                <Col className='myLogCol p-0' align='right'>
                    <HalfLogo className='App-logo-bg' />
                </Col>
            </Row>

        </Container>
    )
};

export { LoginForm }