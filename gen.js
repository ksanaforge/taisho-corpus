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
files.length=390;
//files.length=29;
var prevpage;

const lb=function(tag){
	if (!this.started)return; //ignore lb in apparatus after </body>

	const s=this.popBaseText();
	const pbn=tag.attributes.n;
	const page=(parseInt(pbn,10)-1)*3 + (pbn.charCodeAt(4)-0x61);
	const line=parseInt(pbn.substr(5))-1;
	const pb=pbn.substr(0,4);

	this.putLine(s);

	if (prevpage!==pb && page===0) {
		this.addBook();
	}

	if (this.bookCount){
		const kpos=this.makeKPos(this.bookCount-1,page,line,0);
		this.newLine(kpos, this.tPos);
	}
	prevpage=pb;
}

//t03n0190_004.xml: 0669c28 has inline note
//雙行夾注
const note=function(tag,closing){
	if (closing){
		if (tag.attributes.place==="inline"){
			var s=this.popText();
			if (s) this.putField("note",s);
		}
	} else {
		if (tag.attributes.place==="inline"){
			return true;
		}
	}
}

const p=function(tag,closing){
	this.putEmptyField("p");	
}
const bookStart=function(n){
	console.log("indexing volumn",n)
}
const bookEnd=function(){

}
const TEI=function(tag){
	const id=tag.attributes["xml:id"];
	if (id){
		var sid=id.substr(id.length-5);
		if (sid[0]==="n") sid=sid.substr(1);
		this.putField("sid",sid);
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
	if (closing) {
		var s=this.popText();
	} else {
		return true;//push text
	}
}
const fileStart=function(fn,i){
	const at=fn.lastIndexOf("/");
	fn=fn.substr(at+1);
	fn=fn.substr(0,fn.length-4);//remove .xml
	this.putField("file",fn);
}
const onFinalizeFields=function(fields){

}
const options={inputFormat:"xml",bitPat:"taisho",name:"taisho",
randomPage:true, //CBETA move t09p198a10 under t09p56c01 普門品經序
removePunc:true,textOnly:true
}; //set textOnly not to build inverted
const corpus=createCorpus(options);
corpus.setHandlers(
	{note,lb,body,p,"cb:mulu":cb_mulu,milestone,TEI}, //open tag handlers
	{note,body,"cb:mulu":cb_mulu},  //end tag handlers
	{bookStart,bookEnd,fileStart}  //other handlers
);

files.forEach(fn=>corpus.addFile(sourcepath+fn));

corpus.writeKDB("taisho.cor",function(byteswritten){
	console.log(byteswritten,"bytes written")
});
//console.log(corpus.romable.buildROM({date:(new Date()).toString()}));
console.log(corpus.totalPosting,corpus.tPos);
fs.writeFileSync("disorderPages.json",JSON.stringify(corpus.disorderPages,""," "),"utf8");
fs.writeFileSync("longlines.json",JSON.stringify(corpus.longLines,""," "),"utf8");

