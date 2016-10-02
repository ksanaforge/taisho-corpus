const M=require("./model");
const Corpus=require("ksana-corpus");
var corpus=null;

const gettext=function(pos,cb){
	if (!corpus)return;
	corpus.getText(pos,function(data){
		cb(data);	
	});
};

Corpus.openCorpus("j13",function(err,engine){
	if (err) console.log(err);
	else corpus=engine;
});
var addresspat=/@t?(\d+p\d+[a-c]\d+-\d?[a-c]?\d+)/g;
const composetext=function(t,cb){
	var address=[];
	t.replace(addresspat,function(m,m1){
		address.push(m1);
	});
	corpus.getText(address,function(res){
		var out=t.replace(addresspat,()=>res.shift());
		cb(out);
	})
}
M.registerGetter("gettext",gettext);
M.registerGetter("composetext",composetext);