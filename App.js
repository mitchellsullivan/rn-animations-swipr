import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Image,
  View,
  // Button,
  Dimensions,
  ImageBackground,
  Animated
} from 'react-native';
import {Button, Card} from 'react-native-elements';
import Deck from './components/Deck';
import DATA from './data';

const win = Dimensions.get('window');
const SCREEN_WIDTH = win.width;
const SCREEN_HEIGHT = win.height * 0.9;

const App = (props) => {
  const [data, setData] = React.useState(DATA);

  renderCard = (item) => {
    return (
      <View>
        <ImageBackground
          source={{uri: item.uri}}
          style={styles.bigImage}/>
        {/* <View style={styles.nameTextView}>
          <Text style={styles.nameText}>{item.text}</Text>
        </View> */}
      </View>
    );
  }

  renderLast = () => {
    return (
      <Card 
        title="All Done!"
        height={200}
        top={300}>
        <Text style={{margin: 20}}>
          There's no more content here!
        </Text>
        <Button
          backgroundColor='#03a9f4'
          title='Get more!'
          onPress={() => setData(DATA.map(x => x))}
        />
      </Card>
    )
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <Deck 
          data={data}
          renderCard={renderCard}
          renderNoMoreCards={renderLast} 
        />
      </SafeAreaView>
    </>
  );    
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    // flex: 0.5,
    backgroundColor: '#fff',
    display: 'flex',
    justifyContent: 'center',
  },
  nameText: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 36,
    textShadowOffset: {
      width: 0, 
      height: 1,
    },
    textShadowColor: '#000',
    textShadowRadius: 2,
  },
  nameTextView: {
    position: 'absolute', 
    top: 0, 
    left: 10, 
    right: 0, 
    bottom: 10, 
    flexDirection: 'row',
    justifyContent: 'flex-start', 
    alignItems: 'flex-end',
  },
  bigImage: {
    resizeMode: 'cover',
    overflow: 'hidden',
    borderRadius: 15,
    height: SCREEN_HEIGHT,
    backgroundColor: 'grey'
  }
})

export default App;
