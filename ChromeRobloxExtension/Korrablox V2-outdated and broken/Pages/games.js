var gameStoreOpened = false;

function runGamesPage()
{
	
}

var beforeTax = 0;
var totalRevenue = 0;

function doGamepassThing(idHolder, price, priceElement)
{
	getItemSalesGamepass(idHolder, 0, function(sales)
	{
		sales = sales.split(",").join("");
		var itemSales = parseInt(sales);
		beforeTax = beforeTax + (itemSales * price);
		var taxedPrice = Math.floor(price * .7);
		totalRevenue = totalRevenue + (taxedPrice * itemSales);
		priceElement.setAttribute("title", "Sales: " + sales.toLocaleString() + "\nAfter tax: R$" + (taxedPrice * itemSales).toLocaleString());
		//console.log("Price: " + price + "\nTaxed Price: " + taxedPrice + "\nSales: " + sales + "\nRevenue: " + (taxedPrice * sales));
	});
}

function runGamePage()
{
	//var beforeTax = 0;
	//var totalRevenue = 0;
	$("#tab-store")[0].addEventListener("click", function()
	{
		if (gameStoreOpened == true) { return; }
		gameStoreOpened = true;

		delay(500, function()
		{
			var gamepasses = $(".real-game-pass");
			for (var i = 0; i < gamepasses.length; i++)
			{
				var idHolder = gamepasses[i].children[0].children[0].href;
				idHolder = idHolder.substring(idHolder.indexOf("ss/") + 3);
				idHolder = idHolder.substring(0, idHolder.indexOf("/"));
				
				var price = gamepasses[i].children[0].children[1].children[1].children[1].innerHTML;
				var priceElement = gamepasses[i].children[0].children[1].children[1].children[1];
				
				doGamepassThing(idHolder, price, priceElement);
			}
			delay(400 * gamepasses.length, function() 
			{ 
				console.log("Earnings before tax: " + beforeTax + "\nRevenue after tax: " + totalRevenue);
				var mainDiv = document.createElement("DIV");
				mainDiv.setAttribute("class", "game-revenue");
				
				var span = document.createElement("SPAN");
				span.setAttribute("class", "text-label");
				span.innerHTML = "Revenue: ";
				mainDiv.appendChild(span);
				
				var robuxIcon = document.createElement("SPAN");
				robuxIcon.setAttribute("class", "icon-robux-16x16");
				mainDiv.appendChild(robuxIcon);
				
				var robuxText = document.createElement("SPAN");
				robuxText.setAttribute("class", "text-robux");
				robuxText.setAttribute("title", "Revenue before tax: " + beforeTax.toLocaleString() + "\nUSD: $" + (Math.floor(totalRevenue * .35) / 100).toLocaleString());
				robuxText.innerHTML = totalRevenue.toLocaleString();
				mainDiv.appendChild(robuxText);
				
				$(".game-title-container")[0].appendChild(mainDiv);
			});
		});
	});
	if (window.location.href.indexOf("#!/store") > -1) ///store already open
	{
		$("#tab-store")[0].click();
	}
}