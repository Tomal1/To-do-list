let outputCon = document.querySelector("#outputContainer");
let inputText = document.querySelector("#inputText");
let addButton = document.querySelector("#addButton");

const createTodoItem = (value) => {
  let output = document.createElement("p"); //creating a paragraph tag
  output.classList.add("outputText"); //giving paragraph a class
  output.dataset.itemId = value.id;
  //use text content instead because inner htm is for elements
  output.textContent = value.message; //what we want inside the paragraph
  outputCon.appendChild(output); //where we want to add it

  let deleteBtn = document.createElement("button");
  deleteBtn.classList.add("deleteBtn");
  deleteBtn.innerHTML = "Delete";
  deleteBtn.dataset.itemId = value.id; // assigning an id to delete button
  outputCon.appendChild(deleteBtn);

  deleteBtn.addEventListener("click", (e) => {
    fetch("/api/data/" + e.target.dataset.itemId, {
      method: "DELETE",
    })
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          console.log("success");
        }
        if (data.status === 500) {
          console.log("something went wrong");
        }
      })
      .catch((err) => console.log("something went wrong"));
  });

  let editBtn = document.createElement("button");
  editBtn.dataset.itemId = value.id; //giving edit btn an id
  editBtn.classList.add("editBtn");
  editBtn.innerHTML = "Edit";
  outputCon.appendChild(editBtn);

  editBtn.addEventListener("click", (x) => {
    x.preventDefault();

    // remove the p tag
    const id = x.target.dataset.itemId;
    const textEl = document.querySelector(`[data-item-id="${id}"]`);
    const text = textEl.innerText;
    textEl.style.display = "none";
    

    let input = document.createElement("input");
    input.type = "text";
    input.placeholder = "enter hear to update";
    input.className = "input";
    input.style.display = "block";

    // add the value of p tag to inout field
    input.value = text;
    outputCon.prepend(input);

    let done = document.createElement("button");
    done.innerHTML = "done";
    outputCon.appendChild(done);

    done.addEventListener("click", (e) => {
      e.preventDefault();

      // input.style.visibility = visible;
      // done.style.visibility = hidden;

      let updateValue = { message: input.value };

      fetch("/api/data/" + x.target.dataset.itemId, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateValue),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          if (data.status === 200) {
            console.log("success");
          }
          if (data.status === 500) {
            console.log("something went wrong");
          }
        })
        .catch((err) => console.log("something went wrong"));
    });
  });
};

addButton.addEventListener("click", () => {
  ///converts inputText.value value into an object
  const convertToObj = {
    message: inputText.value,
  };

  fetch("/api/data", {
    method: "POST",
    ///use this or body wont append to database (this is letting api know what type of content is being parsed)
    headers: {
      "Content-Type": "application/json",
    },
    // a JSON object can only take string so this method turns everything into a string
    body: JSON.stringify(convertToObj),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      createTodoItem(data);
    });
});

const name = () => {
  // GET method
  fetch("/api/data", {
    method: "GET", //is calling the get api in server.js, thats how it know which file to go inside
  })
    .then((response) => response.json()) //convert that data into json body
    .then((data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        createTodoItem(data[i]);
      }

      // const items = data.data.data;
      // // loop through all the data in
      // for (let i = 0; i < items.length; i++) {
      //     const dataElement = items[i];
      // createTodoItem(data)
      //}
    });
};
name();
