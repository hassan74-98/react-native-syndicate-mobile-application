import React, { useEffect, useState } from 'react'
import { StyleSheet,View, Text, Button, ActivityIndicator } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { TheContextConsumer } from '../context/context'
import { Picker } from '@react-native-picker/picker';

export default function Login({ navigation },props) {

    const [user, setuser] = useState({
        
        email:"",
        password:""
        
    })
    
    
    
    return (
        
        <TheContextConsumer >
                {(value) => {
                    
                    return(
                        <View style={styles.container}>
                            {(value.userState.email) && navigation.navigate('Dashboard')}
                            <Text>Veuillez vous connecter</Text>
                            <View>
                            {
                                (value.loading) ? 
                                (
                                    <ActivityIndicator size="large" color="#000" />
                                )
                                :
                                (
                                    <View>
                                        {/* <View style={styles.input}>
                                            <Picker
                                                selectedValue={user.email}
                                                style={{height:"100%"}}
                                                onValueChange={(itemValue, itemIndex) => {
                                                    
                                                    setuser({...user,email:itemValue})
                                                }}
                                            >   
                                                <Picker.Item label="Admin" value="hassaneloufir98@gmail.com" />
                                                <Picker.Item label="User" value="User01@gmail.com" />
                                                <Picker.Item label="Representative" value="Rep01@gmail.com" />
                                                <Picker.Item label="Syndic" value="Syn01@gmail.com" />
                                                <Picker.Item label="Treasurer" value="Tres01@gmail.com" />
                                                
                                            </Picker>
                                            
                                        </View> */}
                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Email" 
                                            label="Email" 
                                            value={user.email}
                                            onChangeText={(text) => {setuser({...user,email:text})}}
                                        />
                                        <TextInput 
                                            style={styles.input}
                                            placeholder="Mot de passe" 
                                            label="Password" 
                                            secureTextEntry={true}
                                            value={user.password}
                                            onChangeText={(text) => {setuser({...user,password:text})}}
                                        />
                                    </View>
                                )
                            }

                            
                            
                            </View>


                            <View style={{display:"flex",flexDirection:"row",width:"100%",alignItems: 'center',padding:40,justifyContent: "center"}}>
                                
                                <Button
                                    
                                    title="Se connecter"
                                    onPress={async () =>{
                                        value.Login((user.email).trim(),(user.password).trim()) ;
                                    }}
                                    
                                />
                                
                            </View>
                            
                            {/* <Button
                                title="test"
                                onPress={() =>{Alert.alert("test button",value.userState.uid)}
                                    // navigation.navigate('Home')
                                }
                            /> */}
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
    input: {
        width: 300,
        height: 40,
        padding: 5,
        margin: 30,
        borderWidth: 1,
        borderColor: 'grey',
        borderStyle: 'solid',
        borderRadius: 3,
        backgroundColor:"#fff"
    },
    datePickerStyle: {
        width: 300,
        margin: 30,
    },
    
});