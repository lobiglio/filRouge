const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost', // adresse du serveur
  user: 'root', // le nom d'utilisateur
  password: 'plogadi94', // le mot de passe
  database: 'db_filrouge' // le nom de la base de données
});
module.exports = connection;
