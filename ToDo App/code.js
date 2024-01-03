const form = document.querySelector("#form");
const taskInput = document.querySelector('#taskInput');
const tasksList = document.querySelector('.tasks_list');
const emptyList = document.querySelector('.empty_list');
const list_t_of_work = document.querySelector('#select_type');
const deleteAll = document.getElementById('deleteAll');
const sort = document.getElementById('sort');
const onlyactive = document.getElementById('onlyActive');

let tasks = [];

let draggedIndex = 0;

let type = ['work', 'study', 'other'];
let type_divs = [];
for(let i = 0; i < type.length; i++){
    type_divs[i] = `<h2>${type[i]}</h2>
                <div class="${type[i]}"></div>`;
    // type[i].addEventListener('dragover', (event)=>{
    //     event.preventDefault();
    // })
    tasksList.insertAdjacentHTML('beforebegin',type_divs[i]);
}

const t_work = document.querySelector('.work');
const t_study = document.querySelector('.study');
const t_other = document.querySelector('.other');

if(localStorage.getItem('tasks')){
    tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(function(task) {
        renderTask(task);
    });
};
checkEmptyList();

form.addEventListener('submit', addTask);
deleteAll.addEventListener('click', deleteAlltask);
sort.addEventListener('click', sortAlltask);
onlyactive.addEventListener('click', onlyActivetask);

t_work.addEventListener('click', deleteTask);
t_work.addEventListener('click', doneTask);
t_work.addEventListener('click', openEditTask);
t_work.addEventListener('dragstart', dragstartItem);
t_work.addEventListener('dragend', dragendItem);
t_work.addEventListener('dragover', dragoverItem);


t_study.addEventListener('click', deleteTask);
t_study.addEventListener('click', doneTask);
t_study.addEventListener('click', openEditTask);
t_study.addEventListener('dragstart', dragstartItem);
t_study.addEventListener('dragend', dragendItem);
t_study.addEventListener('dragover', dragoverItem);

t_other.addEventListener('click', deleteTask);
t_other.addEventListener('click', doneTask);
t_other.addEventListener('click', openEditTask);
t_other.addEventListener('dragstart', dragstartItem);
t_other.addEventListener('dragend', dragendItem);
t_other.addEventListener('dragover', dragoverItem);

function addTask(event){
    event.preventDefault();
    
    const textTask = taskInput.value;
    if(textTask.length > 1){
        const newTask = {
            id: Date.now(),
            text: textTask,
            done: false,
            type: '',  
        }
        
        newTask.type = list_t_of_work.value;
        tasks.push(newTask);
        saveToLocalStorage();
    
        renderTask(newTask);
        taskInput.value = '';
        taskInput.focus();
        
        checkEmptyList();

    }
}

function deleteTask(event){
    if(event.target.dataset.action !== 'delete'){
        return;
    }

    const parrentNode = event.target.closest('li');
    const id = Number(parrentNode.id);
    const index = tasks.findIndex(function(task) {
        return task.id === id;
    })
    tasks.splice(index, 1);

    parrentNode.remove();
    saveToLocalStorage();
    checkEmptyList();
}

function doneTask(event){
    if (event.target.dataset.action !== 'done') return;
    const parentNode = event.target.closest('li');
    console.log(parentNode);
    const id = Number(parentNode.id);
    const task = tasks.find(function(task){
        return task.id === id;
    })
    task.done = !task.done;
    const child = parentNode.querySelector('p');
    child.classList.toggle('task-title--done');
    saveToLocalStorage();
}

function checkEmptyList(){
    if (tasks.length === 0){
        const emptyList = `<li class = "empty_list"> 
        <h2>Список дел пуст</h2>
    </li>`;
    tasksList.insertAdjacentHTML('beforebegin', emptyList);
    }
    else{
        const empty_listEl = document.querySelector('.empty_list');
        empty_listEl ? empty_listEl.remove(): null;
    }
}

function saveToLocalStorage(){
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask(task){
    const cssClass = task.done ? "task-title--done": "";
    const textHTML = `
                <li id="${task.id}" class="one_task" draggable="true">
                    <p class="${cssClass}">${task.text}</p>
                    <div class="bttn_2">
                        <button type="button" data-action="done" class="btn-action">
                            <img src="./img/tick.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="delete" class="btn-action">
                            <img src="./img/cross.svg" alt="Done" width="18" height="18">
                        </button>
                        <button type="button" data-action="edit" class="btn-action">Edit</button>
                        
                    </div>
                </li>`;
    
    if (t_work.className === task.type) {
        t_work.insertAdjacentHTML('beforeend', textHTML);
    }
    if (t_study.className === task.type) {
        t_study.insertAdjacentHTML('beforeend', textHTML);
    }
    if (t_other.className === task.type) {
        t_other.insertAdjacentHTML('beforeend', textHTML);
    }
    
}

function openEditTask(event){
    if(event.target.dataset.action !== 'edit') return;

    const sh_edit = document.querySelector('#div_edit');
    sh_edit.classList.add('open');
    const cancel_edit = document.querySelector('#cancel_set');
    cancel_edit.addEventListener('click', function(){
        sh_edit.classList.remove('open');
    })
    const parentNode = event.target.closest('li');
    let node_text = parentNode.querySelector('p');
    const text_edit = document.querySelector('.text_edit');
    const save_edit = document.querySelector('#save_set');
    const id = Number(parentNode.id);
    const index = tasks.findIndex(function(task) {
        return task.id === id;
    })
    save_edit.addEventListener('click', function(){
        node_text.textContent = text_edit.value;
        tasks[index].text = text_edit.value;
        sh_edit.classList.remove('open');
        saveToLocalStorage();
    })
    

}

function deleteAlltask(){
    if (tasks.length === 0) return;
    tasks.splice(0,tasks.length);
    while(t_work.firstChild){
        t_work.removeChild(t_work.firstChild);
    }
    while(t_study.firstChild){
        t_study.removeChild(t_study.firstChild);
    }
    while(t_other.firstChild){
        t_other.removeChild(t_other.firstChild);
    }
    saveToLocalStorage();
    checkEmptyList();
}

function deleteAlltaskforSort(){
    if (tasks.length === 0) return;
    tasks.splice(0,tasks.length);
    while(t_work.firstChild){
        t_work.removeChild(t_work.firstChild);
    }
    while(t_study.firstChild){
        t_study.removeChild(t_study.firstChild);
    }
    while(t_other.firstChild){
        t_other.removeChild(t_other.firstChild);
    }
}

function sortAlltask(){
    let tasks_noactive = []
    let tasks_active = []
    for(let i = 0; i < tasks.length; i++){
        if (tasks[i].done){
            tasks_active.push(tasks[i])
        }
        else{
            tasks_noactive.push(tasks[i])
        }
    }
    deleteAlltaskforSort();
    tasks = tasks_noactive.concat(tasks_active);
    for(let i = 0; i < tasks.length; i++){
        renderTask(tasks[i]);
    }
    console.log(tasks);
    saveToLocalStorage();
}

function onlyActivetask(){
    let tasks_noactive = [];
    for(let i = 0; i < tasks.length; i++){
        if (!tasks[i].done){
            tasks_noactive.push(tasks[i])
        }
    }
    deleteAlltaskforSort();
    tasks = tasks_noactive;
    for(let i = 0; i < tasks.length; i++){
        renderTask(tasks[i]);
    }
    saveToLocalStorage();
}

// function setDraggetIndex(index){
//     draggedIndex = index;
//     console.log('drag = ' + index);
// }

// function allowDrop(event){
//     event.preventDefault();
// }
// function drag(event){
//     const id = event.target.className;
//     console.log('drag ' + id);
//     event.dataTransfer.setData('id', id);
// }
// function drop(event){
//     event.preventDefault();
//     const id = event.target.id;
//     console.log('drop index = ' + draggedIndex + 'category = ' + event.target.id);
    
// }

function dragstartItem(event){
    //console.log(event.target.classList);
    event.target.classList.add('selected');
    //console.log(event.target.classList);
}

let last_class_dragged = null;
function dragendItem(event){    
    const type_elem = event.target.parentNode.querySelector('.selected');
    const curId = type_elem.id;
    let old_class = null;

    for (let i = 0; i < tasks.length; i++ ) {
        // console.log(typeof type[1]);
        // console.log(typeof last_class_dragged.className)
        old_class = tasks[i].type
        if (tasks[i].id == curId && type.includes(last_class_dragged.className) && old_class != last_class_dragged.className) {
            tasks[i].type = last_class_dragged.className;
            saveToLocalStorage()
            document.querySelector(`.${old_class}`).removeChild(document.getElementById(tasks[i].id))
            renderTask(tasks[i])
            break
        }
    }
    event.target.classList.remove('selected');
}

function dragoverItem(event){
    event.preventDefault();
    last_class_dragged = event.target.closest('div')

    

    // const activeElement = t_study.querySelector('.selected');
    // // console.log(activeElement);
    // const curElement = event.target.closest('.one_task');
    // const isMoveable = activeElement != curElement && curElement.classList.contains('one_task');
    // if (!isMoveable) return;
    // const start_node = activeElement.type;
    //console.log(start_node);
    //const finish_node = 
    // const nextElement = (curElement === activeElement.nextElementSibling) ? curElement.nextElementSibling: curElement;
    // tasksList.insertBefore(activeElement, nextElement);
    //console.log(activeElement);
}   