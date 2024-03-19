//import liraries
import React, {Component, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import WrapperContainer from '../../components/WrapperContainer';
import {
  height,
  moderateScale,
  moderateScaleVertical,
  width,
} from '../../styles/responsiveSize';
import {FlashList} from '@shopify/flash-list';
import FastImageComp from '../../components/FastImageComp';
import colors from '../../styles/colors';
import SerachBar from '../../components/SerachBar';
import { firebase } from '@react-native-firebase/auth';

// create a component
const Search = () => {

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch all posts from the 'Posts' collection
    const postsRef = firebase.firestore().collection('Posts');
    const unsubscribe = postsRef.onSnapshot((snapshot) => {
      const fetchedPosts = [];
      snapshot.forEach((doc) => {
        fetchedPosts.push({ id: doc.id, ...doc.data() });
      });
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, []);

  const renderItem = (item,index) => {
    console.log('item+++',item);
    return (
      <TouchableOpacity
        style={{
          marginTop: index % 2 == 0 ? moderateScaleVertical(16) : 0,
        }}>
        <FastImageComp
          url={ item?.item?.file
          }
          imageStyle={{
            ...styles.imageStyle,
            borderColor: colors.whiteColor,
          }}
        />
      </TouchableOpacity>
    );
  };
  return (
    <WrapperContainer>
      <View style={{flex: 1}}>
        <SerachBar
          placeholder="Searach..."
          inputStyle={{marginHorizontal: moderateScale(8)}}
          // isSearch
        />
        <FlashList
          data={posts}
          numColumns={2}
          renderItem={renderItem}
          estimatedItemSize={width / 2}
          ItemSeparatorComponent={() => (
            <View style={{height: moderateScale(20)}} />
          )}
        />
      </View>
    </WrapperContainer>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50',
  },
  imageStyle: {
    width: width / 2.2,
    height: height / 3,
    borderWidth: 1,
    borderRadius: moderateScale(10),
  },
});

//make this component available to the app
export default Search;

