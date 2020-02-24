/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
const REQUEST_URL = ""
import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Picker,
  Image,
  DatePickerAndroid,
  TouchableOpacity
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import { AreaPicker } from 'react-native-pickers';
import AreaJson from './src/Area.json';

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: 'https://facebook.github.io/react/logo-og.png',
      name: '',
      gender: 'man',
      date: '',
      region: ''
    };
  }

  componentDidMount() {
    let today = new Date();
    let year = today.getFullYear().toString();
    let month = (today.getMonth()+1).toString();
    let day = today.getDate().toString();
    this.setState({ date: (year + '-' + month + '-' + day) });
  }

  _handleButtonPress = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      this.setState({ avatar: image.path });
      console.log(this.state.avatar);
    });
  };

  async showDatePicker() {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({ date: (year + '-' + (month+1) + '-' + day) });
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  };

  async register() {
    try {
      let response = await fetch(
        REQUEST_URL + '',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: JSON.stringify({
            avatar: this.state.avatar,
            name: this.state.name,
            gender: this.state.gender,
            date: this.state.date,
            region: this.state.region
          })
        }
      );
      let responseJson = await response.json();
      console.log(responseJson);
      return responseJson;
    } catch (error) {
      console.error(error);
    }
    console.log(this.state);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textInput}>
          <Text>
            头像上传：
          </Text>
          <Image
            style={{
              width: 100,
              height: 100,
              margin: 5
            }}
            source={{uri: this.state.avatar}} />
          <Button title="上传图片" onPress={this._handleButtonPress} />
        </View>

        <View style={styles.textInput}>
          <Text>
            姓名：
          </Text>
          <TextInput
              placeholder="请输入你的名字"
              onChangeText={(name) => this.setState({name})} />
        </View>

        <View style={styles.textInput}>
          <Text>
            性别：
          </Text>
          <Picker
            selectedValue={this.state.gender}
            style={{height: 20, width: 80}}
            onValueChange={(itemValue, itemIndex) => 
              this.setState({gender: itemValue})
            }>
            <Picker.Item label="男" value="man" />
            <Picker.Item label="女" value="woman" />
          </Picker>
        </View>

        <View style={styles.textInput}>
          <Text style={{marginRight: 10}}>
            出生日期：{this.state.date}
          </Text>
          <Button 
            title='选择日期'
            onPress={this.showDatePicker.bind(this)} />
        </View>

        <View style={styles.textInput}>
          <Text>
            所在地：{this.state.region}
          </Text>
          <Button title='选择地区' onPress={(() => { this.AreaPicker.show() }).bind(this)} />
          <AreaPicker
            areaJson={AreaJson}
            onPickerCancel={() => { }}
            onPickerConfirm={(value) => {
                alert(JSON.stringify(value));
            }}
            ref={ref => this.AreaPicker = ref} />
        </View>

        <Button 
          title='注册' 
          color='#51A8DD' 
          onPress={this.register.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
  }
})
