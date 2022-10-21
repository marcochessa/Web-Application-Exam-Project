'use strict';
const sqlite = require('sqlite3');
const db = new sqlite.Database("StudyPlan.db", (err) => {
    if (err) {
        throw new Error(err);
    }
});

const crypto = require('crypto');

async function getStudent(email, password) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM STUDENT WHERE EMAIL = ?';
        db.get(sql, [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            if (row === undefined) {
                return resolve(false);
            }
            const student = {
                id: row.ID,
                name: row.NAME,
                surname: row.SURNAME,
                email: row.EMAIL,
                type: row.TYPE
            }
            const salt = row.SALT;
            crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                if (err) {
                    return reject(err);
                }
                if (!crypto.timingSafeEqual(Buffer.from(row.HASH, 'hex'), hashedPassword)) {
                    return resolve(false);
                }
                resolve(student);
            })
        })
    })
}

async function getStudentByID(id) {
    const sql = "SELECT * FROM STUDENT WHERE ID = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, id, (error, row) => {
            if (error) {
                reject(error);
                return;
            }
            if (row === undefined) {
                return resolve(undefined);
            }
            const student = {
                id: row.ID,
                name: row.NAME,
                surname: row.SURNAME,
                email: row.EMAIL,
                type: row.TYPE
            }
            resolve(student);
            return;
        });
    });
}

async function getCourses() {
    const sql = "SELECT * FROM COURSE ORDER BY NAME";
    return new Promise((resolve, reject) => {
        db.all(sql, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(rows);
            return;
        });
    });
}

async function getCoursesByID(id) {
    const sql = "SELECT * FROM COURSE WHERE ID = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, id, (error, row) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(row);
            return;
        });
    });
}

async function putCourseStudent(id, studentNumber) {
    const sql = "UPDATE COURSE SET STUDENT = ? WHERE ID = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [studentNumber, id], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
            return;
        });
    });
}

async function getIncompatible() {
    const sql = "SELECT * FROM INCOMPATIBLE";
    return new Promise((resolve, reject) => {
        db.all(sql, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(rows);
            return;
        });
    });
}

async function getCareers() {
    const sql = "SELECT * FROM CAREER";
    return new Promise((resolve, reject) => {
        db.all(sql, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(rows);
            return;
        });
    });
}

async function getCareer(id) {
    const sql = "SELECT TYPE FROM STUDENT WHERE ID = ?";
    return new Promise((resolve, reject) => {
        db.get(sql, id, (error, row) => {
            if (error) {
                reject(error);
                return;
            }
            if (row === undefined) {
                return resolve(null);
            }
            resolve(row);
            return;
        });
    });
}

async function putStudentCareer(user, type) {
    const sql = "UPDATE STUDENT SET TYPE = ? WHERE ID = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [type, user], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
            return;
        });
    });
}

async function getPlanCourses(user) {
    const sql = "SELECT * FROM PLAN AS P, COURSE AS C WHERE P.IDCOURSE = C.ID AND P.IDSTUDENT=? ";
    return new Promise((resolve, reject) => {
        db.all(sql, user, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(rows);
            return;
        });
    });
}

async function postPlanCourse(user, course) {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO PLAN (IDSTUDENT, IDCOURSE) VALUES( ?, ?)';
        db.run(sql, [user, course], (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
            return;
        });
    });
}

async function deletePlanCourse(user, course) {
    const sql = "DELETE FROM PLAN AS P WHERE P.IDSTUDENT=? AND P.IDCOURSE = ?";
    return new Promise((resolve, reject) => {
        db.run(sql, [user, course], (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
            return;
        });
    });
}

async function deletePlanCourses(user) {
    const sql = "DELETE FROM PLAN AS P WHERE P.IDSTUDENT=?";
    return new Promise((resolve, reject) => {
        db.run(sql, user, (error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
            return;
        });
    });
}

module.exports = {
    getStudent,
    getStudentByID,
    getCourses,
    getCoursesByID,
    putCourseStudent,
    getPlanCourses,
    getCareer,
    getCareers,
    getIncompatible,
    postPlanCourse,
    deletePlanCourse,
    deletePlanCourses,
    putStudentCareer
}
