import React, { useEffect, useState } from 'react'
import { Image } from 'react-native';
import { Modal,ScrollView,Button } from 'react-native';

import { View, Text, StyleSheet } from 'react-native'
import {  TouchableOpacity } from 'react-native-gesture-handler';
import { TheContextConsumer } from '../context/context';
import { fireStore } from '../firebase/firebase';
import { AllCharges, AppCharges } from '../useFull/Charges';



const paid = (titreFoncier,Receipts) => {
    let total = 0
    Receipts.map((receipt)=>{
        if(receipt.titreFoncier === titreFoncier && receipt.etat === "validé"){
            total += parseFloat(receipt.montant)
        }
    })
    return(total)
}


export default function AppList(props) {
    const [AppList, setAppList] = useState([])

    const [selectedAppartment, setselectedAppartment] = useState({
        propriétaire : {
            // uid : "",
            nom : "",
            prenom : "",
            cin : ""
        },
        paid : 0 ,
        titreFoncier : "",
        Immeuble: "",
        NAppartement: "",
        facture:{
            Charges:[],
            Total : 0
        }
        
        
    })
    const [showModal, setshowModal] = useState(false);

    const [Receipts, setReceipts] = useState([]);

    const getAppList = () => {
        

        fireStore.collection("receipts").onSnapshot((snapshot) => {
            let usersData = []
            let result = []
            let receiptsData = []
            fireStore.collection("users").get().then((usersquery)=>{
                usersquery.docs.map((doc)=>{
                    usersData.push(doc.data())
                }) 
            }).then(()=>{
                fireStore.collection("receipts").get().then((receiptsquery)=>{
                    
                    receiptsquery.docs.map((doc)=>{
                        receiptsData.push(doc.data())
                        
                    })
                }).then(()=>{
                    usersData.map((user)=>{
                        user.proprietaireDe.map((app)=>{
                            let paid = 0
                            let x = AppCharges(app)
                            receiptsData.map((receipt) => {
                                if(receipt.etat === "validé" && receipt.Immeuble === app.Immeuble && receipt.NAppartement ===  app.NAppartement){
                                    paid += parseFloat(receipt.montant)
                                }else{

                                }
                            })
                            app["paid"] = paid
                            app["propriétaire"] = {
                                nom : user.nom,
                                prénom : user.prenom,
                                cin : user.cin,
                            },
                            app["facture"] = x
                            // app["charges"] = AppCharges(app)
                            result.push(app)
                            
                        })
                    })
                }).then(()=>setAppList(result))
            })    
            
            
            
        })
        
    }
    useEffect(() => {
        getAppList()
    }, [])


    return (
        <TheContextConsumer>
            {(value) => {

                return(
                    <View style={{paddingBottom:300}}>
                        {AppList.map((app,index) => {
                            return(
                                <TouchableOpacity 
                                    key={index} 
                                    style={styles.appartementCard} 
                                    onPress={()=>{
                                        // setselectedAppartment(app)
                                        // setshowModal(true)
                                        props.navigation("AppartementsReceipts",app)
                                    }}
                                    >
                                        <View style={{flex:1,height:"100%",backgroundColor:"lightgrey"}}>
                                            <View style={{flexDirection:"row",flex:1,alignItems:'center',paddingVertical:5}}>
                                                <Image source={require("../Images/BuildingIcon.png")} style={styles.icon} />
                                                <Text style={{fontSize:20,flex:1,textAlign:"right",color:"black",paddingRight:10}}>
                                                    {(app.Immeuble)}
                                                </Text>
                                            </View>
                                            <View style={{flexDirection:"row",flex:1,alignItems:'center',paddingVertical:5}}>
                                                <Image source={require("../Images/AppartmentIcon.png")} style={styles.icon} />
                                                <Text style={{fontSize:20,flex:1,textAlign:"right",color:"black",paddingRight:10}}>
                                                    {"N° " + (app.NAppartement)}
                                                </Text>
                                            </View>    
                                        </View>
                                        <View style={{flex:1,height:"100%"}}>
                                            <View style={{flexDirection:"row",flex:1,alignItems:'center',paddingVertical:5}}>
                                                <Image source={require("../Images/PaidIcon.png")} style={styles.icon} />
                                                <Text style={{fontSize:20,flex:1,textAlign:"right",color:"green",paddingRight:10}}>
                                                    {(app.paid)+" dh"}
                                                </Text>
                                            </View>
                                            <View style={{flexDirection:"row",flex:1,alignItems:'center',paddingVertical:5}}>
                                                <Image source={require("../Images/notPaidIcon.png")} style={styles.icon} />
                                                <Text style={{fontSize:20,flex:1,textAlign:"right",color:"red",paddingRight:10}}>
                                                    
                                                    {(((app.facture.Total) - (app.paid)) > 0) ? (((app.facture.Total) - (app.paid)) + " dh") : "0 dh"}
                                                </Text>
                                            </View>      
                                        </View>
                                </TouchableOpacity>
                                    
                                
                            )
                        })}
                        <Modal           
                            animationType = {"fade"}  
                            transparent = {true}  
                            visible = {showModal}  
                            onRequestClose = {() =>{ setshowModal(false);setselectedAppartment({}) } }>  

                            <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                <View style = {styles.modal}>  
                                    
                                    <ScrollView style={{backgroundColor:"grey",width:"100%",paddingTop:10,borderRadius:10}}>
                                        {/* <Text>
                                            {(selectedAppartment.titreFoncier)}
                                        </Text> */}
                                        {/* <Text>
                                            {JSON.stringify(selectedAppartment.propriétaire)}
                                        </Text> */}
                                        {/* <Text style={{textAlign:"center"}}>
                                            {" Nom : " + (selectedAppartment.propriétaire.nom) +"\n"}
                                            {" Prénom : " + (selectedAppartment.propriétaire.prénom)}
                                        </Text> */}
                                        
                                        <View style={{padding:5}}>
                                            {/* <Text>
                                                {"Propriétaire : " + selectedAppartment.propriétaire.nom +" " +selectedAppartment.propriétaire.prenom}
                                            </Text> */}
                                            <Text>
                                                {"N°Appartement : "+  selectedAppartment.NAppartement}
                                            </Text>
                                            <Text>
                                                {"Immeuble : " +selectedAppartment.Immeuble}
                                            </Text>
                                            {/* <Text>
                                                {selectedAppartment}
                                            </Text> */}
                                            <View style={{width:"100%",alignItems:"center"}} >
                                                <Text style={{textAlign:"center"}}>Total à payer depuis la date de signature du contrat {"\n"} {selectedAppartment.facture.Total} DH </Text>
                                            

                                            {selectedAppartment.facture.Charges.map((charge,i)=>{

                                                return(
                                                    <View key={i}  style={{width:"100%",backgroundColor:"lightgrey",alignItems:"center",margin:10,borderRadius:5}}>
                                                        
                                                        
                                                        <Text>
                                                            {charge.startingDay+" --> "+charge.To+" ( "+charge.saison+" )"}
                                                        </Text>

                                                        <Text>
                                                            {charge.days+" ( jours )"}
                                                        </Text>
                                                        <Text>
                                                            {charge.charge+" ( Dh )"}
                                                        </Text>

                                                    </View>
                                                )
                                            })}

                                            </View>
                                        </View>
                                        
                                    </ScrollView>
                                    

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
                            </View>  
                        </Modal>
                        
                    </View>            
                )
            }}
        </TheContextConsumer>
        
    )
}
const styles = StyleSheet.create({
    
    appartementCard:{
        // height:250,
        
        backgroundColor:"white",
        // padding:10,
        marginVertical:10,
        marginHorizontal:10,
        borderRadius: 10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        elevation: 10,
        

    },
    row:{
        width:"100%",
        padding:10,
        marginHorizontal:10,
        // paddingHorizontal:40,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        // backgroundColor:"red"
    },
    column :{
        fontSize:15,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        borderWidth: 1,  
        borderColor: '#000',
        // backgroundColor:"yellow",

    },
    paid :{
        fontSize:15,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        borderWidth: 1,  
        borderColor: '#000',
        backgroundColor:"#46b36c"
        // backgroundColor:"yellow",

    },
    toPay :{
        fontSize:15,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        borderWidth: 1,  
        borderColor: '#000',
        // backgroundColor:"red"
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
    text: {  
        color: 'black',  
        marginTop: 10,
        textAlign:"center",
        fontSize:20
    },
    icon : {
        width:30,
        height:30,
        marginHorizontal:10
    },
    building :{
        flex:1,
        marginVertical:5,
        flexDirection:"row",
        alignItems:"center",
        
    },
    
    cardRow1 :{
        flexDirection:"row",
        backgroundColor:"lightgrey",
        width:"100%"
    },
    cardRow2 :{
        flexDirection:"row",
        
    }        
});
