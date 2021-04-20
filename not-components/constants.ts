import {Dimensions} from "react-native";

export const WIN_DIM = Dimensions.get('window');
export const SCREEN_WIDTH = WIN_DIM.width;
export const SCREEN_HEIGHT = WIN_DIM.height * 0.9;
export const ROTATE_SWITCH_HEIGHT = SCREEN_HEIGHT / 1.8;
export const SWIPE_THRESHOLD = 0.35 * SCREEN_WIDTH;
export const SWIPE_OUT_DURATION = 150;
export const POINT_ORIGIN = Object.freeze({x: 0, y: 0});
