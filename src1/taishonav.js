const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const TaishoNav=React.createClass({
	getInitialState:function(){
		return {pos:"1p6a0906-1212"}
	}
	,contextTypes:{
		action:PT.func,
		getter:PT.func
	}
	,loadtext:function(e){
		this.context.getter("gettext",this.state.pos,
			(data)=>this.context.action("ontext",data)
		);
	}
	,onChange:function(e){
		this.setState({pos:e.target.value});
	}
	,render:function(){
		return E("div",{},
			E("input",{onChange:this.onChange,value:this.state.pos}),
			E("button",{onClick:this.loadtext},"load")
		)
	}
})
module.exports=TaishoNav;