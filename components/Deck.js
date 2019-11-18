import React, { Component, useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet,
  Animated,
  Button,
  Dimensions,
  PanResponder,
  UIManager,
  LayoutAnimation,
} from 'react-native';
import { thisExpression } from '@babel/types';

const win = Dimensions.get('window');
const SCREEN_WIDTH = win.width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 150;

class Deck extends Component {
  static defaultProps = {
    onSwipeRight() {},
    onSwipeLeft() {},
  }

  constructor(props) {
    super(props);

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        this.state.position.setValue({x: gesture.dx, y: gesture.dy})
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          console.log('swipe right!')
          this.forceSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          console.log('swipe left');
          this.forceSwipe('left');
        } else {
          this.resetPosition();
        }
      },
    });
    this.state = {
      panResponder, 
      position, 
      index: 0,
    };
  }

  componentDidUpdate(prevProps) {
    console.log('******', prevProps, '\n', this.props);
    if (prevProps.data !== this.props.data) {
      console.log('resetting to 0');
      this.setState({index: 0});
    }
    if (UIManager.setLayoutAnimationEnabledExperimental) { 
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
    if (prevProps.animate && this.props.animate) {
      LayoutAnimation.configureNext({
        duration: 300,
        update: {
          type: LayoutAnimation.Types.spring,
          springDamping: 0.75
        }
      })
    } else {
      LayoutAnimation.configureNext({})
    }
  }

  forceSwipe(direction) {
    const x = (direction === 'right' ? 
      SCREEN_WIDTH : -SCREEN_WIDTH) * 1.75;
    Animated.timing(this.state.position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
    }).start(() => this.onSwipeComplete());
  }

  onSwipeComplete(direction) {
    const { onSwipeLeft, onSwipeRight, data } = this.props;
    const item = data[this.state.index];

    direction === 'right' ? 
      onSwipeRight(item) : 
      onSwipeLeft(item);

    this.state.position.setValue({x: 0, y: 0});
    // let nextX = data[this.state.index + 1]
    // console.log(nextX);
    Animated.timing(this.state.position, {
      toValue: {x: 0, y: 0},
      duration: 300,

    }).start();
    this.setState({
      index: this.state.index + 1
    });
  }

  resetPosition() {
    Animated.spring(this.state.position, {
      toValue: {x: 0, y: 0}
    }).start();
  }

  getCardStyle() {
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2, 0, SCREEN_WIDTH * 2],
      rotate: '0deg',
      outputRange: ['-90deg', '0deg', '90deg'],
    });

    return {
      ...this.state.position.getLayout(),
      transform: [{rotate}],
    }
  }

  renderCards() {
    if (this.state.index >= this.props.data.length) {
      return this.props.renderNoMoreCards();
    }
    return this.props.data.map((item, i) => {
      if (i < this.state.index) { return null; }
      if (i === this.state.index) {
        return (
          <Animated.View 
            key={item.id}
            style={[this.getCardStyle(), styles.cardStyle]}
            {...this.state.panResponder.panHandlers}
          >
            {this.props.renderCard(item)}
          </Animated.View>
        );
      }
      return (
        <Animated.View 
          key={item.id} 
          style={[styles.cardStyle, 
            // {top: 10 * (i - this.state.index)},
            {transform: [{rotate: getRandomArbitrary(-1, 1) + 'deg'}]}]}
        >
          {this.props.renderCard(item)}
        </Animated.View>
      )
    }).reverse();
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const getRandomArbitrary = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(1);
}

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const styles = StyleSheet.create({
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
  }
});

export default Deck;