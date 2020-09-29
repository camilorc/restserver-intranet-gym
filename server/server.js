require('./config/config');

const express = require('express')
//var bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors')

const app = express()

app.use(cors());

//Habilitamos express.json . para leer el body como json en peticiones post
//Se debe pasar en el header Content-Type: application/json
app.use(express.json({ extended: true }));
//app.use(bodyParser.json());

//Importamos las rutas y las usamos
app.use(require('./routes/index'));

//Habilitamos la carpeta public 
app.use(express.static(path.resolve(__dirname,'../public')));

mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
}, (err,res) => {
    if(err) throw err;
    console.log("Base de datos conectada");
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT)
})