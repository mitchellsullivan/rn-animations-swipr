import React, { Component, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet,
  Animated,
  Button,
  Dimensions,
} from 'react-native';

const win = Dimensions.get('window');

const randomIntFromInterval = (min, max) => { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const Ball = () => {
  const position = new Animated.ValueXY(0, 0);

  useEffect(() => {
    // moveIt();
  }, [moveIt]);

  const moveIt = () => {
    Animated.spring(position, {
      duration: 300,
      toValue: {
        x: randomIntFromInterval(0, win.width - 60), 
        y: randomIntFromInterval(0, win.height - 60)
      }
    }).start();
  }

  return (
    <>
      <Animated.View style={position.getLayout()}>
        <View style={styles.ball}></View>
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