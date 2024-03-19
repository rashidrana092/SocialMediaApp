import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Image } from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import { moderateScale, moderateScaleVertical, textScale } from '../../styles/responsiveSize';
import HeaderComp from '../../components/HeaderComp';
import strings from '../../constants/lang';
import { FlashList } from '@shopify/flash-list';
import TextComp from '../../components/TextComp';
import colors from '../../styles/colors';
import { useSelector } from 'react-redux';
import imagePath from '../../constants/imagePath';
import fontFamily from '../../styles/fontFamily';
import ModalComp from '../../components/ModalComp';
import TextInputComp from '../../components/TextInputComp';
import ButtonComp from '../../components/ButtonComp';


const Links = () => {

    const {selectedTheme} =useSelector(state=>state?.appSetting)
    const  isDark=selectedTheme=='dark';

    const [showModal,setShowModal]=useState(false);
    const [title,setTitle]=useState('');
    const [url,setUrl]=useState('');

    const renderItem=()=>{
        return (
          <TouchableOpacity 
          style={styles.itemStyle}
          activeOpacity={0.7}
          >
            <View style={{flex: 0.1}}>
              <Image source={imagePath.icLink} />
            </View>

            <View style={{flex: 0.8}}>
              <TextComp
                text="https://www.facebook.com/ranarashid05"
                style={{color: colors.blueColor}}
                numberOfLines={1}
              />
            </View>

            <View style={{flex: 0.1}}>
              <Image style={{tintColor: isDark? colors.whiteColor : colors.blackColor}} source={imagePath.rightArrow} />
            </View>
          </TouchableOpacity>
        );
    }

    return (
      <WrapperContainer>
        <View style={{flex: 1, padding: moderateScale(16)}}>
          <HeaderComp leftText={strings.ADD_LINKS} />

          <TouchableOpacity activeOpacity={0.7} style={styles.addLinkStyle}
          onPress={()=>setShowModal(true)}
          >
            <Image
              style={{
                tintColor: isDark ? colors.whiteColor : colors.blackColor,
                marginRight: moderateScale(16),
              }}
              source={imagePath.icAdd}
            />
            <TextComp
              text={strings.ADD_LINKS}
              style={{fontSize: textScale(16), fontFamily: fontFamily.medium}}
            />
          </TouchableOpacity>
          <FlashList
            data={[{}, {}]}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  ...styles.horizontalLine,
                  borderBottomColor: isDark
                    ? colors.whiteColorOpacity40
                    : colors.blackOpacity40,
                }}
              />
            )}
          />
        </View>

        <ModalComp
          key={'1'}
          isVisible={showModal}
          style={{margin: 0, justifyContent: 'flex-end'}}
          avoidKeyboard
          onBackdropPress={() => setShowModal(false)}>
          <View
            style={{
              ...styles.modalStyle,
              backgroundColor: isDark
                ? colors.whiteColorOpacity20
                : colors.whiteColor,
            }}>
            <TextInputComp
              value={title}
              placeholder={strings.TITLE}
              onChangeText={value => setTitle(value)}
            />

            <TextInputComp
              value={url}
              placeholder={strings.URL}
              onChangeText={value => setUrl(value)}
            />
            <ButtonComp text={strings.SAVE} />
          </View>
        </ModalComp>
      </WrapperContainer>
    );
};

export default Links;

const styles = StyleSheet.create({
  itemStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    // justifyContent: 'space-between',
  },

  horizontalLine: {
    height: moderateScale(2),
    borderBottomWidth: 1,
    marginVertical: moderateScaleVertical(16),
  },

  addLinkStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: moderateScaleVertical(16),
  },
  modalStyle: {
    padding: moderateScale(16),
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),
  },
});