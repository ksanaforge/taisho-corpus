const React=require("react");
const E=React.createElement;
const TaishoNav=require("./taishonav");
const TaishoView=require("./taishoview");
const PT=React.PropTypes;
const TaishoPanel=React.createClass({
	getInitialState:function(){
		return {value:"xxxx@t01p0001a0610-14yyyy@t01p0001a0711-14zzzzz"}
	}
	,contextTypes:{
		action:PT.func,
		getter:PT.func
	}
	,componentDidMount:function(){
		setTimeout(this.composetext,1000);//wait for corpus to open
	}
	,composetext:function(){
		this.context.getter("composetext",this.state.value,(data)=>{
			this.context.action("oncomposetext",data);
		});
	}
	,onChange:function(e){
		this.setState({value:e.target.value});
		setTimeout(this.composetext,500);
	}
	,render:function(){
		return E("div",{},
			E("a",{target:"_new",href:"http://ya.ksana.tw/taishonote/"},"taisho range selector"),
			E("br"),
			E("textarea",{className:"input",
				cols:40,rows:20,onChange:this.onChange,value:this.state.value})
		)
	}
})
module.exports=TaishoPanel;