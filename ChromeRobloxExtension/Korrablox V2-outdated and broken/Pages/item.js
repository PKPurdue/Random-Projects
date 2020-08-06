function runItem()
{
	$("#item-details-description")[0].setAttribute("class", "field-content description-content");////make description not clip off
	var itemContainer = $("#item-container")[0];
	var assetType = itemContainer.getAttribute("data-asset-type");
	
	var backgroundTab = {};
	backgroundTab.actionType = "GET";
	backgroundTab.requestType = "itemSales";
	backgroundTab.id = 1609402609;
	backgroundTab.passedStuff = 5000; ////only used for SET

	/*sendBackgroundPage(backgroundTab, function(ret)
	{
		console.log("Returned1: " + ret.val);
	});
	
	backgroundTab.actionType = "SET";
	sendBackgroundPage(backgroundTab, function(ret)
	{
		console.log("Returned2: " + ret.val);
	});

	backgroundTab.actionType = "GET";
	sendBackgroundPage(backgroundTab, function(ret)
	{
		console.log("Returned3: " + ret.val);
	});*/
	
	if (assetType != "GamePass")
	{
		if (lim.length > 0 || limUnique.length > 0) ////is a limited
		{
    			console.log("Is a LIMITED");
    			var itemDetails = $("#item-details")[0];
    			var clonedThing = $(".price-container").clone();
    			clonedThing.attr("id", "valueId");
    			clonedThing.attr("class", "clearfix item-value");
    			clonedThing.insertBefore($(".price-container")[0]); //clonedThing.appendTo(itemDetails);
    			///could also insert before item-type-field-container
			
    			var newElement = $("#valueId")[0];
    			newElement.style.marginBottom = "12px";
    			newElement.children[2].remove();
    			newElement.children[1].remove();
    			newElement.children[0].children[0].innerHTML = "Value";
    			newElement.children[0].children[1].children[0].children[1].innerHTML = "Loading Value...";
			
    			var itemId = $("#item-container")[0].getAttribute("data-item-id");
			
			
			var tab = [];
			tab.actionType = "GET";
			tab.requestType = "itemValue";
			tab.id = itemId;
			tab.passedStuff = 1000;
			
			sendBackgroundPage(tab, function(ret)
			{
				if (ret.success == true)
				{
					newElement.children[0].children[1].children[0].children[1].innerHTML = ret.val.toLocaleString();
					console.log("Found item- value: " + ret.val.toLocaleString());
				}
				else
				{
					console.log("Not found");
					getRocksValue(itemId, function(val) 
					{
    			   			console.log("Returned: " + val);
    			    			newElement.children[0].children[1].children[0].children[1].innerHTML = val.toLocaleString();
						
						if (val != "N/A" && val != "Error")
						{
							console.log("Sending item value to background page");
							tab.actionType = "SET";
							tab.passedStuff = val.split(",").join("");
							sendBackgroundPage(tab, function(ret) { });
						}
    					});
				}
			});
			
		} 
		else //Regular ROBLOX item, GamePass, Model, Decal
		{
    			var itemDetails = $("#item-details")[1];
    			var clonedThing = $(".item-type-field-container").clone();
    			clonedThing.attr("id", "salesId");
    			clonedThing.attr("class", "clearfix item-sales");
   			clonedThing.insertBefore($(".item-type-field-container")[0]); //clonedThing.appendTo(itemDetails);
   			///could also insert before item-type-field-container
			
   			var newElement = $("#salesId")[0];
    			newElement.style.marginBottom = "12px";
    			newElement.children[0].innerHTML = "Sales";
    			newElement.children[1].innerHTML = "Loading...";
			
    			var itemContainer = ($("#item-container") && $("#item-container")[0]) || undefined;
    			if (itemContainer != undefined) 
			{
        			var assetType = itemContainer.getAttribute("data-asset-type");
        			var price = itemContainer.getAttribute("data-expected-price");
        			var itemId = itemContainer.getAttribute("data-item-id");
				

				var tab = [];
				tab.actionType = "GET";
				tab.requestType = "itemSales";
				tab.id = itemId;
				tab.passedStuff = 1000;
				
				sendBackgroundPage(tab, function(ret)
				{
					if (ret.success == true && ret.fresh == true)
					{
						console.log("Found item- sales: " + ret.val.toLocaleString());
						var totalRobux = Math.floor(parseInt(ret.val.split(",").join("")) * price);
						if (totalRobux > 0)
						{
							newElement.children[1].setAttribute("title", "R$" + totalRobux.toLocaleString());
							newElement.children[1].innerHTML = ret.val.toLocaleString();
						}
						else
						{
							newElement.children[1].innerHTML = ret.val.toLocaleString();
						}
					}
					else
					{
						console.log("Not found");
						getItemSales(itemId, 1, function(val) 
						{
    			   				console.log("Returned: " + val);
    			    				var totalRobux = Math.floor(parseInt(val.split(",").join("")) * price); // * .7);
							if (totalRobux > 0) 
							{
               	 						newElement.children[1].setAttribute("title", "R$" + totalRobux.toLocaleString());
								newElement.children[1].innerHTML = val.toLocaleString();
            						}
							else
							{
								newElement.children[1].innerHTML = val.toLocaleString();
							}
							
							if (val != "N/A" && val != "Error")
							{
								console.log("Sending item value to background page");
								tab.actionType = "SET";
								tab.passedStuff = val;
								sendBackgroundPage(tab, function(ret) { });
							}
							else if (ret.success == true && ret.fresh == false)
							{
								totalRobux = Math.floor(parseInt(ret.val.split(",").join("")) * price); // * .7);
								newElement.children[1].setAttribute("title", "[4+ hours old] R$" + totalRobux.toLocaleString());
								newElement.children[1].innerHTML = val.toLocaleString();
							}
    						});
					}
				});
			}
    		}
	}
	else ////gamepass
	{
		var itemDetails = $("#item-details")[1];
    		var clonedThing = $(".item-type-field-container").clone();
    		clonedThing.attr("id", "salesId");
    		clonedThing.attr("class", "clearfix item-sales");
   		clonedThing.insertBefore($(".item-type-field-container")[0]); //clonedThing.appendTo(itemDetails);
   		///could also insert before item-type-field-container
		
   		var newElement = $("#salesId")[0];
    		newElement.style.marginBottom = "12px";
    		newElement.children[0].innerHTML = "Sales";
    		newElement.children[1].innerHTML = "Loading...";
		
    		var itemContainer = ($("#item-container") && $("#item-container")[0]) || undefined;
    		if (itemContainer != undefined) 
		{
        		var assetType = itemContainer.getAttribute("data-asset-type");
        		var price = itemContainer.getAttribute("data-expected-price");
        		var itemId = itemContainer.getAttribute("data-item-id");
        		getItemSales(itemId, 1, function(val) 
			{
        			var totalRobux = Math.floor(parseInt(val.split(",").join("")) * Math.floor(price * .7));
        	   		if (totalRobux > 0) 
				{
              	 			newElement.children[1].setAttribute("title", "R$" + totalRobux.toLocaleString() + "\nUSD: $" + Math.floor(Math.floor(totalRobux * .35) / 100).toLocaleString());
					newElement.children[1].innerHTML = val.toLocaleString();
           			}
			});
		}
	}
}