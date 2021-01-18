import React, { useEffect, useState } from 'react'
import { View, Text } from 'react-native'
import { AppCharges } from '../useFull/Charges'

export default function AppChargesList(props) {
    const [Appartment, setCharges] = useState({
        Charges:[],
        Total:0
    })
    useEffect(() => {
        // setCharges(AppCharges(props.Appartment))
        
    }, [])
    return (
        <View style={{width:"100%"}}>
            {(Appartment["Charges"]) && Appartment["Charges"].map((charge,index) => {

                return(
                    <View>
                        <Text>
                            {JSON.stringify(charge)}
                        </Text>
                    </View>
                )
            })}
        </View>
    )
}
