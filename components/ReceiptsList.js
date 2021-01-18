import React, { useEffect, useState } from 'react'
import { Modal } from 'react-native'
import { Button } from 'react-native'
import { Image } from 'react-native'
import { ScrollView } from 'react-native'
import { Alert } from 'react-native'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { TheContextConsumer } from '../context/context'
import { fireStore } from '../firebase/firebase'

export default function ReceiptsList(props) {

    // const [Receipts, setReceipts] = useState(props.Receipts);
    // const [selectedReceipt, setselectedReceipt] = useState({})
    // const [showModal, setshowModal] = useState(false);
    const [Receipts, setReceipts] = useState([]);
    // const [budjet, setbudjet] = useState(0)

    const getReceipts = () => {
        
        fireStore.collection("receipts").onSnapshot((snapshot) => {
            let receiptsList = []
            snapshot.docs.map((receipt) => {
                receiptsList.push(receipt.data())
            })
            setReceipts(receiptsList)
        })
    }
    useEffect(() => {
        getReceipts()

    }, [])
    // useEffect(() => {
    //     getBudjet()
        
    // }, [Receipts])
    return (
        <TheContextConsumer>
            {(value)=>{
                return(
                    <View>
                        {Receipts.map((receipt,i) => {

                            return(
                                <TouchableOpacity 
                                    key={i} 
                                    style={styles.userCard} 
                                    onPress={()=>{
                                        props.navigation("ReceiptConfirmation",receipt)
                                    }}
                                    >
                                    
                                    <Text style={styles.column}>
                                        {receipt.montant+"dh"}
                                    </Text>
                                    {(receipt.etat === "en attente") && 
                                    (
                                        <Text style={styles.column}>
                                            ⌛
                                        </Text>
                                    )
                                    }
                                    {(receipt.etat === "validé") && 
                                    (
                                        <Text style={styles.column}>
                                            ✔️
                                        </Text>
                                    )
                                    }
                                    {(receipt.etat === "refusé") && 
                                    (
                                        <Text style={styles.column}>
                                            ❌
                                        </Text>
                                    )
                                    }
                                </TouchableOpacity>    
                            )
                            
                        })}
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
    userCard:{
        height:50,
        backgroundColor:"lightgrey",
        padding:10,
        marginVertical:10,
        marginHorizontal:10,
        borderRadius: 10,
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"

    },
    row:{
        width:"100%",
        padding:10,
        marginHorizontal:10,
        // paddingHorizontal:40,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        backgroundColor:"red"
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
    text: {  
        color: 'black',  
        marginTop: 10,
        textAlign:"center",
        fontSize:20
    },
    file : {
        minWidth:300,
        minHeight:300,
        borderRadius:5,
        borderWidth:5,
        borderColor:"black"
    },    
});