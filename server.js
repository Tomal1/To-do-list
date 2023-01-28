
const fs = require("fs");

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

//this line of code is calling the "dotenv" library
require("dotenv").config();


const sequelize = require("./config/connection");

app.use(express.json());// middleware to allow us to use json 
app.use(express.urlencoded({ extended: true })); //middle where to allow us to use special characters in url

//connects public folder
app.use(express.static("./public"));

const data1 = JSON.parse(
    fs.readFileSync(`${__dirname}/data/data.json`)
    );

app.get("/api/data", (req,res)=>{
    //send a json body back with the following data
    res.status(200).json({
        status: "success", //optional - gives message in insomnia to say it has been successfully sent
        result: data1.length, //optional - gives data on how many objects in data1
        
        data: {/*like an envelope for our data */
            data/*must be named the same as endpoint*/: data1, /* everything inside of data.json (our json body of contents) */
        }
    })
});


app.post("/api/data", (req,res)=>{
    console.log(req.body); //this will console the body we input into insomnia
    
    /*a database automatically generates id, but we are not using one 
    so we have to manually create one in this scenario*/
    const newId = data1[data1.length - 1].id +1; //adds 1 to the id

    //newData will be the body with a new id
    //Object.assign(firstObj, secondObj) - this method merges two objects (id object with body object)
    const newData = Object.assign({id:newId}, req.body);

    // will go into out data.obj file and append newData
    data1.push(newData);

    //because we are in a call back so we have to use async version (writeFile)
    fs.writeFile(`${__dirname}/data/data.json`, JSON.stringify(data1), err =>{
        res.status(201).json({
            status: "success",
            data:{
                data: newData
            }
        });
    })
});

//if you do a put request you will need to send all parameters inside of that body,

//with patch only the specific property that you want to updated so it saves time
app.patch("/api/data/:id", (req,res)=>{
    // turning into a number because /:id is a string
    const ID = req.params.id * 1;
    //seeing if our number matches in data1 properties
    const toBeUpdated = data1.find(el => el.id === ID);
    // finding out the index of data1
    const index = data1.indexOf(toBeUpdated);

    // combining the 2 objects together (note the first object (first argument) can be re-used as the merged (modified) object)
    Object.assign(toBeUpdated, req.body)

    data1[index] = toBeUpdated;
    
    fs.writeFile(`${__dirname}/data/data.json`,JSON.stringify(data1), err => {
        res.status(200).json({
            status: "success",
            data:{
                data1: toBeUpdated
            }
        });
    })
});

app.delete("/api/data/:id", (req,res)=>{

    const ID = req.params.id * 1;
    const toBeDeleted = data1.find(el => el.id === ID);
    const index = data1.indexOf(toBeDeleted);

    data1.splice(index,1);
    
    fs.writeFile(`${__dirname}/data/data.json`,JSON.stringify(data1), err => {
        res.status(204).json({
            status: "success",
            data:{
                data1: null
            }
        });
    })

});

sequelize.sync({ force: false }).then(()=>{
    app.listen(PORT, () => console.log(`listening to PORT ${PORT}`))
})