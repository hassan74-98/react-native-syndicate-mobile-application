import React, { useEffect, useState } from 'react'
import { Button } from 'react-native'
import { ScrollView } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { TheContextConsumer } from '../context/context'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Modal } from 'react-native'
import { Image } from 'react-native'
import { fireStore } from '../firebase/firebase'

export default function MyReceipts({route,navigation}) {
    const [selectedReceipt, setselectedReceipt] = useState({
        userUid : "",
        // titreFoncier : "",
        Immeuble : "",
        NAppartement : "",
        syndic: "",
        etat : "",
        montant : "",
        url : "",
        TransactionId: "",
        createdAt : ""
    })
    const [ReceiptsList, setReceiptsList] = useState([])

    const getReceipts = () => {
        
        fireStore.collection("receipts").onSnapshot((snapshot) => {
            let list = []
            snapshot.docs.map((receipt,i) => {
                list.push(receipt.data())
            })
            setReceiptsList(list)
        })
        
    }
    useEffect(() => {
        getReceipts()
    }, [])

    const [showModal, setshowModal] = useState(false);
    return (
        <TheContextConsumer>
            {(value) => {
                let p = 0
                let np = 0
                return(
                    <View style={styles.container}>
                        <ScrollView style={{width:"100%",paddingTop:10}}>
                            {/* <Text>{JSON.stringify(route.params.appartement.NAppartement)}</Text> */}
                            {ReceiptsList.map((receipt,i) => {
                                
                                if(value.userState.uid === receipt.userUid && route.params.appartement.Immeuble === receipt.Immeuble && route.params.appartement.NAppartement ===  receipt.NAppartement){
                                    if(receipt.etat === "valide"){
                                        p += parseFloat(receipt.montant)
                                    }else{
                                        np += parseFloat(receipt.montant)
                                    }
                                    
                                    
                                    
                                    return(
                                        <TouchableOpacity 
                                            key={i} 
                                            style={styles.receiptCard} 
                                            onPress={()=>{
                                                // props.navigation(receipt)
                                                setshowModal(true)
                                                setselectedReceipt(receipt)
                                            }}
                                            >
                                            <View style={{flex:1}}>
                                            <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                                                <Image source={require("../Images/calendarIcon.png")} style={styles.icon} />
                                                <Text style={{}}>
                                                    {JSON.stringify(receipt.PaidAt.toDate()).split('"')[1].split('T')[0]}
                                                </Text>
                                            </View>
                                            <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                                                <Image source={require("../Images/PaidIcon.png")} style={styles.icon} />
                                                <Text >
                                                    {receipt.montant+"dh"}
                                                </Text>
                                            </View>    
                                        </View>
                                        <View style={{flex:1}}>
                                            <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                                                <Image source={require("../Images/BuildingIcon.png")} style={styles.icon} />
                                                <Text style={{}}>
                                                    {receipt.Immeuble}
                                                </Text>
                                            </View>
                                            <View style={{width:"100%",flexDirection:"row",alignItems:"center"}}>
                                                <Image source={require("../Images/AppartmentIcon.png")} style={styles.icon} />
                                                <Text >
                                                    {"N° " +receipt.NAppartement}
                                                </Text>
                                            </View>    
                                        </View>
                                        {(receipt.etat === "en attente") && 
                                        (
                                            <Image source={require("../Images/waitingIcon.png")} style={styles.icon} />
                                            // <Text style={styles.column}>
                                            //     ⌛ waitingIcon
                                            // </Text>
                                        )
                                        }
                                        {(receipt.etat === "validé") && 
                                        (
                                            <Image source={require("../Images/checkedIcon.png")} style={styles.icon} />
                                            // <Text style={styles.column}>
                                            //     ✔️
                                            // </Text>
                                        )
                                        }
                                        {(receipt.etat === "refusé") && 
                                        (
                                            <Image source={require("../Images/uncheckedIcon.png")} style={styles.icon} />
                                            // <Text style={styles.column}>
                                            //     ❌ uncheckedIcon
                                            // </Text>
                                        )
                                        }
                                            
                                            

                                            
                                        </TouchableOpacity>    
                                    )
                                }
                                
                            })}
                            <View style={{width:"100%",alignItems:"center"}}>
                                <Button
                                    title="Ajouter un reçu"
                                    onPress = {()=>{
                                        navigation.navigate("UploadReceipt",{
                                            user : value.userState,
                                            appartement: route.params.appartement,
                                        })
                                    }}
                                />    
                            </View>
                        </ScrollView>
                        <View style={{height:70,alignItems:"center",justifyContent:"center",backgroundColor:"#378a75",width:"100%"}}>
                            <Text>Total validé : {parseFloat(p)} dh</Text>
                            <Text>Total non validé : {parseFloat(np)} dh</Text>
                            
                        </View>
                        
                        {/* <View style={{padding:20}}>
                                <Button
                                    title="Back"
                                    onPress = {()=>{
                                        navigation.navigate("Profile")
                                    }}
                                />    
                        </View> */}
                        <Modal           
                            animationType = {"fade"}  
                            transparent = {true}  
                            visible = {showModal}  
                            onRequestClose = {() =>{ setshowModal(false);setselectedReceipt({}) } }>  

                            <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                <View style = {styles.modal}>  
                                    
                                    <ScrollView style={{backgroundColor:"grey",width:"100%",paddingTop:10,borderRadius:10}}>
                                        <View style={{alignItems:"center",width:"100%"}}>
                                            <View>
                                                <Image source={{ uri: selectedReceipt.url }} style={styles.file} />
                                            </View>
                                            <Text>
                                                {(selectedReceipt.montant)+" DH"}
                                            </Text>
                                            <Text>
                                                {"N°Appartement : "+(selectedReceipt.NAppartement)}
                                            </Text>
                                            <Text>
                                                {"Immeuble : "+(selectedReceipt.Immeuble)}
                                            </Text>
                                            <Text>
                                                {(selectedReceipt.syndic)}
                                            </Text>
                                            <Text>
                                                {"état : "+(selectedReceipt.etat)}
                                            </Text>
                                        </View>
                                        
                                        
                                        
                                        
                                    </ScrollView>
                                    

                                    
                                    

                                </View>
                                <View style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
                                        <View style={{margin:10}}>
                                            <Button 
                                                title="Annuler"
                                                
                                                onPress = {() => {
                                                    setshowModal(!showModal)
                                                }}
                                            />
                                        </View>
                                        
                                        
                                    </View>
                            </View>  
                        </Modal>
                        
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
    receiptCard:{
        // height:50,
        backgroundColor:"white",
        padding:15,
        marginVertical:10,
        marginHorizontal:10,
        borderRadius: 10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        elevation: 10,
    },
    column :{
        fontSize:20,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        borderWidth: 1,  
        borderColor: '#000',
        // backgroundColor:"yellow",

    },
    modal: {  
        justifyContent: 'space-around',  
        alignItems: 'center',   
        backgroundColor : "grey",   
        height: "70%" ,  
        width: '90%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff', 
           
        // marginTop: 80,  
    },
    file : {
        minWidth:300,
        minHeight:300,
        borderRadius:5,
        borderWidth:5,
        borderColor:"black"
    },
    icon : {
        width:30,
        height:30,
        marginHorizontal:10
    },
})