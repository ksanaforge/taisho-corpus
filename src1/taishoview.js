const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const TaishoView=React.createClass({
	getInitialState:function(){
		return {texts:["loading"]}
	}
	,contextTypes:{
		listen:PT.func
	}
	,componentDidMount:function(){
		this.context.listen("ontext",this.onText,this);
	}
	,onText:function(texts){
		this.setState({texts});
	}
	,renderLines:function(line,key){
		return E("div",{key},line);
	}
	,render:function(){
		return E("div",{},this.state.texts.map(this.renderLines));
	}
})
module.exports=TaishoView;