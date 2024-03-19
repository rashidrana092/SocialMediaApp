import React, {Component} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
  width,
} from '../../styles/responsiveSize';
import {FlashList} from '@shopify/flash-list';
import FastImageComp from '../../components/FastImageComp';
import colors from '../../styles/colors';
import SerachBar from '../../components/SerachBar';
import HeaderComp from '../../components/HeaderComp';
import TextComp from '../../components/TextComp';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';

// create a component
const Notification = () => {

    const {selectedTheme} = useSelector(state=>state?.appSetting)
 
    const renderItem = () => {
    

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: moderateScale(16),
        }}>
        <FastImage
          source={require('../../assets/images/pic.png')}
          style={styles.imgStyle}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={{marginHorizontal: moderateScale(16)}}>
          <TextComp text="Rana Rashid" style={{fontSize: textScale(16)}}>
            <Text style={{color: colors.redColor}}>added new post</Text>
          </TextComp>

          <TextComp
            text="1hr ago"
            style={{
              marginVertical: moderateScaleVertical(12),
              color:
                selectedTheme == 'dark'
                  ? colors.whiteColorOpacity70
                  : colors.blackOpacity70,
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer>
      <View style={{flex: 1}}>
        <HeaderComp
          isLeftImage={false}
          leftText="Notifications"
          style={{marginBottom: moderateScaleVertical(16)}}
        />
        <FlashList
          data={[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]}
          renderItem={renderItem}
          estimatedItemSize={width / 3}
          ItemSeparatorComponent={() => (
            <View style={{
                ...styles.horizontalLine,
                borderBottomColor: selectedTheme =='dark'? colors.whiteColorOpacity40: colors.blackOpacity40
            }} />
          )}
        />
      </View>
    </WrapperContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  imgStyle: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },

  horizontalLine: {
    height: moderateScale(2),
    borderBottomWidth :1,
    marginVertical: moderateScaleVertical(16),

  }
});

//make this component available to the app
export default Notification;
