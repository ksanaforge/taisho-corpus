/*
generate taisho.cor (not inverted)

select a text, give human readible address.

select by vol,page, and jump to the juan.
paste address and jump to the juan and highlight text

paste a serial of address,
return a json structure , containing all the text.

*/
//your CBREADER 2016 XML path
const sourcepath="../../CBReader/xml/";






var createCorpus=null
try {
	createCorpus=require("ksana-corpus-builder").createCorpus;
} catch(e){
	createCorpus=require("ksana-corpus-lib").createCorpus;
}
const fs=require("fs");
const files=fs.readFileSync("taisho.lst","utf8").split(/\r?\n/);

//files.length=390;  //first 2 volumn
//files.length=4903; //first 25volume
//for (var i=0;i<4761;i++) files.shift();
//files.length=120;
var prevpage;
var inP=false;
const lb=function(tag){
	if (!this.started)return; //ignore lb in apparatus after </body>

	const s=this.popBaseText();
	const pbn=tag.attributes.n;
	const col=pbn.charCodeAt(4);
	if (col>=0x64) { //column d
		console.log("ignore column d,e",pbn)
		return; //ignore T21n1308_001 0429d01, 0437e01
	} 
	const page=(parseInt(pbn,10)-1)*3 + (col-0x61);
	const line=parseInt(pbn.substr(5))-1;
	const pb=pbn.substr(0,4);

	this.putLine(s);

	if (prevpage!==pb && page===0) {
		this.addBook();
	}

	if (this.bookCount){
		const kpos=this.makeKPos(this.bookCount,page,line,0);
		this.newLine(kpos, this.tPos);
		if (!this.articlePos){
			this.articlePos=kpos;
			this.articleTPos=this.tPos;
		}
		if (!inP) { //if not a paragraph , every lb start a new paragraph (for lg and l)
			this.putEmptyArticleField("p",kpos,this.articleCount);
		}

	}

	prevpage=pb;
}

//t03n0190_004.xml: 0669c28 has inline note
//雙行夾注
const note=function(tag,closing){
	if (closing){
		if (tag.attributes.place==="inline"){
			var s=this.popText();
			if (s) this.putBookField("note",s);
		}
	} else {
		if (tag.attributes.place==="inline"){
			return true;
		}
	}
}

const p=function(tag,closing){
	if (!this.started) return;
	if (closing) {
		inP=false;
	} else {
		inP=true;
		//unlike other kdb, putArticle to increment articleCount comes after fileend, so we need to pass articleCount
		this.putEmptyArticleField("p",this.kPos,this.articleCount);
	}
}
const bookStart=function(n){
	console.log("indexing volumn",n)
}
const bookEnd=function(){

}
const jinfromjuantitle=function(juantitle){
	const at=juantitle.lastIndexOf("卷");
	if (at>0) {
		return juantitle.substr(0,at);
	}
	return juantitle;
}

const TEI=function(tag){
	const id=tag.attributes["xml:id"];
	if (id){
		var sid=id.substr(id.length-5);
		if (sid[0]==="n") sid=sid.substr(1);
		if (this.sid!==sid) {
			newsid=true;
		}
		this.sid=sid;
	}
}

const milestone=function(tag){
	if (tag.attributes.unit==="juan"){
		this.putField("juan",parseInt(tag.attributes.n,10));	
	}
} 

const body=function(tag,closing){
	closing?this.stop():this.start();
}
var EA_pin="";
const cb_mulu=function(tag,closing){
	//subtoc_range[2996] negative 76102944 , 75673824
	const depth=parseInt(tag.attributes.level);
	if (closing) {
		const mulutext=this.popText();
		/// this.addText(mulutext);  //MULU TEXT is not part of Taisho
		const depth=parseInt(tag.attributes.level);

		if (depth==1&&this.sid=="0125" && tag.attributes.type=="品") {
			EA_pin=parseInt(tag.attributes.n,10);
		}

		if (this.sid=="0100" &&tag.attributes.level==2&&tag.attributes.type=="其他"){
			//不知道為什麼 type不是"經"
			this.putField("subsid@"+this.sid,parseInt(mulutext,10));
		}
		if (tag.attributes.type=="經" && depth>=2) { //n26 depth=3, n99 depth=2
			//var n=parseInt(tag.attributes.n,10);  n 不對 
			//if (isNaN(n)) {
			var n=parseInt(parseInt(mulutext),10);
			//}
			if (n) {
				if (this.sid=="0125") {
					n=EA_pin+"."+n;
				}
				this.putField("subsid@"+this.sid,n);
			}
		}
		this.handlers.head_subtree.call(this,tag,closing,depth);
	} else {
		if (depth) this.handlers.head_subtree.call(this,tag,closing,depth);
		return true;
	}
}
const fileStart=function(fn,i){
	const at=fn.lastIndexOf("/");
	fn=fn.substr(at+1);
	fn=fn.substr(0,fn.length-4);//remove .xml
	this.articlePos=0;//reset articlePos, first lb will set articlePos
}
const cbjhead=function(tag,closing){
	if (closing) {
		this.juantitle=this.popText();
		this.addText(this.juantitle);
	} else {
		return true;
	}
}
var newsid=false;
const sid2bulei=require("./sid2bulei");
const getBulei=function(sid){
	var b=sid2bulei[sid] || 0;
	if (b==0 && parseInt(sid)==220) {
		b=sid2bulei["0220"]; //大般若經 cross volumn
	}
	return b;
}
const buleiname=require("./buleiname");
const addGroup=function(){
	if (newsid) {
		const jintitle=jinfromjuantitle(this.juantitle);
		const bulei=getBulei(this.sid);
		console.log(this.sid,jintitle,buleiname[bulei],'kpos',this.stringify(this.articlePos),'tpos',this.articleTPos);
		this.putGroup( this.sid+";"+bulei+"@"+jintitle,this.articlePos,this.articleTPos);
		newsid=false;
	}
}

const fileEnd=function(){
	this.putArticle(this.juantitle,this.articlePos,this.articleTPos);
	addGroup.call(this);
}
const onFinalizeFields=function(fields){
}


const finalize=function(){
	const mpps_fields_note=require("../mpps_lecture/mpps_fields_note.json");
	const mpps_fields_head=require("../mpps_lecture/mpps_fields_head.json");
	const mpps_fields_jin=require("../mpps_lecture/mpps_fields_jin.json");
	this.importExternalMarkup(mpps_fields_note);
	this.importExternalMarkup(mpps_fields_head);
	this.importExternalMarkup(mpps_fields_jin);
}
const bigrams={};

require("./bigrams").split(" ").forEach((bi)=>bigrams[bi]=true);

const options={inputFormat:"xml",bitPat:"taisho",name:"taisho",bigrams,
articleFields:["mppsnote","kepan","jin","p"],
randomPage:false, //CBETA move t09p198a10 under t09p56c01 普門品經序
removePunc:true, //textOnly:true,
maxTextStackDepth:3,//cb:jhead might have note inside
groupPrefix:buleiname,
title:"大正新修大藏經"
}; //set textOnly not to build inverted
const corpus=createCorpus(options);
corpus.setHandlers(
	{"cb:jhead":cbjhead,note,lb,body,p,milestone,TEI,"cb:mulu":cb_mulu}, //open tag handlers
	{"cb:jhead":cbjhead,note,body,p,"cb:mulu":cb_mulu},  //end tag handlers
	{bookStart,bookEnd,fileStart,fileEnd,finalize}  //other handlers
);

files.forEach(function(fn){
	const sourcefile=fn[0]=="."?fn:sourcepath+fn;
	corpus.addFile(sourcefile);	
});
corpus.writeKDB("taisho.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});
//console.log(corpus.romable.buildROM({date:(new Date()).toString()}));
console.log(corpus.totalPosting,corpus.tPos);
fs.writeFileSync("disorderPages.json",JSON.stringify(corpus.disorderPages,""," "),"utf8");
fs.writeFileSync("longlines.json",JSON.stringify(corpus.longLines,""," "),"utf8");


/* negative

41600 prev: 30113639 now: 30113095 key: [ null, 'inverted', 'line2tpos' ]

*/