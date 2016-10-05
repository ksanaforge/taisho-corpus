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
    	{corpus:"taisho",appname:"taisho-corpus",
      address:"2p178a0103-15",control:"notetab",datapath}
    );
  }
});
module.exports=maincomponent;