import React from "react";
import {refreshData, ICardData, incIndex, MainState, RotateEnd, changeRotateEnd} from "../not-components/reducer";
import {
  Animated,
  ImageBackground,
  PanResponder,
  PanResponderGestureState,
  SafeAreaView,
  StatusBar,
  Text,
  UIManager,
  View
} from "react-native";
import {
  POINT_ORIGIN,
  ROTATE_SWITCH_HEIGHT,
  SCREEN_WIDTH,
  SWIPE_OUT_DURATION,
  SWIPE_THRESHOLD
} from "../not-components/constants";
import {Button, Card} from "react-native-elements";
import {Styles} from "./Styles";
import {connect} from "react-redux";
import {RootState} from "../not-components/store";

if (UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const SWIPE_INPUT_MAX = SCREEN_WIDTH * 3;
const SWIPE_OUTPUT_MAX = 45;


class Main extends React.Component<IMainProps, MainState> {
  position = new Animated.ValueXY();

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_: any, gesture: PanResponderGestureState) => {
      console.log("move");
      const end = gesture.y0 > ROTATE_SWITCH_HEIGHT ?
        RotateEnd.TOP :
        RotateEnd.BOTTOM;
      changeRotateEnd(end);
      this.position.setValue({x: gesture.dx, y: gesture.dy})
    },
    onPanResponderRelease: (_: any, gesture: PanResponderGestureState) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        this.finishSwipe(1);
        return;
      }
      if (gesture.dx < -SWIPE_THRESHOLD) {
        this.finishSwipe(-1);
        return;
      }
      Animated.spring(this.position, {
        useNativeDriver: false,
        toValue: POINT_ORIGIN,
      }).start();
    }
  });

  finishSwipe = (direction: number) => {
    const absX = SCREEN_WIDTH * 1.75;
    const x = absX * direction;
    Animated.timing(this.position, {
      useNativeDriver: false,
      toValue: {
        x,
        y: 0
      },
      duration: SWIPE_OUT_DURATION
    }).start(() => {
      this.position.setValue(POINT_ORIGIN);
      this.props.indexChange();
    });
  }

  topCardStyle = () => {
    const rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 3, 0, SCREEN_WIDTH * 3],
      outputRange: [`${this.props.rotationDir * -45}deg`, '0deg', `${this.props.rotationDir * 45}deg`],
    });
    return {
      ...this.position.getLayout(),
      transform: [
        {
          rotate
        }
      ],
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
            title='Get more!'
            onPress={this.props.dataRefresh}
          />
        </Card>
      )
    }

    const cards = data?.map((item: ICardData, i: number) => {
      if (i < index) {
        return null;
      }

      // Render top card
      let cs = [];
      let ph = {};

      if (i === index) {
        ph = {...this.panResponder.panHandlers};
        cs = [Styles.cardStyle, this.topCardStyle()];
      } else {
        cs = [Styles.cardStyle, {top: 0}]
      }

      console.log("const cards");
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
    console.log("rendering");
    return (
      <>
        <StatusBar barStyle="dark-content"/>
        <SafeAreaView style={Styles.container}>
          <View>
            {this.renderCards()}
          </View>
        </SafeAreaView>
      </>
    )
  }
}

const mapStateToProps = ({main: {data, index, rotationDir}}: RootState) => ({
  data,
  index,
  rotationDir,
});

const mapDispatchToProps = {
  indexChange: incIndex,
  dataRefresh: refreshData,
  changeRotateEnd
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export interface IMainProps extends StateProps, DispatchProps {}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
