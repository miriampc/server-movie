"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const  levelup = require('levelup');

const app = express();//captura el objeto express
const db = levelup('./data',{valueEncoding:'json'});

//aregando funcionalidades basicas, libreria
// bodyParser transforma require de tipo post a objeto json

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//Ruta de trabajo
const router = express.Router();

router.get('/',(req,res)=>{//va a mapear : parametros req donde lleg y responde 'hello world'
   res.json({message: "Hola soy el API de cine Laboratoria"});
});

router.post('/movies',(req,res)=>{
    //la-momia
    const id = req.body.nombre.toLowerCase().split(' ').join('-');//en una base se construye key,
    db.put(id,req.body,(err) => { //3 par: 1 key, 2 registro, 3 callback
    if (err) {
        return res.json({message: "Hubo un error a guardar los datos"})
    }
});
res.json({message: "La película se grabó con éxito"});
});

router.get('/movies',(req,res) => {
    let movies = [];
    db.createValueStream().on('data',(data) => {
        movies.push(data);
    }).on('end', _ => {
        res.json(movies);
    })
});

router.get('/movies/:id', (req,res) => {
    if (req.params.id) {
        db.get(req.params.id,(err,movie) => {
            if(err) return res.json({message: "Hubo un error al obtener"});
            res.json(movie);
        });
    }
});

app.use('/api',router);

const  port = process.env.PORT || 3000;
app.listen(port,_=>{
    console.log(`server corriendo en puerto ${port}`);
});