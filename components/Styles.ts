import {StyleSheet} from "react-native";
import {SCREEN_HEIGHT, SCREEN_WIDTH} from "../not-components/constants";

export const Styles = StyleSheet.create({
  getMoreButtonStyle: {
    backgroundColor: '#03a9f4',
    marginTop: SCREEN_HEIGHT - 300
  },
  cardsContainerStyle: {
    height: SCREEN_HEIGHT,
    width: SCREEN_WIDTH - 30
  },
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
    // borderWidth: 3,
    // borderColor: 'transparent',
  },
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
});
