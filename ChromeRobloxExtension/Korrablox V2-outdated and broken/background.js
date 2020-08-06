///////Background, run only once upon start, good for storing things across multiple tabs///////
//essentially a look up and see if you've stored it, otherwise return false and have them store it after getting it///

var itemValues = [];
var itemSales = [];
var userItemValues = [];
var gamePassSales = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) 
{
  	//alert(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
	var usedTable = itemValues;
	var expireTime = 14400;

  	if (request.requestType == "profile")
	{
		usedTable = userItemValues;
	}
	else if (request.requestType == "itemValue")
	{
		usedTable = itemValues;
	}
	else if (request.requestType == "itemSales")
	{
		usedTable = itemSales;
		expireTime = 900; ///15 minutes for item sales refresh
	}
	else if (request.requestType == "gamepassSales")
	{
		usedTable = gamePassSales;
		expireTime = 300; ///refresh every 5 minutes
	}
	else
	{
		var resp = {};
		resp.val = "Did not receive request correctly";
		resp.success = false;
		sendResponse(resp);
	}
	
	if (request.actionType == "GET")
	{
		if (usedTable[request.id] != undefined)
		{
			var resp = {};
			resp.val = usedTable[request.id][0];
			resp.success = true;
			if (Math.floor(new Date().getTime() / 1000) - usedTable[request.id][1] < expireTime)
			{
				resp.fresh = true;
			}
			else
			{
				resp.fresh = false;
			}
			sendResponse(resp);
		}
		else
		{
			var resp = {};
			resp.val = "N/A";
			resp.success = false;
			sendResponse(resp);
		}
	}
	else //SET
	{
		usedTable[request.id] = [request.passedStuff, Math.floor(new Date().getTime() / 1000)];
		var resp = {};
		resp.val = "Success";
		resp.success = true;
		sendResponse(resp);
	}
});