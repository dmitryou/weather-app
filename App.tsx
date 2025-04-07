/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import axios from 'axios';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Button,
  TextInput,
  Image,
} from 'react-native';

import {
  Colors,
  Header,
} from 'react-native/Libraries/NewAppScreen';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


interface WeatherParams {
  location: string;
  image: string;
}


function extractWeatherData(response: any) {
  const location = response?.data?.location?.name;
  const image = response?.data?.current?.weather_icons[0];
  return { location, image };
}

function Section({ children, title }: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  const [city, setCity] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const getWeather = async () => {
    if (!city.trim()) return; // Avoid making a call if input is empty
    try {
      setIsloading(true);
      const response = await axios.get(`https://api.weatherstack.com/current`, {
        params: {
          access_key: 'd5270de54dcf234837ea0468df6af0ab',
          query: city
        }
      });
      const weatherData: WeatherParams = extractWeatherData(response);
      setData(weatherData);
      setIsloading(false);

      setError(null); // Clear any previous errors
    } catch (err) {
      setIsloading(false);
      setError('An error occurred while fetching data.');
      setData(null); // Clear any previous data
    }
  };

  const onCityChange = (text: string) => {
    setCity(text);
  }

  const safePadding = '5%';

  return (
    <View style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        style={backgroundStyle}>
        <View style={{ paddingRight: safePadding }}>
          <Header />
        </View>
        <View
          style={{
            paddingHorizontal: safePadding,
            paddingBottom: safePadding,
          }}>
          <Section title="Get weather in any city">
            Enter city name and press weather for this city.
          </Section>
        </View>
        {isLoading === true ? <View style={styles.container}>
          <Text style={styles.highlight}>{'Loading data'}</Text>
        </View> : error ? <View style={styles.container}>
          <Text style={styles.highlight}>{error}</Text>
        </View> :
          <>
            <TextInput
              style={styles.input}
              onChangeText={(e) => { onCityChange(e) }}
              value={city}
            />
            <Button
              onPress={getWeather}
              title="Get Weather"
              accessibilityLabel="Learn more about this purple button"
            />
            <View style={styles.container}>
              <Text style={styles.highlight}>{data?.location}</Text>
            </View>

            <View style={styles.container}>
              <Image
                style={styles.tinyLogo}
                source={{
                  uri: data?.image,
                }}
              />
            </View></>}
      </ScrollView >
    </View >
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
  }
});

export default App;
