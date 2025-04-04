module.exports = {
    dependencies: {
      // Exclude one of the vector icons packages
      '@react-native-vector-icons/common': {
        platforms: {
          android: null, // disable Android platform, other platforms will still autolink
        },
      },
      // OR
      'react-native-vector-icons': {
        platforms: {
          android: null,
        },
      }
    }
  };