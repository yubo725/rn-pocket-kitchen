/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
import CategoryListItem from './CategoryListItem.js';
import DetailScreen from './detail.js';

var { global } = require('./global.js');
var cardColors = ['#FC5163', '#3C98FD', '#FB971F', '#4EC72E'];

export default class TestNavigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categoryLoaded: global.statePreload,
      data: {}
    };
  }

  static navigationOptions = {
    title: '掌中菜谱',
  };

  renderLoadingView() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 15, fontSize: 16}}>正在加载菜谱分类信息</Text>
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
    var data = this.state.data;
    var items = [];
    var categorys = data.result.childs;
    for (var i = 0; i < categorys.length; i++) {
      var category = categorys[i];
      items.push(
        <Text style={{fontSize: 18}}>{category.categoryInfo.name}</Text>
      );
      var subItems = '';
      var categoryChild = category.childs;
      for (var j = 0; j < categoryChild.length; j++) {
        var childCategory = categoryChild[j];
        subItems += childCategory.categoryInfo.name;
      }
      items.push(
        <Text style={{fontSize: 15}}>{subItems}</Text>
      );
      items.push(<View style={{height: 15, width: global.screenWidth, backgroundColor: '#888888'}} />);
    }
    var list = [];
    var childs = data.result.childs;
    for (var i = 0; i < childs.length; i++) {
      list.push(<CategoryListItem data={data.result.childs[i]} nav={this.nav} cardColor={cardColors[i % 4]} />);
    }
    return (
      <ScrollView>
        <View style={[styles.container, {marginBottom: 5}]}>
          <StatusBar
             backgroundColor="white"
             barStyle="light-content"
           />
          {list}
        </View>
      </ScrollView>
    );
  }

  nav = (data) => {
    if (!global.isEmpty(data.name)) {
      const { navigate } = this.props.navigation;
      navigate('Chat', data);
    }
  }

  render() {
    switch (this.state.categoryLoaded) {
      case global.statePreload:
        this.getCategory();
        return this.renderLoadingView();
        break;
      case global.stateLoadError:
        return this.renderErrorView();
        break;
      case global.stateLoadSuccess:
        return this.renderSuccessView();
        break;
      default:
    }
  }

  // 获取菜谱分类
  getCategory = () => {
    const URL = "https://apicloud.mob.com/v1/cook/category/query?key=" + global.key;
    fetch(URL).then((res)=>res.json())
      .then((json)=>{
        this.setState({data: json}, ()=>{
          this.setState({categoryLoaded: global.stateLoadSuccess});
        });
      })
  }

  showToast(msg) {
    ToastAndroid.show(msg, ToastAndroid.SHORT);
  }

}

class ChatScreen extends React.Component {
  static navigationOptions = ({navigation}) => ({
    title: `${navigation.state.params.name}`,
  })
  constructor(props) {
    super(props);
    const { navigate } = this.props.navigation;
    this.state = {
      loadingState: global.statePreload,
      params: this.props.navigation.state.params,
      data: {},
      flatListLoadingNextPageState: global.statePreload,
      flatListNextPageData: {},
      navigation: navigate
    }
  }
  renderLoadingView() {
    return (
      <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" />
        <Text style={{marginTop: 15, fontSize: 16}}>正在加载列表信息</Text>
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
  renderFlatListFooter = ()=>{
    switch (this.state.flatListLoadingNextPageState) {
      case global.statePreload:
        setTimeout(()=>{
          this.setState({flatListLoadingNextPageState: global.stateLoadSuccess});
        }, 5000);
        return (
          <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="small" />
            <Text>正在加载下一页数据</Text>
          </View>
        );
        break;
      case global.stateLoadSuccess:
        ToastAndroid.show('没有更多数据了', ToastAndroid.SHORT);
        return (
          <View style={{paddingTop: 10, paddingBottom: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{width: 100, height: 1 / PixelRatio.get(), backgroundColor: '#D3D3D3'}} />
            <Text style={{marginLeft: 10, marginRight: 10}}>我也是有底线的</Text>
            <View style={{width: 100, height: 1 / PixelRatio.get(), backgroundColor: '#D3D3D3'}} />
          </View>
        );
        break;
    }
    return (
      <View><Text>This is Footer!</Text></View>
    );
  }
  renderSuccessView() {
    var data = this.state.data;
    var list = data.result.list;
    if (list != null && list.length > 0) {
      return (
        <FlatList
          data={list}
          renderItem={this.renderListItem}
          ListFooterComponent={this.renderFlatListFooter}
        />
      );
    }
    return (
      <Text>No Data!</Text>
    );
  }
  renderListItem = (data) => {
    return (
      <View key={data.index}>
        <TouchableOpacity style={listItemStyles.container} activeOpacity={0.6} onPress={()=>{this.state.navigation('Detail', data.item)}}>
          <Image
            style={listItemStyles.image}
            source={global.isEmpty(data.item.thumbnail) ? require('./images/ic_no_pic.jpg')
                                                      : {uri: data.item.thumbnail}}
          />
          <View style={listItemStyles.textContainer}>
            <Text style={{fontSize: 16, alignSelf: 'flex-start', color: '#000000'}}>{data.item.name}</Text>
            <Text style={{fontSize: 14, alignSelf: 'flex-start', marginTop: 2}}>{"分类：" + data.item.ctgTitles}</Text>
          </View>
        </TouchableOpacity>
        <View style={{width: global.screenWidth, height: 1 / PixelRatio.get(), backgroundColor: '#D3D3D3'}} />
      </View>
    );
  }
  render() {
    switch (this.state.loadingState) {
      case global.statePreload:
        this.getListData();
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
  // 获取分类菜谱的列表数据
  getListData() {
    const URL = "https://apicloud.mob.com/v1/cook/menu/search?key=" + global.key + "&cid=" + this.state.params.ctgId + "&page=1&size=20";
    fetch(URL).then((res)=>res.json())
      .then((json)=>{
        this.setState({data: json}, () => {
          this.setState({loadingState: global.stateLoadSuccess});
        });
      });
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: TestNavigation },
  Chat: { screen: ChatScreen },
  Detail: { screen: DetailScreen },
});

const listItemStyles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    width: global.screenWidth,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  image: {
    width: 65,
    height: 48,
    marginLeft: 5,
    marginRight: 5,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('TestNavigation', () => SimpleApp);
