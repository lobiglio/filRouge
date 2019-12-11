const express = require('express');
const connection = require('./conf');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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

// Récupération de certaines données des taches"
app.get('/tasks/light', (req, res) => {
  connection.query('SELECT title, is_done, days from tasks', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des champs');
    } else {
      res.json(results);
    }
  });
});

// Récupération des taches filtrees par titre commençant par faire"
app.get('/tasks/filter1', (req, res) => {
  connection.query(
    'SELECT * from tasks WHERE title LIKE "faire%"',
    (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des champs');
      } else {
        res.json(results);
      }
    }
  );
});

// Récupération des taches supérieures à 3 jours"
app.get('/tasks/filter2', (req, res) => {
  connection.query('SELECT * from tasks WHERE days>3', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des champs');
    } else {
      res.json(results);
    }
  });
});

// Récupération des taches ordonnées"
app.get('/tasks/order', (req, res) => {
  connection.query('SELECT * from tasks ORDER BY days DESC', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des champs');
    } else {
      res.json(results);
    }
  });
});

// écoute de l'url "/api/tasks" avec le verbe POST
app.post('/tasks', (req, res) => {
  // récupération des données envoyées
  const formData = req.body;
  // connexion à la base de données, et insertion de la tache
  connection.query('INSERT INTO tasks SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la sauvegarde de la tache');
    } else {
      res.sendStatus(200);
    }
  });
});

// Modification d'une entité
app.put('/tasks/:id', (req, res) => {
  const idTask = req.params.id;
  const formData = req.body;
  connection.query(
    'UPDATE tasks SET ? WHERE id = ?',
    [formData, idTask],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la modification de la tâche');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Modification du booléen d'une entité
app.put('/tasks/toggle/:id', (req, res) => {
  const idTask = req.params.id;
  connection.query(
    'UPDATE tasks SET is_done = !is_done WHERE id = ?',
    idTask,
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send('Erreur lors de la modification de la tâche');
      } else {
        res.sendStatus(200);
      }
    }
  );
});

// Suppression d'une entité
app.delete('/tasks/:id', (req, res) => {
  const idTask = req.params.id;
  connection.query('DELETE FROM tasks WHERE id = ?', [idTask], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send('Erreur lors de la suppression de la tâche');
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});
