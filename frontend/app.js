document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoList = document.getElementById('todo-list');
  const exportButton = document.getElementById('export-button');

  // Obtener todas las tareas desde el servidor
  const fetchTodos = async () => {
    const response = await fetch('http://localhost:3000/todos');
    const todos = await response.json();
    todoList.innerHTML = '';
    todos.forEach(todo => {
      const todoItem = document.createElement('li');
      todoItem.textContent = todo.text;
      todoItem.id = todo.id;
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.addEventListener('click', () => deleteTodo(todo.id));
      todoItem.appendChild(deleteButton);
      todoList.appendChild(todoItem);
    });
  };

  // Agregar una nueva tarea
  todoForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const newTodo = { id: Date.now().toString(), text: todoInput.value };
    await fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodo),
    });
    todoInput.value = '';
    fetchTodos();
  });

  // Eliminar una tarea
  const deleteTodo = async (id) => {
    await fetch(`http://localhost:3000/todos/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  // Exportar las tareas a un archivo JSON
  exportButton.addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/export');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'todos.json';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  });

  // Inicializar la lista de tareas
  fetchTodos();
});

