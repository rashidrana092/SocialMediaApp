import firestore from '@react-native-firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import FastImageComp from '../../components/FastImageComp';
import TextComp from '../../components/TextComp';
import WrapperContainer from '../../components/WrapperContainer';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../navigations/navigationStrings';
import actions from '../../redux/actions';
import colors from '../../styles/colors';
import {
  moderateScale,
  moderateScaleVertical,
} from '../../styles/responsiveSize';
import styles from './styles';

const Home = ({ navigation }) => {
  const { selectedTheme } = useSelector(state => state?.appSetting);

  const [posts, setPosts] = useState();
  const [postsWithUserData, setPostsWithUserData] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore().collection('Posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const newPostsData = [];
        snapshot.forEach(doc => {
          const post = doc.data();
          fetchUserData(post.userId)
            .then(userData => {
              newPostsData.push({ ...post, userData });
              // Update state when all user data is fetched
              if (newPostsData.length === snapshot.size) {
                setPostsWithUserData(newPostsData);
              }
            })
            .catch(error => {
              console.error("Error fetching user data:", error);
            });
        });
      });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     const postsCollection = await firestore().collection('Posts').get();
  //     const postsData = postsCollection.docs.map(doc => doc.data());

  //     // Fetch user data for each post
  //     const postsWithUserData = await Promise.all(postsData.map(async post => {
  //       const userData = await fetchUserData(post.userId);
  //       return { ...post, userData };
  //     }));

  //     setPostsWithUserData(postsWithUserData);
  //   };

  //   fetchPosts();
  // }, []);

    const fetchUserData = async (userId) => {
      const userDoc = await firestore().collection('Users').doc(userId).get();
      return userDoc.data();
    };
 
  const userPosts = async () => {


    try {

      const response = firestore()
        .collection('Posts')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot => {
          const posts = [];

          querySnapshot.forEach(documentSnapshot => {

            posts.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id
            });

          });
          //console.log("posts++", posts);
          //console.log("response+++", response);

          setPosts(posts);
        });


    } catch (error) {
      //console.log('error raised', error);
    }
  };

  const onPressHeart = async (item, index) => {
    try {
      const res = await actions.likeDislike({
        postId: item?._id,
        userId: userData?._id,
      });
      const clonerArry = [...posts];

      clonerArry[index].isLike = !item?.isLike;
      clonerArry[index].likeCount = item?.isLike
        ? clonerArry[index].likeCount + 1
        : clonerArry[index].likeCount - 1;


      setPosts(clonerArry);

    } catch (error) {
    }

  };

  const onPresPost = item => {
    navigation.navigate(navigationStrings.POST_DETAIL, { item: item });
  };


  const getUserInfo = async (id) => {
    try {

      const res = await firestore()
        .collection('Users')
        .doc(id)
        .get();

      console.log("response++", res.data());
      setPostUser(res.data());

      return res.data();
    }
    catch (error) {
      console.log("error+++", error);

    }
  }

  const renderItem = ({ item }) => {

    const date = item?.createdAt;
    console.log("item==>", item);

    console.log()
    //   const newDate = moment(date).format('dddd, MMMM DD YYYY, h:mm A');
    const newDate = moment(date).format('DD/MM/YYYY, h:mm A');
    //console.log("all data++++", item);

    return (
      <Pressable onPress={() => onPresPost(item)} style={styles.boxStyle}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

            <FastImageComp
              url={item?.userData.img}
              imageStyle={styles.profileImage}
            />            
     

            <View>
              <TextComp
                text={item?.userData?.fullName}
                style={styles.nameStyle}
                
                />
              {!!item?.user?.userId ? (
                <TextComp
                  text={"dsd"}
                  style={{
                    ...styles.bioStyle,
                    color:
                      selectedTheme == 'dark'
                        ? colors.whiteColorOpacity40
                        : colors.blackOpacity70,
                  }}
                />
              ) : null}
            </View>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={imagePath.icDots} />
          </TouchableOpacity>
        </View>
        <FastImageComp
          url={item?.file}
          imageStyle={styles.postImage}
        />            

        {!!item?.description ? (
          <TextComp text={item?.description} style={styles.descStyle} />
        ) : null}

        <TextComp
          // text={ date.toLocaleString().replace(',', '')} 
          text={newDate}
          style={{
            ...styles.descStyle,
            marginVertical: moderateScaleVertical(12),
            color:
              selectedTheme == 'dark'
                ? colors.whiteColorOpacity70
                : colors.blackOpacity70,
          }}
        />

        <View style={styles.flexHorizontal}>
          <View style={{ flexDirection: 'row' }}>
            <TextComp
              text={`Comments ${item?.commentCount || 0}`}
              style={{ ...styles.descStyle, marginRight: moderateScale(8) }}
            />

            <TextComp
              text={`Likes ${item?.likeCount || 0}`}
              style={styles.descStyle}
            />

            <TouchableOpacity onPress={() => onPressHeart(item, index)}>
              <Image
                tintColor={item?.isLike ? colors.redColor : colors.blackColor}
                source={imagePath.icHeart}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <Image source={imagePath.icShare} />
          </TouchableOpacity>
        </View>
      </Pressable>

    );
  }


  const listEmptComp = () => {
    return (
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <TextComp
          text="no data found"
          style={{
            ...styles.notDataFound,
            color:
              selectedTheme == 'dark' ? colors.whiteColor : colors.blackColor,
          }}
        />
      </View>
    );
  };

  return (
    <WrapperContainer style={styles.container}>

      <View style={{ flex: 1, padding: moderateScale(8) }}>
        <FlashList
          data={postsWithUserData}
          renderItem={renderItem}
          estimatedItemSize={200}
          ItemSeparatorComponent={() => (
            <View style={{ height: moderateScale(20) }} />
          )}
          ListEmptyComponent={listEmptComp}
          keyExtractor={(item, index) => index.toString()}
        />

      </View>

    </WrapperContainer>
  );
};

export default Home;
