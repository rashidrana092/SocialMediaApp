import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import React, { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-crop-picker';
import { useSelector } from 'react-redux';
import ButtonComp from '../../components/ButtonComp';
import HeaderComp from '../../components/HeaderComp';
import MultiTextInput from '../../components/MultiTextInput';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import strings from '../../constants/lang';
import navigationStrings from '../../navigations/navigationStrings';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';


const AddPost = ({ navigation, route }) => {
  const { selectedTheme } = useSelector(state => state?.appSetting);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const isDark = selectedTheme == 'dark';
  const [text, setText] = useState('');
  const onSelect = () => { };
  const postId = generatePostId(10);
  const [imageData, setImageData] = useState(null)


  function generatePostId(strLength, charSet) {
    var result = [];

    strLength = strLength || 5;
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    while (strLength--) {
      result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
    }

    return result.join('');

  }


  const onSave = async () => {

    if (imageData.length == 0) {
      alert('Please upload at least one photo');
      return;
    }
    setLoading(true);

    try {
      console.log("current user==>", auth().currentUser.uid);
      console.log("post id length==>", postId.length);
      let fullName = "";
      const subscriber = firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .onSnapshot(documentSnapshot => {
          fullName = documentSnapshot.data().fullName;
          console.log('User data: ', fullName);
        });



      const response = await storage()
        .ref(`/posts/${imageData.name}`)
        .putFile(imageData.uri)
      //      console.log("response==>",response);
      const url = await storage().ref(`posts/${imageData.name}`).getDownloadURL();

      var postData = {
        postId: postId,
        userId: auth().currentUser.uid,
        fullName: fullName,
        description: text,
        file: url,
        createdAt: new Date().getTime(),

      }
      console.log("created at: ", postData.createdAt);

      firestore()
        .collection('Posts')
        .doc(postId)
        .set(postData); // add for auto id, set for custom id


      console.log(postData);

      //    console.log("Post added with ID: ", postId);

      navigation.navigate(navigationStrings.HOME)
      setLoading(false);

    } catch (error) {
      console.log('error raised==>', error?.message);
      setLoading(false);
    }

  };

  const renderItem = (item, index) => {
    console.log("item====", item);
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onSelect(item, index)}
        style={{ marginRight: moderateScale(16) }}
      >
        <Image
          source={{ uri: imageData.uri }}
          style={styles.imgStyle}
        />

        <Pressable
          onPress={() => removeImage(0)}
          style={styles.crossStyle}
        >
          <Image
            style={{ tintColor: isDark ? colors.whiteColor : colors.blackColor }}
            source={imagePath.icCross} />
        </Pressable>

      </TouchableOpacity>
    );
  };

  const onAdd = () => {

    Alert.alert('Upload Image', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', onPress: () => { } },
    ]);
  };

  const openCamera = () => {
    try {
      const image = ImagePicker.openCamera({ mediaType: 'photo' });
      //console.log('image', image);
    } catch (error) {
      //console.log('error raised');
    }
  };

  const openGallery = async () => {
    try {

      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setImageData(response)
      console.log("response==>", response);
      console.log("imageData==>", imageData);

    } catch (error) {
      console.log('error raised');
    }


  };


  const removeImage = () => {


    // let cloneImages = [imageData]
    // console.log("cloneImages=>", cloneImages);
    // // cloneImages[0]=undefined
    // cloneImages.splice(0, 1)
    // setImageData(cloneImages)
    setImageData(null)

  }

  return (
    <WrapperContainer>
      <HeaderComp leftText='Create post' />

      <View style={styles.container}>

        <View>
          <TouchableOpacity
            onPress={onAdd}
            style={{
              ...styles.imgStyle,
              backgroundColor: colors.gray2,
              alignItems: 'center',
              justifyContent: 'center'
            }}>

            {imageData
              ? <Image style={styles.imgStyle} source={{ uri: imageData.uri }} />
              : <Image style={{ tintColor: colors.whiteColor }} source={imagePath.icAdd} />

            }

            {
              imageData
                ? <Pressable
                  onPress={removeImage}
                  style={styles.crossStyle}
                >
                  <Image
                    style={{ tintColor: isDark ? colors.whiteColor : colors.blackColor }}
                    source={imagePath.icCross} />

                </Pressable>
                : null

            }



          </TouchableOpacity>



          <MultiTextInput
            value={text}
            placeholder={strings.DESCRIPTION}
            onChangeText={(value) => setText(value)}
            multiline={true}
            inputStyle={{ marginTop: moderateScaleVertical(24) }}
          />
        </View>


        <ButtonComp
          text={strings.SAVE}
          onPress={onSave}
        />

      </View>

    </WrapperContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16),
    justifyContent: 'space-between',
  },
  imgStyle: {
    height: width / 4,
    width: width / 4,
    borderRadius: moderateScale(8),

  },
  crossStyle: {
    position: 'absolute',
    left: 80,
    top: -10,
    tintColor: colors.redColor,
  },
});

//make this component available to the app
export default AddPost;
