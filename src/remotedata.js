var firebase=require("firebase");

var config = {
    apiKey: "AIzaSyA8NMcVkhwOWyioDZ1IZaI7u0lYWh3xaFk",
    authDomain: "taishonote-6c953.firebaseapp.com",
    databaseURL: "https://taishonote-6c953.firebaseio.com",
    storageBucket: "taishonote-6c953.appspot.com",
    messagingSenderId: "791356341342"
};

firebase.initializeApp(config);

const usernotes=function(key) {
	return firebase.database().ref("/user-notes").child(key);
}

const notes=function() {
	return firebase.database().ref("/notes");
}
const rootpath=function(path){
	return firebase.database().ref(path);
}

const linkedBy=function(file){
	return firebase.database().ref("/linkedBy").child(file);
}
module.exports={rootpath,notes,usernotes,linkedBy,firebase};