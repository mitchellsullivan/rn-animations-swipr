import React, { useEffect } from 'react';
import {
  View,
  Animated,
  Button,
  Dimensions,
} from 'react-native';

const win = Dimensions.get('window');

const randInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Ball = () => {
  const position = new Animated.ValueXY({x: 0, y: 0});

  const moveIt = () => {
    Animated.timing(position, {
      useNativeDriver: false,
      duration: 300,
      toValue: {
        x: randInt(0, win.width - 60),
        y: randInt(0, win.height - 60)
      }
    }).start();
  }

  useEffect(() => {
    // moveIt();
  }, [moveIt]);

  return (
    <>
      <Animated.View style={position.getLayout()}>
        <View style={styles.ball}/>
      </Animated.View>
      <Button onPress={moveIt} title={'blah'}/>
    </>
  )
}

const styles = {
  ball: {
    height: 60,
    width: 60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black',
  }
}

export default Ball;
