// 👉 Importar librerías
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const connection = require('./db'); // Asegúrate que db.js esté configurado
const app = express();
const PORT = 3000;

// 👉 Middlewares
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Para leer application/x-www-form-urlencoded
app.use(bodyParser.json()); // ✅ Opcionalmente, para leer JSON
app.use(express.static(path.join(__dirname, 'views'))); // ✅ Para servir los archivos de views/

// 👉 Ruta para obtener la lista de colegios
app.get('/colegios', (req, res) => {
  const query = 'SELECT id, nombre FROM colegio';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener colegios:', err.message);
      return res.status(500).json({ error: 'Error al cargar colegios' });
    }
    res.json(results); // ✅ Respondemos con el array de colegios
  });
});

// 👉 Ruta para recibir y guardar alumno
app.post('/registrar', (req, res) => {
  const { nombre, direccion, telefono, id_colegio } = req.body;

  // Validación de datos
  if (!nombre || !direccion || !telefono || !id_colegio) {
    return res.status(400).send('❌ Todos los campos son obligatorios.');
  }

  const query = 'INSERT INTO alumno (nombre, direccion, telefono, id_colegio) VALUES (?, ?, ?, ?)';
  connection.query(query, [nombre, direccion, telefono, id_colegio], (err, result) => {
    if (err) {
      console.error('❌ Error al insertar alumno:', err.message);
      return res.status(500).send('❌ Error al registrar al alumno.');
    }
    res.send('✅ Alumno registrado correctamente.');
  });
});

// 👉 Ruta principal (carga del formulario)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'views', 'formulario.html')); // ✅ Sirve el formulario
});

// 👉 Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en: http://localhost:${PORT}`);
});
