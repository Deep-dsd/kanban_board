const addBtnsEl = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtnsEl = document.querySelectorAll(".solid");
const addItemContainersEl = document.querySelectorAll(".add-container");
const addItemsEl = document.querySelectorAll(".add-item");

//Item Lists
const backlogListEl = document.getElementById("backlog-list");
const progressListEl = document.getElementById("progress-list");
const completeListEl = document.getElementById("complete-list");
const onHoldListEl = document.getElementById("on-hold-list");
const itemListsEl = document.querySelectorAll(".drag-item-list");

let updatedOnLoad = false;
//Initialize Array
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let dragging = false;

//Get Arrays from localStorage if available, set default values if not
const getSavedColumns = () => {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Eat Fruits", "Sit back and relax"];
    progressListArray = ["Work on Projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
};

// Set localStorage Arrays
const updateSavedColumns = () => {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];

  listArrays.forEach((list, i) => {
    localStorage.setItem(`${arrayNames[i]}Items`, JSON.stringify(list));
  });
};

//Array filtering, to remove any null value
const filterArray = (arr) => {
  return arr.filter((item) => item !== null);
};

//Create DOM Elements for each list item
const createItemEl = (columnEl, column, item, index) => {
  //List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  columnEl.appendChild(listEl);
};

//Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
const updateDOM = () => {
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  //Backlog Column
  backlogListEl.textContent = "";
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogListEl, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);

  //Progress Column
  progressListEl.textContent = "";
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressListEl, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);

  //Complete Column
  completeListEl.textContent = "";
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeListEl, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);

  //OnHold Column
  onHoldListEl.textContent = "";
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldListEl, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);

  updatedOnLoad = true;
  updateSavedColumns();
};

//Update Item- Delete if necessary, or update Array value
const updateItem = (id, column) => {
  const selectedArr = listArrays[column];
  const selectedColumnEl = itemListsEl[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArr[id];
    } else {
      selectedArr[id] = selectedColumnEl[id].textContent;
    }

    updateDOM();
  }
};

//Allows arrays to reflect Drag and Drop items
const rebuildArrays = () => {
  backlogListArray = Array.from(backlogListEl.children).map(
    (child) => child.textContent
  );

  progressListArray = Array.from(progressListEl.children).map(
    (child) => child.textContent
  );

  completeListArray = Array.from(completeListEl.children).map(
    (child) => child.textContent
  );

  onHoldListArray = Array.from(onHoldListEl.children).map(
    (child) => child.textContent
  );
  updateDOM();
};

//When Item starts dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

//Column Allows for Item to drop
const allowDrop = (e) => {
  e.preventDefault();
};

//When Item Enters column Area
const dragEnter = (column) => {
  itemListsEl[column].classList.add("over");
  currentColumn = column;
};

//Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  //Remove Background Color/padding
  itemListsEl.forEach((item) => {
    item.classList.remove("over");
  });

  //Add Item to column
  const parent = itemListsEl[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
};

updateDOM();

const addToColumn = (column) => {
  const itemText = addItemsEl[column].textContent;
  listArrays[column].push(itemText);
  itemText.textContent = "";
  updateDOM();
};

const showInputBox = (column) => {
  addBtnsEl[column].style.visibility = "hidden";
  saveItemBtnsEl[column].style.display = "flex";
  addItemContainersEl[column].style.display = "flex";
};
const hideInputBox = (column) => {
  addBtnsEl[column].style.visibility = "visible";
  saveItemBtnsEl[column].style.display = "none";
  addItemContainersEl[column].style.display = "none";
  addToColumn(column);
};

//Showing the input Box, so user can add Items
addBtnsEl.forEach((addBtn, i) => {
  addBtn.addEventListener("click", () => showInputBox(i));
});

//Hidding the input Box
saveItemBtnsEl.forEach((addBtn, i) => {
  addBtn.addEventListener("click", () => hideInputBox(i));
});
