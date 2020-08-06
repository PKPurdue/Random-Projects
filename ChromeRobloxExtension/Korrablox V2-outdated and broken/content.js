var things = $(".item-name-container"); //document.getElementsByClassName("item-name-container");
var lim = document.getElementsByClassName("icon-label icon-limited-label");
var limUnique = $(".icon-limited-unique-label");
var apiLink = "https://www.rolimons.com/item/"; //"https://rbx.rocks/apis/item?id=";

//var backgroundPage = chrome.extension.getBackgroundPage(); ////allows you to access variables in background


function sendBackgroundPage(tab, callback) //typeString is "profile", "itemValue", "itemSales"
{
	console.log(tab.actionType + "- " + tab.requestType + " for id: " + tab.id);
	var ret = {};
	ret.actionType = tab.actionType;
	ret.requestType = tab.requestType;
	ret.id = tab.id;
	ret.passedStuff = tab.passedStuff;
	chrome.runtime.sendMessage(ret, function(response) 
	{
		console.log(response.success + "- " + response.val);
		callback(response);
	});
}


function globalFuncTest() { console.log("Global function test"); }

function getRocksValue(id, callback)
{
	/*console.log("Request to: " + apiLink + id);
	$.get(apiLink + id, function(data)
	{
		/*console.log(JSON.stringify(data));
		var stats = JSON.parse(data).stats
		if (stats.value != null)
		{
			console.log("Item Value: " + stats.value.toLocaleString());
			//alert(stats.value);
			callback(stats.value.toLocaleString())
			
		}
		else if (stats.rap != null)
		{
			//alert(stats.rap);
			console.log("Returning RAP instead, RAP: " + stats.rap.toLocaleString());
			callback(stats.rap.toLocaleString())
		}
		else
		{
			//alert("N/A");
			callback("N/A");
			//console.log("No value assigned for item: " + id);
		}
		console.log(JSON.stringify(data));
		callback(item_details_data.value.toLocaleString());
	}).error(function() { callback("Error"); console.log("Error loading item: " + id); });*/
	$.get(apiLink + id, function(data)
	{
		//console.log($(data).item_details_data);
		var val = $(data).find(".list-group")[0].children[1].children[1].children[0].innerHTML;
		val = parseInt(val);
		callback(val);
	});
}

function getItemSales(itemId, attempt, callback)
{
	$.getJSON("https://api.roblox.com/marketplace/productinfo", {"assetId":itemId}, function(data)
	{
		callback(JSON.parse(JSON.stringify(data)).Sales.toLocaleString())
	}).error(function(err)
	{
		if (attempt < 3)
		{
			getItemSales(itemId, attempt + 1, callback)
		}
		else
		{
			callback("N/A");
		}
	});
}

function getValue(link, callback)/////profile value
{
	$.get(link, function(data)
	{ 
		var valueHere = $(data).find(".hide-on-med-and-down");
		if (valueHere != undefined && valueHere.length > 1 && valueHere[1].parentNode != undefined)
		{
			var par = $(data).find(".hide-on-med-and-down")[1].parentNode; 
			par.children[0].remove(); 
			$(".details-info")[0].children[4].children[1].children[0].innerHTML = par.innerHTML.toLocaleString();
			//console.log(par.innerHTML); 
		}
		else
		{
			$(".details-info")[0].children[4].children[1].children[0].innerHTML = $(".details-info")[0].children[3].children[1].children[0].innerHTML;
		}
	});
}

function delay(amount, callback)
{
	setTimeout(function()
	{
		callback();
	}, amount);
}

function getGamepasses(gameLink, callback)
{
    $.get(gameLink, function(data) 
    { 
        var gamepasses = $(data).find(".store-card");
        var str = JSON.stringify(data);
        var strSplit = str.split("text-robux");
	var ret = [];
	if (strSplit.length < 2) { callback(ret); return; }
        for (var i = 1; i < strSplit.length; i++)
        {
        	var newSplit = strSplit[i].split("<");
         	var linkk = gamepasses[i - 1].children[0].getAttribute("href");
         	linkk = linkk.substring(linkk.indexOf("game-pass/") + 10);
		
		var temp = [];
		temp.push(linkk.substring(0, linkk.indexOf("/")));
		temp.push(newSplit[0].substring(3));
		ret.push(temp);
        }
	callback(ret);	
    }).error(function(err) { console.log("Error."); });
}


function getItemSalesGamepass(itemId, attempt, callback)
{
	$.getJSON("https://api.roblox.com/marketplace/game-pass-product-info", {"gamePassId":itemId}, function(data)
	{
		//itemReturnValue = JSON.parse(JSON.stringify(data)).Sales.toLocaleString();
		callback(JSON.parse(JSON.stringify(data)).Sales.toLocaleString());
	}).error(function(err)
	{
		if (attempt < 3)
		{
			getItemSalesGamepass(itemId, attempt + 1, callback)
		}
		else
		{
			//itemReturnValue = "N/A";
			console.log("Could not load marketplace thing for id: " + itemId);
			callback("0");
		}
	});
}


/*if (window.location.href.indexOf("https://www.roblox.com/") > -1) ////remove the thing if the decline button exists
{
	var declineButton = $("#decline-btn");
	if (declineButton.length > 0)
	{
		var first = $("#simplemodal-container");
		if (first.length > 0) { first[0].remove(); }
		first = undefined;
		first = $("#simplemodal-overlay");
		if (first.length > 0) { first[0].remove(); }
	}
	var i = 0;
	var aa = setInterval(function()
	{
		i++;
		var declineButton = $("#decline-btn");
		if (declineButton.length > 0)
		{
			var first = $("#simplemodal-container");
			if (first.length > 0) { first[0].remove(); }
			first = undefined;
			first = $("#simplemodal-overlay");
			if (first.length > 0) { first[0].remove(); }
		}
		if (i > 10) { window.clearInterval(aa); }	
	}, 150);
}*/


if (window.location.href.indexOf("https://www.roblox.com/catalog") > -1 || window.location.href.indexOf("https://www.roblox.com/library") > -1)
{
	if (window.location.href.indexOf("https://www.roblox.com/catalog/?") > -1) ///generic catalog page
	{
		runCatalog();
	}
	else if (window.location.href.indexOf("https://www.roblox.com/library/?") == -1) ////actual item page
	{
		runItem();
	}
}
else if (window.location.href.indexOf("https://www.roblox.com/games") > -1)
{
	if (window.location.href.indexOf("https://www.roblox.com/games/?") > -1) ///generic catalog page
	{
		runGamesPage();
	}
	else ////actual item page
	{
		runGamePage();
	}
}
else if (window.location.href.indexOf("https://www.roblox.com/My/Money.aspx#/#TradeItems_tab") > -1) //trade
{
	runTradePage();
}

if (window.location.origin == "https://www.reddit.com")
{
	window.addEventListener('keydown', function (e) {
		if (e.shiftKey && e.keyCode == 68 && window.location.href.indexOf("reddit.com/search") > -1) { //Shift + D = remove things from list
			removeThings();
		}
		else if (e.shiftKey && e.keyCode == 70 && window.location.href.indexOf("reddit.com/search") > -1) //Shift + F = remove all subreddits containing string
		{
			removeThingsSearch();
		}
		else if (e.shiftKey && e.keyCode == 84 && window.location.href.indexOf("reddit.com/search") > -1) //Shift + T = remove all posts containing string in title
		{
			removeThingTitleSearch();
		}
		else if (e.shiftKey && e.keyCode == 72 && window.location.href.indexOf("reddit.com/search") > -1) //Shift + H = highlight possible nearby posts
		{
			highlightNearby();
		}
	});
}