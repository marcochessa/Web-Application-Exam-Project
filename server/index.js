'use strict';

const express = require('express');

const cors = require('cors');

const universityDAO = require('./universityDAO');

// init express
const app = new express();
const port = 3001;


app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
}

app.use(cors(corsOptions));

const passport = require('passport');

const LocalStrategy = require('passport-local');

const crypto = require('crypto');

const session = require('express-session');

app.use(session({
  secret: 'secretofstudyplan',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.authenticate('session'));


passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  return cb(null, user);
});

passport.use(new LocalStrategy(
  function verify(email, password, callback) {
    universityDAO.getStudent(email, password)
      .then((student) => {
        if (student) {
          return callback(null, student);
        }
        return callback(false, { error: 'Username or password incorrect' });
      })
      .catch()
  }
));

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(400).json({ message: "Not authenticated" });
}

/**
* Function that allows a student to login
* 
* @return   {} 
*/
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.status(200).json(req.user);
});

/**
* Function that allows a student to logout
* 
* @return   {} 
*/
app.post('/api/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    return res.status(200).end();
  });
});

/**
* Function that do a get of all courses provided for a university
* 
* @return   {courses[]} 
*/
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await universityDAO.getCourses();
    const incomp = await universityDAO.getIncompatible();
    courses.forEach(element => {
      element.INCOMPATIBLE = incomp.filter((T) => T.IDCOURSE === element.ID).map((T) => T.IDCOURSEINC);
    });
    courses.forEach(element => {
      element.SUCCESSIVE = courses.filter((T) => T.PREPARATORY == element.ID).map((T) => T.ID);
    });
    return res.status(200).json(courses);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
* Function that do a get of all study plan's courses for a student
* 
* @return   {courses[]} 
*/
app.get('/api/plan/', isLoggedIn, async (req, res) => {
  try {
    const planCourses = await universityDAO.getPlanCourses(req.user.id);
    const incomp = await universityDAO.getIncompatible();
    const courses = await universityDAO.getCourses();
    courses.forEach(element => {
      element.INCOMPATIBLE = incomp.filter((T) => T.IDCOURSE === element.ID).map((T) => T.IDCOURSEINC);
    });
    planCourses.forEach(element => {
      element.SUCCESSIVE = courses.filter((T) => T.PREPARATORY == element.ID).map((T) => T.ID);
    });
    return res.status(200).json(planCourses);
  } catch (e) {
    return res.status(500).send(e);
  }
});


/**
* Function that do a post of study plan's courses for a student
* 
* @return   {} 
*/
app.post('/api/plan/', isLoggedIn, async (req, res) => {

  let student = await universityDAO.getStudentByID(req.user.id);
  if (student === undefined) {
    return res.status(404).end();
  }

  /*Check thah career has not yet been altered*/
  if (student.type !== null) {
    return res.status(422).end();
  }

  const incomp = await universityDAO.getIncompatible();

  /*Check course existence and credit number*/
  let credit = 0;
  for (let el of req.body.planCourses) {
    if (el.length !== 7)
      return res.status(404).end();
    let course = await universityDAO.getCoursesByID(el);
    if (course === undefined) {
      return res.status(404).end();
    }
    credit = credit + course.CREDIT;
  }

  let career = await universityDAO.getCareers();
  career = career.filter((c) => c.ID === req.body.career);
  if (credit < career[0].MINCREDIT || credit > career[0].MAXCREDIT) {
    return res.status(422).end();
  }


  /*Check INCOMPATIBLE and PREPARATORY courses*/

  for (let el of req.body.planCourses) {
    let course = await universityDAO.getCoursesByID(el);

    course.INCOMPATIBLE = incomp.filter((T) => T.IDCOURSE === course.ID).map((T) => T.IDCOURSEINC);
    let intersection = course.INCOMPATIBLE.filter(x => req.body.planCourses.includes(x));

    if (intersection.length !== 0) {
      return res.status(422).end();
    }

    if (course.PREPARATORY !== null) {
      if (!req.body.planCourses.includes(course.PREPARATORY)) {
        return res.status(422).end();
      }
    }
    
    /*Check STUDENT NUMBER*/
    if (course.MAXSTUDENT !== null) {
      let availableSlot = course.MAXSTUDENT - course.STUDENT;
      if (availableSlot < 1) {
        return res.status(422).json({ err: "Not enough slots in" + course.ID });
      }
    }
  }

  try {
    /*Save every studyplan course with respective student*/
    for (let el of req.body.planCourses) {
      let course = await universityDAO.getCoursesByID(el);
      await universityDAO.putCourseStudent(el, course.STUDENT + 1);
      await universityDAO.postPlanCourse(req.user.id, el);
    }
    await universityDAO.putStudentCareer(req.user.id, req.body.career);
    res.status(201).end();
  } catch (e) {
    res.status(503).end();
  }
});

/**
* Function that do a modify of study plan's courses for a student
* 
* @return   {} 
*/
app.put('/api/plan/', isLoggedIn, async (req, res) => {

  /*Check student existence*/
  let student = await universityDAO.getStudentByID(req.user.id);
  if (student === undefined) {
    return res.status(404).end();
  }

  /*Check career type match*/
  if (student.type !== req.body.career) {
    return res.status(422).end();
  }

  const incomp = await universityDAO.getIncompatible();


  const planCourses = await universityDAO.getPlanCourses(req.user.id);

  /*Check course existence and credit number*/
  let credit = 0;
  for (let el of req.body.planCourses) {
    if (el.length !== 7)
      return res.status(404).end();
    let course = await universityDAO.getCoursesByID(el);
    if (course === undefined) {
      return res.status(404).end();
    }
    credit = credit + course.CREDIT;
  }

  let career = await universityDAO.getCareers();
  career = career.filter((c) => c.ID === req.body.career);
  if (credit < career[0].MINCREDIT || credit > career[0].MAXCREDIT) {
    return res.status(422).end();
  }

  let courdeToAdd = req.body.planCourses.filter(x => !planCourses.map((c) => c.ID).includes(x));
  for (let el of courdeToAdd) {
    let course = await universityDAO.getCoursesByID(el);

    
    /*Check INCOMPATIBLE and PREPARATORY courses*/
    course.INCOMPATIBLE = incomp.filter((T) => T.IDCOURSE === course.ID).map((T) => T.IDCOURSEINC);
    let intersection = course.INCOMPATIBLE.filter(x => req.body.planCourses.includes(x));

    if (intersection.length !== 0) {
      return res.status(422).end();
    }

    if (course.PREPARATORY !== null) {
      if (!req.body.planCourses.includes(course.PREPARATORY)) {
        return res.status(422).end();
      }
    }

    /*Check STUDENT NUMBER for available slot in a course*/
    if (course.MAXSTUDENT !== null) {
      let availableSlot = course.MAXSTUDENT - course.STUDENT;
      if (availableSlot < 1) {
        return res.status(422).json({ err: "Not enough slots in " + course.ID });
      }
    }
  }

   /*Insert and delete courses from new study plan list*/
  try {
    for (let el of courdeToAdd) {
      let course = await universityDAO.getCoursesByID(el);
      if (course === undefined) {
        return res.status(404).end();
      }
      await universityDAO.putCourseStudent(course.ID, course.STUDENT + 1);
      await universityDAO.postPlanCourse(req.user.id, el);
    }

    let courdeToDelete = planCourses.map((c) => c.ID).filter(x => !req.body.planCourses.includes(x));
    for (let el of courdeToDelete) {
      let course = await universityDAO.getCoursesByID(el);
      if (course === undefined) {
        return res.status(404).end();
      }
      
    /*Check SUCCESSIVE courses (if you have a successive course in the plan you cannot cancel the previous one)*/
      if (course.SUCCESSIVE !== undefined) {
        for (let el of course.SUCCESSIVE) {
          if (req.body.planCourses.includes(el))
            if (!courdeToDelete.includes(el)) {
              return res.status(422).end();
            }
        }
      }
      await universityDAO.putCourseStudent(course.ID, course.STUDENT - 1);
      await universityDAO.deletePlanCourse(req.user.id, el);
    }
    res.status(201).end();
  } catch (e) {
    res.status(503).end();
  }
});

/**
* Function that do a get of the information about the different type of career
* 
* @return   {careers[]} 
*/
app.get('/api/careers/', isLoggedIn, async (req, res) => {
  try {
    const careers = await universityDAO.getCareers();
    return res.status(200).json(careers);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
* Function that do a get of career id for a student
* 
* @return   {career_type_ID} 
*/
app.get('/api/career/', isLoggedIn, async (req, res) => {
  try {
    const career = await universityDAO.getCareer(req.user.id);
    return res.status(200).json(career);
  } catch (e) {
    return res.status(500).send(e);
  }
});

/**
* Function that do a delete of study plan for a student
* 
* @return   {} 
*/
app.delete('/api/plan/', isLoggedIn, async (req, res) => {
  try {
    let student = await universityDAO.getStudentByID(req.user.id);
    if (student === undefined) {
      return res.status(404).end();
    }

    const planCourses = await universityDAO.getPlanCourses(req.user.id);
    for (let el of planCourses) {
      let course = await universityDAO.getCoursesByID(el.IDCOURSE);
      if (course === undefined)
        return res.status(422).end();
      await universityDAO.putCourseStudent(course.ID, course.STUDENT - 1);
    }
    await universityDAO.putStudentCareer(req.user.id, null);
    await universityDAO.deletePlanCourses(req.user.id);
    return res.status(204).end();
  } catch (e) {
    return res.status(500).send(e);
  }
});


// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});