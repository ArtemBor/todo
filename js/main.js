const form = document.querySelector('#form') 
const taskInput = document.querySelector('#taskInput')
const tasksList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'))
    tasks.forEach(function (task) {
        renderTask (task)
    });
}

checkEmptyList ()

// Добавление задачи
form.addEventListener('submit', addTask)

// Удаление задачи
tasksList.addEventListener('click', deleteTask)

// Отмечаем задачу завершенной
tasksList.addEventListener('click', doneTask)


// Функция добавления задачи
function addTask (event) {
     //отменяем отправку формы
     event.preventDefault();

     //Достаем текст задачи из поля ввода
     const taskText = taskInput.value
 
    // Описываем задачу в виде объекта
     const newTask = {
        id: Date.now(),
        text: taskText,
        done: false
    }

    // Добавляем задачу в массив с задачами
    tasks.push(newTask)

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage ()

    renderTask(newTask)

     //очищаем поле ввода
     taskInput.value = ''
     taskInput.focus()
 
     checkEmptyList ()  
}

// Функция удаления задачи
function deleteTask (event) {
    // Проверяем, если клик был НЕ по кнопке "удалить задачу"
    if (event.target.dataset.action !== 'delete') {
        return 
    }

    // Проверяем, что клик был по кнопке "Удалить задачу"
    const paranNode = event.target.closest('li')
    
    // Определяем ID задачи
    const id = Number(paranNode.id)

    // // Находим индекс задачи в массиве
    // const index = tasks.findIndex(function(task) {
    //     if (task.id === id) {
    //         return true
    //     }
    // })

    // // Удаляем задачу из массива
    // tasks.splice(index, 1)

    // ИСПОЛЬЗОВАНИЕ МЕТОДА FILTER для удаления задачи из массива задач
    tasks = tasks.filter(function (task) {
        if (task.id === id) {
            return false
        } else {
            return true
        }
    })

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage ()

    // Удаляем задачу из разметки
    paranNode.remove()

    checkEmptyList ()
}

// Функция отметки задачи, как выполненная
function doneTask (event) {
    // Проверяем, что клик был НЕ по кнопке "Задача выполнена"
    if (event.target.dataset.action !== 'done') {
        return
    }

    // Проверяем, что клик был по кнопке "Задача выполнена"
        const paranNode = event.target.closest('li')
        
        //Определяем id задачи
        const id = Number(paranNode.id)

        const task = tasks.find(function (task) {
            if (task.id === id) {
                return true
            }
        })

    task.done = !task.done

    // Сохраняем список задач в хранилище браузера LocalStorage
    saveToLocalStorage ()

    const taskTitle = paranNode.querySelector('.task-title')
    taskTitle.classList.toggle('task-title--done')

}

function checkEmptyList () {
    if (tasks.length === 0) {
        const emptyListHTML = `<li id="emptyList" class="list-group-item empty-list">
					<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
					<div class="empty-list__title">Список дел пуст</div>
				</li>`
        tasksList.insertAdjacentHTML('afterbegin', emptyListHTML)
    } 

    if (tasks.length > 0) {
        const emptyListE1 = document.querySelector('#emptyList')
        emptyListE1 ? emptyListE1.remove() : null
    }
}

function saveToLocalStorage () {
    localStorage.setItem('tasks', JSON.stringify(tasks))
}

function renderTask (task) {
    // Формируем css класс
    const cssClass = task.done ? 'task-title task-title--done' : 'task-title'

     //формируем разметку для новой задачи
     const taskHTML = `<li id='${task.id}' class="list-group-item d-flex justify-content-between task-item">
                     <span class="${cssClass}">${task.text}</span>
                     <div class="task-item__buttons">
                         <button type="button" data-action="done" class="btn-action">
                             <img src="./img/tick.svg" alt="Done" width="18" height="18">
                         </button>
                         <button type="button" data-action="delete" class="btn-action">
                             <img src="./img/cross.svg" alt="Done" width="18" height="18">
                         </button>
                     </div>
                 </li>`
     //Добавляем задачу на страницу
     tasksList.insertAdjacentHTML('beforeend', taskHTML)
}