const jwt = require('jsonwebtoken');
//=====================================
// Verificamos el TOKEN
//=====================================
const verificaToken = (req, res, next) => {

    let token = req.get('token'); //Obtenemos el Token desde el Header de la petición

    jwt.verify(token,process.env.SEED_TOKEN,(err,decoded)=>{

        if(err){
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario; //Añadimos al req un objeto usuario para tener sus datos
        next();

    });

};

//=====================================
// Verificamos si es ADMIN
//=====================================
const verificarAdmin = (req, res, next) => {

    let rol = req.usuario.role;

    if(rol === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'No tienes los permisos necesarios para realizar esta acción'
            }
        });
    }

    


};

module.exports = {
    verificaToken,
    verificarAdmin
};