const React=require("react");
const TaishoPanel=require("./taishopanel");
const ComposerPanel=require("./composerpanel");
const PT=React.PropTypes;
const Model=require("./model");
const store=require("./store");
const E=React.createElement;
const styles={
  container:{display:"flex"},
  leftpanel:{flex:1},
  rightpanel:{flex:1}
}
const maincomponent = React.createClass({
  getInitialState:function() {
    return {}
  }
  ,childContextTypes: {
    listen: PT.func
    ,unlistenAll: PT.func
    ,action: PT.func
    ,getter: PT.func
    ,hasGetter: PT.func
    ,registerGetter:PT.func
    ,unregisterGetter:PT.func
  }
  ,getChildContext:function(){
    return Model;
  }
  ,render: function() {
    return E("div",{style:styles.container},
      E("div",{style:styles.leftpanel},E(TaishoPanel)),
      E("div",{style:styles.rightpanel},E(ComposerPanel))
    );
  }
});
module.exports=maincomponent;