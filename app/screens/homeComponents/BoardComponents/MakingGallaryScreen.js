import React,{Component} from "react";
import {View,Image,Text,TextInput,Keyboard,StyleSheet,Button,TouchableOpacity,FlatList} from "react-native";
import axios from "axios";
import Constants from 'expo-constants'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import * as MediaLibrary from 'expo-media-library'
import {Camera} from 'expo-camera'
import { ScrollView } from "react-native-gesture-handler";


export default class Write extends Component {
    constructor(props){
		super(props)
		this.state={
		title: '',
        content: '',
        img: []
		}
	}
    
    openImage = async() => {
        let permission = await ImagePicker.requestCameraPermissionsAsync();

        if(permission.granted === false){
            return;
        }
        
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result)

        if (!result.cancelled) {
            this.setState({ img: result });
        }
    }
    
    postBoard = () => {
        const {club_id} = this.props.route.params
        const{title,content} = this.state;
        const {user_id} = this.props.route.params
        const data = new FormData();
        if(title == ''){
            this.setState({alarm:'제목을 입력하세요'})
        }
        else if(content == ""){
            this.setState({alarm:'내용을 입력하세요'})
        }
        else{
            if(this.state.img.length != 0){
                let localUri = this.state.img.uri;
                let filename = localUri.split("/").pop();
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                data.append("img", {
                    uri: localUri,
                    name: filename,
                    type,
                });}
                data.append("id",user_id)
                data.append("title",title)
                data.append("content",content)
        fetch('http://115.85.183.157:3000/post/'+club_id+'/pic_board',{
            method: 'POST',
            body:data,
            headers: {
                "content-type": "multipart/form-data",
            },
        })
        .then((response) => response.json())
        .then((response)=>{
            if(response.success){
                this.props.navigation.navigate("GallaryBoardScreen");
            }else{
                alert(response.msg);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }
        Keyboard.dismiss();
    };

    render() {
        
        return(
            <View style={{flex: 1, backgroundColor:"#ebf4f6"}}>
            <ScrollView>
                <View style={styles.setting}>
                    <Text 
                    style={styles.topp}>
                        게시글 작성</Text>
                <View>
                    <Text style={{color:'red',alignSelf: 'center'}}>{this.state.alarm}</Text>
                </View>
                <View style={styles.writingform}>
                {
                        this.state.img.length !== 0 ?
                        (<Image source = {{uri:this.state.img.uri}} style = {styles.image}></Image>
        
                        ) : <Text>사진을 추가하세요!!</Text>
                    }
                    <TextInput style={styles.input} 
                    placeholder = "제목" 
                    onChangeText={title => this.setState({title})}/>
                    <TextInput style={styles.contentinput} 
                    placeholder = {"\n * 부적절한 용어 사용시 이용 제한 ! *" }
                    multiline = {true} 
                    blurOnSubmit={true}
                    onChangeText={content => this.setState({content})}
                    />
                </View>
                <View style={styles.buttonarea}>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress = {this.postBoard}
                    >
                        <Text style = {styles.buttonText}>🖍  작성</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                    style = {styles.button}
                    onPress = {this.openImage}
                    >
                        <Text style = {styles.buttonText}>🔗  사진</Text>
                    </TouchableOpacity>
                </View>
                </View>
                </ScrollView>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    setting: {
      alignItems :"center",
      paddingTop: Constants.statusBarHeight
    },
    topp: {
        fontSize: 25, 
        borderWidth:2,
        borderColor:'#76b0be', 
        backgroundColor:'#76b0be', 
        width:"100%",
        textAlign: 'center',
        color: 'white',
        fontWeight: "bold",
    },
    writingform: {
        width: '100%',
        alignItems: "center"
    },
    input:{
        borderWidth: 2,
        borderColor: "#484a49",
        borderRadius: 6,
        width: '100%',
        height: 50,
        marginTop: 8,
        paddingHorizontal: 20,
        fontSize: 25
      },
      contentinput:{
        borderWidth: 2,
        borderColor: "#484a49",
        borderRadius: 6,
        width: '100%',
        height: 400,
        marginTop: 8,
        paddingHorizontal: 20,
        fontSize: 20,
        textAlignVertical: 'top'
      },
      button:{
        borderWidth: 2,
        borderColor : "#3A445D",
        backgroundColor: "#3A445D",
        opacity:0.7,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        width: "100%"
      },
      buttonarea:{
        width : '20%',
        alignItems :"center",
        justifyContent: "center",
        flexDirection: "row"
      },
      buttonText: {
        fontSize : 20,
        color: 'white'
      },
      image: {
          width:150,
          height: 150,
          resizeMode: 'contain'
      }
  });

