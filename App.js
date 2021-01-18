import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/Home';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import AddUser from './screens/AddUser';
import DATA from './screens/DATA';
import TheContextProvider from './context/context';

import EditUser from './screens/EditUser';
import Profile from './screens/Profile';

import Appartments from './screens/Appartments';
import UploadReceipt from './screens/UploadReceipt';
import Receipts from './screens/Receipts';
import ReceiptConfirmation from './screens/ReceiptConfirmation';

import MyReceipts from './screens/MyReceipts';

import ChargesScreen from './screens/ChargesScreen';
import Users from './screens/Users';
import UploadCharge from './screens/UploadCharge';
import { LogBox } from 'react-native';
import _ from 'lodash';
import AppartementsReceipts from './screens/AppartementsReceipts';

const Stack = createStackNavigator();

LogBox.uninstall()
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

export default function App() {
  return (

    <TheContextProvider>


      <NavigationContainer>

        <Stack.Navigator screenOptions={{
          headerTitleAlign:"center",
          headerStyle:{
            backgroundColor:"#378a75",
          }
        }}>

          <Stack.Screen name="Home" component={Home} options={{title:"Home",headerTitleStyle:{color:"white"}}}/>

          <Stack.Screen name="Login" component={Login} options={{title:"Login",headerTitleStyle:{color:"white"}}}/>
          <Stack.Screen name="Dashboard" component={Dashboard} options={{title:"Bentriaa 1.0",headerTitleStyle:{color:"white"}}}/>
          <Stack.Screen name="AddUser" component={AddUser} options={{title:"Ajouter un copropriétaire",headerTitleStyle:{color:"white"}}}/>
          <Stack.Screen name="DATA" component={DATA} />
          <Stack.Screen name="Users" component={Users} />
          <Stack.Screen name="EditUser" component={EditUser} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Appartments" component={Appartments} />


          <Stack.Screen name="MyReceipts" component={MyReceipts} options={{title:"Mes reçus",headerTitleStyle:{color:"white"}}}/>
          <Stack.Screen name="Les charges" component={ChargesScreen} />

          <Stack.Screen name="UploadCharge" component={UploadCharge} options={{title:"Ajouter une charge",headerTitleStyle:{color:"white"}}}/>

          
          
          <Stack.Screen name="AppartementsReceipts" component={AppartementsReceipts} options={{title:"Reçus ajoutés",headerTitleStyle:{color:"white"}}}/>

          <Stack.Screen name="UploadReceipt" component={UploadReceipt} />
          <Stack.Screen name="Les reçus" component={Receipts} />
          <Stack.Screen name="ReceiptConfirmation" component={ReceiptConfirmation} options={{title:"Validation de reçu",headerTitleStyle:{color:"white"}}}/>
          


        </Stack.Navigator>

      </NavigationContainer>


    </TheContextProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
