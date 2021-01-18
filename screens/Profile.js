import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { Button } from 'react-native'
import { View, Text,StyleSheet } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import ChargesList from '../components/ChargesList'
import { TheContextConsumer } from '../context/context'
import { fireStore } from '../firebase/firebase'
import { AppCharges } from '../useFull/Charges'


export default function Profile({navigation}) {
    const [budjet, setbudjet] = useState({
        valdé:0,
        enAttente:0
    })
    
    const [charges, setcharges] = useState(0)
    useEffect(() => {
        getBudjet()
    }, [])
    const getBudjet = () => {
        
        fireStore.collection("receipts").onSnapshot((snapshot) => {
            let x = {
                valdé:0,
                enAttente:0
            }
            snapshot.docs.map((receipt) => {
                let receiptData = receipt.data()
                


                if(receiptData.syndic === "Nouveau syndic"){
                    if(receiptData.etat === "validé"){
                        x["valdé"] += Math.abs(parseFloat(receiptData.montant))
                    }else if(receiptData.etat === "en attente"){
                        x["enAttente"] += Math.abs(parseFloat(receiptData.montant))
                    }
                    
                }
            })
            setbudjet(x)
        })
        fireStore.collection('charges').onSnapshot((snapshot) => {
            let x = 0
            snapshot.docs.map((doc)=>{
                
                x += Math.abs(parseFloat(doc.data().montant))
            })
            setcharges(x)
        })

        
        
    }
    return (
        <TheContextConsumer>
                {(value) => {
                    
                    
                    return(
                        <View style={styles.container}>
                            <ScrollView style={{width:"100%",padding:10}}>
                                <Text style={{width:"100%",textAlign:"center",fontSize:20,paddingVertical:10}}>
                                    {"Bonjour "+value.userState.nom+" "+value.userState.prenom}
                                </Text>
                                <View style={{alignItems:"center"}}>
                                    <Text style={{textAlign:"center",fontSize:25}}>
                                        {"Budjet actuel"+"   "+(budjet["valdé"] - charges)+"  "+"dh"}
                                    </Text>
                                    <Text style={{textAlign:"center"}}>
                                        {"( budjet en cours de validation validé"+"   "+JSON.stringify(budjet["enAttente"])+"  "+"dh )"}
                                    </Text>
                                </View>
                                {(value.userState.proprietaireDe).map((appartement,i) => {
                                    let data = AppCharges(appartement)
                                    return(
                                        <View key={i} style={styles.appartmentCard}>
                                            <View style={styles.appartmentHeader}>
                                                <View style={{flex:1,alignItems:"center"}}>
                                                    <Image source={require("../Images/BuildingIcon.png")} style={styles.icon} />
                                                    <Text>
                                                        Immeuble {appartement.Immeuble}
                                                    </Text>
                                                </View>
                                                <View style={{flex:1,alignItems:"center"}}>
                                                    <Image source={require("../Images/AppartmentIcon.png")} style={styles.icon} />
                                                    <Text>
                                                        N° {appartement.NAppartement}
                                                    </Text>
                                                </View>
                                            </View>
                                            
                                            
                                            

                                            <Text style={{fontSize:30}}>
                                                Details
                                            </Text>
                                            {
                                                data.Charges.map((charge,index)=>{
                                                    return(
                                                        <View key={index} style={{backgroundColor:"lightgrey",width:"100%",display:"flex",alignItems:"center",margin:10,borderRadius:10}}>
                                        
                                                            <Text>
                                                                {"( " + charge.startingDay +"===>"+charge.To+" )"}
                                                                
                                                            </Text>
                                                            <Text>
                                                                {JSON.stringify(charge.saison)+"   " + JSON.stringify(charge.charge) + " DH "+"   ( "+JSON.stringify(charge.days)+" jours ) "}
                                                            </Text>
                                                                                                                       
                                                        </View>                                                    
                                                    )
                                                })
                                            }
                                            <View style={{padding:20,paddingHorizontal:50}}>
                                                <Button
                                                    title="voir mes reçus"
                                                    onPress={()=>{
                                                            navigation.navigate("MyReceipts",{
                                                            user:value.userState,
                                                            appartement: appartement,
                                                            })
                                                        }
                                                    }
                                                    
                                                />    
                                            </View> 

                                        </View>
                                    )
                                })}
                                
                                <Text style={{paddingBottom:100}}>

                                </Text>
                                <View style={{width:"100%",alignItems:"center",paddingBottom:100}}>
                                    <Button
                                        title="Logout"
                                        onPress={() => {
                                            value.LogOut();
                                            navigation.navigate('Home')
                                            }
                                        }
                                    />    
                                </View>
                                
                                

                                

                            </ScrollView>
                            
                            
                            
                            <Text></Text>
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
    appartmentCard : {
        backgroundColor:"#fca103",
        marginVertical:10,
        alignItems:"center",
        marginHorizontal:20,
        borderRadius:10,
        padding:10,
        elevation: 10
    },
    icon : {
        width:30,
        height:30,
        marginHorizontal:10
    },
    appartmentHeader : {
        flexDirection:"row",
        width:"100%",
        justifyContent:"space-between"
    },
    
  });