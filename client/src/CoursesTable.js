import { Container, Table } from 'react-bootstrap';
import { useEffect } from 'react';
import API from './API'
import CourseRow from './CourseRow'



function CoursesTable(props) {
    /*
    * The table of courses is updated with each change in the vector of them.
    */
    let setCourses = props.setCourses;
    useEffect(() => {
        async function load() {
            let list;
            list = await API.getCourses();
            setCourses(() => list);
        }
        load();
    }, [setCourses]);

    return <>
        <Container  className="myTable">
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Credit</th>
                        <th>Student</th>
                        <th>Max Student</th>
                    </tr>
                </thead>
                <tbody>
                    {/* map for all films in filteringFilms */}
                    {props.courses.map((course) => <CourseRow key={course.id} mode={props.mode} credit={props.credit} setCredit={props.setCredit} course={course} courses={props.courses} planCourses={props.planCourses} setPlanCourses={props.setPlanCourses}/>)}
                </tbody>

            </Table>
        </Container>
    </>;
}


export default CoursesTable;