const functions = require('firebase-functions');
const express = require('express')
const admin = require('firebase-admin')
const app = express()


//datos obtenidos de google Cloud Firestore, configuracion del proyecto, cuentas de servicio
admin.initializeApp({
    credential: admin.credential.cert('./credentials.json'), //credentials.json es un archivo que obtuve de : generar nueva clave privada
    databaseURL: "https://prueba-5fb97.firebaseio.com"
})

const db = admin.firestore()

app.get('/hello',(req, res) => {
    return res.status(200).json({message: 'hello world'})
})

//obtener un dato
app.get('/api/products/:product_id', async (req, res) => {
     try {
         const doc = db.collection("SMINVENTARIO").doc(req.params.product_id) //product_id es variable
         const response =  await doc.get()         
         const product = response.data()
         return res.status(200).json(product)
     } catch (error) {
         res.status(500).send(error)
     }
})

//obtener todos los datos
app.get('/api/products', async (req, res) => {
    try {
      const query = db.collection('SNINVENTARIO')  
      const querySnapshot = await query.get()
      const docs = querySnapshot.docs

      const response = docs.map(doc => ({
          id: doc.id,
          producto: doc.data().producto,
          clave: doc.data().clave
      }))

      return res.status(200).json(response)
    } catch (error) {
        return res.status(500).send(error)
    }
})

app.post('/api/products', async (req, res) => {
   try {
    await db.collection('SMINVENTARIO').doc('/'+req.body.id +'/')
    .create({
        producto:req.body.producto,
        clave: req.body.clave
    })   

    return res.status(204).json()       
   } catch (error) {
       console.log(error)
       return res.status(500).send(error)
       
   }
})

exports.app = functions.https.onRequest(app)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
