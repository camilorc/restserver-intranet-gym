
// ==============================
// Puerto
// ==============================
process.env.PORT = process.env.PORT || 4000;

// ==============================
// Entorno
// ==============================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==============================
// Base de Datos
// ==============================
let urlBD;
if(process.env.NODE_ENV === 'dev'){
    urlBD = 'mongodb://localhost:27017/intranet-gym';
}else{
    urlBD = 'mongodb+srv://camilorc:snRck3j15n0J5HKV@cluster0-rp8kx.gcp.mongodb.net/intranet-gym';
}

process.env.URLDB = urlBD;

// ==============================
// TOKEN caducidad
// ==============================
//Segundos
//Minutos
//horas
//dias
process.env.CADUCIDAD = 60 * 60 * 24 * 30;

// ==============================
// SEED TOKEN
// ==============================
process.env.SEED_TOKEN = process.env.SEED_TOKEN || 'palabra-secreta-dev';

// ==============================
// CLIENT ID GOOGLE
// ==============================
process.env.CLIENT_ID = process.env.CLIENT_ID || '336967462765-s79jd1i8729k5t5ge0050pe762prvi5b.apps.googleusercontent.com';