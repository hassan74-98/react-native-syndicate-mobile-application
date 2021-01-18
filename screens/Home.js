import React, { useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { StyleSheet,View, Text, Button } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import ChargesList from '../components/ChargesList';
import { fireStore } from '../firebase/firebase';
// const FindNextJun = (inputDate)=>{
    
//     let junDateToSec = (new Date(inputDate.getFullYear(),4,31,13,0,0))
//     if(inputDate-(new Date(inputDate.getFullYear(),4,31,13,0,0)) >= 0){
//         return(new Date(junDateToSec.getFullYear()+1,4,31,13,0,0))
//     }
//     else {
//         return(new Date(junDateToSec.getFullYear(),4,31,13,0,0))
//     }
// }
// const testFunction = (input) => {
//     let x = new Date(input)
//     return((new Date(x.getFullYear(),5,1,13,0,0)))
    
// }
export default function Home({ navigation }) {
    
    // const [user, setuser] = useState(null)
    // const [test, settest] = useState("2019-10-02")
    // useEffect(() => {
    //     // A0fbtcbyqSTCkHAnWNPzl24rP6h1
    //     // hneaAlnLeUMOC1S6RYClIpIPyCZ2
    //     fireStore.collection("users").doc("A0fbtcbyqSTCkHAnWNPzl24rP6h1").onSnapshot((query)=>{
    //         let data = query.data()
            
    //         data.proprietaireDe.map((app)=>{
                
                
    //         })
    //         setuser(data)
    //     })
    // }, [])
    
    
    

    
    
    return (

        <View style={styles.container}>
            
            <View>
                
            </View>
             <Text style={{textAlign:"center",padding:10,fontSize:20}}>
                bentriaa 1.0
            </Text>
            {/*<Text style={{textAlign:"center",padding:10,fontSize:20}}>
                Phase de teste
            </Text>
            <Text style={{textAlign:"center",padding:10,fontSize:50}}> 👷{"\n"}  </Text>
            
            <Button
                title="Commencer"
                onPress={() =>
                    navigation.navigate('Login')
                }
            /> */}
            {/* <ScrollView style={{backgroundColor:"back",width:"100%",padding:30}}>
                {(user) && (
                    <Text style={{textAlign:"center",fontSize:23}}>
                        
                    </Text>    
                )}  
                {(user) && (
                    <ChargesList user={user}/>
                )}    
                
                
            </ScrollView> */}

            {/*
            {(date) &&
            <Text>
                {JSON.stringify(FindNextJun(FindNextJun(date.toDate())))}
            </Text>}
            {(date) &&
            <Text>
                {JSON.stringify(FindNextJun(FindNextJun(FindNextJun(date.toDate()))))}
            </Text>}
            {(date) &&
            <Text>
                {JSON.stringify(FindNextJun(FindNextJun(FindNextJun(FindNextJun(date.toDate())))))}
            </Text>}
            {(date) &&
            <Text>
                {JSON.stringify(FindNextJun(FindNextJun(FindNextJun(FindNextJun(FindNextJun(date.toDate()))))))}
            </Text>} */}
            {/* <Text style={{textAlign:"center",padding:10,fontSize:20}}>

                
                Phase de teste {"\n"}{"\n"}{"\n"}{"\n"}
                <Text style={{textAlign:"center",padding:10,fontSize:60}}> 👷 </Text>
            </Text> */}
            <Button
                title="Commencer"
                onPress={() =>
                    navigation.navigate('Login')
                }
            />
            <View></View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:"#fccf97",
      alignItems: 'center',
      justifyContent: 'space-between',
    },
});
{/* {"date : "+JSON.stringify((user.proprietaireDe[1].DateDeSignatureDuContrat.toDate()))+"\n"}
                        {"next : "+JSON.stringify((FindNextJun(user.proprietaireDe[1].DateDeSignatureDuContrat.toDate())))+"\n"} */}
                        {/* {"june : "+ JSON.stringify((new Date("2012-03-05")))+"\n"}
                        {"next june : "+ JSON.stringify(FindNextJun(new Date("2012-03-05")))+"\n"}
                        {"next june : "+ JSON.stringify(FindNextJun(FindNextJun(new Date("2012-03-05"))))+"\n"}
                        {"next june : "+ JSON.stringify(FindNextJun(FindNextJun(FindNextJun(new Date("2012-03-05")))))+"\n"} */}
                        {/* {"\n"+"\n"+"\n"+"\n"}
                        { JSON.stringify((new Date(test)))+"\n"}
                        { JSON.stringify(FindNextJun(new Date(test)))+"\n"}
                        { "\n"+"\n"}
                        { JSON.stringify(testFunction((test)))+"\n"} */}
                        {/* {"next june : "+ JSON.stringify(FindNextJun(FindNextJun(new Date(test))))+"\n"}
                        {"next june : "+ JSON.stringify(FindNextJun(FindNextJun(FindNextJun(new Date(test)))))+"\n"}
                        {"next june : "+ JSON.stringify(FindNextJun(FindNextJun(FindNextJun(FindNextJun(new Date(test))))))+"\n"} */}