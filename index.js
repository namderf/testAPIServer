var express = require("express");
var path = require("path");
var fs = require("fs");

var app= express();
const dirPath = path.join (__dirname, 'mock');

global.jsons={}
global.confs={}
global.count={}

fs.readdir(dirPath,function(err, files){
	if(err){
		return console.log("Unable to read directory: " + err);
	}
	files.forEach(function(file){
		const pathObj = path.parse(file);
		const endpoint = "/"+ pathObj.name;
		const fExt= pathObj.ext;
		if (fExt==".json"){
			global.jsons[endpoint]= require(dirPath+endpoint);
			global.count[endpoint]=0;
			cfgPath = path.join(dirPath, `${pathObj.name}.cfg`);
			if (fs.existsSync(cfgPath)){
				console.log(`Found config for ${endpoint}`);
				global.confs[endpoint]=JSON.parse(fs.readFileSync(cfgPath,'utf8'));
			}
			console.log("Opening endpoint " +endpoint);
			app.get(endpoint, (req, res,next)=>{
				res.json(req.returnJSON);
			});	
		}
		
		
	});
});

var returnJSON =function(req, res, next){
	const endpoint = req.originalUrl;
	if (confs[endpoint]){
		let config = confs[endpoint];
		for (let prop in config){
			if (Array.isArray(config[prop])	&& prop in jsons[endpoint]){
				let index = count[endpoint]%config[prop].length;
				jsons[endpoint][prop]=config[prop][index];
			}
		}
	}
	req.returnJSON=jsons[endpoint];
	count[endpoint]++;
	next();
}
app.use(returnJSON);


app.listen(3000, ()=>{
	console.log("Server running on port 3000");
});