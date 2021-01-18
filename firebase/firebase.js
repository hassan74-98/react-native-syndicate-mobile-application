import firebase from "firebase"
const app = firebase.initializeApp({
    //put your firebase apikey project 
})

const fireStore = app.firestore();
const auThentication = app.auth();
const Storage = app.storage();
const TimeStamp = firebase.firestore.FieldValue.serverTimestamp();
export {fireStore,auThentication,Storage,TimeStamp}
