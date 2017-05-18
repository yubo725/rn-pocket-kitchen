import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  StatusBar,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  PixelRatio
} from 'react-native';

import { StackNavigator } from 'react-navigation';

var { global } = require('./global.js');

export default class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadingState: global.statePreload,
      params: this.props.navigation.state.params,
      data: {}
    };
  }
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.name}`,
  });
  renderLoadingView() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 15, fontSize: 16}}>正在加载菜谱详情</Text>
      </View>
    );
  }
  renderErrorView() {
    return (
      <TouchableOpacity activeOpacity={0.5} onPress={()=>{}} style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontSize: 16, color: '#FF0000'}}>加载失败，点击屏幕重新加载</Text>
      </TouchableOpacity>
    );
  }
  renderSuccessView() {
    var methodStr = this.state.data.recipe.method;
    var methodObj = JSON.parse(methodStr);
    var steps = [];
    for (var i = 0; i < methodObj.length; i++) {
      steps.push(
        <Text style={styles.text}>{methodObj[i].step}</Text>
      );
    }
    return (
      <ScrollView>
        <View style={styles.container}>
          <Image source={{uri: this.state.data.recipe.img}} style={styles.image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{this.state.data.recipe.sumary}</Text>
          </View>
          <View style={styles.textContainer}>
            {steps}
          </View>
        </View>
      </ScrollView>
    );
  }
  getDetail() {
    const URL = "https://apicloud.mob.com/v1/cook/menu/query?key=" + global.key + "&id=" + this.state.params.menuId;
    fetch(URL).then((res)=>res.json())
              .then((json)=>{
                this.setState({data: json.result}, ()=>{
                  this.setState({loadingState: global.stateLoadSuccess})
                })
              });
  }
  render() {
    switch (this.state.loadingState) {
      case global.statePreload:
        this.getDetail();
        return this.renderLoadingView();
        break;
      case global.stateLoadError:
        return this.renderErrorView();
        break;
      case global.stateLoadSuccess:
        return this.renderSuccessView();
        break;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: global.screenWidth,
    height: 200,
  },
  textContainer: {
    marginLeft: 5,
    marginTop: 5,
    marginRight: 5,
    marginBottom: 5,
    borderColor: '#D3D3D3',
    borderRadius: 5,
    backgroundColor: '#DCDCDC'
  },
  text: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
  }
});
