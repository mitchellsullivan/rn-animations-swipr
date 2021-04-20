import React from 'react';
import { Provider} from "react-redux";
import { store } from "../not-components/store";
import Main from "./Main";
import {SafeAreaView, StatusBar} from "react-native";
import {Styles} from "./Styles";

const App = () => {
  return (
    <Provider store={store}>
      <StatusBar barStyle="dark-content"/>
      <SafeAreaView style={Styles.container}>
      <Main/>
      </SafeAreaView>
    </Provider>
  )
}

export default App;
