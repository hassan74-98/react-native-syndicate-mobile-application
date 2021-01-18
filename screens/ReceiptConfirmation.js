import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { Modal } from 'react-native';
import { Alert } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { ActivityIndicator } from 'react-native';
import { Button } from 'react-native';
import { View, Text, StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { TheContextConsumer } from '../context/context';
import { fireStore } from '../firebase/firebase';

export default function ReceiptConfirmation({ route,navigation }) {
    const [loader, setloader] = useState(false)
    const [input, setinput] = useState(route.params);
    const [userIfos, setuserIfos] = useState({
        nom : "",
        prenom : "",
    })
    useEffect(() => {
        setloader(true)
        fireStore.collection("users").doc(input.userUid).get().then((querySnapshot) => {
            setuserIfos(querySnapshot.data())
        }).then(() => {
            setloader(false)
        }).catch((e) => {
            Alert.alert("",e.toString())
        })
    }, [])
    
    const [visible, setIsVisible] = useState(false);
    
    const images = [{
        url: input.url,
    }]
    const [confirmationModal, setconfirmationModal] = useState(false)
    const [refus, setrefus] = useState(false)

    const ValidateReceipt = (value) => {
        fireStore.collection("receipts").where("url", "==", input.url).get().then((snapshot)=>{
            
            fireStore.collection("receipts").doc(snapshot.docs[0].id).update({
                etat : "validé",
                By : value.userState.uid
            }).then(()=>{
                navigation.navigate("Receipts")
                Alert.alert("","reçu validé 👍 ")
            }).catch((e)=>{
                Alert.alert("error",e.toString())
            })
        })
    }
    const refuseReceipt = (value) => {
        fireStore.collection("receipts").where("url", "==", input.url).get().then((snapshot)=>{
            
            fireStore.collection("receipts").doc(snapshot.docs[0].id).update({
                etat : "refusé",
                By : value.userState.uid
            }).then(()=>{
                navigation.navigate("Receipts")
                Alert.alert("","reçu refusé 👍 ")
            }).catch((e)=>{
                Alert.alert("error",e.toString())
            })
        })
    }

    return (
        <TheContextConsumer>
            {(value) => {
                return(
                    <View style={styles.container}>
                        
                        <ScrollView style={{width:"100%",paddingVertical:30,paddingHorizontal:20}}>
                            <View style={{height:70,alignItems:"center",justifyContent:"center",width:"100%",paddingBottom:10}}>
                                <Text style={{fontSize:25}}> Validation de reçu </Text>
                            </View>
                            <TouchableOpacity 
                                onPress={()=>{
                                    setIsVisible(true)
                                }}
                            >
                                {(loader) ? 
                                    (
                                        <ActivityIndicator size="large" color="#000" />
                                    )
                                    :
                                    (
                                        <Image source={{ uri: input.url }} style={styles.file} />
                                    )
                                }
                                
                            </TouchableOpacity>
                            <View style={{flexDirection:"row",justifyContent:"center"}}>
                                

                                <Text style={{textAlign:"center",fontSize:20}}>
                                {(input.etat === "en attente") && 
                                        (
                                            <Text style={styles.column}>
                                                ⌛ {"pas encore validé"+"\n"}
                                            </Text>
                                        )
                                    }
                                    {(input.etat === "validé") && 
                                        (
                                            <Text style={styles.column}>
                                                ✔️ {"validé" +"\n"}
                                            </Text>
                                        )
                                    }
                                    {(input.etat === "refusé") && 
                                        (
                                            <Text style={styles.column}>
                                                ❌ {"refusé"+"\n"}
                                            </Text>
                                        )
                                    }
                                    {"Nom : "+userIfos.nom +"\n"}
                                    {"prénom : "+userIfos.prenom +"\n"}
                                    {"\n"+"Identifiant du reçu :"+ (input.TransactionId)+"\n"}
                                    {"Syndic :"+ (input.syndic)+"\n"}
                                    {"Montant : "+(input.montant)+" dh"+"\n"}
                                    {"Immeuble : "+(input.Immeuble)+"\n"}
                                    {"N°Appartement : "+(input.NAppartement)+"\n"}
                                    {"date : " + JSON.stringify(input.PaidAt.toDate()).split('"')[1].split('T')[0]}
                                </Text>
                            </View>
                            <View style={{display:"flex",flexDirection:"row"}}>
                                    
                                    <View style={styles.buttons}>
                                        <Button
                                            title="valider"
                                            onPress={()=>{
                                                setconfirmationModal(true)
                                                
                                            }}
                                        />
                                    </View >
                                    <View style={styles.buttons}>
                                        <Button
                                            title="refuser"
                                            onPress={()=>{
                                                setrefus(true)
                                                
                                            }}
                                        />
                                    </View>
                                    
                            </View>
                            <Text style={{paddingBottom:300}}>

                            </Text>
                            <Modal 
                                visible={visible} 
                                transparent={true}
                                onRequestClose = {() =>{
                                    setIsVisible(false)
                                }} 
                            >
                                <ImageViewer imageUrls={images}/>
                            </Modal>
                            <Modal 
                                visible={confirmationModal} 
                                transparent={true}
                                onRequestClose = {() =>{
                                    setconfirmationModal(false)
                                }} 
                            >
                                <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                    <View style = {styles.modal}>
                                        <Text>
                                            Attention cette étape est irréversible!!!
                                        </Text>
                                        <Text style={{width:"80%"}}>
                                            Vérifier que le numéro de transaction est bien celui fournit par le propriétaire et que la transaction a bien été faite.
                                        </Text>
                                        <View style={{display:"flex",flexDirection:"row"}}>
                                    
                                                <View style={styles.buttons}>
                                                    <Button
                                                        title="confirmer"
                                                        onPress={()=>{
                                                            
                                                            ValidateReceipt(value)
                                                            
                                                        }}
                                                    />
                                                </View >
                                                <View style={styles.buttons}>
                                                    <Button
                                                        title="anuuler"
                                                        onPress={()=>{
                                                            setconfirmationModal(false)
                                                            // Alert.alert("cancelled receipt")
                                                            
                                                        }}
                                                    />
                                                </View>
                                                
                                        </View>


                                    </View>
                                </View>
                            </Modal>




                            <Modal 
                                visible={refus} 
                                transparent={true}
                                onRequestClose = {() =>{
                                    setrefus(false)
                                }} 
                            >
                                <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                    <View style = {styles.modal}>
                                        <Text>
                                            Confimation
                                        </Text>
                                        <Text style={{width:"80%",fontSize:20}}>

                                            Êtes-vous de vouloir refuser le reçu.
                                        </Text>
                                        <View style={{display:"flex",flexDirection:"row"}}>
                                    
                                                <View style={styles.buttons}>
                                                    <Button
                                                        title="confirmer"
                                                        onPress={()=>{
                                                            // ValidateReceipt()
                                                            refuseReceipt(value)
                                                            
                                                        }}
                                                    />
                                                </View >
                                                <View style={styles.buttons}>
                                                    <Button
                                                        title="annuler"
                                                        onPress={()=>{
                                                            // setconfirmationModal(false)
                                                            // Alert.alert("cancelled receipt")
                                                            setrefus(false)
                                                            
                                                        }}
                                                    />
                                                </View>
                                                
                                        </View>
                                    </View>
                                </View>
                            </Modal>




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
      justifyContent: 'space-between',
    },
    file : {
        minWidth:300,
        minHeight:300,
        borderRadius:5,
        borderWidth:5,
        borderColor:"black"
    },
    buttons : {
        height:50,
        flex:1,
        // backgroundColor:"grey",
        alignItems:"center",
        display:"flex",
        justifyContent:"center"
        
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
    
});