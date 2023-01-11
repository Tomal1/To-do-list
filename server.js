const fs = require("fs");

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connects public folder
app.use(express.static("./public"));

const data1 = JSON.parse(fs.readFileSync(`${__dirname}/data/data.json`));

app.get("/api/data", (req,res)=>{
    res.status(200).json({
        status:"success", //optional gives message in isomnia to say it has been successfully sent
        result: data1.length, //optional gives data on how many objects in data1
        data: {
            data: data1
        }
    })
});

app.post("/api/data", (req,res)=>{
    console.log(req.body); // will console the body
    
    const newId = data1[data1.length - 1].id +1; //adds 1 to the id

    const newData = Object.assign({id:newId}, req.body);

    data1.push(newData);
    fs.writeFile(`${__dirname}/data/data.json`,JSON.stringify(data1), err =>{
        res.status(201).json({
            status: "success",
            data:{
                data1: newData
            }
        });
    })
});




app.listen(PORT, ()=>{
    console.log(`listening to PORT ${PORT}`)
});