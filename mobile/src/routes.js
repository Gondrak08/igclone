import React from 'react'
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Image, Modal, TouchableOpacity} from 'react-native'

import Feed from './pages/Feed';
import New from './pages/New';
import Logo from '../assets/logo.png'


const AppStack = createStackNavigator();

export default function Routes(){
    return(
        <NavigationContainer>
            <AppStack.Navigator  initialRouteName="Feed" headerMode="screen" 
                screenOptions={{
                    headerTintColor: '#000',
                    headerBackTitle: null,
                    headerTitle: (props) =>  <Image style={{marginHorizontal:20}} source={Logo} />
                                 }}
                 mode={Modal} >

                <AppStack.Screen name="Feed" component={Feed} />
                <AppStack.Screen name="New" component={New} />
            </AppStack.Navigator>
        </NavigationContainer>
    )
}
