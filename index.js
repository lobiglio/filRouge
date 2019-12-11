const express = require('express');
const connection = require('./conf');
const app = express();
const port = 3000;

// écoute de l'url "/tasks"
app.get('/tasks', (req, res) => {
  // connection à la base de données, et sélection des taches
  connection.query('SELECT * from tasks', (err, results) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      res.status(500).send('Erreur lors de la récupération des taches');
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

// écoute de l'url "/tasks/light"
app.get('/tasks/light', (req, res) => {
  connection.query('SELECT title, is_done, days from tasks', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des champs');
    } else {
      res.json(results);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});
