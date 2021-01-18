import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { Modal } from 'react-native';
import { View, Text,StyleSheet, Button, FlatList, ScrollView } from 'react-native'
import { List, ListItem } from "react-native-elements";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import ChargesList from '../components/ChargesList';
import UserCard from '../components/UserCard';
import { TheContextConsumer } from '../context/context'
import { auThentication, fireStore } from '../firebase/firebase'

export default function Users({ navigation }) {
    
    const [users, setusers] = useState([])
    const [Search, setSearch] = useState("")

    useEffect(() => {
        fireStore.collection("users").onSnapshot((querySnapshot) => {
            let list = []
            querySnapshot.docs.map((doc) => {
                list.push(doc.data())
            })
            setusers(list)
        })
    }, [])

    return (
        
        <TheContextConsumer >
            {(value) => {
                
                
                return(
                    <View style={styles.container}>
                        
                        <Text></Text>
                        <View style={{height:70,alignItems:"center",justifyContent:"center",backgroundColor:"lightgrey",width:"100%"}}>
                            <Text style={{fontSize:20}}> Liste de utilisateurs </Text>
                        </View>
                        <View style={{backgroundColor:"lightblue",width:"100%",alignItems:"center"}}>
                            <TextInput style={styles.input}
                                placeholder={"Search"} 
                                label={"Search"}
                                value={Search}
                                autoCapitalize = 'none'
                                
                                onChangeText={(text) => {
                                    let x = text.toLowerCase()
                                    setSearch(text.toLowerCase())
                                }}
                            />    
                        </View>
                        
                        
                        <ScrollView style={{backgroundColor:"grey",width:"100%",paddingVertical:10}}>
                        
                            {users.map((user,index)=>{
                                if((JSON.stringify(user).toLowerCase()).includes(Search)){
                                    return(

                                        <TouchableOpacity key={index} style={styles.item} onPress={() => {}}>
                                            <View style={styles.column}>
                                                <Text style={{textAlign:"center",textTransform:"uppercase"}}>
                                                    {user.nom}
                                                </Text>
                                            </View>
                                            <View style={styles.column}>
                                                <Text style={{textAlign:"center",textTransform:"uppercase"}}>
                                                    {user.prenom}
                                                </Text>
                                            </View>
                                        </TouchableOpacity> 
                                        
                                    )    
                                }
                                
                            })}
                            <Text style={{paddingBottom:300}}>

                            </Text>
                        </ScrollView>
                        
                        <View style={{padding:20}}>
                            <Button
                                title="Back"
                                onPress = {()=>{
                                    navigation.navigate("Dashboard")
                                }}
                            />    
                        </View>
                        <View></View>
                    </View>
                )
            }}
        </TheContextConsumer>    
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
        // height:"50%",
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    item : {
        backgroundColor:"white",
        height:50,
        margin:10,
        alignItems:"center",
        borderRadius:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"center"
    },
    modal: {  
        justifyContent: 'space-around',  
        alignItems: 'center',   
        backgroundColor : "grey",   
        height: 300 ,  
        width: '80%',  
        borderRadius:10,  
        borderWidth: 1,  
        borderColor: '#fff',    
        marginTop: 80,  
        marginLeft: 40,
        

    },  
    text: {  
    color: 'black',  
    marginTop: 10,
    textAlign:"center",
    fontSize:20
    },
    column : {
        flex:1,
        // backgroundColor:"red",
        // height:"100%",
        display:"flex",
        justifyContent:"center",
        marginHorizontal:5,
        borderWidth: 1,  
        borderColor: '#000',
        borderRadius:5,
        height:35

    }  
});
{/* <ScrollView style={{backgroundColor:"black",width:"100%"}}>
{(value.usersList) && value.usersList.map((user,index)=>{
    const x = {user}
    return(
        <View key={index} style={{alignItems:"center",width:"100%",marginVertical:10,backgroundColor:"grey",display:"flex",flexDirection:"row",justifyContent:"center"}}>
            
                
            <ChargesList Appartements={user.proprietaireDe}/>
                
               
        </View> 
        
    )
})}
</ScrollView> */}