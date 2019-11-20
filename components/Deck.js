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
const SCREEN_HEIGHT = win.height;
const ROTATE_SWITCH_HEIGHT = SCREEN_HEIGHT / 1.8;
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

const Deck = ({data, renderCard, renderNoMoreCards}) => {
  const START = {x: 0, y: 0}
  const [position] = useState(new Animated.ValueXY());
  const [index, setIndex] = useState(0);
  const [prev] = usePrevious(data, 'asdf');
  const [rotateDir, setRotateDir] = useState(1);
  const [panResponder] = useState(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        if (gesture.y0 > ROTATE_SWITCH_HEIGHT) {
          setRotateDir(-1);
        } else {
          setRotateDir(1);
        }
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
      duration: 300,
      update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.75
      }
    })
    position.setValue(START);
    setIndex(index + 1);
  }

  resetPosition = () => {
    Animated.spring(position, {
      toValue: START,
    }).start();
  }

  topCardStyle = () => {
    const toRotate = position.x.interpolate({
      inputRange: [
        -SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3
      ],
      outputRange: [
        -rotateDir * 45 + 'deg', 
        '0deg', 
        rotateDir * 45 + 'deg'
      ],
    });
    return {
      ...position.getLayout(),
      transform: [{rotate: toRotate}],
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
      let cs = []
      let ph = {};
      if (i === index) {
        ph = {...panResponder.panHandlers};
        cs = [styles.cardStyle, topCardStyle()]
      } else if (i === index + 1) {
        cs = [
          styles.cardStyle, {
            rotate: '0deg', 
            top: 0 * (i - index)
          }
        ]
      } else {
        cs = [
          styles.cardStyle, {
            top: 0 * (i - index),
            // transform: [{
              // rotate: getRandomArbitrary(-2, 2) + 'deg'
            // }]
          }
        ]
      }

      return (
        <Animated.View key={item.id} style={cs} {...ph}>
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
    width: SCREEN_WIDTH - 20,
    alignSelf: 'center',
    marginTop: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 10,
  }
});

export default Deck;