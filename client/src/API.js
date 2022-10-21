const PREFIX = 'http://localhost:3001/api';

function Course(id, name, credit, student = 0, maxStudent = null, preparatory = null, incompatible=null, successive=null) {
    this.id = id;
    this.name = name;
    this.credit = credit;
    this.student = student;
    this.maxStudent = maxStudent;
    this.preparatory = preparatory;
    this.incompatible = incompatible;
    this.successive = successive;
}

/**
* Function that allows a student to logout
* @param {username: email, password:String{min:6}}
* @return   {} 
*/
async function postLogin(username, password) {
    const url = PREFIX + '/login'
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            return await response.json();
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

/**
* Function that allows a student to logout
* @param {username, password}
* @return   {} 
*/
async function postLogout(username, password) {
    const url = PREFIX + '/logout'
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            return;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

/**
* Function that do a get of all courses provided for a university
* 
* @return  {courses[]} 
*/
async function getCourses() {
    const url = PREFIX + '/courses';
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (response.ok) {
            const list = await response.json();
            const courses = list.map((c) => new Course(c.ID, c.NAME, c.CREDIT, c.STUDENT, c.MAXSTUDENT, c.PREPARATORY, c.INCOMPATIBLE, c.SUCCESSIVE));
            return courses;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (ex) {
        throw ex;
    }
}

/**
* Function that do a post of study plan's courses for a student
* 
* @return   {} 
*/
async function postPlanCourses(planCourses, career) {
    const url = PREFIX + '/plan'
    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "planCourses": planCourses.map((c)=>c.id),
                "career": career
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

/**
* Function that do a modify of study plan's courses for a student
* 
* @return   {} 
*/
async function putPlanCourses(planCourses, career) {
    const url = PREFIX + '/plan'
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify({
                "planCourses": planCourses.map((c)=>c.id),
                "career": career
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}

/**
* Function that do a get of career id for a student
* 
* @return   {career_type_ID} 
*/
async function getCareer() {
    const url = PREFIX + '/career';
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (response.ok) {
            const types = await response.json();
            return types;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (ex) {
        throw ex;
    }
}

/**
* Function that do a get of the information about the different type of career
* 
* @return   {careers[]} 
*/
async function getCareers() {
    const url = PREFIX + '/careers';
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (response.ok) {
            const types = await response.json();
            return types;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (ex) {
        throw ex;
    }
}

/**
* Function that do a get of all study plan's courses for a student
* 
* @return   {courses[]} 
*/
async function getPlanCourses() {
    const url = PREFIX + '/plan';
    try {
        const response = await fetch(url, {
            credentials: 'include'
        });
        if (response.ok) {
            const list = await response.json();
            const courses = list.map((c) => new Course(c.ID, c.NAME, c.CREDIT, c.STUDENT, c.MAXSTUDENT, c.PREPARATORY, c.INCOMPATIBLE, c.SUCCESSIVE));
            return courses;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    }
    catch (ex) {
        throw ex;
    }
}

/**
* Function that do a delete of study plan for a student
* 
* @return   {} 
*/
async function deletePlanCourses() {
    const url = PREFIX + '/plan';
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (response.ok) {
            return true;
        }
        else {
            const text = await response.text();
            throw new TypeError(text);
        }
    } catch (ex) {
        throw ex;
    }
}


const API = { postLogin, postLogout, getCourses, getPlanCourses, postPlanCourses, putPlanCourses, getCareer, getCareers, deletePlanCourses};
export default API;
