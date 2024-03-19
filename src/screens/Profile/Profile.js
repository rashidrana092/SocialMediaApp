//import liraries
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import FastImageComp from '../../components/FastImageComp';
import { moderateScale, moderateScaleVertical, textScale, width } from '../../styles/responsiveSize';
import TextComp from '../../components/TextComp';
import { useSelector } from 'react-redux';
import colors from '../../styles/colors';
import { FlashList } from '@shopify/flash-list';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigations/navigationStrings';
import FastImage from 'react-native-fast-image';
import auth from '@react-native-firebase/auth';
import firestore, { firebase } from '@react-native-firebase/firestore';

// create a component
const Profile = ({ navigation }) => {

  const { selectedTheme } = useSelector(state => state?.appSetting)
  const { userData } = useSelector(state => state?.auth)
  const [currentUserData, setCurrentUserData] = useState(null);
  console.log("usesdata==>", userData)
  const isDark = selectedTheme == 'dark'
  const defaultProfileImage = require('../../assets/images/profile.png');

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const userDoc = await firestore().collection('Users').doc(auth().currentUser.uid).get();
  //       if (userDoc.exists) {
  //         const userData = userDoc.data();
  //         setCurrentUserData(userData);
  //         console.log("userdat+++", currentUserData.img);
  //       } else {
  //         console.log("User document not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);


  // const [posts, setPosts] = useState([]);
  // useEffect(() => {
  //   const unsubscribe = firestore().collection('Posts')
  //     .orderBy('createdAt', 'desc')
  //     .onSnapshot(snapshot => {
  //       const newPostsData = [];
  //       snapshot.forEach(doc => {
  //         const post = doc.data();
  //         fetchUserData(post.userId)
  //           .then(userData => {
  //             newPostsData.push({ ...post, userData });
  //             if (newPostsData.length === snapshot.size) {
  //               setPosts(newPostsData);
  //               console.log("newpostdata+++", newPostsData);
  //               setCurrentUserData(userData)
  //               console.log("userdta+++", userData);

  //             }
  //           })
  //           .catch(error => {
  //             console.error("Error fetching user data:", error);
  //           });
  //       });
  //     });

  //   return () => unsubscribe();
  // }, []);

  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [getUserData,setUserData]=useState([]);

  useEffect(() => {
    // Check if user is logged in
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);

        // Fetch posts for the current user
        const userId = authUser.uid;
        const postsRef = firebase.firestore().collection('Posts').where('userId', '==', userId);
        const unsubscribePosts = postsRef.onSnapshot((snapshot) => {
          const fetchedPosts = [];
          snapshot.forEach((doc) => {
            fetchedPosts.push({ id: doc.id, ...doc.data() });
          });
          fetchUserData(userId)
            .then(userData => {
              console.log('userdata+++',userData);
             setUserData(userData)
            })
            .catch(error => {
              console.error("Error fetching user data:", error);
            });     
          setPosts(fetchedPosts);
       // console.log("posts++",posts);
        });

        return () => unsubscribePosts();
      } else {
        setUser(null);
        setPosts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (userId) => {
    const userDoc = await firestore().collection('Users').doc(userId).get();
//    console.log('fetchuserdata+++',userDoc.data());
setUserData(userDoc.data())
    return userDoc.data();
  };


  const listHeader = () => {
    return (
      // empty tag virtual dom mien new node create ni krta.
      <View style={{ marginBottom: moderateScaleVertical(16) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {console.log("getuserdata",getUserData.email)}

            <FastImage
              source={!!getUserData?.img ? { uri: getUserData?.img } : defaultProfileImage}
              style={{ height: 100, width: 100, borderRadius: moderateScale(50) }}
              resizeMode={FastImage.resizeMode.cover}
            />

            {console.log("current user data +++", user)}
            <View style={{ marginLeft: moderateScale(16) }}>
              <TextComp
                text={user?.displayName}
                style={{ fontSize: textScale(20) }} />

              <TextComp
                text={user?.email}
                style={{
                  fontSize: textScale(14),

                  color: isDark
                    ? colors.whiteColorOpacity70
                    : colors.blackOpacity70,
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate(navigationStrings.PORFILE_EDIT)}>
            <Image source={imagePath.icEdit} />
          </TouchableOpacity>
        </View>
        <View style={{ marginVertical: moderateScaleVertical(16) }}>
          <TextComp
            text="I am a Software Developer and my latest passion is Mobile App development.I am using React Native to make wonderful mobile apps."
            style={{ fontSize: textScale(16) }}
          />
        </View>

        <View
          style={{
            ...styles.boxView,
            backgroundColor: isDark
              ? colors.whiteColorOpacity20
              : colors.blackOpacity40,
          }}>
          <TextComp
            text="Dashboard"
            style={{
              fontSize: textScale(16),
            }}
          />

          <TextComp
            text="1k account reached in last 30 days"
            style={{
              fontSize: textScale(16),
              color: isDark
                ? colors.whiteColorOpacity70
                : colors.blackOpacity70,
            }}
          />
        </View>
      </View>
    );
  }

  const renderItem = ({ item }) => {

    { console.log("item+++", item)}// ;setUserData(item?.userData)}
    return (
      <TouchableOpacity >
        <FastImageComp
          url={item.file}

          imageStyle={{
            ...styles.imgStyle,
            borderColor: isDark ? colors.whiteColor : colors.blackColor,
          }}
        />
      </TouchableOpacity>
    );
  }
  return (
    <WrapperContainer>
      <View style={{ flex: 1, padding: moderateScale(16) }}>
        <FlashList
          showsVerticalScrollIndicator={false}
          numColumns={3}
          data={posts}
          renderItem={renderItem}
          ListHeaderComponent={listHeader}
          ListEmptyComponent={() => <Text>no posts found</Text>}
          keyExtractor={(item, index) => item?._id || String(index)}
        //estimatedItemSize={width / 2}
        />
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
});

//make this component available to the app
export default Profile;
