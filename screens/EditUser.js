import React, { useEffect, useRef, useState } from 'react'
import { Alert } from 'react-native'
import { View, Text, TextInput, StyleSheet, Button,ScrollView } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TheContextConsumer } from '../context/context'
import DateTimePicker from '@react-native-community/datetimepicker';
import { fireStore } from '../firebase/firebase'

import _ from 'lodash';
export default function EditUser({ route,navigation }) {
    
    // const [initialUser, setuserToAdd] = useState(route.params.user)
    
    const initialUser = _.cloneDeep(route.params)

    const [userToEdit, setuserToEdit] = useState(route.params)
    const [clone, setclone] = useState(route.params)
    //++++++++++++++++++++++++++++++++++++++++++++++++ 
    // useEffect(() => {
    //     setuserToEdit(_.cloneDeep(route.params))
        
    // }, [])

    // add appartement to appatements
    const handleAddAppartement = () => {
        setuserToEdit({...userToEdit,...userToEdit.proprietaireDe.push(
            {
                // titreFoncier:"",
                DateDeSignatureDuContrat : "",
                NomDuNotaire : "",
                NAppartement : "",
                Immeuble : "",
            }
        )})
    }
    
    // ++++++++++++++++++++++++++++


    // Triggers to show date-pickers
    const [role, setrole] = useState(-1)
    //+++++++++++++++++++++++++++++

    // input Refs To focus on next input automatically
    const myRefs= useRef([]);
    const myRefs2= useRef([]);
    // +++++++++++++++++++++++++++++++++++++++++++++++

    // date picker parameters and functions
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const handleDatePickerOnChange = (selectedDate,index,key) => {

        
        let NewObject = {...userToEdit}
        NewObject["proprietaireDe"][index][key] = (new Date(JSON.stringify(selectedDate).split('"')[1].split('T')[0]));
        return(NewObject)
    }
    const showMode = (currentMode) => {
        setMode(currentMode);
    };
    const showDatepicker = (x) => {
        showMode('date');
        setrole(x)
    };
    // +++++++++++++++++++++++++++++++++++++++++++++++


    
    

    
    
    
    
    const handleSubmit = () => {
        let verfied = true;
        
        if(!userToEdit["proprietaireDe"][0]){
            verfied = false;
            Alert.alert("Champ maquant:","Veuillez ajouter au moins un appartement."+userToEdit["proprietaireDe"].length.toString())
        }
        Object.keys(userToEdit).map((key,i)=>{
            if(key.toString() === "proprietaireDe"){
                
                userToEdit[key].map((appartement,appI)=>{
                    Object.keys(appartement).map((appKey)=>{
                        if(appartement[appKey] === ""){
                            Alert.alert("Champ manquant:", appKey.toString() +"\n"+ "(Appartement : " + (appI+1)+")")
                            verfied = false
                        }
                    })
                })
                
            }else{
                if(userToEdit[key] === ""){
                    Alert.alert("Champ manquant:",key.toString())
                    verfied = false;
                }
            }

        })
        if(verfied===true){

            auThentication.createUserWithEmailAndPassword(userToEdit.email,userToEdit.password).then((Credentials)=>{
                fireStore.collection("users").doc(Credentials.user.uid).set(userToEdit).catch((e)=>{
                    Alert.alert(e.toString());
                }).catch((e)=>Alert.alert(e.toString()))
            }).then(()=>{
                Alert.alert(userToEdit.email,"ajouté 👍");
                setuserToEdit({
                    email:"",
                    password:"123456",
                    nom:"",
                    prenom:"",
                    numeroDeTelephone:"",
                    cin:"",
                    proprietaireDe:[]
                })
            }).catch((e)=>Alert.alert(e.toString()))
        }
        
        
        
    }

    return (
        <TheContextConsumer>
                {(value) => {
                    return(
                        <View style={styles.container}>
                            
                            
                            <Text></Text>

                            <View style={{height:70,alignItems:"center",justifyContent:"center",backgroundColor:"lightgrey",width:"100%"}}>
                                <Text> Liste des utilisateurs </Text>
                            </View>

                            <ScrollView style={{backgroundColor:"grey",width:"100%",height:"50%",textAlign:"center"}}>
                                    {(userToEdit) && (
                                        <View style={{height:"100%",display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"white"}}>

                                            <Text style={{backgroundColor:"red"}}>
                                                {JSON.stringify(userToEdit.email)}
                                            </Text>
                                            
                                        </View>
                                    )}
                            </ScrollView>


                            <View style={{flexDirection:"row",width:"100%",alignItems:"center",justifyContent:"space-between"}}>
                                <View style={{flexGrow:1,padding:20,borderRadius:20}}>
                                    <Button
                                        title="Ajouter"
                                        onPress={
                                            // handleSubmit
                                            () => {
                                                // setuserToEdit((prev)=>{
                                                //     let New = {...prev}
                                                //     New.email = "test@gmail.com"
                                                //     return(New)
                                                // })
                                                setuserToEdit({})
                                                // Alert.alert("",JSON.stringify(userToEdit))
                                            }
                                        }
                                    />
                                </View>
                                <View style={{flexGrow:1,padding:20,borderRadius:20}}>
                                    <Button
                                        title="Annuler"
                                        onPress={()=>{
                                            // console.log(initialUser.email+"\n"+userToEdit.email)
                                            // Alert.alert(JSON.stringify(value.usersList[0].proprietaireDe[0].DateDeSignatureDuContrat),JSON.stringify(userToEdit.proprietaireDe[0].DateDeSignatureDuContrat))
                                            // setuserToAdd(initialUser)
                                            // value.getUsersList()
                                            Alert.alert("",JSON.stringify(userToEdit["email"])+"\n"+JSON.stringify(clone["email"]))
                                            // setuserToAdd(userToEdit)
                                            
                                        }
                                            
                                        }
                                    />
                                </View>
                                
                            </View>
                            
                            
                        </View>      
                    )
                }}
        </TheContextConsumer>
            
            

        
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    input: {
        width: 300,
        height: 40,
        padding: 5,
        marginVertical: 10,
        marginHorizontal: 30,
        borderWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
        borderRadius: 3,
        backgroundColor:"white",
    },
});