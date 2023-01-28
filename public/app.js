let outputCon = document.querySelector("#outputContainer");
let inputText = document.querySelector("#inputText");
let addButton = document.querySelector("#addButton");

const createTodoItem = (value) => {
    let output = document.createElement("p"); //creating a paragraph tag
    output.classList.add("outputText"); //giving paragraph a class
    
    //use text content instead because inner htm is for elements
    output.textContent = value.message; //what we want inside the paragraph
    outputCon.appendChild(output); //where we want to add it

    let deleteBtn  =  document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML = "Delete";
    deleteBtn.dataset.itemId = value.id //
    outputCon.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", (e)=>{

        fetch("/api/data/" + e.target.dataset.itemId, {
        
            method: "DELETE",
            
        })
        .then(data =>{
            console.log(data)
            if(data.status === 200){
                console.log("success");
            } 
            if (data.status === 500){
                console.log("something went wrong")
            }
        })
        .catch(err => console.log("something went wrong"))
    })


    let editBtn  =  document.createElement("button");
    editBtn.dataset.itemId = value.id; //giving edit btn an id
   

    editBtn.addEventListener("click", (e) => {
        let input = document.createElement("input");
        input.type = "text";
        input.className = "input";
        outputCon.appendChild(input);

        let done = document.createElement("button");
        done.innerHTML = "done";
        outputCon.appendChild(done);

        done.addEventListener("click", ()=>{

            let updateValue = {message: input.value}
            console.log(updateValue)
            fetch("/api/data/" + e.target.dataset.itemId, {
                method: "PATCH",
                headers: {
                    "Content-Type":"application/json"
                },
                body: JSON.stringify(updateValue)
            })
            .then(data =>  {
                console.log(data)
                if(data.status === 200){
                    console.log("success");
                } 
                if (data.status === 500){
                    console.log("something went wrong")
                }
            })
            .catch(err => console.log("something went wrong"))

        })
        


    })
    
    editBtn.classList.add("editBtn");
    editBtn.innerHTML = "Edit";
    outputCon.appendChild(editBtn);
}

addButton.addEventListener("click", () =>{
    ///converts inputText.value value into an object
    const convertToObj = {
        message: inputText.value
    }

    console.log(convertToObj)
    
    fetch("/api/data",{
        method:"POST", 
        ///use this or body wont append to database (this is letting api know what type of content is being parsed)
        headers: {
            "Content-Type":"application/json"
        },
        // a JSON object can only take string so this method turns everything into a string
        body: JSON.stringify(convertToObj)
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const items = data.data.data;
      createTodoItem()
    })    
});


const name = () =>{
    // GET method
    fetch("/api/data", {
        method: "GET" //is calling the get api in server.js, thats how it know which file to go inside
    })
    .then(response =>response.json()) //convert that data into json body
    .then(data =>{
        console.log(data)
        const items = data.data.data;
        // loop through all the data in 
        for (let i = 0; i < items.length; i++) {
            const dataElement = items[i];
            createTodoItem(dataElement)
        }
    })
};
name()

