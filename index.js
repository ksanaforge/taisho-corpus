var React=require("react");
var ReactDOM=require("react-dom");
require("ksana2015-webruntime/livereload")(); 
var ksanagap=require("ksana2015-webruntime/ksanagap");
ksanagap.boot("taisho-corpus",function(){
	var Main=React.createElement(require("./src/main"));
	ksana.mainComponent=ReactDOM.render(Main,document.getElementById("main"));
});