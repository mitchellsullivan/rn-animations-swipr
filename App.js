import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import {Card, Button} from 'react-native-elements';
import Ball from './components/Ball';
import Deck from './components/Deck';

const DATA = [
  { id: 1, text: 'Card #1', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 2, text: 'Card #2', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 3, text: 'Card #3', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 4, text: 'Card #4', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
  { id: 5, text: 'Card #5', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-04.jpg' },
  { id: 6, text: 'Card #6', uri: 'http://www.fluxdigital.co/wp-content/uploads/2015/04/Unsplash.jpg' },
  { id: 7, text: 'Card #7', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-09.jpg' },
  { id: 8, text: 'Card #8', uri: 'http://imgs.abduzeedo.com/files/paul0v2/unsplash/unsplash-01.jpg' },
];

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: DATA,
      shouldAnimate: true,
    }
  }

  renderCard(item) {
    return (
      <Card
        key={item.id}
        title={item.text}
      >

        <Image source={{uri: item.uri}}
               resizeMode='stretch'
               style={{height: 300}}/>
        <Text style={{marginBottom: 10}}>
          I can put more stuff here.
        </Text>
        <Button
          icon={{name: 'code', color: '#fff',}}
          backgroundColor='#03a9f4'
          title='View now!'
          titleStyle={{color: '#fff'}}
        />
      </Card>
    );
  }

  reset() {
    this.setState({
      shouldAnimate: false,
    }, () => this.setState({
      data: DATA.map(x => x),
    }, () => this.setState({
      shouldAnimate: true,
    })))
  }

  renderNoMoreCards(that) {
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

  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView style={styles.container}>
          <Deck 
            data={this.state.data}
            renderCard={this.renderCard}
            shouldAnimate={this.state.shouldAnimate}
            renderNoMoreCards={() => this.renderNoMoreCards(this)} 
          />
        </SafeAreaView>
      </>
    );    
  }

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
})

export default App;
