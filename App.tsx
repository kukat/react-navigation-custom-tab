/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import BarcodeScanning from '@react-native-ml-kit/barcode-scanning';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {useCallback} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import {ImageLibraryOptions, launchImageLibrary} from 'react-native-image-picker';
import {MyTabBar} from './MyTabBar';

function HomeScreen({navigation}) {
  return (
    <View style={styles.view}>
      <Text>Home!</Text>
      <Button
        title="Go to Explore"
        onPress={() => {
          navigation.navigate('Popup');
        }}
      />
    </View>
  );
}
function ExploreScreen() {
  return (
    <View style={styles.view}>
      <Text>Explore!</Text>
    </View>
  );
}
function RewardsScreen() {
  return (
    <View style={styles.view}>
      <Text>Rewards!</Text>
    </View>
  );
}
function ProfileScreen() {
  return (
    <View style={styles.view}>
      <Text>Profile!</Text>
    </View>
  );
}

const DummyScreen = () => (
  <View>
    <Text>Dummy screen!</Text>
  </View>
);

const ScanScreen = () => {
  const scanImage = useCallback(async (imageUri: string) => {
    console.log(`scanning image: ${imageUri}`);
    const barcodes = await BarcodeScanning.scan(imageUri);
    barcodes?.map(barcode => {
      console.log(`barcode: ${barcode.format} value: ${barcode.value}`);
      Alert.alert('Scanner', `barcode: ${barcode.format} value: ${barcode.value}`);
    });
  }, []);

  const pickImage = useCallback(async () => {
    const imageOptions: ImageLibraryOptions = {
      mediaType: 'photo',
      selectionLimit: 1,
    };
    const result = await launchImageLibrary(imageOptions);
    const imageUri = result.assets?.[0].uri;
    console.log(`picked image: ${imageUri}`);
    imageUri && (await scanImage(imageUri));
  }, [scanImage]);

  return (
    <View style={styles.view}>
      <Text>Scan!</Text>
      <Button title="Pick photo" onPress={pickImage} />
    </View>
  );
};

const PopupScreen = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.view, {backgroundColor: 'lightblue'}]}>
      <Text>Popup!</Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator tabBar={props => <MyTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} options={{tabBarBadge: 3}} />
      <Tab.Screen name="Scan" component={DummyScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Tab" component={TabNavigator} options={{headerShown: false}} />
        <Stack.Group screenOptions={{presentation: 'modal'}}>
          <Stack.Screen name="Popup" component={PopupScreen} />
          <Stack.Screen name="Scanner" component={ScanScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#673ab7',
  },
});

export default App;
