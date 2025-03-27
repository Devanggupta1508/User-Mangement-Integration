const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const app = express();
const port = 8080;
const path =require("path");
const methodOverride = require("method-override");
app.set("view engine","ejs");

app.set("views",path.join(__dirname,"views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended:true}));


const{v4:uuidv4 }=require('uuid');

// MySQL connection setup
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "practice",
    password: "@DEVANG#2004"
});




// API route to get total users
app.get("/", (req, res) => {
    let q = "SELECT COUNT(*) AS userCount FROM random_datatable"; 

    connection.query(q, (err, result) => {
        if (err) {
            console.error("❌ Query Error:", err.message);
            return res.status(500).send("Database query failed"); // ✅ Proper error handling
        }

        console.log("✅ Total Users:", result[0].userCount);
        let userCount = result[0].userCount;  // ✅ Value extract karo
        let data = { userCount };  // ✅ Ab ye object properly banega
        res.render("home.ejs", data);
        
    });
});


app.get("/user", (req, res) => {
    let q = "SELECT * FROM random_datatable";
    let q2 = "SELECT COUNT(*) AS userCount FROM random_datatable";

    connection.query(q2, (err, countResult) => {
        if (err) {
            console.error("❌ Count Query Error:", err.message);
            return res.status(500).send("Database query failed");
        }

        let userCount = countResult[0].userCount; // ✅ Total users extract

        connection.query(q, (err, result) => {
            if (err) {
                console.error("❌ Data Query Error:", err.message);
                return res.status(500).send("Database query failed");
            }

            let userdata = { 
                users: result, 
                userCount: userCount // ✅ Total count bhej diya
            };

            res.render("show.ejs", userdata);
        });
    });
});

//edit routes 

app.get("/user/:id/edit",(req,res) =>{
    let {id} = req.params;
    let q = `SELECT * FROM random_datatable  WHERE id = '${id}'`;

connection.query(q, (err, result) => {
    if (err) {
        console.error("❌ Data Query Error:", err.message);
        return res.status(500).send("Database query failed");
    }

   let user = result[0];
   console.log(user);

    res.render("edit.ejs",{user});
});
});

//uodate routes in database to edit form .

app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: Newusername } = req.body;
    let q = `SELECT * FROM random_datatable WHERE id = '${id}'`;

    connection.query(q, (err, result) => {
        if (err) {
            console.error("❌ Data Query Error:", err.message);
            return res.status(500).send("Database query failed");
        }

        let user = result[0];
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (formPass !== user.password) {
            return res.send("wrong password");
        }

        let q2 = `UPDATE random_datatable SET username ='${Newusername}' WHERE id='${id}'`;
        connection.query(q2, (err, result) => {
            if (err) {
                console.error("❌ Update Query Error:", err.message);
                return res.status(500).send("Failed to update user");
            }
            res.redirect("/user");
        });
    });
});


app.get("/user/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM random_datatable WHERE id = ?`;

    connection.query(q, [id],(err, result) => {
        if (err) {
            console.error("❌ Data Query Error:", err.message);
            return res.status(500).send("Database query failed");
        }

        let user = result[0];
        if (!user) {
            return res.status(404).send("User not found");
        }

        res.render("delete.ejs", { user });  
    });
});



app.delete("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass } = req.body;

    let q = `SELECT * FROM random_datatable WHERE id = ?`;

    connection.query(q, [id], (err, result) => {
        if (err) {
            console.error("❌ Data Query Error:", err.message);
            return res.status(500).send("Database query failed");
        }

        let user = result[0];
        if (!user) {
            return res.status(404).send("User not found");
        }

        if (formPass !== user.password) {
            return res.send("Wrong password");
        }

        let q2 = `DELETE FROM random_datatable WHERE id = ?`;
        connection.query(q2, [id], (err, result) => {
            if (err) {
                console.error("❌ Delete Query Error:", err.message);
                return res.status(500).send("Failed to delete user");
            }
            res.redirect("/user");
        });
    });
});

app.get("/user/new", (req, res) => {
    res.render("new.ejs");  // Yeh form wale page ko render karega
});


app.post("/user/new", (req, res) => {
    let { username: newuser, email: useremail, password: userpassword } = req.body;

    let q = `INSERT INTO random_datatable (id, username, email, password) VALUES (?, ?, ?, ?)`;

    connection.query(q, [uuidv4(), newuser, useremail, userpassword], (err, result) => {
        if (err) {
            console.error("❌ Insert Query Error:", err.message);
            return res.status(500).send("Failed to create user");
        }
        res.redirect("/user");  // ✅ Redirect after successful insertion
    });
});

















app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
