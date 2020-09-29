const express = require('express');
const {verificaToken} = require('../middleware/autenticacion');
const Contract = require('../models/Contract');
const app = express();


//===================================
//Mostrar todos los contratos
//===================================
app.get('/contracts',verificaToken,(req, res)=>{
    
    Contract.find((err, contracts)=>{

        if(err){
            return res.json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            data:contracts
        })

    });


});
//===================================
//Crear nuevo contrto
//===================================
app.post('/contracts',verificaToken,(req,res)=>{


});


module.exports = app;