/**
 * Use xmlhttpreq to get the raw rss xml
 */
function getRSS(vid, hid, url){

	jQuery.getFeed({
	  url: url,
	  success: function processRSS(feed,data){
        jQuery('#' + vid).html(getVerticalViewHTML(feed));
		jQuery('#' + hid).html(getHorizViewHTML(feed));
				
		var scriptNode = document.createElement('SCRIPT');
		var text = "";
		for(i = 1; i < maxEntries; i++){
			text = text + "mwl.addSwipeLeftListener('#entry" + (i - 1) + "', \"mwl.setGroupTarget('#btns','#btn" + i + "', 'show', 'hide');mwl.switchClass('#entries', 'entry"+(i-1)+"','entry"+i+"')\");";
		}
		
		for(i = (maxEntries - 1); i >= 1; i--){
			text = text + "mwl.addSwipeRightListener('#entry"+i+"', \"mwl.setGroupTarget('#btns','#btn"+(i-1)+"', 'show', 'hide');mwl.switchClass('#entries', 'entry"+i+"','entry"+(i-1)+"')\");";
		}
						
		var scriptText = document.createTextNode(text);
		scriptNode.appendChild(scriptText);
		
		var bodyNode = document.getElementsByTagName('body')[0];
	    bodyNode.appendChild(scriptNode);
	  } 
	});  
}