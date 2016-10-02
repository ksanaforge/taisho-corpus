var React=require("react");
var E=React.createElement;
var PT=React.PropTypes;
var CorpusNoteMode=require("ksana2015-parallel").CorpusNoteMode;

var maincomponent = React.createClass({
  getInitialState:function() {
    return {};
  },
  componentDidMount:function(){
  }
  ,render: function() {
    return E(CorpusNoteMode,{corpus:"taisho",address:"2p178a0103-15"});
  }
});
module.exports=maincomponent;