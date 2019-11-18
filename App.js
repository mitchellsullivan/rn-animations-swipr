import React, { 
  Component, 
  useState, 
  useEffect 
} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  StatusBar,
  Image,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import Deck from './components/Deck';
import DATA from './data';

const App = (props) => {
  const [data, setData] = useState(DATA);

  renderCard = (item) => {
    return (
      <Card key={item.id} title={item.text}>
        <Image source={{uri: item.uri}}
               resizeMode='stretch'
               style={{height: 300}}
        />
        <Text style={{marginBottom: 10}}>More, etc.</Text>
        <Button
          icon={{name: 'code', color: '#fff',}}
          backgroundColor='#03a9f4'
          title='View now!'
          titleStyle={{color: '#fff'}}
        />
      </Card>
    );
  }

  reset = () => {
    setData(DATA.map(x => x));
  }

  renderNoMoreCards = (that) => {
    return (
      <Card title="All Done!">
        <Text style={{marginBottom: 10}}>
          There's no more content here!
        </Text>
        <Button
          backgroundColor='#03a9f4'
          title='Get more!'
          onPress={() => that.reset()}
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
          renderNoMoreCards={() => renderNoMoreCards(this)} 
        />
      </SafeAreaView>
    </>
  );    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})

export default App;
