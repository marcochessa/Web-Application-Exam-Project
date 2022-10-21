
import { ToggleButtonGroup, ToggleButton, Card, Row, Col } from 'react-bootstrap';


function StudyPlanForm(props) {

    /*
    * The career type is set via buttons
    */
    const handlePartTime = (event) => {
        event.preventDefault();
        props.setCareer(1);
        props.setMode('edit');
    }

    const handleFullTime = (event) => {
        event.preventDefault();
        props.setCareer(2);
        props.setMode('edit');
    }


    return <>
        <Card style={{ width: '100%' }}>
            <Card.Body className='text-center'>
                <Card.Title>
                    <h2>
                        <strong>Personal StudyPlan</strong>
                    </h2>
                </Card.Title>
                <Row className='px-0 py-2 px-sm-5'>
                    <Col className='my-3'>
                        <h4>
                            No study plan available.
                        </h4>
                        <h4>
                            <b>
                                Create it now!
                            </b>
                        </h4>
                    </Col>
                    <Col>
                        <h4>
                            <b>New StudyPlan</b>
                        </h4>
                        <hr></hr>
                        <h5>
                            Select your studyplan type
                        </h5>
                        <ToggleButtonGroup type="checkbox" >
                            <ToggleButton variant="secondary" className='px-4' onClick={handlePartTime}>
                                Part-Time
                            </ToggleButton>
                            <ToggleButton variant="secondary" className='px-4' onClick={handleFullTime}>
                                Full-Time
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    </>
}


export default StudyPlanForm;