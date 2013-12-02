// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });



var _OnOff=1;

var onObje={text:"on"};
var onColorObje={color:"#0f0"};

var offObje={text:"off"};
var offColorObje={color:"#f00"};

chrome.browserAction.setBadgeText(onObje);
chrome.browserAction.setBadgeBackgroundColor(onColorObje);
//global.ext_status = "on";

//example of using a message handler from the inject scripts
chrome.extension.onRequest.addListener(

  function(request, sender, sendResponse) {
  		//chrome.pageAction.show(sender.tab.id);
  			if (request.msg === "getStatus")
    			{	
    				console.log("requested sending status:"+_OnOff);
    				sendResponse({status:_OnOff});
        			return true;
    			}
    
  });
/*chrome.extension.sendRequest({msg: "setStatus"}, function(response) {
 
});*/
var reInject=function()
{
	chrome.tabs.query({url:"*://*/*"},function (tabs) {
		console.log("tab query done");
		for(var i=0;i<tabs.length;i++){
			chrome.tabs.sendMessage(tabs[i].id, {status:_OnOff});
				console.log("injection for tab "+tabs[i].id);
				var _OnOffbool;
				if(_OnOff)
					_OnOffbool=true;
				else _OnOffbool=false;
				chrome.tabs.executeScript(tabs[i].id,{code:"statusa ="+(_OnOffbool)+";"});
												}
	/*	for (a in tabs)
			{	a.id;
		
				console.log("injection for tab "+a.id);
			}*/
	});
}
chrome.browserAction.onClicked.addListener(function(){
	if(_OnOff)
	{

		chrome.browserAction.setBadgeText(offObje);
		chrome.browserAction.setBadgeBackgroundColor(offColorObje);	
	/*	global.ext_status= "off";	*/
		reInject();
	}
	else{

		chrome.browserAction.setBadgeText(onObje);
		chrome.browserAction.setBadgeBackgroundColor(onColorObje);
		/*global.ext_status = "on";*/
		reInject();
	}
		_OnOff+=1;
		_OnOff%=2;
	
});
/*
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
			 {
    			if (request.msg == "getStatus")
    			{
        			sendResponse({status: global.ext_status});
        			return true;
    			}
		 });*/
