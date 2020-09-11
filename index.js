var express = require("express");
var path = require("path");
var fs = require("fs");

var app= express();
const dirPath = path.join (__dirname, 'mock');

global.jsons={}

fs.readdir(dirPath,function(err, files){
	if(err){
		return console.log("Unable to read directory: " + err);
	}
	files.forEach(function(file){
		const endpoint = "/"+ path.parse(file).name;
		global.jsons[endpoint]= require(dirPath+endpoint);
		console.log("Opening endpoint " +endpoint);
		app.get(endpoint, (req, res,next)=>{
			res.json(jsons[endpoint]);
		});
		
	});
});

var returnJSON =function(req, res, next){
	const endpoint = req.originalUrl;
	req.returnJSON=jsons[endpoint];
	next();
}
app.use(returnJSON);


app.listen(3000, ()=>{
	console.log("Server running on port 3000");
});