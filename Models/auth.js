const dB = _require("../config/db")


async function register(payload){
        const{username,password,role} = payload;
    try{
        if (req.body.role === "admin") {
            const query = `
                INSERT INTO admin(username,password,role)
                VALUES($1,$2,$3)
                RETURNING*
            `
            const values = [username,password,role];
            const result = await dB.query(query,values)
            console.log(result)
            await dB.end();
          } 
        
    }
    catch(err){
          console.log(err.message);
          await dB.end();
    }
    else if (req.body.role === "teacher") {
        Teacher.push(req.body);
      } 
    else if (req.body.role === "student") {
        req.body.enrolledCourses = []; 
        Student.push(req.body);
    }
    else
}


function login(payload){
    
}

Payload={
    username:"excellentjumo",
    password: "",
    role:"Student"
}
register(payload)