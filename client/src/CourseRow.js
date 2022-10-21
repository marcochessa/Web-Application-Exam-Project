import { useState, useEffect } from 'react';
import { Collapse, Col, Row, Alert } from 'react-bootstrap';

function CourseRow(props) {
    const [open, setOpen] = useState(false);
    const [added, setAdded] = useState(false);
    const [show, setShow] = useState(false);
    const [lock, setLock] = useState('');

    /*
    * The status of each course is changed through the color of the text and background. 
    * Also set is the ability to display an error alert with the reason why you can no longer include a particular course in your study plan.
    */
    useEffect(() => {
        let problem = checkCompatibility(props.course, props.planCourses, added);
        setLock(problem);
        if (lock === '' || props.mode === 'view') {
            setShow(false);
        }
        let inserted = checkInsert(props.course, props.planCourses);
        setAdded(inserted);
    }, [props.planCourses, props.course, props.mode, lock, added]);

    if (show) {
        return (
            <tr>
                <td colSpan="6" className="text-center">
                    <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                        <p> {lock} </p>
                    </Alert>
                </td>
            </tr>
        );
    }

    return <>
        <tr style={{
            backgroundColor: lock !== '' && props.mode === 'edit' && props.studentLogged !== '' && !added ? "rgba(255, 0, 0, 0.1)" : "",
            color: props.mode === 'edit' && added && props.studentLogged !== '' ? "#12a700" : ""
        }}>
            <CourseData setShow={setShow} added={added} lock={lock} mode={props.mode} credit={props.credit} setCredit={props.setCredit} course={props.course} courses={props.courses} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} open={open} setOpen={setOpen} ></CourseData>
        </tr>
        <Collapse in={open}>
            <tr style={{
                backgroundColor: "#efefef"
            }}>
                <td colSpan="6">
                    <Row>
                        <Col>
                            <Row>
                                <Col xs={12} md={3}><strong>Incompatible</strong></Col>
                                <Col>
                                    {props.course.incompatible.length === 0 ?
                                        <Row><Col>-----</Col></Row>
                                        :
                                        props.course.incompatible.map((el) => <Row key={el}><Col>{el} - {props.courses.filter((e) => e.id === el).map((e) => e.name)[0]}</Col></Row>)
                                    }
                                </Col>
                            </Row>
                        </Col>
                        <Col>
                            <Row>
                                <Col xs={12} md={3}><strong> Preparatory</strong></Col>
                                <Col> {props.course.preparatory === null ? <>-----</> : props.course.preparatory + " - " + props.courses.filter((e) => e.id === props.course.preparatory).map((e) => e.name)[0]}</Col>
                            </Row>
                        </Col>
                    </Row>
                </td>
            </tr>
        </Collapse>
    </>
}

/*
* A given course is inserted into the table including related data
*/
function CourseData(props) {
    return <>
        <td>  {props.course.id} </td>
        <td> {props.course.name} </td>
        <td> {props.course.credit} </td>
        <td> {props.course.student}{props.course.student === props.course.maxStudent && props.mode === 'edit' &&
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-exclamation-diamond mb-1 mx-1" viewBox="0 0 16 16">
                <path d="M6.95.435c.58-.58 1.52-.58 2.1 0l6.515 6.516c.58.58.58 1.519 0 2.098L9.05 15.565c-.58.58-1.519.58-2.098 0L.435 9.05a1.482 1.482 0 0 1 0-2.098L6.95.435zm1.4.7a.495.495 0 0 0-.7 0L1.134 7.65a.495.495 0 0 0 0 .7l6.516 6.516a.495.495 0 0 0 .7 0l6.516-6.516a.495.495 0 0 0 0-.7L8.35 1.134z" />
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z" />
            </svg>} </td>
        <td> {props.course.maxStudent === null ? <>-</> : props.course.maxStudent} </td>
        <td> <CourseAction setShow={props.setShow} added={props.added} lock={props.lock} credit={props.credit} setCredit={props.setCredit} course={props.course} courses={props.courses} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} mode={props.mode} open={props.open} setOpen={props.setOpen}></CourseAction> </td>
    </>
}

/*
*Using the same button, you can both add and remove a course from your study plan
*/
function CourseAction(props) {
    const handleAdd = (event) => {
        event.preventDefault();
        props.courses.filter((c) => c.id === props.course.id)[0].student++;
        props.setPlanCourses(() => [...props.planCourses, props.course]);
        props.setCredit(() => props.credit + props.course.credit)
    }

    const handleRemove = (event) => {
        event.preventDefault();
        props.courses.filter((c) => c.id === props.course.id)[0].student--;
        props.setPlanCourses(() => props.planCourses.filter((course) => course.id !== props.course.id));
        props.setCredit(() => props.credit - props.course.credit)
    }



    return <>
        <Row>
            <Col className='px-1'>
                <svg onClick={() => props.setOpen(!props.open)} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
            </Col>
            {props.mode === 'edit' && props.added === false && props.lock === '' &&
                <Col className='px-1'>
                    <svg onClick={handleAdd} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-clipboard-plus" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                </Col>
            }
            {props.lock !== '' && props.lock !== 'Unprocessable - this course not have slots available' ?
                props.mode === 'edit' && props.added === true &&
                <Col className='px-1'>
                    <svg onClick={() => props.setShow(true)} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="red" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                </Col>
                :
                props.mode === 'edit' && props.added === true &&
                <Col className='px-1'>
                    <svg onClick={handleRemove} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                </Col>
            }
            {props.mode === 'edit' && props.added === false && props.lock !== '' &&
                <Col className='px-1'>
                    <svg onClick={() => props.setShow(true)} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-clipboard-x-fill" viewBox="0 0 16 16">
                        <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm4 7.793 1.146-1.147a.5.5 0 1 1 .708.708L8.707 10l1.147 1.146a.5.5 0 0 1-.708.708L8 10.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 10 6.146 8.854a.5.5 0 1 1 .708-.708L8 9.293Z" />
                    </svg>
                </Col>
            }

        </Row>
    </>
}

/**
* Function that check if a course can be added in a studyplan of a student
* 
* @param    {course, planCourses[], added} 
* @return   {String}         Error message
*/
function checkCompatibility(course, planCourses, added) {
    let followPrep = 0;
    if (course.preparatory === null) {
        followPrep = 1;
    }
    if (planCourses.length !== 0) {
        for (let planC of planCourses) {
            for (let inc of course.incompatible) {
                if (inc === planC.id) {
                    return 'Unprocessable - this course is incompatible with: ' + inc;
                }
            }
            if (added === true)
                for (let succ of course.successive)
                    if (succ === planC.id) {
                        return 'Unprocessable - please delete first: ' + course.successive;
                    }
            if (course.preparatory === planC.id) {
                followPrep = 1;
            }
        }
    }
    if (course.maxStudent !== null) {
        if (course.student >= course.maxStudent)
            return 'Unprocessable - this course not have slots available';
    }
    if (followPrep === 0) {
        return 'Unprocessable - please insert this university course first: ' + course.preparatory;
    } else {
        return '';
    }
}

/**
* Function that check if a course has already been added in a studyplan of a student
* 
* @param    {course, planCourses[]} 
* @return   {boolean}  
*/
function checkInsert(course, planCourses) {
    for (let planC of planCourses) {
        if (course.id === planC.id) {
            return true;
        }
    }
    return false;

}

export default CourseRow;