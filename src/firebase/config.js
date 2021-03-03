import firebase from "firebase/app"
import 'firebase/storage'
import 'firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
    apiKey: "AIzaSyAnCJRehR8wUVZ6YGxCD3bsVH8yssTSUUY",
    authDomain: "realme-a9ba5.firebaseapp.com",
    databaseURL: "https://realme-a9ba5-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "realme-a9ba5",
    storageBucket: "realme-a9ba5.appspot.com",
    messagingSenderId: "213075706973",
    appId: "1:213075706973:web:8d0b7f8caec3bc47ce39b4",
    measurementId: "G-PF37B6150Y"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const projectStorage = firebase.storage()
const projectFirestore = firebase.firestore()
// console.log(firebase.auth())
const auth = firebase.auth()
const timestamp = firebase.firestore.FieldValue.serverTimestamp
// const databaseRef = firebase.database().ref()
// export const postsRef = databaseRef.collection("posts")
export const postsRef = firebase.firestore().collection('posts')

export { projectStorage, projectFirestore, timestamp, auth }
