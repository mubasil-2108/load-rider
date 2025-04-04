import { Dimensions, Platform, StatusBar } from 'react-native'
import { totalSize } from 'react-native-dimension'
import * as Device from 'expo-device';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from '../responsive';

const { width, height } = Dimensions.get('window')

const hasNotch = () => {
    const notchDevices = ['iPhone X', 'iPhone XR', 'iPhone XS', 'iPhone 11', 'iPhone 12', 'iPhone 13', 'iPhone 14', 'iPhone 15'];
    return Device.brand === 'Apple' && notchDevices.includes(Device.modelName);
  };

const statusBarHeight = Platform.select({
  ios: hasNotch()?40:23,
  android: StatusBar.currentHeight
})
const headerHeight = Platform.select({
  ios: height * 0.07,
  android: height * 0.08
})
const tabBarHeight = Platform.select({
  ios: hasNotch()? height * 0.1:height * 0.09,
  android: height * 0.09
})

// Used via Metrics.baseMargin
export const sizes = {
  marginBottom : height*0.025,
  marginTop : height*0.025,
  marginHorizontal: width*0.05,
  marginHorizontal2: width*0.03,
  marginVertical: height*0.025,
  section: 25,
  TinyMargin: responsiveFontSize(4),
  smallMargin: responsiveFontSize(8),
  baseMargin: responsiveFontSize(18),
  mediumMargin: responsiveFontSize(26),
  doubleBaseMargin: responsiveFontSize(55),
  doubleBaseMargin1: responsiveFontSize(54),
  doubleSection: 50,
  horizontalLineHeight: 1,
  searchBarHeight: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 64 : 54,
  buttonRadius: (Platform.OS === 'ios') ? 100 : 100,
  inputHeight: (Platform.OS === 'ios') ? height*0.07 : height*0.07,
  buttonHeight: (Platform.OS === 'ios') ? height*0.06 : height*0.06,
  modalRadius: 15,
  cardRadius: (Platform.OS === 'ios') ? 15 : 15,
  ModalRadius: (Platform.OS === 'ios') ? 25 : 35,
  inputRadius:(Platform.OS === 'ios') ? 15 : 20,
  statusBarHeight:statusBarHeight,
  headerHeight:headerHeight+statusBarHeight,
  tabBarHeight:tabBarHeight,
  icons: {
    xTiny: responsiveFontSize(11),
    tiny: responsiveFontSize(14),
    xSmall:responsiveFontSize(16),
    small: responsiveFontSize(18),
    mediumSmall: responsiveFontSize(20),
    medium: responsiveFontSize(24),
    mediumLarge: responsiveFontSize(25),
    largeTiny: responsiveFontSize(30),
    large:responsiveFontSize(34),
    largeXLarge: responsiveFontSize(32),
    large1:responsiveFontSize(45),
    xl: responsiveFontSize(55),
    xl1: responsiveFontSize(58.9),
    xxl: responsiveFontSize(95),
    xxl1: responsiveFontSize(95.7),
  },
  images: {
    small: 20,
    smallLarge: 20,
    mediumXSmall: 30,
    mediumSmall: 37,
    medium: 40,
    mediumLarge: 45,
    mediumXLarge: 48,
    large: 60,
    large1: 55,
    largeXSmall: 35,
    largeXLarge: 88,
    xLSmall: 100,
    xL2:140,
    xL: 170,
    logo: 80,
    logoHeight: responsiveHeight(15),
    placeHeight: responsiveHeight(17),
    logoHeightLarge: responsiveWidth(50),
    logoButtonHeight: responsiveHeight(4),
    logoWidth: responsiveWidth(35),
    logoWidth2: responsiveWidth(33),
    placeWidth: responsiveWidth(40),
    logoWidthLarge: responsiveWidth(50),
    logoButtonWidth: responsiveWidth(25),
  
    productHeight: responsiveHeight(13),
    productWidth: responsiveWidth(40),
    profilePic: responsiveWidth(30)
  }
}


export const fontSizes = {
  xL:responsiveFontSize(50),
  h1: responsiveFontSize(42),
  h2: responsiveFontSize(38),
  h2_small: responsiveFontSize(36),
  h3: responsiveFontSize(32),
  h3_small: responsiveFontSize(30),
  h4: responsiveFontSize(28),
  h4_small: responsiveFontSize(25),
  h5: responsiveFontSize(24),
  h5_small: responsiveFontSize(22),
  h6: responsiveFontSize(20),
  input: responsiveFontSize(1.6),
  large1: responsiveFontSize(18.96),
  large: responsiveFontSize(18),
  mediumSmall2: responsiveFontSize(15.51),
  mediumSmall: responsiveFontSize(15),
  medium: responsiveFontSize(16),
  regularLarge: responsiveFontSize(17),
  regular: responsiveFontSize(14),
  regularSmall: responsiveFontSize(13),
  small: responsiveFontSize(12),
  tiny: responsiveFontSize(10),
  xTiny: responsiveFontSize(9),
  xTiny1: responsiveFontSize(7.75),
  xxTiny: responsiveFontSize(4)
}
