var bannedLinks = ["rbxleaks.com", "rbx.place", "rbx.exchange", "rabb.it", "gyazo.us"];
var currentLink = window.location.href.toLowerCase();

console.log("RUNNING");

for (var i = 0; i < bannedLinks.length; i++)
{
	if (currentLink.indexOf(bannedLinks[i]) > -1)
	{
		
		window.location = "https://www.roblox.com/BLOCKED_SITE_FOR_SAFETY";
	}
}