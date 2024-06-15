const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

let todos = [];

// Obtener todas las tareas
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Agregar una nueva tarea
app.post('/todos', (req, res) => {
  const todo = req.body;
  todos.push(todo);
  res.status(201).json(todo);
});

// Eliminar una tarea
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  todos = todos.filter(todo => todo.id !== id);
  res.status(204).end();
});

// Exportar las tareas a un archivo JSON
app.get('/export', (req, res) => {
  const jsonContent = JSON.stringify(todos, null, 2);
  fs.writeFile('todos.json', jsonContent, 'utf8', (err) => {
    if (err) {
      res.status(500).send('Error al exportar las tareas');
    } else {
      res.download('todos.json');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});

