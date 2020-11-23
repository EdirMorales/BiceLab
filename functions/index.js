const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');

const app = express();




exports.helloworld = functions.https.onRequest((request, response) => {
    response.send("Hello");
});