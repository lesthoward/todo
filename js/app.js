const todoForm = document.querySelector('.addtodo__form');
let lists = [ 
            {id: uniqueId(), text: 'Task Completed', count: 0}, 
            {id: uniqueId(), text: 'Studies', count: 0},
            {id: uniqueId(), text: 'Job', count: 0}
        ]
let todos =   [
    {id: 1, title: 'You can\'t remove this one'}
]
const listCheckedState = false


const todoListWrapper = document.querySelector('.viewtodo__list');

// Objeto de los "to do"
function createObject (title, category, completed=false) {
    this.id = uniqueId()
    this.title = title
    this.category = category
    this.completed = completed
}

// Cuando el contenido se cargue dibujar elementos de categoría y option del select
document.addEventListener('DOMContentLoaded', () => {
    printCategoryList ()
    printOptionList ()
    printTodos()
    
})

// Cuando el formulario se envía. Acá empieza toda la acción
todoForm.addEventListener('submit', e => {
    e.preventDefault()
    const addInput = document.querySelector('.addtodo__add');
    const selectInput = document.querySelector('.addtodo__selection');

    // Si está vacío, genera una alerta
    const addValue = addInput.value
    const idCategory = selectInput.value
    if(addValue === '' | idCategory === '') return alert('Type something.')

    // Crea un objeto con las propiedades de los input
    const newObjTodo = new createObject(addValue, idCategory)
    todoForm.reset()
    todos.push(newObjTodo)
    categroryCount(idCategory, 1)
    printTodos()
    
})

// Cuando de hace click sobre la lista de tareas, de esta forma porque los otros elementos deben esperar a que JavaScript genere el contenido
todoListWrapper.addEventListener('click', e => {
    // Tomo como referencia para las siguientes acciones
    const parentElement = e.target.parentElement
    // Quiero que al presionar en el titulo también se seleccione el checkbox, y haga su misma función
    if(e.target.classList.contains('viewtodo__title')) {
        const checkbox = e.target.parentElement.querySelector('.viewtodo__checkbox')
        if(!checkbox.checked) {
            checkbox.checked = true
            e.target.parentElement.dataset.completed = true
        } else {
            checkbox.checked = false
            e.target.parentElement.dataset.completed = false
        }
        completeTask(parentElement)
    } 

    if(e.target.classList.contains('viewtodo__checkbox')) {
        if(e.target.checked){
            e.target.parentElement.dataset.completed = true
        } else {
            e.target.parentElement.dataset.completed = false
        }
        completeTask(parentElement)
    }

    // Configurar el botón para eliminar
    if(e.target.classList.contains('viewtodo__delete')) {;
        // Tomar los id de referencia en la lista de "to do" y la de su categoria
        const itemId = e.target.parentElement.dataset.id
        const idCategory = e.target.parentElement.dataset.category
        // Extraer todos los todo a exepción del mismo id, de esta forma los elimino
        todos = todos.filter(todo => {
            return todo.id !== itemId
        })
        categroryCount(idCategory, -1)
        deleteTaskCompleted(parentElement)
        printTodos()
    }

    
})

// Borrar las tareas con el botón de eliminar para cada una, debe ser independiente
function deleteTaskCompleted (target) {
    const completed = target.dataset.completed
    if(completed === 'true') {
        lists[0].count += -1
    }
    printCategoryList()
}

// En el momento que se hace click sobre una tarea para tacharla, añadir a completadas o quitar de la mismas
function completeTask (target) {
    const completed = target.dataset.completed
    if(completed === 'true') {
        lists[0].count += 1
    } else {
        lists[0].count += -1
    }
    
    printCategoryList()
}

// El conteo de los tipos de categorias en relación con el arreglo. 
// Su id y forSum es para tomarlos del HTML a la hora de eliminar y el segundo para hacer una función modular de restar y sumar "categroryCount(..., -1 | +1)"
function categroryCount (idCategory, forSum) {
    lists.forEach(list => {
        if(list.id === idCategory) {
            list.count += forSum
        }
    })
    printCategoryList ()
}



// Cuando se genera un todo, esta es la 
function printTodos () {
    const todoWrapper = document.querySelector('.viewtodo__list');
    todoWrapper.innerHTML = ''
    todoWrapper.innerHTML = todos
        .map(todo => `
            <li class="viewtodo__item" data-completed="false" data-id="${todo.id}" data-category="${todo.category}">
                <input class="viewtodo__checkbox" type="checkbox">
                <p class="viewtodo__title">${todo.title.charAt(0).toUpperCase() + todo.title.slice(1)}</p>
                <i class="viewtodo__delete fas fa-times"></i>
            </li>
        `).join('')
}

// Dibujar la lista de las categorías de acuerdo al arreglo
function printCategoryList () {
    const categoryWrapper = document.querySelector('.addtodo__categories');
    categoryWrapper.innerHTML = ''
    categoryWrapper.innerHTML += lists
        .map(list => `
            <div class="addtodo__item">
                ${list.text}
                <span class="addtodo__count">${list.count}</span>
            </div>
            
        `).join('')
}

// Dibujar las opciones del select de en base al arreglo correspondiente
function printOptionList () {
    const selectItem = document.querySelector('.addtodo__selection');

    const fragment = document.createDocumentFragment()
    lists.forEach(list => {
        if(list.text !== lists[0].text) {
            const option = document.createElement('option');
            option.textContent = list.text
            option.value = list.id
            fragment.appendChild(option)
        }
    })
    selectItem.appendChild(fragment)
}

// Generador de id's aleatorios
function uniqueId () {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
