function runCatalog()
{
	document.body.style.backgroundColor = "#4ebeff";
	setTimeout(function() 
	{ 
		$("#search-options")[0].children[0].children[0].style.paddingLeft = "5px"; 
		$("#search-options")[0].children[0].children[0].style.width = "165px";
		$("#search-options")[0].style.backgroundColor = "#DDDDDD";
		//$("#search-options")[0].children[0].children[0].style.paddingRight = "15px"; 
	}, 500);
	//$("#search-options")[0].children[0].children[0].style.marginLeft = "15px";
}

/* Catalog Darkmode
function changeThingColor(elements, color)
{
	for (var i = 0; i < elements.length; i++)
    {
		elements[i].style.color = color;
    }
}
function changeThingBackgroundColor(elements, color)
{
	for (var i = 0; i < elements.length; i++)
    {
		elements[i].style.backgroundColor = color;
    }
}
function darkMode()
{
	document.body.style.backgroundColor = "#303030";
	$("#catalog-content")[0].style.backgroundColor = "#404040";
	$("#search-options")[0].style.backgroundColor = "#404040";
	
	var items = $(".item-card-container");
	changeThingBackgroundColor(items, "#585858");

	var itemNames = $(".item-card-name-link");
	changeThingColor(itemNames, "#00FF00");

	var itemPrices = $(".text-robux");
	changeThingColor(itemPrices, "#FFFFFF");

	var wasRobux = $(".item-card-label");
	changeThingColor(wasRobux, "#FFFFFF");

	var resultText = $(".num-results-line");
	changeThingColor(resultText, "#FFFFFF");

	var categories = $(".menu-link");
	changeThingColor(categories, "#00FDCF");
	//for (var i = 0; i < categories
}

darkMode();
*/