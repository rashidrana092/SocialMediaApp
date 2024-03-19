import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, useColorScheme, StatusBar } from 'react-native';
import colors from '../styles/colors';
import { useSelector } from 'react-redux';

const WrapperContainer = ({
    style = {},
    children
}) => {
    const { selectedTheme } = useSelector(state => state?.appSetting)

    return (
        <View style={{
            ...styles.container,
            ...style,
            backgroundColor: selectedTheme == 'dark' ? colors.themeColor : colors.whiteColor
        }}>
            <StatusBar barStyle={selectedTheme == 'dark' ? 'light-content' : 'dark-content'} />
            <SafeAreaView style={{ flex: 1 }}>
                {children}
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.themeColor
    },
});

export default WrapperContainer;
