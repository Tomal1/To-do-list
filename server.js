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
    });
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
    });
});

//if you do a put request you will need to send all parameters inside of that body,

//with patch only the specific property that you want to updated so it saves time
app.patch("/api/data/:id", (req,res)=>{
    // turning into a number
    const ID = req.params.id * 1;
    //seeing if our number matches in data1 properties
    const toBeUpdated = data1.find(el => el.id === ID);
    // finding out the index of data1
    const index = data1.indexOf(toBeUpdated);

    Object.assign(toBeUpdated, req.body)

    data1[index] = toBeUpdated;
    
    fs.writeFile(`${__dirname}/data/data.json`,JSON.stringify(data1), err => {
        res.status(200).json({
            status: "success",
            data:{
                data1: toBeUpdated
            }
        });
    });
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
    });
});

app.listen(PORT, ()=>{
    console.log(`listening to PORT ${PORT}`)
});