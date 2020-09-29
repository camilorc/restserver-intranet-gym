const express = require('express');
const Usuario = require('../models/Usuario');
const {verificaToken,verificarAdmin} = require('../middleware/autenticacion');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');

const app = express();


app.get('/usuario', [verificaToken,verificarAdmin],async(req, res) =>{
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    try {

        let usuarios = await Usuario
                                .find({estado:true})
                                .skip(desde)
                                .limit(limite);
        let total = await Usuario.count();

        res.json({
            ok:true,
            usuarios,
            total
        })
        
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            error
        });
    }



});

app.post('/usuario',async(req, res) => {

    try {

        let {nombre,email,password,role} = req.body;

        let usuario = new Usuario({
            nombre,
            email,
            password: bcrypt.hashSync(password,10),
            role
        });

        await usuario.save((error, userBD) => {

            //Verificamos si hay error
            if(error){
                console.log(error);
                return res.status(400).json({
                    ok:false,
                    error
                })
            }

            //Todo Bien
            userBD.password = null;

            //Debemos retornar el TOKEN
            token = jwt.sign({
                usuario: userBD
            }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD });

            res.json({
                ok:true,
                token
            })

        });
        

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            error:{
                msg: 'Hubo un error inesperado'
            }
        });
    }
    
});

app.put('/usuario/:id', verificaToken,async(req, res) => {

    let id = req.params.id;

    try {

        //Con la función _ del undescore
        //Extraemos del objeto solo los atributos que queremos que se puedan actualizar
        let body = _.pick(req.body,['nombre','email','img','role','estado']);
        
        let userBD = await Usuario.findByIdAndUpdate(id,body,{new:true, runValidators:true});

        userBD.password = null;

        res.json({
            ok:true,
            usuario:userBD
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            error
        });
    }
    
});

app.delete('/usuario/:id',verificaToken, async(req, res) => {

    let id = req.params.id;

    try {

       
        let userBD = await Usuario.findByIdAndUpdate(id,{estado:false},{new:true});

        userBD.password = null;

        res.json({
            ok:true,
            usuario:userBD
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            error
        });
    }
    
});

app.post('/usuario/obtener',verificaToken, (req, res)=>{

    try {

        if(req.usuario){

            res.json({
                ok:true,
                usuario:req.usuario
            });

        }else{

            res.status(400).json({
                ok: false,
                error:'Usuario no existe'
            });

        }
        
    } catch (error) {

        res.status(400).json({
            ok: false,
            error:'Usuario no existe'
        });
    }



});

module.exports = app;