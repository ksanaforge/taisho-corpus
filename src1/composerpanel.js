const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const ComposerPanel=React.createClass({
	getInitialState:function(){
		return {texts:[]}
	}
	,contextTypes:{
		listen:PT.func,
	}
	,componentDidMount:function(){
		this.context.listen("oncomposetext",this.oncomposetext,this);
	}
	,oncomposetext:function(texts){
		this.setState({texts});
	}
	,render:function(){
		return E("div",{},this.state.texts);
	}
})
module.exports=ComposerPanel;