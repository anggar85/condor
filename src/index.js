// CONSTANTS
const PENDING = false
const COMPLETED = true
const LIST1 = 1
const LIST2 = 2
const SAMPLE_TEXT =  ["greet",
  "campaign",
  "coffee",
  "care",
  "revise",
  "monarch",
  "patrol",
  "bear",
];  

// Main LISTS
let dataList1 = [];
let dataList2 = [];
let sorts = [1,1];

// I'm populating dataList1 with sample data
for (let x = 0; x < SAMPLE_TEXT.length; x++) {
  dataList1.push({ title: SAMPLE_TEXT[x], status: PENDING, show: true })
}


// ELEMENTS

const divList = document.getElementById("list1");
const divList2 = document.getElementById("list2");


const searchL1 = document.getElementById("search1");
const searchL2 = document.getElementById("search2");
const addNew = document.getElementById("addNew");
const btnCancelNewItem = document.getElementById("btnCancelNewItem");
const btnSaveNewItem = document.getElementById("btnSaveNewItem");


// LISTENERS
searchL1.addEventListener("input", (e)=>searchTasks(e.target.value, dataList1, fillList1));
searchL2.addEventListener("input", (e)=>searchTasks(e.target.value, dataList2, fillList2));
addNew.addEventListener("click", addNewRow);
btnCancelNewItem.addEventListener("click", cancelNewItem);
btnSaveNewItem.addEventListener("click", saveNewItem);




// METHODS

function deleteItem(index) {
  delete dataList1[index]
  dataList1 = dataList1.filter( d => d);
  fillList1();
}

function deleteItemFromList2(index) {
  delete dataList2[index]
  dataList2 = dataList2.filter( d => d);
  fillList2();
}

function saveNewItem() {
  const inputNewRow = document.getElementById("inputNewRow");
  let obj = {title: inputNewRow.value, status: PENDING, show: true};
  dataList1.push(obj);
  fillList1();
  cancelNewItem();
}


function cancelNewItem() {
  const list1NewRow = document.getElementById("list1NewRow");
  list1NewRow.classList.add("invisibleCustom");
  resetInput();
}


function addNewRow() {
  const list1NewRow = document.getElementById("list1NewRow");
  list1NewRow.classList.remove("invisibleCustom");
  document.getElementById("inputNewRow").focus();
}

function resetInput() {
  const inputNewRow = document.getElementById("inputNewRow");
  inputNewRow.value = "";
}


function searchTasks(value, dataSet, callBack) {
  if (value === "")
    dataSet.forEach((d, i) => {
      dataSet[i].show = true
    })

  dataSet.forEach((d, i) => {
    if (!d.title.toLowerCase().includes(value.toLowerCase()))
      dataSet[i].show = false 
  });

  callBack();
    
}

function fillList1() {
  dataList1 = dataList1.sort((a,b)=> sortData(a,b ))
  let info = "";
  if (dataList1.length === 0) {
    divList.innerHTML = "<tr><td class='text-center'>No Pending Tasks</td></tr>";
  } else {
    dataList1.forEach((d, index) => {
      if (!d.show) return
      info += "<tr>";
      info += `<td width='25'><input id="chbx_${index}" type='checkbox' data-id="${index}"/></td>`;
      info += `<td id="title_${index}" class="d-flex justify-content-between">
                <div  class="w-100">
                  <div >
                  <label for="chbx_${index}" >${d.title}</label>
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <img data-id="${index}_edit" src="src/img/edit.png" class="isCursor miniIcon" />
                  <img data-id="${index}_delete" src="src/img/trash.png" class="ml-2 mr-2 isCursor miniIcon" />
                </div>
                `;
    });
    divList.innerHTML = info;

    // Listener for clicks on icons
    updateIconsListeners();

    // Listener for clicks on checkboxes
    const divListChkbx = document.querySelectorAll('#list1 input[type=checkbox]');
    divListChkbx.forEach(e => e.addEventListener("change", function(e) {
      e.stopPropagation()
      const index = e.target.getAttribute("data-id")
      changeItemFromList(index, LIST2)
    }));
  }
}


function fillList2() {
  dataList2 = dataList2.sort((a,b)=> sortData(a,b ))
  let info = "";
  if (dataList2.length === 0) {
    divList2.innerHTML = "<tr><td class='text-center'>No Completed Tasks Yet</td></tr>";
  } else {
    dataList2.forEach((d, index) => {
      if (!d.show) return
      info += "<tr>";
      info += `<td width='25'><input type='checkbox' id="chbxc_${index}" data-id="${index}" checked/></td>`;
      info += `<td id="title2_${index}" class="d-flex justify-content-between">
                <div  class="w-100">
                  <div class="" >
                  <s>${d.title}</s>
                   
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <img data-id="${index}_deleteList2" src="src/img/trash.png" class="ml-2 mr-2 isCursor miniIcon" />
                </div>
                `;
    });
    divList2.innerHTML = info;

    // Listener for clicks on icons
    updateIconsListeners()

    // Listener for clicks on checkboxes
    const divListChkbx = document.querySelectorAll('#list2 input[type=checkbox]');
    divListChkbx.forEach(e => e.addEventListener("change", function(e) {
      e.stopPropagation()
      const index = e.target.getAttribute("data-id")
      changeItemFromList(index, LIST1)
    }));
  }
}

function changeItemFromList(index, list) {
  if (list === LIST1) {
    dataList1 = [...dataList1, dataList2[index]].filter((d)=> d)
    delete dataList2[index]
    dataList2 = dataList2.filter((d,i) => i !== index)  
  }else{
    dataList2 = [...dataList2, dataList1[index]].filter((d)=> d)
    delete dataList1[index]
    dataList1 = dataList1.filter((d,i) => i !== index)
  }
  fillList1();
  fillList2();  
}


function updateItem(index) {
  const value = dataList1[index].title
  const element = document.getElementById("title_" + index)
  element.innerHTML = `
                      <div  class="w-100">
                        <div>
                          <input id="input_${index}" class="form-control" type="text" value="${value}" />
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <img data-id="${index}_cancel" src="src/img/cancel.png" class="isCursor miniIcon" />
                        <img onclick="saveUpdate(${index})" data-id="${index}_save" src="src/img/check.png" class="ml-2 mr-2 isCursor miniIcon" />
                      </div>`;
                      updateIconsListeners()
}

function updateIconsListeners() {
  const divListImgs = document.querySelectorAll('#list1 img, #list2 img');
    divListImgs.forEach(e => e.addEventListener("click", function(e) {
      const [id, action] = e.target.getAttribute("data-id").split("_");
      switch (action) {
        case "delete":
          deleteItem(id);
        break;
        case "deleteList2":
          deleteItemFromList2(id);
        break;
        case "edit":
          updateItem(id);
        break;
        case "cancel":
          fillList1();
        break;
        default:
          break;
      }
    }));
}


function saveUpdate(index) {
  const value = document.getElementById("input_" + index).value;
  let obj = {title: value, status: PENDING, show: true};
  dataList1[index] = obj;
  fillList1();
}

function sortData( a, b ) {
  if ( a.title < b.title )
    return -1;
  if ( a.title > b.title )
    return 1;
  return 0;
}

function changeSortOrder(params) {
  
}

(function () {
  fillList1();
})();


