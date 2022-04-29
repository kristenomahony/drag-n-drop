const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const needToDoList = document.getElementById("need-to-do-list");
const inProgressList = document.getElementById("in-progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let needToDoListArray = [];
let inProgressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let currentColumn;
let dragging = false;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("needToDoItems")) {
    needToDoListArray = JSON.parse(localStorage.needToDoItems);
    inProgressListArray = JSON.parse(localStorage.inProgressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    needToDoListArray = ["Python course", "Sit back and relax"];
    inProgressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    needToDoListArray,
    inProgressListArray,
    completeListArray,
    onHoldListArray
  ];
  const arrayNames = ["needToDo", "inProgress", "complete", "onHold"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

// filter arrays to remove empty items
function filterArray(array) {
  filteredArray = array.filter(item => item !== null);
  return filteredArray;
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  // append
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // Need to Do Column
  needToDoList.textContent = "";
  needToDoListArray.forEach((needToDoItem, index) => {
    createItemEl(needToDoList, 0, needToDoItem, index);
  });
  needToDoListArray = filterArray(needToDoListArray);
  // In Progress Column
  inProgressList.textContent = "";
  inProgressListArray.forEach((inProgressItem, index) => {
    createItemEl(inProgressList, 1, inProgressItem, index);
  });
  inProgressListArray = filterArray(inProgressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// update or delete item or update array
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}
// add to column list
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}
// show add item box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}

// hide add item box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// allow arrays to reflect dropped items
function rebuildArrays() {
  needToDoListArray = [];
  inProgressListArray = [];
  completeListArray = [];
  onHoldListArray = [];
  for (let i = 0; i < needToDoList.children.length; i++) {
    needToDoListArray.push(needToDoList.children[i].textContent);
  }
  for (let i = 0; i < inProgressList.children.length; i++) {
    inProgressListArray.push(inProgressList.children[i].textContent);
  }
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}
// drag function
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
// when item enters drop area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}
// column allows the drop
function allowDrop(e) {
  e.preventDefault();
}
// drop function
function drop(e) {
  e.preventDefault();
  // remove background color
  listColumns.forEach(column => {
    column.classList.remove("over");
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // dragging complete
  dragging = false;
  rebuildArrays();
}
// on load
updateDOM();
