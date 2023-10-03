const(Client) postgres = require("pg")
//take not of the capital C
//destructuring client


const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'school',
    user: 'postgress',
    password: 'secretpassword!!',
  })
client.connect()

// const sqlConnection = postgres('postgres://username:password@host:port/database', {
//   host                 : 'localhost',            // Postgres ip address[s] or domain name[s]
//   port                 : 5432,          // Postgres server port[s]
//   database             : 'School',            // Name of database to connect to
//   username             : 'postgres',            // Username of database user
//   password             : 'password',            // Password of database user
  
// })

module.exports = sqlConnection;