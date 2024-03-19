//import liraries
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import ButtonComp from '../../components/ButtonComp';
import FastImageComp from '../../components/FastImageComp';
import HeaderComp from '../../components/HeaderComp';
import ModalComp from '../../components/ModalComp';
import MultiTextInput from '../../components/MultiTextInput';
import TextInputComp from '../../components/TextInputComp';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import navigationStrings from '../../navigations/navigationStrings';
import FastImage from 'react-native-fast-image';
import store from '../../redux/store';
import { saveUserData } from '../../redux/reducers/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from '../../utils/helperFunctions';
import auth from '@react-native-firebase/auth';

// create a component
const ProfileEdit = ({ navigation }) => {
  const { selectedTheme } = useSelector(state => state?.appSetting);

  const isDark = selectedTheme == 'dark';

  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [showPassModal, setShowPassModal] = useState(false);
  const [showExternalLinks, setShowExternalLinks] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const { dispatch } = store;

  const onSave = () => {
    //console.log('sss');
  };

  const onLogout = () => {

    AsyncStorage.removeItem('userData').then((res) => {
      console.log("user removed!!!");
      dispatch(saveUserData({}));
      auth()
        .signOut()
        .then(() => navigation.replace(navigationStrings.INITIAL_SCREEN)
        )

        .catch(error => {
          console.log("error==>",error);
        });

    }).catch((error) => {
      showError(error.message);
    })

  }

  return (
    <WrapperContainer>
      <View style={{ flex: 1, padding: moderateScale(16) }}>
        <HeaderComp
          leftText={strings.EDIT_PROFILE}
          rightText={strings.SAVE}
          onPressRight={onSave}
        />

        <TouchableOpacity activeOpacity={0.7} style={{ alignSelf: 'center' }}>
          <FastImage
            source={require('../../assets/images/pic.png')}
            style={{ width: 100, height: 100, borderRadius: moderateScale(50) }}
            resizeMode={FastImage.resizeMode.cover}

          />
          <Image
            source={imagePath.icEdit}
            style={{ position: 'absolute', bottom: 4, right: 0 }}
          />
        </TouchableOpacity>


        <View style={{ marginTop: moderateScaleVertical(24) }}>
          <TextInputComp
            value={userName}
            placeholder={strings.USERNAME}
            onChangeText={value => setUserName(value)}
          />

          <TextInputComp
            value={fullName}
            placeholder={strings.FULL_NAME}
            onChangeText={value => setFullName(value)}
          />

          <MultiTextInput
            multiline={true}
            value={bio}
            placeholder={strings.BIO}
            onChangeText={value => setBio(value)}
          />

          <ButtonComp
            onPress={() => setShowPassModal(true)}
            text={strings.CHANGE_PASSWORD}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 0.5,
              borderColor: isDark ? colors.whiteColor : colors.blackColor,
            }}
          />

          <ButtonComp
            text={strings.ADD_LINKS}
            onPress={() => navigation.navigate(navigationStrings.LINKS)}
            style={{
              backgroundColor: 'transparent',
              borderWidth: 0.5,
              borderColor: isDark ? colors.whiteColor : colors.blackColor,
              marginTop: moderateScaleVertical(16),
            }}
          />

          <ButtonComp
            text={strings.LOGOUT}
            onPress={onLogout}
            style={{
              //backgroundColor: 'transparent',
              borderWidth: 0.5,
              //borderColor: colors.redColor,
              marginTop: moderateScaleVertical(16),
            }}
          />

          <ModalComp
            key={'1'}
            isVisible={showPassModal}
            style={{ margin: 0, justifyContent: 'flex-end' }}
            avoidKeyboard
            onBackdropPress={() => setShowPassModal(false)}>
            <View
              style={{
                ...styles.modalStyle,
                backgroundColor: isDark
                  ? colors.whiteColorOpacity20
                  : colors.whiteColor,
              }}>
              <TextInputComp
                value={password}
                placeholder={strings.ENTER_OLD_PASSWORD}
                onChangeText={value => setPassword(value)}
                secureTextEntry={secureText}
                secureText={secureText ? strings.SHOW : strings.HIDE}
                onPressSecure={() => setSecureText(!secureText)}
              />

              <TextInputComp
                value={confirmPassword}
                placeholder={strings.CONFIRM_PASSWORD}
                onChangeText={value => setConfirmPassword(value)}
                secureTextEntry={secureText}
                secureText={secureText ? strings.SHOW : strings.HIDE}
                onPressSecure={() => setSecureText(!secureText)}
              />
              <ButtonComp text={strings.CHANGE_PASSWORD} />
            </View>
          </ModalComp>
        </View>
      </View>
    </WrapperContainer>

  );
};

// define your styles
const styles = StyleSheet.create({
  boxView: {
    padding: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  imgStyle: {
    width: width / 3,
    height: width / 3,
    borderWidth: 0.5,
  },
  modalStyle: {

    padding: moderateScale(16),
    borderTopLeftRadius: moderateScale(8),
    borderTopRightRadius: moderateScale(8),

  },

});

//make this component available to the app
export default ProfileEdit;
