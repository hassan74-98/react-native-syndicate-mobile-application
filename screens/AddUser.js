import React, { useRef, useState } from 'react'
import { StyleSheet,View, Text, Button, Alert, ScrollView } from 'react-native'
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler'

import { TheContextConsumer } from '../context/context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auThentication, fireStore } from '../firebase/firebase';
// import { Picker } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ActivityIndicator } from 'react-native';
export default function AddUser({ navigation }) {
    
    const [loader, setloader] = useState(false)
    const [errorMessage, seterrorMessage] = useState("")
    // Usr Infos 
    const [userToAdd, setuserToAdd] = useState({
        email:"",
        // password:"123456",
        nom:"",
        prenom:"",
        numeroDeTelephone:"",
        cin:"",
        role:"User",
        proprietaireDe:[]
    })
    //++++++++++++++++++++++++++++++++++++++++++++++++ 

    // add appartement to appatements
    const handleAddAppartement = () => {
        setuserToAdd({...userToAdd,...userToAdd.proprietaireDe.push({
            // titreFoncier:"azazeaza",
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

        // let mySelectedDate = new Date(selectedDate)
        // Alert.alert(JSON.stringify(selectedDate),mySelectedDate.getFullYear()+" / "+mySelectedDate.getMonth()+" / "+mySelectedDate.getDate()+"\n"+(new Date(JSON.stringify(selectedDate).split('"')[1].split('T')[0])).toString())
        // let NewSelectedDate = new Date(mySelectedDate.getFullYear(),mySelectedDate.getMonth(),mySelectedDate.getDate());
        let NewObject = {...userToAdd}
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
    function randomPassword(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    
    

    
    
    
    
    const handleSubmit = (user) => {
        setloader(true)
        let verfied = true;
        
        if(!userToAdd["proprietaireDe"][0]){
            verfied = false;
            Alert.alert("Champ maquant:","Veuillez ajouter au moins un appartement."+userToAdd["proprietaireDe"].length.toString())
        }
        
        Object.keys(userToAdd).map((key,i)=>{
            if(key.toString() === "proprietaireDe"){
                
                userToAdd[key].map((appartement,appI)=>{
                    // appartement["titreFoncier"]

                    Object.keys(appartement).map((appKey)=>{

                        if(appartement[appKey] === ""){
                            Alert.alert("Champ manquant:", appKey.toString() +"\n"+ "(Appartement : " + (appI+1)+")")
                            verfied = false
                        }
                        if( appKey === "DateDeSignatureDuContrat"){
                            if( (new Date() <= appartement[appKey]) ){
                                verfied = false

                                Alert.alert("Erreur : ", "Date de signature du contrat incorrecte .")
                            }
                        }
                        
                    })
                })
                
            }else{
                if(userToAdd[key] === ""){
                    Alert.alert("Champ manquant:",key.toString())
                    verfied = false;
                }
            }

        })

        if(verfied===true){
            userToAdd["createdBy"] = user.uid
            auThentication.createUserWithEmailAndPassword((userToAdd.email).trim(),randomPassword(6)).then((Credentials)=>{
                fireStore.collection("users").doc(Credentials.user.uid).set(userToAdd).catch((e)=>{
                    seterrorMessage(e.toString());
                }).catch((e)=>{
                    setloader(false)
                    Alert.alert(e.toString())
                })
            }).then(()=>{
                
                setloader(false)
                
                setuserToAdd({
                    email:"",
                    nom:"",
                    prenom:"",
                    numeroDeTelephone:"",
                    cin:"",
                    role:"User",
                    proprietaireDe:[]
                })
            }).catch((e)=>{
                setloader(false)
                seterrorMessage(e.toString())
            }).then(() => {
                auThentication.sendPasswordResetEmail(userToAdd.email)
                Alert.alert(userToAdd.nom + userToAdd.prenom,"ajouté(e) 👍");
            })
        }
    }
    

    return (
        <TheContextConsumer>
                {(value) => {
                    if(value.userState){

                    
                    return(
                        <View style={styles.container}>
                            
                            
                            
                            
                                
                            
                            <ScrollView style={{width:"100%",height:"50%",textAlign:"center"}}>
                                    <View style={{height:70,alignItems:"center",fontSize:30,justifyContent:"center",width:"100%",elevation:5}}>
                                        <Text style={{fontSize:25}}>ajouter un copropriétaire</Text>
                                    </View>
                                    {/* <Text style={{textAlign:"center",margin:20,fontSize:20}}>infos du copropriétaire</Text> */}
                                    {/* <Text>
                                        {JSON.stringify(errorMessage)}
                                    </Text> */}
                                    <View>
                                        
                                        {Object.keys(userToAdd).map((key, i)=>{
                                            
                                            if(key !== "proprietaireDe" && key !== "password" && key !== "role"){
                                                return(
                                                    <View key={i}>
                                                        <Text style={{textAlign:"center"}}>{key.toString()} </Text>
                                                        <TextInput style={styles.input}
                                                            placeholder={key} 
                                                            label={key}
                                                            value={userToAdd[key]}
                                                            onChangeText={(text) => {
                                                                setuserToAdd((prev)=>{
                                                                    let New = {...prev}
                                                                    New[key] = text
                                                                    return(New)
                                                                }) 
                                                            }}
                                                            ref={tag => (myRefs.current[i] = tag)} 
                                                            
                                                            onSubmitEditing={() => {
                                                                
                                                                for(let t = 1 ; t<(myRefs.current.length - i) ; t++ ){
                                                                    if(myRefs.current[i+t]){
                                                                        myRefs.current[i+t].focus();
                                                                        break 
                                                                    }
                                                                    
                                                                }
                                                            }}
                                                        />
                                                    </View>
                                                )        
                                            }else if( key === "role" && value.userState.role === "Admin"){

                                                return(
                                                    <View key={i}>
                                                        <Text >{key.toString()} </Text>
                                                        
                                                        <View style={styles.input}>
                                                            <Picker
                                                                selectedValue={userToAdd["role"]}
                                                                style={{height:"100%"}}
                                                                onValueChange={(itemValue, itemIndex) => {
                                                                    setuserToAdd((prev)=>{
                                                                        let New = {...prev}
                                                                        New[key] = itemValue
                                                                        return(New)
                                                                    }) 
                                                                }}
                                                            >
                                                                <Picker.Item label="User" value="User" />
                                                                <Picker.Item label="Representative" value="Representative" />
                                                                <Picker.Item label="Syndic" value="Syndic" />
                                                                <Picker.Item label="Treasurer" value="Treasurer" />
                                                                {/* <Picker.Item label="Admin" value="Admin" /> */}
                                                            </Picker>
                                                            
                                                        </View>
                                                    </View>
                                                )
                                            }
                                            
                                            
                                        })}
                                    </View>
                                    {userToAdd["proprietaireDe"].map((appartement,index) =>{
                                        
                                        return(
                                            <View key={index} style={{backgroundColor:"#fca103",textAlign:"center",marginVertical:10,alignItems:"center",marginHorizontal:20,borderRadius:10}}>
                                                <Text style={{fontSize:20,margin:20}}> Appartement {index+1} </Text>
                                                    
                                                    
                                                

                                                {Object.keys(appartement).map((key, i)=>{
                                                    if(key !== "DateDeSignatureDuContrat"){
                                                        return(
                                                            <View key={i} >
                                                                <Text style={{textAlign:"center"}}>{key} </Text>
                                                                <TextInput
                                                                    ref={tag => (myRefs2.current[i] = tag)} 
                                                                    style={styles.input}
                                                                    placeholder={key}
                                                                    value={appartement[key]}
                                                                    onChangeText={(text) => {
                                                                        let NewObject = {...userToAdd}                                                        
                                                                        userToAdd["proprietaireDe"][index][key] = text;
                                                                        setuserToAdd(NewObject);
                                                                    }}
                                                                    onSubmitEditing={() => {
                                                                
                                                                        for(let t = 1 ; t<(myRefs2.current.length - i) ; t++ ){
                                                                            if(myRefs2.current[i+t]){
                                                                                myRefs2.current[i+t].focus();
                                                                                break 
                                                                            }
                                                                            
                                                                        }
                                                                    }}
                                                                    
                                                                />
                                                        
                                                            </View>
                                                        )   
                                                    }else{
                                                        return(
                                                            
                                                            <TouchableOpacity style={{display:"flex",alignItems:"center",justifyContent:"center"}} onPress={()=>showDatepicker(index)}>

                                                                <Text style={{textAlign:"center"}}>{"Date de signature du contrat"} </Text>
                                                                <Text style={{width: 300,height: 40,padding: 5,marginVertical: 10,borderColor: 'grey',borderStyle: 'solid',backgroundColor:"white",textAlignVertical:"center",textAlign:"center",borderWidth: 1,borderColor: 'grey',borderRadius: 3}}>
                                                                    {(typeof(appartement[key]) === "string") ? (<Text>"Cliquer pour selectionner une date" </Text>) : (<Text>{JSON.stringify(appartement[key]).split('"')[1].split("T")[0]}</Text>)}
                                                                </Text>
                                                                
                                                                {(role === index) && (
                                                                
                                                                    <View>
                                                                        
                                                                        <DateTimePicker
                                                                            testID={key.toString()}
                                                                            value={appartement[key] || new Date()}
                                                                            mode={mode}
                                                                            
                                                                            is24Hour={true}
                                                                            display="default"
                                                                            onChange={(event, selectedDate) => {
                                                                                
                                                                                if(selectedDate){
                                                                                    setrole(-1)
                                                                                    setShow(Platform.OS === 'ios');
                                                                                    setuserToAdd(handleDatePickerOnChange(selectedDate,index,key));
                                                                                }else{
                                                                                    setrole(-1)
                                                                                }
                                                                                
                                                                            }
                                                                                
                                                                            }
                                                                        />    
                                                                    </View>
                                                                    
                                                                )}
                                                                
                                                                
                                                            </TouchableOpacity>
                                                        )
                                                    }
                                                    
                                                })}
                                                <View style={{width:200,marginBottom:10}}>
                                                    <Button
                                                        title="supprimer"
                                                        onPress={()=>{
                                                            
                                                            if(index > -1){
                                                                let n =userToAdd["proprietaireDe"]
                                                                n.splice(index,1)
                                                                setuserToAdd({...userToAdd,proprietaireDe:n})
                                                            }
                                                        }}
                                                    />    
                                                </View>
                                                
                                            </View>
                                        )
                                        
                                    })}
                                    <View style={{marginVertical:20,paddingHorizontal:100}}>
                                        <Button
                                            title="ajouter un appartement"
                                            onPress={() =>{
                                                handleAddAppartement();
                                            }
                                            }
                                        />    
                                    </View>
                                    
                                <View style={{marginVertical:20,paddingHorizontal:100}}>
                                    {(loader) ? 
                                        (
                                            <ActivityIndicator size="large" color="#000" />
                                        )
                                        :
                                        (
                                            <Button
                                                title="Ajouter"
                                                onPress={() => {
                                                    if(["Admin","Representative"].includes(value.userState.role)){
                                                        handleSubmit(value.userState)
                                                    }else{
                                                        Alert.alert("Warning","Don't try it again, be responsible.")
                                                    }
                                                    
                                                }}
                                            />                   
                                        )
                                    
                                    }
                                     
                                </View>
                                
                            </ScrollView>
                            
                            
                            
                            
                            
                        </View>      
                    )
                    }
                }}
        </TheContextConsumer>
            
            

        
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fccf97",
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


