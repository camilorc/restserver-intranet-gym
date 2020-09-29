const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contractSchema = new Schema({
    start:{
        type: Date,
        require:true
    },
    end:{
        type: Date,
        require:true
    },
    total:{
        type: Number,
        require:true
    },
    certificate_student:{
        type: Boolean,
        default:false
    },
    description:{
        type: String
    },
    estado:{
        type: Boolean,
        default:true
    }

});

module.exports = mongoose.model('Contract',contractSchema);