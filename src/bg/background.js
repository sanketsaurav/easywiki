// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
var _OnOff=1;
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });
chrome.browserAction.onClicked.addListener(function(){
	if(_OnOff)
	{
		var obje={text:"on"};
		chrome.browserAction.setBadgeText(obje);
		
	}
	else{
		var obje={text:"off"};
		chrome.browserAction.setBadgeText(obje);

	}
		_OnOff+=1;
		_OnOff%=2;
	
});