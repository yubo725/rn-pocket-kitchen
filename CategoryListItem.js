import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

var { global } = require('./global.js');
var cellHeight = 40;

export default class CategoryListItem extends Component {
  constructor(props) {
    super(props);
  }
  renderCell(data) {
    return (
      <TouchableOpacity style={styles.cell} activeOpacity={0.5} onPress={() => {this.props.nav(data)}}>
        <Text style={styles.cellText}>{data.name}</Text>
      </TouchableOpacity>
    );
  }
  renderHorizontalDivider() {
    return (
      <View style={styles.horizontalDivier} />
    );
  }
  renderVerticalDevider() {
    return (
      <View style={styles.verticalDivider} />
    );
  }
  renderRow(data) {
    var arr = [];
    if (data != null && data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        arr.push(this.renderCell(data[i]));
        arr.push(this.renderVerticalDevider());
      }
      arr.splice(-1, 1);
    }
    return (
      <View style={styles.categoryNameRow}>
        {arr}
      </View>
    );
  }
  // 将一维数组arr按pageSize分页为二维数组，每行pageSize个元素
  splitArr(arr, pageSize) {
    var resultArr = [];
    var itemArr;
    for (var j = 0; j < Math.ceil(arr.length / pageSize); j++) {
      itemArr = [];
      for (var i = 0; i < 4; i++) {
        var index = i + 4 * j;
        if (index < arr.length) {
          itemArr.push(arr[i + 4 * j].categoryInfo);
        } else {
          itemArr.push({"name": ""});
        }
      }
      resultArr.push(itemArr);
    }
    return resultArr;
  }
  render() {
    var data = this.props.data;
    var childs = data.childs;
    var arr = this.splitArr(childs, 4);
    var rows = [];
    for (var i = 0; i < arr.length; i++) {
      rows.push(this.renderRow(arr[i]));
      rows.push(this.renderHorizontalDivider());
    }
    rows.splice(-1, 1);
    return (
      <View style={[styles.container, {backgroundColor: this.props.cardColor}]}>
        <View style={styles.categoryTitleContainer}>
          <Text style={styles.categoryTitle}>{this.props.data.categoryInfo.name}</Text>
        </View>
        <View style={styles.horizontalDivier} />
        <View style={styles.categoryNameContainer}>
          {rows}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: global.screenWidth - 10,
    flexDirection: 'column',
    backgroundColor: '#FC5163',
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
  },
  categoryTitleContainer: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 5,
  },
  horizontalDivier: {
    width: global.screenWidth - 10,
    height: 1,
    backgroundColor: '#FFFFFF'
  },
  categoryTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  categoryNameContainer: {
    flexDirection: 'column',
  },
  categoryNameRow: {
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: cellHeight,
  },
  cellText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  verticalDivider: {
    width: 1,
    height: cellHeight,
    backgroundColor: '#FFFFFF',
  }
});
