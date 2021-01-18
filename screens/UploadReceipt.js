import React, { useState,useEffect  } from 'react'
import { Alert } from 'react-native';
import { Button } from 'react-native';
import { Image,View, Text,StyleSheet,TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { Storage, TimeStamp,fireStore } from '../firebase/firebase';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { Modal } from 'react-native';
import { TheContextConsumer } from '../context/context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator } from 'react-native';

// import { Picker } from '@react-native-picker/picker';

export default function UploadReceipt({ route,navigation }) {

    const [loader, setloader] = useState(false)
    const [timestamp, settimestamp] = useState(TimeStamp)
    const [input, setinput] = useState(route.params);
    const [file, setfile] = useState(null)
    const [state, setstate] = useState({
        TransactionId : "",
        Montant : "",
        catégorie : "",
        date:""
    })
    
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
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
    }, []);


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
    
    const uploadFile = async  () => {
        if(file){
            setloader(true)
            const response = await fetch(file.uri);
            const blob = await response.blob();
            const imageRef = await Storage.ref().child("receipts").child((input.user.nom+"_"+input.user.prenom)).child(((new Date()).getTime()).toString())
            const filtredPath = imageRef.fullPath.split("/")
            if(state.catégorie === ""){
                setloader(false)
                Alert.alert("","veuillez sélectionner une catégorie")
            }else if(state.Montant.length > 0 && state.TransactionId.length > 0){
                
                if(state.date === ""){
                    setloader(false)
                    Alert.alert("","veuillez sélectionner la date correspendante au reçu")
                }else{
                    fireStore.collection("receipts").where("TransactionId", "==", state.TransactionId).get().then((snapshot)=>{
                        if(!snapshot.docs[0]){
                            
                            imageRef.put(blob).then(() => {
    
                                imageRef.getDownloadURL().then((x)=>{
                                    fireStore.collection("receipts").doc((imageRef.fullPath.split("/")[0]).toString()+(imageRef.fullPath.split("/")[1]).toString()+(imageRef.fullPath.split("/")[2]).toString()).set({
                                        userUid : input.user.uid,
                                        Immeuble : input.appartement.Immeuble,
                                        NAppartement : input.appartement.NAppartement,
                                        syndic: state.catégorie,
                                        etat : "en attente",
                                        montant : Math.abs(state.Montant) ,
                                        PaidAt: state.date,
                                        url : x.toString(),
                                        TransactionId: state.TransactionId,
                                        createdAt : timestamp,
                                        By:""
                                    }).then(()=>{
                                        setfile(null);
                                        setstate({
                                            TransactionId : "",
                                            Montant : "",
                                            catégorie : "",
                                            date:""
                                        })
                                        setloader(false)
                                        Alert.alert("","reçu envoyé 👍")
                                    }).catch((error) => { 
                                        setloader(false)
                                        Alert.alert("error storingdata",error.toString()) 
                                    })
    
                                }).catch((error) => { 
                                    setloader(false)
                                    Alert.alert("error getting url",error.toString()) 
                                })
    
                            }).then(()=>{
                                
                                setfile(null);
                                
                            }).catch((()=>{
                                setloader(false)
                                Alert.alert("error",e.toString());
                            }))
    
                        }else{
                            setloader(false)
                            Alert.alert("Attention !!","Le numero de la transaction existe déjà.")
                        }
                        
                    })    
                }
                
                
            }else{
                setloader(false)
                Alert.alert("","Veuillez d'abord indiquer le montant et le numero de transaction")
            }
        }else{
            setloader(false)
            Alert.alert("","Veuillez sélectionner une photo")
        }
        
        

        
        
    }

    return (
        <TheContextConsumer>
            {(value) => {
                
                return(
                    <View style={styles.container}>
                        
                        <View style={{flexDirection:"row",paddingHorizontal:20,paddingVertical:10}}>
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Image source={require("../Images/BuildingIcon.png")} style={{height:30,width:30}} />
                                <Text style={{fontSize:20,paddingHorizontal:30,flex:1,textAlign:"center"}}>
                                    {(input.appartement.Immeuble)}
                                </Text>
                            </View>
                            <View style={{flex:1,flexDirection:"row"}}>
                                <Image source={require("../Images/AppartmentIcon.png")} style={{height:30,width:30}} />
                                <Text style={{fontSize:20,paddingHorizontal:30,flex:1,textAlign:"center"}}>
                                    {"N° " + (input.appartement.NAppartement)}
                                </Text>
                            </View> 
                        </View>
                          
                        <ScrollView style={{width:"100%",height:"50%",textAlign:"center",paddingVertical:40}}>
                        

                            <View style={{alignItems:"center",width:"100%",paddingBottom:200}}>
                                
                                {(file) ? <Image source={{ uri: file.uri }} style={styles.file} />
                                        : <View style={styles.file} >
                                            <Text style={{fontSize:25}}>
                                                Sélectionner un reçu
                                            </Text>
                                        </View>
                                }

                                {(file) && <View style={{padding:10}}>
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
                                                <Image source={require("../Images/gallery.png")} style={styles.icon} />
                                                {/* <Text style={{textAlign:"center"}}>Choisir une photo dans la gallerie</Text> */}
                                            </TouchableOpacity>
                                            
                                        </View> 
                                    </View>
                                }
                                <View style={styles.input}>
                                    <Picker
                                        selectedValue={state["catégorie"]}
                                        style={{height:"100%"}}
                                        onValueChange={(itemValue, itemIndex) => {
                                            setstate({...state,catégorie : itemValue})
                                        }}
                                    >
                                        <Picker.Item label="sélectionner un syndic" value="" />
                                        <Picker.Item label="Nouveau syndic" value="Nouveau syndic" />
                                        <Picker.Item label="Driss" value="Driss" />
                                        <Picker.Item label="S2S" value="S2S" />
                                    </Picker>
                                    
                                </View>
                                <View style={{justifyContent:"space-around",flex:1}}>

                                    <View style={styles.dateInput}>
                                        <TextInput style={styles.dateInputField}
                                            placeholder={"Montant en Dh"} 
                                            label={"Montant"}
                                            value={ state["Montant"] }
                                            keyboardType={"numeric"}
                                            onChangeText={(text) => {
                                                setstate({...state,Montant:text.replace(/[^0-9]/g, '')})
                                            }}
                                        />
                                        <Text style={{paddingRight:15}}>DH</Text>    
                                    </View>
                                    

                                    <TextInput style={styles.input}
                                        placeholder={"Identifiant du reçu"} 
                                        label={"TransactionId"}
                                        value={state["TransactionId"]}
                                        onChangeText={(text) => {
                                            setstate({...state,TransactionId:text.replace(/[^0-9]/g, '')})
                                        }}
                                    />
                                    
                                    <TouchableOpacity style={{display:"flex",flexDirection:"row",alignItems:"center",justifyContent:"center"}} onPress={()=>showDatepicker()}>
                                        <Text style={{width: 300,height: 40,padding: 5,marginVertical: 10,borderColor: 'grey',borderStyle: 'solid',borderRadius: 3,backgroundColor:"white",textAlignVertical:"center",textAlign:"center"}}>
                                            {(typeof(state["date"]) === "string") ? (<Text>Date correspondente au reçu</Text>) : (<Text>Payé le : { JSON.stringify(state["date"]).split('"')[1].split("T")[0]}</Text>)}
                                        </Text>
                                    </TouchableOpacity>
                                    <View style={{padding:20,paddingHorizontal:50}}>
                                        {(loader) ?
                                            (
                                                <ActivityIndicator size="large" color="#000" />
                                            )
                                            :
                                            (
                                                <Button
                                                    title="valider"
                                                    onPress={()=>{
                                                        // state
                                                        uploadFile()
                                                        
                                                        // Alert.alert("",JSON.stringify(state))
                                                    }}
                                                />           
                                            )
                                        }
                                         
                                    </View>
                                    {(datePickerOnOff) && (                      
                                        <View>
                                            
                                            <DateTimePicker
                                                testID={"Date correspondente au reçu"}
                                                value={state["date"] || new Date()}
                                                mode={mode}
                                                
                                                is24Hour={true}
                                                display="default"
                                                onChange={(event, selectedDate) => {
                                                    
                                                    if(selectedDate){
                                                        setdatePickerOnOff(false)
                                                        setShow(Platform.OS === 'ios');
                                                        setstate({...state, date : (new Date(JSON.stringify(selectedDate).split('"')[1].split('T')[0]))})
                                                        
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
      backgroundColor:"#fccf97",
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
    modal: {  
        justifyContent: 'space-around',  
        alignItems: 'center',   
        backgroundColor : "lightgrey",   
        height: "70%" ,  
        width: '90%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
        // marginTop: 80,
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
    },
    appartment :{
        // flex:1,
        marginVertical:5,
        flexDirection:"row",
        alignItems:"center",
        
    },
  });
//   display:"flex",flexDirection:"row",alignItems:'center',width:"100%",backgroundColor:"red"