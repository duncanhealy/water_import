// var functions = require('firebase-functions');

// // Start writing Firebase Functions
// // https://firebase.google.com/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// })
const functions = require('firebase-functions')

const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)
// Team, Project, User params
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /q/:pushId/original
exports.addQ = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text
  // Push it into the Realtime Database then send a response
  admin.database().ref('/q').push({original: original}).then(snapshot => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    res.redirect(303, snapshot.ref)
  })
})

exports.e = functions.database.ref('/{groupId}/{pushId}/encrypt')
    .onWrite(event => {
      const _data = event.data.val()
      console.log('encrypt', event.params.groupID, event.params.pushId, _data)
      const encryptedstring = _data
      return event.data.ref.parent.child('e').set(encryptedstring)
    })

// Listens for new Qs added to /q/:pushId/original and creates an
// uppercase version of the Q to /q/:pushId/uppercase
exports.makeUppercase = functions.database.ref('/q/{pushId}/original')
    .onWrite(event => {
      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val()
      console.log('Uppercasing', event.params.pushId, original)
      const uppercase = original.toUpperCase()
      // You must return a Promise when performing asynchronous tasks inside a Functions such as
      // writing to the Firebase Realtime Database.
      // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
      return event.data.ref.parent.child('uppercase').set(uppercase)
    })
