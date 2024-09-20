import admin from 'firebase-admin';

const serviceAccount = require("../privateKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});