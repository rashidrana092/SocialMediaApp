import auth, {
  firebase,
  sendEmailVerification,
  updateProfile,
} from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ButtonComp from '../../components/ButtonComp';
import HeaderComp from '../../components/HeaderComp';
import TextComp from '../../components/TextComp';
import TextInputComp from '../../components/TextInputComp';
import WrapperContainer from '../../components/WrapperContainer';
import strings from '../../constants/lang';
import navigationStrings from '../../navigations/navigationStrings';
import fontFamily from '../../styles/fontFamily';
import {
  moderateScale,
  moderateScaleVertical,
  textScale,
} from '../../styles/responsiveSize';
import { showError } from '../../utils/helperFunctions';
import validator from '../../utils/validations';
import imagePath from '../../constants/imagePath';
import { ReducerType } from '@reduxjs/toolkit';

const Signup = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userId, setUserId] = useState('');

  const [secureText, setSecureText] = useState(true);
  const [isLoading, setLoading] = useState(false);
 // const defaultImage =require(imagePath.fifthActiveIcon);
  const localImage = require('../../assets/images/ic_user.png');
  const isValidData = () => {
    const error = validator({
      userName,
      fullName,
      email,
      password,
    });
    if (error) {
      showError(error);
      return false;
    }
    return true;
  };
  useEffect(()=>{
    console.log('default image: ',localImage);

  },[])

  const onPressSignup = async () => {
    const checkValid = isValidData();

    if (checkValid) {
      setLoading(true);
      try {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((user) => {
            let data = {
              userId: user.user.uid,
              userName: userName,
              fullName: fullName,
              email: email,
              password: password,
              img: defaultImage

            }

            firestore()
              .collection('Users')
              .doc(user.user.uid)
              .set(data, { merge: true });

            console.log('user added successfully');
            setUserId(user.user.uid);

            const update = {
              displayName: fullName,
            };

            firebase.auth().currentUser.updateProfile(update);
            console.log("curren user+++", auth().currentUser);

            navigation.navigate(navigationStrings.OTP_VERIFICATION, {
              data: data,
            });
          });
      } catch (error) {
        console.log('error occured==>', error);
        showError(error?.error || error.message);
        setLoading(false);
      }
    }
  };


  return (
    <WrapperContainer>
      <HeaderComp />

      <KeyboardAwareScrollView>
        <View style={{ padding: moderateScale(16) }}>
          <View style={{}}>
            <TextComp
              style={styles.headerStyle}
              text={strings.CREATE_NEW_ACCOUNT}
            />
            <TextComp
              style={styles.descStyle}
              text={strings.CREATE_AN_ACCOUNT_SO_YOU_CAN_CONTINUE}
            />

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

            <TextInputComp
              value={email}
              placeholder={strings.EMAIL}
              onChangeText={value => setEmail(value)}
            />

            <TextInputComp
              value={password}
              placeholder={strings.PASSWORD}
              onChangeText={value => setPassword(value)}
              secureTextEntry={secureText}
              secureText={secureText ? strings.SHOW : strings.HIDE}
              onPressSecure={() => setSecureText(!secureText)}
            />
          </View>

          <ButtonComp
            text={strings.SIGN_UP}
            style={{ marginTop: moderateScaleVertical(52) }}
            onPress={onPressSignup}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
     
    </WrapperContainer>
  );
};
const styles = StyleSheet.create({
  headerStyle: {
    fontSize: textScale(24),
    fontFamily: fontFamily.medium,
  },
  descStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.regular,
    marginTop: moderateScaleVertical(8),
    marginBottom: moderateScaleVertical(52),
  },
});

//make this component available to the app
export default Signup;
