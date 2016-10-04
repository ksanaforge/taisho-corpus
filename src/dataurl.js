var firebase=require("firebase");

var config = {
    apiKey: "AIzaSyA8NMcVkhwOWyioDZ1IZaI7u0lYWh3xaFk",
    authDomain: "taishonote-6c953.firebaseapp.com",
    databaseURL: "https://taishonote-6c953.firebaseio.com",
    storageBucket: "taishonote-6c953.appspot.com",
    messagingSenderId: "791356341342"
};

const app=firebase.initializeApp(config);

var notes=function(key) {
	return firebase.database().ref("/notes");
}

var user=function() {
	return firebase.database().ref("/");
}
var rootpath=function(path){
	return firebase.database().ref(path);
}
module.exports={rootpath,user,notes,app,firebase};