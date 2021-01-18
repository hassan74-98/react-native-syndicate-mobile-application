import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native'
import { View, Text,StyleSheet, Button  } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { TheContextConsumer } from '../context/context'
import { fireStore } from '../firebase/firebase';
import Profile from './Profile';
import Appartments from './Appartments';
import AddUser from './AddUser';
import Receipts from './Receipts';

import ChargesScreen from './ChargesScreen';



const Tab = createMaterialTopTabNavigator();
export default function Dashboard({ navigation }) {
    
    const [budjet, setbudjet] = useState({
        valdé:0,
        enAttente:0
    })
    const [charges, setcharges] = useState(0)
    useEffect(() => {
        getBudjet()
    }, [])
    // *********************************************************************
    
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
    // *********************************************************************
    return (
        <TheContextConsumer >
            {(value) => {
                if(value.userState.uid){
                    return(
                        
                        <Tab.Navigator tabBarOptions={{
                            activeTintColor : "white",
                            inactiveTintColor : "black",
                            style : {backgroundColor:"#378a75"},
                            indicatorStyle : {
                                backgroundColor : "white",
                                height:4
                            },
                            labelStyle : {
                                fontWeight:"bold"
                            },
                            iconStyle:{
                                flex:1,
                            },
                            showIcon:true,
                        }}>
                            <Tab.Screen 
                                name="Profile" 
                                component={Profile} 
                                options={{
                                    tabBarIcon : ({ color: string}) => <Icon name="account" color={"black"} size={25}/>,
                                    tabBarLabel : () => null
                                }}    
                                
                            />
                            
                            <Tab.Screen 
                                name="Appartments" 
                                component={Appartments} 
                                options={{
                                    tabBarIcon : ({ color: string}) => <Icon name="office-building" color={"lightgrey"} size={25}/>,
                                    tabBarLabel : () => null
                                }} 
                            />
                            
                            <Tab.Screen 
                                name="Les charges" 
                                component={ChargesScreen} 
                                options={{
                                    tabBarIcon : ({ color: string}) => <Icon name="bitcoin" color={"yellow"} size={25}/>,
                                    tabBarLabel : () => null
                                }} 
                            />
                            {(["Admin","Representative"].includes(value.userState.role)) && 
                                (
                                    <Tab.Screen 
                                        name="AddUser" 
                                        component={AddUser} 
                                        options={{
                                            tabBarIcon : ({ color: string}) => <Icon name="account-plus" color={"white"} size={25}/>,
                                            tabBarLabel : () => null
                                        }} 
                                    />
                                )
                            }
                            
                            <Tab.Screen 
                                name="Les reçus" 
                                component={Receipts} 
                                options={{
                                    tabBarIcon : ({ color: string}) => <Icon name="receipt" color={"#800000"} size={25}/>,
                                    tabBarLabel : () => null
                                }} 
                            />
                        </Tab.Navigator>
                        
                    )    
                }else{
                    navigation.navigate("Login");
                }
                
                }
            }
        </TheContextConsumer>
        
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor:"#fccf97"
    },
    scene: {
        flex: 1,
    },
});
