import { StyleSheet } from "react-native";
import colors from "../../styles/colors";
import { moderateScale, moderateScaleVertical, textScale,height,width } from "../../styles/responsiveSize";
import fontFamily from "../../styles/fontFamily";

const styles = StyleSheet.create({
  boxStyle: {
    backgroundColor: colors.gray2,
    borderRadius: moderateScale(8),
    padding: moderateScale(12),

  },
  profileImage: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    marginRight: moderateScale(16),
  },
  nameStyle: {
    fontSize: textScale(16),
    fontFamily: fontFamily.medium,
    color: colors.whiteColor,
  },
  bioStyle: {
    fontSize: textScale(12),
    fontFamily: fontFamily.medium,
    color: colors.whiteColorOpacity50,
    marginTop: moderateScaleVertical(4),
  },

  postImage: {
    width: '100%',
    height: height / 2.8,
    borderRadius: moderateScale(8),
    marginVertical: moderateScaleVertical(16),
    
  },

  descStyle: {
    fontSize: textScale(14),
    fontFamily: fontFamily.regular,
  },

  flexHorizontal:{
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
 
  }
});

export default styles;