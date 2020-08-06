var currentText = "";
if (window.location.href != "https://www.roblox.com/My/Money.aspx#/#TradeItems_tab")
{
	throw new Error("not the trade page");
}

function addStuffToButtons(startAt)
{
	if (startAt == undefined) { startAt = 0; }
	var buttons = $(".ViewTradeLink");
	for (var i = startAt; i < buttons.length; i++)
    {
		buttons[i].onclick = function()
		{
			setTimeout(function()
			{
				var offerTotal = 0;
				var receiveTotal = 0;
				
				var items = $(".InventoryItemContainerInner");
				var waiting = false;
				var i = 0;
				console.log(items.length);
				var aa = setInterval(function()
				{
					if (waiting == false)
					{
						waiting = true;
						var itemLink = $(".InventoryItemLink")[i + 1].getAttribute("href");
						itemLink = itemLink.substr(itemLink.indexOf("catalog/") + 8);
						itemLink = itemLink.substr(0, itemLink.indexOf("/"));
						getRocksValue(itemLink, function(val)
						{
							waiting = false;
							i++;
							var lis = items[i].parentNode.parentNode.parentNode.parentNode.getAttribute("list-id");
							if (parseInt(val) == undefined || (val + "").charAt(0) == "N")
							{
								$(".InventoryItemOriginalPrice")[i].innerHTML = val;
								if (lis == "OfferList0")
								{
									//offerTotal = offerTotal + parseInt($(".InventoryItemAveragePrice")[i - 1].innerHTML);
								}
								else
								{
									//receiveTotal = receiveTotal +  + parseInt($(".InventoryItemAveragePrice")[i - 1].innerHTML);
								}
							}
							else if (parseInt(val) != undefined)
							{
								console.log("Value: " + val);
								console.log(val == "NaN");
								$(".InventoryItemOriginalPrice")[i].innerHTML = val;
								if (lis == "OfferList0")
								{
									offerTotal = offerTotal + val;
								}
								else
								{
									receiveTotal = receiveTotal + val;
								}
							}
							$(".InventoryItemOriginalPrice")[i].parentNode.children[0].innerHTML = "Value: ";
							if (i == items.length - 1) 
							{
								console.log("Offer total: " + offerTotal + ", Receive total: " + receiveTotal); 
								var thingOne = items[1].parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[1];
								var thingTwo = items[i].parentNode.parentNode.parentNode.parentNode.children[0].children[1].children[1];
								//console.log(li);
								//var offset = 0;
								//if ($(".OfferContainer").length > 2) { offset++; }
								//var thingOne = $(".OfferContainer")[0 + offset].children[0].children[1].children[1].children[1];
								//var thingTwo = $(".OfferContainer")[1 + offset].children[0].children[1].children[1].children[1];
								thingOne.innerHTML = offerTotal.toLocaleString();
								thingTwo.innerHTML = receiveTotal.toLocaleString();
								window.clearInterval(aa); 
								clearInterval(aa);
							}
						});
					}
				}, 100);
			}, 500);
		}
    }
	
	$(".btn-control")[0].onclick = function()
	{
		setTimeout(function() { addStuffToButtons(buttons.length); }, 100);
	}
}

function runTradePage()
{
	setInterval(function()
	{
		var currentVal = $("#TradeItems_TradeType :selected").text();
		if (currentVal != currentText)
		{
			currentText = currentVal;
			addStuffToButtons();
		}
	}, 750);
}
