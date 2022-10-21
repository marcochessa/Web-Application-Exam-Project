import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginForm } from './AuthComponent';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import { Navbar, Nav, Container, Row, Col, Dropdown, Badge } from 'react-bootstrap';

import StudyPlanForm from './StudyPlanForm'
import StudyPlanTable from './StudyPlanTable'
import CoursesTable from './CoursesTable'
import Error from './Error'
import { ReactComponent as Logo } from './logo.svg';
import API from './API'

function App() {
  /* if user is logged the state contains his name, '' otherwise */
  const [userLogged, setUserLogged] = useState('');

  const [courses, setCourses] = useState([]);
  const [career, setCareer] = useState('');
  const [mode, setMode] = useState('view');
  const [planCourses, setPlanCourses] = useState([]);
  const [credit, setCredit] = useState(0);

  /**
  * During Logout, all components are reinitialized, including the statuses of: mode, students logged in. 
  * The number of credits and the course vector are also reset.
  */
  const handleLogout = async (event) => {
    event.preventDefault();
    await API.postLogout();
    setUserLogged(() => '');
    setMode(() => 'view');
    setCredit(() => 0);
    setPlanCourses(() => []);
    setCareer(() => '');
  }

  return (

    <BrowserRouter>
      <Routes>

        <Route path='/' element={
          <>
            <HomeLayout credit={credit} setCredit={setCredit} mode={mode} setMode={setMode} career={career} setCareer={setCareer} planCourses={planCourses} setPlanCourses={setPlanCourses} courses={courses} setCourses={setCourses} userLogged={userLogged} handleLogout={handleLogout} />
          </>
        }>
        </Route>
        
        <Route path='/login' element={ userLogged !=='' ? <Navigate to="/" replace={true}/> :
          <LoginForm setUserLogged={setUserLogged} setCareer={setCareer}></LoginForm>
        }>
        </Route>

        <Route path='*' element={
          <Error />
        } />

      </Routes>
    </BrowserRouter >
  );
}

/**
 * prepare page layout 
 * @param {*} props 
 * @returns AppLayout 
 */
function HomeLayout(props) {

  return <>

    {props.userLogged !== '' ?
      <NavigationBar userLogged={props.userLogged} handleLogout={props.handleLogout} />
      :
      <NavigationBarLO />
    }
    <Container fluid>
      <Row className="mx-0 mx-sm-5 mt-3 mb-3">
        <h4>Courses provided</h4>
        <CoursesTable mode={props.mode} credit={props.credit} setCredit={props.setCredit} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} courses={props.courses} setCourses={props.setCourses}></CoursesTable>
      </Row>

      {props.userLogged !== '' ?
        <Row className="mx-0 mx-sm-5 mt-2 mb-5">
          {props.career === null ?
            <StudyPlanForm career={props.career} setMode={props.setMode} setCareer={props.setCareer} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses}></StudyPlanForm>
            :
            <StudyPlanTable mode={props.mode} setMode={props.setMode} credit={props.credit} setCredit={props.setCredit} career={props.career} setCareer={props.setCareer} userLogged={props.userLogged} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} courses={props.courses} setCourses={props.setCourses}></StudyPlanTable>
          }
        </Row>
        :
        <Row className="m-5 text-center">
          <Col className="m-3">

            <Logo className='App-logo-nav' />
            <hr></hr>
            <h4>To create and modify a study plan please <Badge bg="light" text="dark" as={Link} to="/login">Login</Badge> </h4>
          </Col>
        </Row>
      }
    </Container>
  </>
}


/**
 * NavBar: contain site-logo, site-name, user-icon, button for logout 
 * @param {*} props 
 * @returns NavigationBar
 */
function NavigationBar(props) {
  return <>
    <Navbar variant="dark" expand='md' sticky="top" className='navbar-padding py-0 py-sm-4 myNavbar'>
      <Navbar.Text className='mx-3' style={{ fontSize: "1.3rem" }}>
        Welcome {props.userLogged.name + " " + props.userLogged.surname}
      </Navbar.Text>

      {/* site logo and name */}
      <Navbar.Brand as={Link} to='/' className="mx-auto">
        <Logo className='App-logo-nav' style={{ marginRight: "7rem" }} />
      </Navbar.Brand>
      <Dropdown>
        <Dropdown.Toggle className='bg-transparent mx-1' id="dropdown-basic" variant='dark' style={{ border: 0, fontSize: "1.2rem", }}>
          {props.userLogged.id}
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="mb-2 mx-2 bi bi-person-square" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
          </svg>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={props.handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-door-open mx-2 mb-1" viewBox="0 0 16 16">
              <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1z" />
              <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117zM11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5zM4 1.934V15h6V1.077l-6 .857z" />
            </svg>
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  </>
}

/**
 * NavBar: contain site-logo, site-name, user-icon, button for logout 
 * @param {*} props 
 * @returns NavigationBarLO
 */
function NavigationBarLO() {
  return <>
    <Navbar variant="dark" expand='md' sticky="top" className='navbar-padding py-0 py-sm-4 myNavbar'>
      {/* site logo and name */}
      <Navbar.Brand as={Link} to='/' className="mx-2" >
        <span className='mx-2'>
          <Logo className='App-logo-nav' />
        </span>

      </Navbar.Brand>

      <Navbar.Text className='mx-auto' style={{ fontSize: "1.3rem" }}>
        The essential application for your studies
      </Navbar.Text>

      <Nav className="mx-2">
        <Nav.Link as={Link} to='/login' style={{ fontSize: "1.4rem", color: "white", marginLeft: "7rem" }}>

          Login
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="currentColor" className="mb-1 mx-2 bi bi-person-square" viewBox="0 0 16 16">
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12z" />
          </svg>

        </Nav.Link>
      </Nav>
    </Navbar>
  </>
}


export default App;
