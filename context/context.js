import React, { createContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { auThentication, fireStore } from "../firebase/firebase";
import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.uninstall()
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const TheContext = createContext();

export default function TheContextProvider(props) {

    const [userState, setuserState] = useState({});
    
    const [usersList, setusersList] = useState([]);

    const [loading, setloading] = useState(false)
    
    
    
    
    
    

    

    // const getUsersList = () => {
    //     let t = []
    //     fireStore.collection("users").get().then((snapshot) => {
    //         snapshot.docs.map((doc) => {
    //             let x = doc.data();
    //             x.id = doc.id;
    //             t.push(x)
    //         })
    //     }).then((e)=>{
    //         setusersList(t)
    //     }) 
    // }
    
    

    const Login = (email,password) => {
        setloading(true)
        auThentication.signInWithEmailAndPassword(email,password).then((Credentials)=>{
            // let loader = true;
            let user = {}
            fireStore.collection('users').doc(Credentials.user.uid).get().then(async (doc)=>{
                user = doc.data();
                user["uid"] = Credentials.user.uid;
                
                
            }).then(() => {
                // loader = false;
                setloading(false)
                setuserState(user);
                
            })
        }).catch((e) => {
            setloading(false)
            Alert.alert("",e.toString())
            
        })
        
    }
    const addNewUser = (userToadd) => {
        return(
            auThentication.createUserWithEmailAndPassword(userToadd.email,userToadd.password).then((Credentials)=>{
                fireStore.collection("users").doc(Credentials.user.uid).set(userToadd).catch((e)=>{
                    Alert.alert(e.toString());
                }).catch((e)=>Alert.alert(e.toString()))
            }).then(()=>{Alert.alert(userToadd.email,"ajouté 👍")}).catch((e)=>Alert.alert(e.toString()))
        )
    }
    
    const LogOut = () =>{
        auThentication.signOut();
        setuserState({})
    }
    // const getUserByUid = (uid) => {
        
    //     fireStore.collection("users").doc(uid).get().then((querySnapshot)=>{
    //         return(querySnapshot.data())
    //     }).catch((e)=>{Alert.alert(e.toString())})
    // }
    

    return (
        <TheContext.Provider value={ {userState,loading,Login,LogOut,addNewUser  } }>
            {props.children}
        </TheContext.Provider>
    )
}
const TheContextConsumer = TheContext.Consumer;

export {TheContextProvider,TheContextConsumer}