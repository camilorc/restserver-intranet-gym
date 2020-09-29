const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

app.post('/login', async (req, res) => {

    const { email, password } = req.body;

    try {

        //Buscamos si existe el emai
        const user = await Usuario.findOne({ email });

        //Comprobamos si existe el usuario con ese Email
        if (!user) {
            return res.status(400).json({
                ok: false,
                error: { message: 'Usuario no encontrado en BD' }
            });
        }

        //Compramos que la contraseña sea correcta
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                ok: false,
                error: { message: 'Error en contraseña de BD' }
            });
        }

        //Generamos el TOKEN
        token = jwt.sign({
            usuario: user
        }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD });


        res.json({
            ok: true,
            usuario: user,
            token
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({
            ok: false,
            error: { message: 'Hubo un error en la petición' }
        });

    }


});


//Validación Token Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}


app.post('/google', async (req, res) => {

    let token = req.body.token

    let usuarioGoogle = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            })
        });

    //Verificar el usuario en nuestra BD
    Usuario.findOne({ email: usuarioGoogle.email }, (err, usuarioBD) => {

        //En caso de Error
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //Si existe el usuario 
        if (usuarioBD) {

            //y es de google ( hacemos login)
            if (usuarioBD.google) {
                //Generamos el TOKEN
                token = jwt.sign({
                    usuario: usuarioBD
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD });


                return res.json({
                    ok: true,
                    usuario: usuarioBD,
                    token
                })
            } else {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario ya existe. Intente con su email y password'
                    }
                });
            }

        } else {
            //Es primera vez que el usuario entra
            //Debemos crear el User en nuestra BD
            let usuario = new Usuario();

            usuario.nombre = usuarioGoogle.nombre;
            usuario.email = usuarioGoogle.email;
            usuario.google = true;
            usuario.img = usuarioGoogle.img;
            usuario.password = ':)';

            usuario.save((err, user) => {

                //En caso de Error
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Generamos el TOKEN
                token = jwt.sign({
                    usuario: user
                }, process.env.SEED_TOKEN, { expiresIn: process.env.CADUCIDAD });


                return res.json({
                    ok: true,
                    usuario: user,
                    token
                })
            });
        }
    });

});

module.exports = app;