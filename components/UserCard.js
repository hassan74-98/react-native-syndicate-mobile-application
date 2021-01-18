import React, { useState } from 'react'
import { View, Text,StyleSheet } from 'react-native'


export default function UserCard(props) {
    const [user, setuser] = useState(props.user)
    return (
        <View style={styles.userCard}>
            <Text>
                {JSON.stringify(user.nom)}
            </Text>
        </View>
    )
}
const styles = StyleSheet.create({
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
});