import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { ScrollView } from 'react-native'
import { Modal } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { View, Text, StyleSheet, Button } from 'react-native'
import { TheContextConsumer } from '../context/context'
import { fireStore } from '../firebase/firebase'

export default function AppartementsReceipts({route,navigation}) {
    const [propriétaire, setpropriétaire] = useState(null)
    const [receipts, setreceipts] = useState([])
    const [whichReceipts, setwhichReceipts] = useState("")
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
    const [showModal, setshowModal] = useState(false);
    const handleClickOnReceipt = (receipt) => {
        setshowModal(true);
        setselectedReceipt(receipt);
    }
    useEffect(() => {
        let list = []
        fireStore.collection("receipts").get().then((query)=> {
            query.docs.map((doc)=>{
                let data = doc.data()
                if(route.params.Immeuble === data.Immeuble && route.params.NAppartement === data.NAppartement){
                    list.push(data)
                }
            })
        }).then(() => {setreceipts(list)})
        // fireStore.collection("users").doc(re)
    }, [])
    return (
        <TheContextConsumer>
            {(value) => {

                return(
                    <View style={styles.container}>
                        
                        <View style={{paddingHorizontal:3,paddingVertical:10}}>
                                <Button
                                    title="Tous les reçus"
                                    onPress={() => {
                                        setwhichReceipts("")
                                    }}
                                />
                            </View>
                        <View style={{flexDirection:"row",paddingTop:10}}>
                            
                            <View style={{flex:1,paddingHorizontal:3}}>
                                <Button
                                    title="new"
                                    onPress={() => {
                                        setwhichReceipts("Nouveau syndic")
                                    }}
                                />
                            </View>
                            <View style={{flex:1,paddingHorizontal:3}}>
                                <Button
                                    title="Driss"
                                    onPress={() => {
                                        setwhichReceipts("Driss")
                                    }}
                                />
                            </View>
                            <View style={{flex:1,paddingHorizontal:3}}>
                                <Button
                                    title="S2S"
                                    onPress={() => {
                                        setwhichReceipts("S2S")
                                    }}
                                />
                            </View>
                        </View>
                        <ScrollView style={{width:"100%",paddingTop:10}}>
                            <View style={{width:"100%",flexDirection:"row"}}>
                                <View style={{flex:1}}>
                                    <Text style={{textAlign:"center",fontSize:18}}>
                                        {"Nom : "+route.params.propriétaire.nom}
                                    </Text>
                                    
                                </View>
                                <View style={{flex:1}}>
                                    <Text style={{textAlign:"center",fontSize:18}}>
                                        {"Prénom : "+route.params.propriétaire.prénom}
                                    </Text>
                                    
                                </View>
                            </View>
                            
                            {receipts.map((receipt,i)=>{
                                if(whichReceipts === ""){
                                    return(
                                        <TouchableOpacity style={styles.receiptCard} onPress={()=>{handleClickOnReceipt(receipt)}}>
                                            <View style={{flex:1}}>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/calendarIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
                                                        {JSON.stringify(receipt.PaidAt.toDate()).split('"')[1].split('T')[0]}
                                                    </Text>
                                                </View>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/PaidIcon.png")} style={styles.icon} />
                                                    <Text style={{color:"green",fontSize:18}}>
                                                        {receipt.montant+"dh"}
                                                    </Text>
                                                </View>    
                                            </View>
                                            <View style={{flex:1}}>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/BuildingIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
                                                        {receipt.Immeuble}
                                                    </Text>
                                                </View>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/AppartmentIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
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
                                }else if(whichReceipts === receipt.syndic){
                                    return(
                                        <TouchableOpacity style={styles.receiptCard} onPress={()=>{handleClickOnReceipt(receipt)}}>
                                            <View style={{flex:1}}>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/calendarIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
                                                        {JSON.stringify(receipt.PaidAt.toDate()).split('"')[1].split('T')[0]}
                                                    </Text>
                                                </View>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/PaidIcon.png")} style={styles.icon} />
                                                    <Text style={{color:"green",fontSize:18}}>
                                                        {receipt.montant+"dh"}
                                                    </Text>
                                                </View>    
                                            </View>
                                            <View style={{flex:1}}>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/BuildingIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
                                                        {receipt.Immeuble}
                                                    </Text>
                                                </View>
                                                <View style={{width:"100%",flexDirection:"row",alignItems:"center",paddingVertical:5}}>
                                                    <Image source={require("../Images/AppartmentIcon.png")} style={styles.icon} />
                                                    <Text style={{fontSize:18}}>
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
                        </ScrollView>
                        <Modal           
                            animationType = {"fade"}  
                            transparent = {true}  
                            visible = {showModal}  
                            onRequestClose = {() =>{ setshowModal(false);setselectedReceipt({}) } }>  

                            <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                <View style = {styles.modal}>  
                                    
                                    <ScrollView style={{backgroundColor:"grey",width:"100%",paddingTop:10,borderRadius:10}}>
                                        {/* <Text>
                                            {JSON.stringify(selectedReceipt.url)}
                                        </Text> */}
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
                                                title="ok"
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
        // <View>
        //     <Text></Text>
        // </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fccf97",
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    row:{
        // width:"100%",
        height:50,
        padding:10,
        marginHorizontal:10,
        paddingHorizontal:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        // backgroundColor:"red"
    },
    column :{
        
        fontSize:20,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        // backgroundColor:"yellow",
        borderWidth: 1,  
        borderColor: '#000',

    },
    receiptCard:{
        // height:50,
        backgroundColor:"white",
        // padding:15,
        marginVertical:10,
        marginHorizontal:10,
        borderRadius: 10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between",
        elevation: 10,
    },
    icon : {
        width:30,
        height:30,
        marginHorizontal:10
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
});