import React, { useEffect, useState } from 'react'
import { Button } from 'react-native'

import { View, Text } from 'react-native'
import { AllCharges } from '../useFull/Charges'

export default function ChargesList(props) {

    const [UserAppartments, setCharges] = useState({
        Appartments:[],
        Total : 0
    })

    useEffect(() => {
        setCharges(AllCharges(props.user))
        
    }, [])

    return (
        <View style={{width:"100%"}}>
            {/* {JSON.stringify(props.user)} */}
            {/* <Text>
                {JSON.stringify(UserAppartments)}
            </Text> */}
            {UserAppartments.Appartments.map((appartement,i)=>{
                
                return(
                    <View style={{display:"flex"}} key={i}>
                        <Text>
                            
                            {"Immeuble : " + appartement.Immeuble+"\n"}
                            {"N° : " + appartement.NAppartement}
                            
                        </Text>

                        <Text style={{width:"100%",textAlign:"center"}}>{"Total à payer  : "+ appartement["Total"].toString() + " DH "}</Text>
                        <View key={i} style={{display:"flex",alignItems: 'center',justifyContent:"center"}}>

                            {appartement["ChargesList"].map((x,index)=>{

                                return(
                                    <View key={index} style={{backgroundColor:"lightgrey",width:"80%",display:"flex",alignItems:"center",margin:10}}>
                                        
                                        <Text>
                                            {"( " + x.startingDay +"===>"+x.To+" )"}
                                            
                                        </Text>
                                        <Text>
                                            {JSON.stringify(x.saison)+"   " + JSON.stringify(x.charge) + " DH "+"   ( "+JSON.stringify(x.days)+" jours ) "}
                                        </Text>

                                        
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{padding:20,paddingHorizontal:50}}>
                            <Button
                                title="voir mes reçus"
                                onPress={()=>props.navigation("MyReceipts",{
                                    user:props.user,
                                    appartement: appartement,
                                    
                                })}
                                
                            />    
                        </View>
                    </View>
                )
            })}

            
        </View>
    )
}
