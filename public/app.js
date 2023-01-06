let outputCon = document.querySelector("#outputContainer");
let inputText = document.querySelector("#inputText");
let addButton = document.querySelector("#addButton");

addButton.addEventListener("click", () =>{

    let output = document.createElement("p");
    output.classList.add("outputText");
    output.innerHTML = inputText.value;
    outputCon.appendChild(output);

    let deleteBtn  =  document.createElement("button");
    deleteBtn.classList.add("deleteBtn");
    deleteBtn.innerHTML = "Delete";
    outputCon.appendChild(deleteBtn);

    let editBtn  =  document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.innerHTML = "Edit";
    outputCon.appendChild(editBtn);
});







