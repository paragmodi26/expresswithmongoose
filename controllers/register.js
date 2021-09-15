const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const student = require('../models/resgistermodel')
const app = express()
const jwt = require('jsonwebtoken')
// const popup = require('popups');
const alert = require('alert');
const cookieParser = require("cookie-parser");
app.use(cookieParser())
const port = 8000
const path = require('path')
app.use(bodyParser.json())
app.set("views engine", "ejs")
app.use(bodyParser.urlencoded())
app.listen(port, () => {
    console.log("app listen to http://127.0.0.1:" + port)
})
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
})
app.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname + '/login.html'))
})
//select all user
app.get("/alluser", function (req, res) {
    student.find((err, result) => {
        if (err) {
            res.send(err)
        } else {
            if (result.length === 0) {
                res.send("no data Found")
            } else {
                let response = result
                console.log(typeof (response))
                let data = response
                // console.log(data)
                res.render("alluser.ejs", {data: data})
            }
        }
    })

})

//select one user by any parameter example id
app.get("/userbyid/:email", function (req, res) {
    student.findOne({email: req.params.email}, function (err, result) {
        if (err) {
            res.send("error : " + err)
        } else {
            if (result === null) {
                res.send("no data Found")
            } else {
                res.send(result)
            }
        }
    })
})


//insert
app.post("/adduser", function (req, res) {
    const hashCode = function (s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a
        }, 0);
    }
    email = req.body.email;
    let employee = new student()
    employee.id = req.body.id;
    employee.name = req.body.name;
    employee.number = req.body.number;
    employee.email = req.body.email;
    employee.password = hashCode(req.body.password);
    let token = jwt.sign(
        {user_id: employee._id, email},
        "secret",
        {
            expiresIn: "2h",
        }
    );
    employee.token = token
    if (!(employee.id && employee.name && employee.number && employee.email && employee.password)) {
        window.alert("All input required")
        res.redirect('/')
    } else {

        student.findOne({email: employee.email}, (err, result) => {
            if (err) {
                res.send("error " + err)
            } else {
                console.log(result)
                if (result === null) {
                    employee.save((err) => {
                        if (!err) {
                            res.send('<script>window.alert("Login Success");window.open("http://127.0.0.1:8000/login","_self")</script>')

                        } else {
                            res.send('Error during record insertion : ' + err);
                        }
                    });

                } else {
                    res.statusMessage = "Already register";
                    res.status(400)
                    res.redirect('/')
                }

            }

        })
    }

})

//select one user and Update
app.put("/updateuser/:id", function (req, res) {
    let filter = {id: req.params.id}

    let update = {name: req.body.name, number: req.body.number, email: req.body.email, password: req.body.password}
    student.findOneAndUpdate(filter, update, function (err, result) {
        if (err) {
            res.send("error : " + err)
        } else {
            if (result === null) {
                res.send("no data found")
            } else {
                student.findOne({id: req.params.id}, function (err, result) {
                    if (err) {
                        res.send("error : " + err)
                    } else {
                        res.send(result)

                    }
                })
            }
        }
    })
})


//select user by id and delete it
app.delete("/deleteuser/:id", function (req, res) {
    student.findOneAndDelete({id: req.params.id}, function (err, result) {
        if (err) {
            res.send(err)
        } else {
            if (result === null) {
                res.send("no data found to delete")
            } else {
                res.send("data deleted")
            }
        }
    })
})


//login user
app.post("/dologin", function (req, res) {
    let cookie = req.cookies
    console.log(cookie)
    if (req.cookies['email'] !== req.body.email) {
        const hashCode = function (s) {
            return s.split("").reduce(function (a, b) {
                a = ((a << 5) - a) + b.charCodeAt(0);
                return a & a
            }, 0);
        }
        let email = req.body.email
        let password = hashCode(req.body.password)
        let user = {email: email, password: password}
        student.findOne({email: email}, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                if (result === null) {
                    res.send("No Account Register with this Email ")
                } else {
                    let toke = jwt.sign(
                        {user_id: user._id, email},
                        "secret",
                        {
                            expiresIn: "2h",
                        }
                    );
                    student.findOne(user, function (err, result) {
                        if (err) {
                            res.send(err)
                        } else {

                            if (result === null) {
                                res.send("Invalid Password")
                            } else {

                                let filter = {id: req.body.email}

                                let update = {token: toke}
                                student.findOneAndUpdate(filter, update, function (err, result) {
                                    if (err) {
                                        res.send("error : " + err)
                                    }
                                    else{
                                        res.setHeader('Access-Control-Allow-Headers', toke);

                                    }
                                })
                            }
                        }
                    })



                    res.append('Set-Cookie', '8000email=' + email + '; Path=/; HttpOnly');
                    res.send(result)
                }
            }
        })

    } else {
        res.send("welcome")
    }
})

app.get("/profile", function (req, res) {
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    console.log(req.cookies)
    if (isEmpty(req.cookies)) {
        res.redirect('/login')
    } else {
        let email = req.cookies['email']
        student.findOne({email: email}, function (err, result) {
            if (err) {
                res.send(err)
            } else {
                if (result === null) {
                    res.send("no Profile data")
                } else {
                    res.render("profile.ejs", {data: result});

                }
            }

        })

    }
})