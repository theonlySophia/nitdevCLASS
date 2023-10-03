const express = require("express"); //import express module
const server = express(); //initialising the server that is getting started, call express function

server.use(express.json());

//ADMIN
/*Username
Password
Create Student
Update Student*/

let Admin = [];

let Teacher = [];

let Student = [];

let Courses = [];

server.post("/register", (req, res) => {
  if (req.body.role === "admin") {
    Admin.push(req.body);
  } else if (req.body.role === "teacher") {
    Teacher.push(req.body);
  } else if (req.body.role === "student") {
    req.body.enrolledCourses = []; 
    Student.push(req.body);
  } else {
    res.json("Invalid role.");
  }
  res.json("DONE");
});

server.post("/login", (req, res) => {
  const info = req.body;
  if (req.body.role === "admin") {
    let validAdmin = false;
    for (const admin of Admin) {
      if (
        admin.username === info.username &&
        admin.password === info.password
      ) {
        validAdmin = true;
        break;
      }
    }
    if (validAdmin) {
      res.status(200).json("User logged in successfully");
    } else {
      res.status(400).json("Invalid username or password");
    }
  } else if (req.body.role === "teacher") {
    let validTeacher = false;
    for (const admin of Teacher) {
      if (
        admin.username === info.username &&
        admin.password === info.password
      ) {
        validTeacher = true;
        break;
      }
    }
    if (validTeacher) {
      res.status(200).json("User logged in successfully");
    } else {
      res.status(400).json("Invalid username or password");
    }
  } else if (req.body.role === "student") {
    let validStudent = false;
    for (const admin of Student) {
      if (
        admin.username === info.username &&
        admin.password === info.password
      ) {
        validStudent = true;
        break;
      }
    }
    if (validStudent) {
      res.status(200).json("User logged in successfully");
    } else {
      res.status(400).json("Invalid username or password");
    }
  } else {
    res.json("Invalid role.");
  }
});

server.get("/get-admin", (req, res) => {
  res.json(Admin);
});

server.get("/get-all-students/:role", (req, res) => {
  if (req.params.role === "admin") {
    res.json(Student);
  } else {
    res.json("UNAUTHORISED");
  }
});

server.get("/get-teachers/:role", (req, res) => {
  if (req.params.role === "admin") {
    res.json(Teacher);
  } else {
    res.json("UNAUTHORISED");
  }
});

server.post("/create-course/:role", (req, res) => {
  if (req.params.role === "admin") {
    Courses.push(req.body);
    res.json("Course created successfully");
  } else {
    res.json("UNAUTHORISED");
  }
});

server.get("/get-courses", (req, res) => {
  res.json(Courses);
});

server.delete("/delete-course/:role", (req, res) => {
  if (req.params.role === "admin") {
    const index = Courses.findIndex((course) => course.code === req.body.code);
    if (index !== -1) {
      const deletedCourse = Courses.splice(index, 1);
      res.json(`${deletedCourse[0].code} deleted successfully`);
    } else {
      res.json("Course code does not exist");
    }
  } else {
    res.json("Unauthorized");
  }
});
 
server.delete("/delete-student/:role", (req, res) => {
  if (req.params.role === "admin") {
    const index = Student.findIndex(
      (stu) => stu.username === req.body.username
    );
    if (index !== -1) {
      const deletedStudent = Student.splice(index, 1);
      res.json(`${deletedStudent[0].username} deleted successfully`);
    } else {
      res.json("Student does not exist");
    }
  } else {
    res.json("Unauthorized");
  }
});

server.delete("/delete-teacher/:role", (req, res) => {
  if (req.params.role === "admin") {
    const index = Teacher.findIndex(
      (teach) => teach.username === req.body.username
    );
    if (index !== -1) {
      const deletedTeacher = Teacher.splice(index, 1);
      res.json(`${deletedTeacher[0].username} deleted  successfully`);
    } else {
      res.json("Student does not exist");
    }
  } else {
    res.json("Unauthorized");
  }
});

server.put("/reset-password", (req, res) => {
  const { username, password } = req.body;
  if (req.body.role === "admin") {
    const adminIndex = Admin.findIndex((admin) => admin.username === username);
    if (adminIndex !== -1) {
      Admin[adminIndex].password = password;
      res.json("Password reset successfully");
    } else {
      res.status(404).json("Admin not found");
    }
  } else if (req.body.role === "teacher") {
    const teacherIndex = Teacher.findIndex(
      (teacher) => teacher.username === username
    );
    if (teacherIndex !== -1) {
      Teacher[teacherIndex].password = password;
      res.json("Password reset successfully");
    } else {
      res.status(404).json("Teacher not found");
    }
  } else if (req.body.role === "student") {
    const studentIndex = Student.findIndex(
      (student) => student.username === username
    );
    if (studentIndex !== -1) {
      Student[studentIndex].password = password;
      res.json("Password reset successfully");
    } else {
      res.status(404).json("Student not found");
    }
  } else {
    res.status(400).json("Invalid role.");
  }
});

server.post("/enroll-course/:role", (req, res) => {
  if (req.params.role === "student") {
    const { username, code } = req.body;
    const student = Student.find((stu) => stu.username === username);
    if (!student) {
      res.status(404).json("Student not found");
      return;
    }
    const course = Courses.find((c) => c.code === code);
    if (!course) {
      res.status(404).json("Course not found");
      return;
    }

    if (student.enrolledCourses.includes(code)) {
      res.status(400).json("Student is already enrolled in this course");
      return;
    }
    student.enrolledCourses.push(code);

    res.json("Student enrolled in the course successfully");
  } else {
    res.json("Unauthorized");
  }
});

server.get("/get-enrolled-courses/:role", (req, res) => {
  if (req.params.role === "student") {
    const { username } = req.body;
    const student = Student.find((stu) => stu.username === username);

    if (!student) {
      res.status(404).json("Student not found");
      return;
    }

    const enrolledCourseCodes = student.enrolledCourses;
    res.json(enrolledCourseCodes);
  } else {
    res.json("Unauthorized");
  }
});

server.delete("/drop-course/:role", (req, res) => {
  if (req.params.role === "student") {
    const { username, code } = req.body;

    const student = Student.find((stu) => stu.username === username);

    if (!student) {
      res.status(404).json("Student not found");
      return;
    }

    const courseIndex = student.enrolledCourses.indexOf(code);

    if (courseIndex === -1) {
      res.status(400).json("Student is not enrolled in this course");
      return;
    }

    student.enrolledCourses.splice(courseIndex, 1);

    res.json("Course dropped successfully");
  } else {
    res.json("Unauthorized");
  }
});

server.get("/get-student-profile/:username", (req, res) => {
  const username = req.params.username;
  const student = Student.find((stu) => stu.username === username);

  if (!student) {
    res.status(404).json("Student not found");
    return;
  }

  res.json(student);
});

server.get("/get-students/:role", (req, res) => {
    if (req.params.role === "teacher") {
      const { teacher, code } = req.body;

      const teacherInfo = Teacher.find(
        (teach) => teach.username === teacher
      );
      if (!teacherInfo) {
        res.status(404).json("Teacher not found");
        return;
      }
      const course = Courses.find((c) => c.code === code);
      if (!course) {
        res.status(404).json("Course not found");
        return;
      }

      const enrolledStudents = Student.filter((stu) =>
        stu.enrolledCourses.includes(code)
      );
      res.json(enrolledStudents);
    } else {
      res.json("UNAUTHORISED");
    }
});

server.get("/get-teacher-profile/:username", (req, res) => {
  const username = req.params.username;
  const teacher = Teacher.find((teach) => teach.username === username);

  if (!teacher) {
    res.status(404).json("Teacher not found");
    return;
  }

  res.json(teacher);
});



//should be the last thing
server.listen(3006, () => {
  console.log("Hello world");
});
