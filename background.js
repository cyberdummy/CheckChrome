function onClickHandler(info, tab) {
	chrome.tabs.getSelected(null, function(tab)
	{
		var state = 1;

		if (info.menuItemId == 'checkchrome-on')
			state = 2;
		else if (info.menuItemId == 'checkchrome-inverse')
			state = 3;

		chrome.tabs.sendMessage(tab.id, {check_to: state}, function(response) {
		console.log(response.farewell);
	});});
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
function checkChrome_init () {
	// Create one test item for each context type.
  var contexts = ["selection"];

  var on_id = chrome.contextMenus.create({"title": "Check", "contexts":["selection"], "id": "checkchrome-on"});
  console.log("check on : " + on_id);

  var off_id = chrome.contextMenus.create({"title": "UnCheck", "contexts":["selection"], "id": "checkchrome-off"});
  console.log("check off : " + off_id);

  var inverse_id = chrome.contextMenus.create({"title": "Inverse", "contexts":["selection"], "id": "checkchrome-inverse"});
  console.log("check inverse : " + inverse_id);
}

chrome.runtime.onStartup.addListener(checkChrome_init());
//chrome.runtime.onInstalled.addListener(checkChrome_init());
