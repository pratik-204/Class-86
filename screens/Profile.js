import React, { Component } from "react";
import { StyleSheet, Text, View ,Switch , Image , SafeAreaView ,Platform ,StatusBar } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import * as SplashScreen from 'expo-splash-screen';
import * as Font from "expo-font";
import firebase from 'firebase';


SplashScreen.preventAutoHideAsync();

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      isEnabled: false,
      light_theme: true,
      name:""
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  toggleSwitch(){
    const previus_state = this.state.isEnabled
    const theme = !this.state.isEnabled?"dark":"light"
    var updates = {}
    updates[
      "/users/"+firebase.auth().currentUser.uid+"/current_theme"
    ]=theme
    firebase
    .database()
    .ref()
    .update(updates)
    this.setState({isEnabaled:!previus_state,light_theme:previus_state})


  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }


  async fetchUser(){
    let theme,name,image;
    await firebase
    .database()
    .ref("/users/"+firebase.auth().currentUser.uid)
    .on("value",function(snapshot){
      theme=snapshot.val().current_theme;
      name=`${snapshot.val().first_name} ${snapshot.val().last_name}`
    })
    this.setState({
      light_theme: theme==="light"?true:false,
      isEnabaled:theme==="light"?false:true,
      name:name
    })
  }

  render() {
    if (this.state.fontsLoaded) {
      SplashScreen.hideAsync();
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea}/>
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image sorce={require("../assets/logo.png")}
              style={styles.iconImage}
              ></Image>
              </View>
              <View style={styles.appTitleTextContainer}>
                <Text style={styles.appTitleText}>Story Telling App</Text>
              </View>
              <View style={styles.screenContainer}>
              <View style={styles.profileImageContainer}>
                <Image 
                source={require("../assets/profile_img.png")}
                style={styles.profileImage}/>
                <Text style={styles.nameText}>
                  {this.state.name}
                </Text>
              </View>
              <View style={styles.themeConatainer}>
                <Text style={styles.themeText}>
                  Dark Theme
                </Text>
                <Switch 
                style={{transform:[{scaleX:1.3},{scaleY:1.3}]}}
                trackColor={{false:"#767577",true:"white"}}
                thumbColor={{this.state.isEnabaled?"#ee8249":"#f4f3f4"}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>this.toggleSwitch(                )}
                Value={this.state.isEnabled}/>
              </View>
              <View style={{flex:0.3}}></View>
              </View>
              <View style={{flex:0.08}}></View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  droidSafeArea:{
    marginTop:Platform.OS==="android"?StatusBar.currentHeight:0,   
  },
  appTitle:{
    flex:0.07,
    flesDirection:"row"
  },
  appIcon:{
      flex:0.3,
      justifyContent:"center",
      alignItems:"center"
  },
  iconImage:{
    width:"100%",
    height:"100",
    resizeMode:"contain"
  },
  appTitleTextContainer:{
    flex:0.7,
    justifyContent:"center",
  },
  appTitleText:{
    color:"white",
    fontSize:RFValue(28),
    fontFamily:"Bubblegum-Sans"
  },
  nameText:{
    color:"white",
    fontSize:RFValue(40),
    fontFamily:"Bubblegum-Sans",
    marginTop:RFValue(10)
  }, 
  profileImageContainer:{
    flex:0.5,
    justifyContent:"center",
    alignItems:"center",
  },
  screenContainer:{
    flex:0.85,
  },
  profileImage:{
    width:RFValue(140),
    height:RFValue(140),
    borderRadius:RFValue(70),

  },
  themeConatainer:{
    flex:0.2,
    flexDirection:"row",
    justifyContent:"center",
    marginTop:RFValue(20),
  },
  themeText:{
    color:"white",
    fontSize:RFValue(30),
    fontFamily:"Bubblegum-Sans",
    margineRight:RFValue(15)
  }
});
