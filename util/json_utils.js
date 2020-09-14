module.exports={
	setJSONValue: function (in_json, keypath, value){
		keypathArray = createKeyPathArray(keypath);
		in_json=setValue(in_json,keypathArray,value);
		return in_json;
	}
};

function createKeyPathArray(keypath){
	keypathArray = keypath.split(".");
	for (let [i, key] of keypathArray.entries()){
		key = key.split("[");
		keyId = key[0];
		arrayIndex= null;
		if (key[1]){
			arrayIndex=key[1].slice(0,-1);
		}
		keypathArray[i] = {keyId,arrayIndex}
	}
	return keypathArray;
}

function setValue (in_json, keypathArray, value){
	let copyJSON = Object.assign({},in_json);
	let copyKeypath = keypathArray.map(val=>val);
	key = keypathArray[0];

	if (key.keyId in copyJSON && copyKeypath.length>0){
		if (key.arrayIndex && Array.isArray(copyJSON[key.keyId])){
			if (copyKeypath.length==1){
				copyJSON[key.keyId][key.arrayIndex]=value;
			}
			else{
				copyKeypath.shift();
				copyJSON[key.keyId][key.arrayIndex]=setValue(copyJSON[key.keyId][key.arrayIndex],copyKeypath, value);
			}
		}
		else{
			if (copyKeypath.length==1){
				copyJSON[key.keyId] = value;
			}
			else{
				copyKeypath.shift();
				copyJSON[key.keyId] = setValue(copyJSON[key.keyId],copyKeypath, value);
			}
		}
	}
	return copyJSON;
}
