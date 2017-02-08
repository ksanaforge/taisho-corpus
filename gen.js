/*
generate taisho.cor (not inverted)

select a text, give human readible address.

select by vol,page, and jump to the juan.
paste address and jump to the juan and highlight text

paste a serial of address,
return a json structure , containing all the text.

*/
const Ksanapos=require("ksana-corpus/ksanapos");
const createCorpus=require("ksana-corpus-builder").createCorpus;
const fs=require("fs");
const sourcepath="../../CBReader/xml/";
const files=fs.readFileSync("taisho.lst","utf8").split(/\r?\n/);
//files.length=390;  //first 2 volumn
//files.length=4903; //first 25volume
//for (var i=0;i<3917;i++) files.shift();
for (var i=0;i<7728;i++) files.shift();

//for (var i=0;i<300;i++) files.shift();
//files.length=300;
var prevpage;

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
	if (closing || !this.started) return;
	this.putEmptyBookField("p");	
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
const cb_mulu=function(tag,closing){
	//subtoc_range[2996] negative 76102944 , 75673824
	const depth=parseInt(tag.attributes.level);
	if (depth) {
		return this.handlers.head_subtree.call(this,tag,closing,depth);
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
const addGroup=function(){
	if (newsid) {
		const jintitle=jinfromjuantitle(this.juantitle);
		console.log(this.sid,jintitle,'kpos',this.articlePos,'tpos',this.articleTPos);
		this.putGroup( this.sid+";"+jintitle,this.articlePos,this.articleTPos);
		newsid=false;
	}
}

const fileEnd=function(){
	this.putArticle(this.juantitle,this.articlePos,this.articleTPos);
	addGroup.call(this);
}
const onFinalizeFields=function(fields){

}
const options={inputFormat:"xml",bitPat:"taisho",name:"taisho",
randomPage:false, //CBETA move t09p198a10 under t09p56c01 普門品經序
removePunc:true, //textOnly:true,
maxTextStackDepth:3//cb:jhead might have note inside
}; //set textOnly not to build inverted
const corpus=createCorpus(options);
corpus.setHandlers(
	{"cb:jhead":cbjhead,note,lb,body,p,milestone,TEI,"cb:mulu":cb_mulu}, //open tag handlers
	{"cb:jhead":cbjhead,note,body,"cb:mulu":cb_mulu},  //end tag handlers
	{bookStart,bookEnd,fileStart,fileEnd}  //other handlers
);

files.forEach(fn=>corpus.addFile(sourcepath+fn));
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