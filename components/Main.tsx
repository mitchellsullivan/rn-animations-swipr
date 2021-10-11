import React from "react";
import {
  changeRotateEnd,
  ICardData,
  incIndex,
  MainState,
  refreshData,
  SwipeDirection,
  TouchedCardEnd
} from "../not-components/reducer";
import {Animated, ImageBackground, PanResponder, PanResponderGestureState, Text, UIManager, View} from "react-native";
import {
  POINT_ORIGIN,
  ROTATE_SWITCH_HEIGHT,
  SWIPE_FINISH_WIDTH,
  SWIPE_INPUT_MAX_ABS,
  SWIPE_OUT_DURATION,
  SWIPE_OUTPUT_MAX_ABS,
  SWIPE_THRESHOLD
} from "../not-components/constants";
import {Button, Card} from "react-native-elements";
import {Styles} from "./Styles";
import {connect} from "react-redux";
import {RootState} from "../not-components/store";

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

class Main extends React.Component<IMainProps, MainState> {
  position = new Animated.ValueXY();

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: this.onMove.bind(this),
    onPanResponderRelease: this.onRelease.bind(this),
  });

  onRelease(_: any, gesture: PanResponderGestureState) {
    let dir = SwipeDirection.NONE;

    if (gesture.dx > SWIPE_THRESHOLD) {
      dir = SwipeDirection.RIGHT;
    }

    if (gesture.dx < -SWIPE_THRESHOLD) {
      dir = SwipeDirection.LEFT;
    }

    if (dir === SwipeDirection.NONE) {
      Animated.spring(this.position, {
        useNativeDriver: false,
        toValue: POINT_ORIGIN,
      }).start();
      return;
    }

    Animated.timing(this.position, {
      useNativeDriver: false,
      toValue: {
        x: SWIPE_FINISH_WIDTH * dir,
        y: 0
      },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.position.setValue(POINT_ORIGIN);
      this.props.incIndex();
    });
  }

  onMove(_: any, gesture: PanResponderGestureState) {
    const end = gesture.y0 <= ROTATE_SWITCH_HEIGHT ?
        TouchedCardEnd.TOP :
        TouchedCardEnd.BOTTOM;
      if (this.props.rotationDir != end) {
      this.props.changeRotateEnd(end);
    }
    this.position.setValue({x: gesture.dx, y: gesture.dy})
  }

  topCardStyle = () => {
    const inputRange = [-1, 0, 1]
      .map(n => n * SWIPE_INPUT_MAX_ABS);
    const outputRange = [-1, 0, 1]
      .map(n => `${n * this.props.rotationDir * SWIPE_OUTPUT_MAX_ABS}deg`);
    return {
      ...this.position.getLayout(),
      transform: [{
        rotate: this.position.x.interpolate({
          inputRange,
          outputRange,
        })
      }],
    }
  }

  renderCards = () => {
    const {index, data} = this.props;
    // No more cards
    if (index >= data?.length || 0) {
      return (
        <Card containerStyle={Styles.cardsContainerStyle}>
          <Card.Title>That's all!</Card.Title>
          <Card.Divider/>
          <View style={{ alignItems: 'center'}}>
            <Text>There are no more chicks in your area.</Text>
          </View>
          <Button
            style={Styles.getMoreButtonStyle}
            title='Start Over!'
            onPress={() => this.props.refreshData()}
          />
        </Card>
      )
    }

    const cards = data?.map((item: ICardData, i: number) => {
      if (i < index) {
        return null;
      }

      // Render top card
      let cs;
      let ph = {};

      if (i === index) {
        ph = {...this.panResponder.panHandlers};
        cs = [Styles.cardStyle, this.topCardStyle()];
      } else {
        cs = [Styles.cardStyle, {top: 0}]
      }

      return (
        <Animated.View key={item.id} style={cs} {...ph}>
          <ImageBackground source={{uri: item.uri}} style={Styles.bigImage}>
            <View style={Styles.nameTextView}>
              <Text style={Styles.nameText}>{item.text}</Text>
            </View>
          </ImageBackground>
        </Animated.View>
      )
    })

    return cards?.reverse() || [];
  }

  render() {
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const mapStateToProps = ({main: {data, index, rotationDir}}: RootState) => ({
  data,
  index,
  rotationDir,
});

const mapDispatchToProps = {
  incIndex,
  refreshData,
  changeRotateEnd
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export interface IMainProps extends StateProps, DispatchProps {}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
