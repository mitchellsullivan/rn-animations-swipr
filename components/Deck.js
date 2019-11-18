import React, { 
  Component, 
  useEffect, 
  useState, 
  useRef, 
} from 'react';
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

const win = Dimensions.get('window');
const SCREEN_WIDTH = win.width;
const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 150;

function usePrevious(value, initialValue) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  if (ref.current === undefined && initialValue !== undefined) {
    return initialValue;
  }
  return ref.current;
}

if (UIManager.setLayoutAnimationEnabledExperimental) { 
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const Deck = ({data, shouldAnimate, renderCard, renderNoMoreCards}) => {
  const [position] = useState(new Animated.ValueXY());
  const [index, setIndex] = useState(0);
  const [prev] = usePrevious(data, 'asdf');

  const [panResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        position.setValue({x: gesture.dx, y: gesture.dy})
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          finishSwipe('right');
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          finishSwipe('left');
        } else {
          resetPosition();
        }
      },
    })
  );

  useEffect(() => {
    if (prev.data !== data) {
      setIndex(0);
    }
    console.log(shouldAnimate);
    // if (shouldAnimate) {
    //   LayoutAnimation.configureNext({
    //     duration: 1000,
    //     update: {
    //       type: LayoutAnimation.Types.spring,
    //       springDamping: 0.1
    //     }
    //   })
    // } else {
      // LayoutAnimation.configureNext({})
    // }
  }, [data]);

  finishSwipe = (direction) => {
    const x = (direction === 'right' ? 
      SCREEN_WIDTH : -SCREEN_WIDTH) * 1.75;
    Animated.timing(position, {
      toValue: {x, y: 0},
      duration: SWIPE_OUT_DURATION,
    }).start(() => onSwipeComplete());
  }

  onSwipeComplete = (direction) => {
    const item = data[index];
    // direction === 'right' ? 
    //   onSwipeRight(item) : onSwipeLeft(item);
    LayoutAnimation.configureNext({
      duration: 1000,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.75
      }
    })
    position.setValue({x: 0, y: 0});
    // Animated.timing(position, {
    //   toValue: {x: 0, y: 0},
    //   duration: 300,
    // }).start();
    setIndex(index + 1);
  }

  resetPosition = () => {
    Animated.spring(position, {
      toValue: {x: 0, y: 0}
    }).start();
  }

  topCardStyle = () => {
    const toRotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3],
      rotate: '0deg',
      outputRange: ['-90deg', '0deg', '90deg'],
    });
    return {
      ...position.getLayout(),
      transform: [
        {rotate: toRotate}
      ],
    }
  }

  renderCards = () => {
    // No more cards
    if (index >= data.length) {
      return renderNoMoreCards();
    }
    const cards = data.map((item, i) => {
      // Don't render already swiped
      if (i < index) { return null; }
      // Render top card
      if (i === index) {
        return (
          <Animated.View 
            key={item.id}
            style={[topCardStyle(), styles.cardStyle]}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
      const messyStyle = {
        top: 10 * (i - index),
        transform: [{
          rotate: getRandomArbitrary(-1, 1) + 'deg'
        }]
      }
      return (
        <Animated.View 
          key={item.id} 
          style={[styles.cardStyle, messyStyle]}
        >
          {renderCard(item)}
        </Animated.View>
      )              
    })

    return cards.reverse();
  }

  return (
    <View>
      {renderCards()}
    </View>
  )
};

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