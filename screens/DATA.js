import React from 'react'
import { StyleSheet,View, Text } from 'react-native'

export default function DATA() {
    return (
        <View style={styles.container}>
            <Text>DATA</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
});