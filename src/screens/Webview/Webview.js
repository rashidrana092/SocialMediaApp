//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import WrapperContainer from '../../components/WrapperContainer';
import HeaderComp from '../../components/HeaderComp';

// create a component
const Webview = () => {
  return (
    <WrapperContainer>
        <HeaderComp />
        <WebView source={{uri: 'https://reactnative.dev'}} style={{flex: 1}}/>

    </WrapperContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
});

//make this component available to the app
export default Webview;
