import { Container, Table, Button, Row, Col, Alert, Badge, Modal } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import API from './API'

import StudyPlanRow from './StudyPlanRow'

function StudyPlanTable(props) {

    const [minCredit, setMinCredit] = useState('');
    const [maxCredit, setMaxCredit] = useState('');
    const [lockMess, setlockMessage] = useState('');
    const [show, setShow] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [err, setErr] = useState('');

    /*
    * The table containing the courses in one's study plan is rendered. 
    * Also the maximum and minimum credits are set by taking it from the student's career.
    */
    let setCredit = props.setCredit;
    let setPlanCourses = props.setPlanCourses;
    useEffect(() => {
        async function load() {
            let list = await API.getPlanCourses();
            setCredit(countCredit(list));
            setPlanCourses(() => list);
            let planType = await API.getCareers();
            let minCredit = planType[props.career - 1].MINCREDIT;
            let maxCredit = planType[props.career - 1].MAXCREDIT;
            setMinCredit(minCredit);
            setMaxCredit(maxCredit);
        }
        load();
    }, [setPlanCourses, setCredit, props.career]);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    /*
    * Changes made to the existing plan of study are cancelled or the career is reset to null in case of no existing plan previously
    */
    const handleCancel = async (event) => {
        event.preventDefault();
        let list = await API.getPlanCourses();
        props.setCredit(countCredit(list));
        props.setPlanCourses(() => list);
        list = await API.getCourses();
        props.setCourses(() => list);
        props.setMode('view');
        props.setCareer(props.userLogged.type);
        setShow(false);
    }

    /*
    * New study plan or changes to a previously existing study plan is saved
    */
    const handleSave = async (event) => {
        event.preventDefault();
        if (props.credit > maxCredit) {
            setlockMessage('Too many exams for this studyplan');
            setShow(true);
        } else if (props.credit < minCredit) {
            setlockMessage('Not enough exams for this studyplan');
            setShow(true);
        } else {
            let err = false;
            let mode = 'view';
            try {
                if (props.userLogged.type === null)
                    await API.postPlanCourses(props.planCourses, props.career);
                else
                    await API.putPlanCourses(props.planCourses, props.career);
            } catch (e) {
                setlockMessage('Server Error');
                setErr(e);
                err = true;
                mode = 'edit';
            }
            let list = await API.getCourses();
            let career = await API.getCareer();
            props.userLogged.type = career.TYPE;
            props.setCourses(() => list);
            props.setMode(mode);
            setShow(err);
        }
    }

    /*
    * The entire curriculum is deleted after user confirmation
    */
    const handleDeleteAll = async (event) => {
        event.preventDefault();
        let err = false;
        let mode = 'view';
        try {
            await API.deletePlanCourses();
        } catch (e) {
            setlockMessage('Server Error');
            err = true;
            mode = 'edit';
        }
        props.setCredit(0);
        props.setPlanCourses([]);
        let list = await API.getCourses();
        let career = await API.getCareer();
        props.userLogged.type = career.TYPE;
        props.setCareer(null);
        props.setCourses(() => list);
        props.setMode(mode);
        setShow(err);
    }

    return <>
        <Container className="myPlanTable">
            <Row className="d-flex">
                <Col className='mt-2'>
                    {props.mode === 'edit' ?
                        <h4> <Badge bg="secondary">MIN: {minCredit}</Badge> <Badge bg="secondary">MAX: {maxCredit}</Badge></h4>
                        :
                        <h4> <Badge bg="dark">{props.career === 1 ? 'PART-TIME' : 'FULL-TIME'}</Badge> </h4>
                    }
                </Col>
                <Col className='mx-auto mt-2 d-flex justify-content-center'>
                    <h4><Badge bg="dark">CFU: {props.credit}</Badge></h4>
                </Col>

                {props.mode === 'view' ?
                    <Col className="d-flex justify-content-end">
                        <Button onClick={() => props.setMode('edit')} className='px-4 m-2' variant="primary">Edit</Button>
                    </Col>
                    :
                    <Col className="d-flex justify-content-end">
                        {props.userLogged.type !== null &&
                            <Button onClick={handleShow} className='px-4 m-2' variant="danger">Delete All</Button>
                        }

                        <Button onClick={handleCancel} className='px-4 m-2' variant="primary">Cancel</Button>

                        <Button onClick={handleSave} className='px-4 m-2' variant="success">Save</Button>

                        <Modal
                            show={showModal}
                            onHide={handleClose}
                            backdrop="static"
                            keyboard={false}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Delete StudyPlan</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to definitely delete your study plan?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="danger" onClick={handleDeleteAll}>Delete All</Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                }
            </Row>
            {show &&
                <Row className="d-flex text-center">
                    {lockMess === 'Server Error' ?
                        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                            <h3> {lockMess} </h3>
                            <h4> {err.message !== '' ? JSON.parse(err.message).err : "please check your study plan request"}</h4>
                        </Alert>
                        :
                        (props.credit >= minCredit && props.credit <= maxCredit) ? setShow(false) :
                            <Alert variant="primary" onClose={() => setShow(false)} dismissible>
                                <p> {lockMess} </p>
                            </Alert>
                    }
                </Row>
            }
            <Table responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Credit</th>
                        <th>Max Student</th>
                        <th>Preparatory</th>
                    </tr>
                </thead>
                <tbody>
                    {/* map for all films in filteringFilms */}
                    {props.planCourses.map((course) => <StudyPlanRow key={course.id} mode={props.mode} credit={props.credit} setCredit={props.setCredit} course={course} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} courses={props.courses} setCourses={props.setCourses} />)}
                </tbody>

            </Table>
        </Container>
    </>
}

/*
* The current number of credits is set
*/
function countCredit(list) {
    let credit = 0;
    for (let element of list) {
        credit = credit + element.credit;
    }
    return credit;
}

export default StudyPlanTable;