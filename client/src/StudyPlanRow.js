import { useState, useEffect } from 'react';
import { Col, Row, Alert } from 'react-bootstrap';

function StudyPlanRow(props) {
    const [lock, setLock] = useState('');
    const [show, setShow] = useState(false);

    /*
    * The status of each row of studyplan is changed through the color of the text and other properties. 
    * The ability to remove a course from the study plan is also managed. All by an appropriate alert containing the reason why a particular course cannot be removed
    */
    useEffect(() => {
        let message = checkLock(props.course, props.planCourses);
        setLock(message);
        if (lock === '' || props.mode === 'view') {
            setShow(() => false);
        }
    }, [props.planCourses, props.course, props.mode, lock]);

    if (show) {
        return (
            <tr>
                <td colSpan="6" className="text-center">
                    <Alert variant="danger" onClose={() => setShow(false)} dismissible>
                        <p>{lock} </p>
                    </Alert>
                </td>
            </tr>
        );
    }

    return <>
        <CourseData lock={lock} course={props.course} setShow={setShow} credit={props.credit} setCredit={props.setCredit} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} mode={props.mode} courses={props.courses} setCourses={props.setCourses}></CourseData>
    </>
}

/*
* A given course is inserted into the table including related data
*/
function CourseData(props) {
    return <tr>
        <td>  {props.course.id} </td>
        <td> {props.course.name} </td>
        <td> {props.course.credit} </td>
        <td> {props.course.maxStudent === '' ? <>-</> : props.course.maxStudent} </td>
        <td> {props.course.preparatory === null ? <>-----</> : props.course.preparatory} </td>
        <td> <CourseAction lock={props.lock} setShow={props.setShow} credit={props.credit} setCredit={props.setCredit} course={props.course} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses} mode={props.mode} courses={props.courses} setCourses={props.setCourses}></CourseAction> </td>
    </tr>
}

/*
* By button it is possible to remove the course provided that the next course has been previously removed (if present in the plan)
*/
function CourseAction(props) {
    const handleDelete = (event) => {
        event.preventDefault();
        props.courses.filter((c) => c.id === props.course.id)[0].student--;
        props.setPlanCourses(() => props.planCourses.filter((course) => course.id !== props.course.id));
        props.setCredit(() => props.credit - props.course.credit)

    }

    return <>
        <Row>
            {props.mode === 'edit' && props.lock === '' &&
                <Col className='px-1'>
                    <svg onClick={handleDelete} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-clipboard-x" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                </Col>
            }
            {props.mode === 'edit' && props.lock !== '' &&
                <Col className='px-1'>
                    <svg onClick={() => props.setShow(true)} style={{ cursor: "pointer", color: "red" }} xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-clipboard-x" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z" />
                        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
                        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
                    </svg>
                </Col>
            }
        </Row>
    </>
}

/**
* Function that check if a course can be deleted from studyplan of a student
* 
* @param    {course, planCourses[]} 
* @return   {String}         Error message
*/
function checkLock(course, planCourses) {
    for (let planC of planCourses) {
        for (let succ of course.successive)
            if (succ === planC.id) {
                return 'Unprocessable - please delete first: ' + course.successive;
            }
    }
    return '';

}

export default StudyPlanRow;