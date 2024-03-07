const http = require('http');
const express = require('express');
const app = require('./app');
const mongoose = require('mongoose'); 



mongoose.connect('mongodb+srv://fabbattais:Xcbm82f7@cluster0.714hsoe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',)
  .then(() => {
    console.log('Connexion à MongoDB réussie !');

    const server = http.createServer(app);

    server.listen(port, () => {
      console.log(`Serveur en cours d'exécution sur le port ${port}`);
    });
  })
  .catch((error) => console.log('Connexion à MongoDB échouée ! Erreur :', error));
