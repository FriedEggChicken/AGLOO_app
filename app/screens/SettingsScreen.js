import React, { useState, Component } from "react";
import { createStackNavigator} from '@react-navigation/stack';
import LoginScreen from './LoginScreen'
import SettinggMain from './SettingMain'

const SettingStack = createStackNavigator();

export default class SettingMain extends Component {
  constructor(props) {
    super(props);
}
  render () {
    const userID = this.props.userID
  return (
      <SettingStack.Navigator screenOptions = {{headerShown: false}} >
        <SettingStack.Screen name = "SettinggMain">
        {(props)=> <SettinggMain {...props} userID = {userID}/>}
        </SettingStack.Screen>
        <SettingStack.Screen name = "Loginn" component = {LoginScreen}/>
      </SettingStack.Navigator>
  );
}
}