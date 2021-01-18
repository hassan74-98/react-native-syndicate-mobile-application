import React, { useState } from 'react'
import { Alert } from 'react-native'
import { Image } from 'react-native'
import { View, Text, StyleSheet, Button } from 'react-native'
import { ScrollView, TextInput, TouchableOpacity } from 'react-native-gesture-handler'
import { TheContextConsumer } from '../context/context'
import { fireStore, TimeStamp,Storage } from '../firebase/firebase'
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { ActivityIndicator } from 'react-native'
export default function UploadCharge({navigation}) {
    const [loader, setloader] = useState(false)
    const [timestamp, settimestamp] = useState(TimeStamp)
    const [Charge, setCharge] = useState({
        montant : "",
        createdAt : "",
        declaredAt:"",
        by:"",
        service:"",
        autre:"",
        documentUrl : ""
    })
    const [file, setfile] = useState(null)
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [datePickerOnOff, setdatePickerOnOff] = useState(false)
    const showMode = (currentMode) => {
        setMode(currentMode);
    };
    // ***************************
    
    
    const showDatepicker = () => {
        showMode('date');
        setdatePickerOnOff(true);
    };
    const handleUploadCharge = async (user) => {
        // Alert.alert("",JSON.stringify(timestamp))
        if(user.role === "Admin"){
            
            if(file){
                setloader(true)
                const response = await fetch(file.uri);
                const blob = await response.blob();
                const imageRef = await Storage.ref().child("charges").child((user.nom+"_"+user.prenom)).child(((new Date()).getTime()).toString())
                
                if(Charge.service === ""){
                    setloader(false)
                    Alert.alert("","veuillez sélectionner un service")
                }else {
                    
                    if(Charge.montant.length === 0){
                        setloader(false)
                        Alert.alert("","veuillez saisir le montant de la charge")
                    }else{
                        
                        if(Charge.declaredAt === ""){
                            setloader(false)
                            Alert.alert("","veuillez indiquer la date correspondente à la charge")
                            
                        }else{





                            
                            if(Charge.service === "Autre" && Charge.autre === ""){
                                
                                if(Charge.autre === ""){
                                    setloader(false)
                                    Alert.alert("","veuillez indique le justificatif de la charge")
                                }
                            }else{
                                
                                imageRef.put(blob).then(() => {
                                    
                                    imageRef.getDownloadURL().then((x) => {
                                        
                                        fireStore.collection("charges").doc((imageRef.fullPath.split("/")[0]).toString()+(imageRef.fullPath.split("/")[1]).toString()+(imageRef.fullPath.split("/")[1]).toString()+(imageRef.fullPath.split("/")[2]).toString()).set({
                                            montant : Charge.montant,
                                            createdAt : TimeStamp,
                                            declaredAt:Charge.declaredAt,
                                            by:user.uid,
                                            service:Charge.service,
                                            autre:Charge.autre,
                                            documentUrl : x.toString()
                                        }).then(()=>{
                                            setloader(false)
                                            setCharge({
                                                montant : "",
                                                createdAt : "",
                                                declaredAt:"",
                                                by:"",
                                                service:"",
                                                autre:"",
                                                documentUrl : ""
                                            })
                                            setfile(null)
                                            Alert.alert("Charge ajoutée ")
                                        }).catch((e) => {
                                            setloader(false)
                                            Alert.alert("",e.toString())
                                        })
                                    }).catch((e) => {
                                        setloader(false)
                                        Alert.alert("",e.toString())
                                    })
                                })
                            }
                        }
                    }

                    
                }
            }else{
                setloader(false)
                Alert.alert("","Veuillez sélectionner une photo")
            }





        }else{
            setloader(false)
            Alert.alert("Error","Seul trésorier peut ajouter une charge !!!")
        }
    }
    const pickImage = async (x) => {
        const options = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        }
        let result = null
        if(x === 1){
            result = await ImagePicker.launchCameraAsync(options);
        }else{
            result = await ImagePicker.launchImageLibraryAsync(options);
        }
        if (!result.cancelled) {
          
          setfile(result)
          
        }
    };
    return (
        <TheContextConsumer>
            {(value) => {

                return(
                    <View style={styles.container}>
                        
                        <ScrollView style={{width:"100%",height:"50%",textAlign:"center",paddingVertical:40}}>

                            
                            <View style={{alignItems:"center",width:"100%"}}>
                                {(file) ? <Image source={{ uri: file.uri }} style={styles.file} />
                                        : 
                                        (
                                            // <Image source={{ uri: "" }} style={styles.file} />
                                            <View style={styles.file}>
                                                <Text style={{fontSize:30}}>
                                                    Ajouter une photo
                                                </Text>
                                            </View>
                                        )
                                }

                                {(file) && 
                                    <View style={{padding:10}}>
                                        <Button
                                            color="white"
                                            title="❌"
                                            onPress={()=>{
                                                setfile(null)
                                            }}
                                        /> 
                                    </View>
                                }
                                {(!file) && 
                                    <View style={{display:"flex",flexDirection:"row",flex:1}}>
                                        <View style={styles.buttons}>
                                            
                                            <TouchableOpacity onPress={()=>{pickImage(1)}} style={{alignItems:"center"}}>
                                                <Image source={require("../Images/camera.png")} style={styles.icon} />
                                                {/* <Text>Prendre une photo</Text> */}
                                            </TouchableOpacity>
                                            
                                        </View >
                                        <View style={styles.buttons}>
                                            <TouchableOpacity onPress={()=>{pickImage(0)}} style={{alignItems:"center"}}>
                                                <Image source={require('../Images/gallery.png')}  style={styles.icon} />
                                                
                                            </TouchableOpacity>
                                            
                                        </View> 
                                    </View>
                                }
                                {/* <View style={styles.input}>
                                    <Picker
                                        selectedValue={Charge["service"]}
                                        style={{height:"100%"}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setCharge({...Charge,service : itemValue})
                                        }}
                                    >
                                        <Picker.Item label="sélectionner une charge" value="" />
                                        <Picker.Item label="Lydec" value="Lydec" />
                                        <Picker.Item label="Securité" value="Securité" />
                                        <Picker.Item label="Jardinage" value="Jardinage" />
                                        <Picker.Item label="Ascenseur" value="Ascenseur" />
                                        <Picker.Item label="Plomberie" value="Plomberie" />
                                        <Picker.Item label="Autre" value="Autre" />
                                    </Picker>
                                    
                                </View> */}
                                {
                                    (Charge.service === "Autre") ? 
                                    <TextInput style={styles.input}
                                        placeholder={"Autre charge"} 
                                        label={"Autre charge"}
                                        value={Charge["autre"]}
                                        onChangeText={(text) => {
                                            setCharge({...Charge,autre:text})
                                        }}
                                    /> 
                                    :
                                    <View style={styles.input}>
                                        <Picker
                                            selectedValue={Charge["service"]}
                                            style={{height:"100%"}}
                                            onValueChange={(itemValue, itemIndex) => {
                                                setCharge({...Charge,service : itemValue})
                                            }}
                                        >
                                            <Picker.Item label="sélectionner une charge" value="" />
                                            <Picker.Item label="Lydec" value="Lydec" />
                                            <Picker.Item label="Securité" value="Securité" />
                                            <Picker.Item label="Jardinage" value="Jardinage" />
                                            <Picker.Item label="Ascenseur" value="Ascenseur" />
                                            <Picker.Item label="Plomberie" value="Plomberie" />
                                            <Picker.Item label="Autre" value="Autre" />
                                        </Picker>
                                        
                                    </View> 
                                }
                                {/*  */}
                                <View style={{justifyContent:"space-around",flex:1}}>

                                    <View style={styles.dateInput}>
                                        <TextInput style={styles.dateInputField}
                                            placeholder={"Montant en Dh"} 
                                            label={"Montant"}
                                            value={ Charge["montant"] }
                                            keyboardType={"numeric"}
                                            onChangeText={(text) => {
                                                setCharge({...Charge,montant:text.replace(/[^0-9]/g, '')})
                                            }}
                                        />
                                        <Text style={{paddingRight:15}}>DH</Text>    
                                    </View>
                                    

                                    
                                    
                                    <TouchableOpacity style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={()=>showDatepicker()}>
                                        <Text style={{width: 300,height: 40,padding: 5,marginVertical: 10,borderColor: 'grey',borderStyle: 'solid',borderRadius: 3,backgroundColor:"white",textAlignVertical:"center",textAlign:"center"}}>
                                            {(typeof(Charge["declaredAt"]) === "string") ? (<Text>Date correspondente au reçu</Text>) : (<Text>Payé le : { JSON.stringify(Charge["declaredAt"]).split('"')[1].split("T")[0]}</Text>)}
                                        </Text>
                                    </TouchableOpacity>
                                    
                                    {(datePickerOnOff) && (                      
                                        <View>
                                            
                                            <DateTimePicker
                                                testID={"Date correspondente au reçu"}
                                                value={Charge["declaredAt"] || new Date()}
                                                mode={mode}
                                                
                                                is24Hour={true}
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    
                                                    if(selectedDate){
                                                        setdatePickerOnOff(false)
                                                        setShow(Platform.OS === 'ios');
                                                        setCharge({...Charge, declaredAt : (new Date(JSON.stringify(selectedDate).split('"')[1].split('T')[0]))})
                                                        
                                                    }else{
                                                        setdatePickerOnOff(false)
                                                    }
                                                    
                                                }
                                                    
                                                }
                                            />    
                                        </View>
                                        
                                    )}
                                    
                                </View>
                                
                            </View>
                            
                                {(loader) ?
                                    (
                                        <ActivityIndicator size="large" color="#000" style={{paddingBottom:100,paddingHorizontal:50,paddingTop:20}}/>
                                    )
                                    :
                                    (
                                        <View style={{paddingBottom:100,paddingHorizontal:50,paddingTop:20}}>
                                            <Button
                                                title="Ajouter"
                                                onPress={()=>{
                                                    handleUploadCharge(value.userState)
                                                }}
                                            />  
                                        </View>
                                                 
                                    )}
                            
                            

                            
                        </ScrollView>
                        
                    </View>
                )
            }}
        </TheContextConsumer>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fccf97',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    file : {
        
        minWidth:300,
        minHeight:300,
        borderRadius:5,
        borderWidth:5,
        borderColor:"black",
        justifyContent:"center",
        alignItems:"center"
    },
    buttons : {
        // height:50,
        flex:1,
        // backgroundColor:"grey",
        alignItems:"center",
        display:"flex",
        justifyContent:"center"
        
    },
    icon : {
        width:50,
        height:50,
    },
    // modal: {  
    //     justifyContent: 'space-around',  
    //     alignItems: 'center',   
    //     backgroundColor : "lightgrey",   
    //     height: "70%" ,  
    //     width: '90%',  
    //     borderRadius:10,  
    //     borderWidth: 1,  
    //     borderColor: '#fff',    
    //     // marginTop: 80,
    // },
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
    dateInputField: {
        flex:1
    },
    dateInput: {
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
        display:"flex",
        flexDirection:"row",
        alignItems:'center'
    }
  });