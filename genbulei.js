/*generate bulei from CBReader*/
const fs=require("fs");
const buleilst=fs.readFileSync("/CBReader/bulei_sutra_sch.lst","ucs2").trim().split(/\r?\n/);

var bcode="", sid2bulei={},buleiname=["部類不明"]; 
const processbulei=function(line){
	const m=line.match(/^(\d+) (.*?) /);
	if (m) {
			bcode=parseInt(m[1]);
			buleiname.push(m[2]);			
	} else {
			const sutra=line.match(/T\d+n(\d+[a-zA-Z]?)/);
			if (sutra) {
				sid2bulei[sutra[1]]=bcode;
			}
	}
}
buleilst.forEach(processbulei);
fs.writeFileSync("sid2bulei.js","module.exports="+JSON.stringify(sid2bulei,""," "),"utf8");
fs.writeFileSync("buleiname.js","module.exports="+JSON.stringify(buleiname,""," "),"utf8");
console.log("bulei",buleiname)