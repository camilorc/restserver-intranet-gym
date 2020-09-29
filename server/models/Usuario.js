const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre:{
        type: String,
        required: [true,'El nombre es requerido']
    }, 
    email:{
        type: String,
        unique: true,
        required: [true, 'El email es obligatorio']
    }, 
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img:{
        type: String,
        required: false
    },
    role:{
        type: String,
        default: 'USER_ROLE',
        enum: {
            values: ['ADMIN_ROLE','USER_ROLE'],
            message: '{VALUE} no es un rol válido'
        }
    },
    estado:{
        type: Boolean,
        default:true
    },
    google:{
        type: Boolean,
        default:false
    }

});

usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe ser único'});

module.exports = mongoose.model('Usuario',usuarioSchema);