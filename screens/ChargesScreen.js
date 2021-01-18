import React, { useEffect, useState } from 'react'
import { Button } from 'react-native';
import { Alert } from 'react-native';
import { Image } from 'react-native';
import { Modal } from 'react-native';
import { View, Text, StyleSheet } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { TheContextConsumer } from '../context/context';
import { fireStore } from '../firebase/firebase';

export default function ChargesScreen({navigation}) {

    const [Charges, setCharges] = useState([])
    const [selectedCharge, setselectedCharge] = useState({
        montont : "",
        createdAt : "",
        by:"",
        service:"",
        documentUrl : "",
        declaredAt:""

    })
    const [Total, setTotal] = useState(0)
    const [showModal, setshowModal] = useState(false);

    useEffect(() => {
        
        fireStore.collection("charges").onSnapshot((querySnapshot) => {
            let list = [] 
            let t = 0
            querySnapshot.docs.map((doc)=>{
                let data = doc.data()
                list.push(data)
                t += Math.abs(parseInt(data.montant))
            })
            setTotal(t)
            setCharges(list)
        })
    }, [])
    return (
        <TheContextConsumer>
            {(value) => {

                return(
                    <View style={styles.container}>
                        {/* <Text style={{width:"100%",textAlign:"center",fontSize:20,padding:10,elevation:5}}>
                            {"total des charges"+"\n"+Total + "dh"}
                        </Text> */}
                        
                        <ScrollView style={{width:"100%",height:"50%",textAlign:"center"}}>
                            <Text style={{width:"100%",textAlign:"center",fontSize:30,padding:20,elevation:10}}>
                                {"total des charges"+"\n"+Total + "dh"}
                            </Text>
                            {Charges.map((charge,i)=> {

                                return(
                                    <TouchableOpacity key={i} style={styles.chargeCard} onPress={()=>{setselectedCharge(charge),setshowModal(true)}}>
                                        
                                        <View style={{flexDirection:"row",alignItems:"center"}}>

                                            <View style={{flexDirection:"column",flex:1,backgroundColor:"lightgrey",borderTopLeftRadius:10,borderBottomLeftRadius:10}}>
                                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                                    
                                                    <Image source={require("../Images/serviceIcon.png")} style={styles.icon} />
                                                    {(charge.service === "Autre") ? (
                                                        <View>
                                                        <Text style={{fontSize:18}}>
                                                            {(charge.autre)}
                                                        </Text>
                                                    </View>
                                                    ) : (
                                                        <View >
                                                            <Text style={{fontSize:18}}>
                                                                {(charge.service)}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                                    <Image source={require("../Images/calendarIcon.png")} style={styles.icon} />
                                                    
                                                    <Text style={{fontSize:18}}>
                                                        {JSON.stringify(charge.declaredAt.toDate()).split('"')[1].split('T')[0]}
                                                    </Text>    
                                                </View>
                                                
                                                
                                            </View>
                                            <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
                                                <Image source={require("../Images/spentIcon.png")} style={styles.icon} />
                                                <Text style={{color:"red",paddingLeft:20,fontSize:20}}>
                                                    {(charge.montant) +" dh"}
                                                </Text>
                                            </View>
                                        </View>
                                                
                                        {/* <View style={styles.column}>
                                            <Text >
                                                {JSON.stringify(charge.declaredAt.toDate()).split('"')[1].split('T')[0]}
                                            </Text>
                                        </View>
                                        {(charge.service === "Autre") ? (
                                            <View style={styles.column}>
                                            <Text >
                                                {(charge.autre)}
                                            </Text>
                                        </View>
                                        ) : (
                                            <View style={styles.column}>
                                                <Text >
                                                    {(charge.service)}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={styles.column}>
                                            <Text >
                                                {(charge.montant) +" dh"}
                                            </Text>
                                        </View> */}
                                        
                                    </TouchableOpacity>
                                )
                            })}
                            {(value.userState.role === "Admin") && <View style={{marginVertical:20,paddingHorizontal:100,paddingBottom:300}}>
                                <Button
                                    title="Ajouter une charge"
                                    onPress={() => {
                                        
                                        if((value.userState.role) === "Admin"){
                                            // Alert.alert("","get ready for magic ... !!!")
                                            navigation.navigate("UploadCharge")
                                        }else{
                                            Alert.alert("Warning","Don't try it again, be responsible.")
                                        }
                                        
                                    }}
                                />    
                            </View>}
                        </ScrollView>
                        
                        
                        <Modal           
                            animationType = {"fade"}  
                            transparent = {true}  
                            visible = {showModal}  
                            onRequestClose = {() =>{ setshowModal(false);setselectedCharge({}) } }>  

                            <View style={{width:"100%",height:"100%",alignItems:"center",justifyContent:"center"}}>
                                <View style = {styles.modal}>  
                                    
                                    <ScrollView style={{backgroundColor:"grey",width:"100%",paddingTop:10,borderRadius:10}}>
                                        <View style={{alignItems:"center",width:"100%"}}>
                                            <View>
                                                <Image source={{ uri: selectedCharge.documentUrl }} style={styles.file} />
                                            </View>
                                            <Text>
                                                {(selectedCharge.montant)+" DH"}
                                            </Text>
                                            {(selectedCharge.declaredAt !== "")
                                                &&
                                                <Text>
                                                    {"Payée le : "+JSON.stringify(selectedCharge.declaredAt.toDate()).split('"')[1].split("T")[0]}
                                                </Text>
                                            }
                                            {(selectedCharge.service === "Autre") ?
                                                (
                                                    <Text>
                                                        {"Pour : "+(selectedCharge.autre)}
                                                    </Text>
                                                )
                                                :
                                                (
                                                    <Text>
                                                        {"Pour : "+(selectedCharge.service)}
                                                    </Text>
                                                )
                                            }
                                            
                                            
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
    container: {
      flex: 1,
      backgroundColor:"#fccf97",
      alignItems: 'center',
      justifyContent: 'space-between',
      
    },
    chargeCard : {
        backgroundColor:"white",
        // height:50,
        borderRadius:10,
        margin:10,
        flexDirection:"row",
        alignItems:"center",
        elevation:5
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
    modal: {  
        justifyContent: 'space-around',  
        alignItems: 'center',   
        backgroundColor : "grey",   
        height: "70%" ,  
        width: '90%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
    },
    file : {
        minWidth:300,
        minHeight:300,
        borderRadius:5,
        borderWidth:5,
        borderColor:"black"
    },
    column :{
        fontSize:15,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:5,
        borderWidth: 1,  
        borderColor: '#000',
        borderRadius:8,
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        // backgroundColor:"yellow",
        height:40,
        

    },
    icon : {
        width:30,
        height:30,
        marginHorizontal:10
    },

});