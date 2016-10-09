/*
 TODO : login to firebase

*/
const React=require("react");
const E=React.createElement;
const PT=React.PropTypes;
const CorpusNoteMode=require("ksana2015-parallel").CorpusNoteMode;
const datapath=require("./datapath");
const maincomponent = React.createClass({
  getInitialState:function() {
    return {};
  },
  componentDidMount:function(){
  }
  ,render: function() {
    return E(CorpusNoteMode,
    	{corpus:"taisho",appname:"taisho-corpus",control:"notetab",datapath,
      address:"1p1b1216-1301"} 
      //address:"2p177b1502-04"}
      //address:"1p176a0103-15"}      
    );
  }
});
module.exports=maincomponent;