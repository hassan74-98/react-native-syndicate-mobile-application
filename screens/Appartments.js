import React, { useState } from 'react'
import { Button } from 'react-native'
import { ScrollView } from 'react-native'
import { View, Text,StyleSheet } from 'react-native'

import { TheContextConsumer } from '../context/context'


import AppList from '../components/AppList'

export default function Appartments({navigation}) {
    
    

    return (
        <TheContextConsumer >
            {(value)=>{
                return(
                    <View style={styles.container}>
                        <Text style={{width:"100%",textAlign:"center",fontSize:30,padding:20}}>
                                Liste des appartements
                        </Text>
                        <ScrollView style={{width:"100%",paddingVertical:10}}>
                            
                            <AppList Users={value.usersList} navigation={(screen,data) => {navigation.navigate(screen,data)}}/>
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
      
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor:"#fccf97"
    },
    // userCard:{
    //     height:50,
    //     backgroundColor:"lightgrey",
    //     padding:10,
    //     marginVertical:10,
    //     marginHorizontal:10,
    //     borderRadius: 10,
    //     display:"flex",
    //     flexDirection:"row",
    //     alignItems:"center",
    //     justifyContent:"space-between"

    // },
    row:{
        // width:"100%",
        height:50,
        padding:10,
        marginHorizontal:10,
        paddingHorizontal:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"space-between",
        // backgroundColor:"#378a75"
    },
    column :{
        
        fontSize:20,
        textAlign:"center",
        overflow: "hidden",
        flex:1,
        margin:1,
        backgroundColor:"#fccf97",
        borderWidth: 1,  
        borderColor: '#000',

    },
    text: {  
        color: 'black',  
        marginTop: 10,
        textAlign:"center",
        fontSize:20
    }    
});