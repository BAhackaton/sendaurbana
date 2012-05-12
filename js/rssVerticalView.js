/**
 * Construct HTML string that will be inserted into the content container.
 * 
 * This goes through the RSS entries and creates a vertical list of RSS
 * entries. Each entry is represented by a picture and title. Clicking on the
 * title unrolls the summary attached to the RSS entry.
 */
var maxEntries;
function getVerticalViewHTML(feed){

	var entryIndex = 0;
    
	var entries = feed.items;

	var outputstr = "";
	outputstr += '<div class="header_contnr"><table cellspacing="0" cellpadding="0" width="100%"><tr><td class="alignC"><img src="img/title_news.png" width="113" height="40" alt="News"/></td><td class="alignR w45"><span onclick="window.location.reload();"><img src="img/reload.png" alt="Reload"/></span></td></tr></table></div>';   
    outputstr += '<div class="pubDate_contnr"><div id="catPubDate" class="pubDate_txt">';
	outputstr += feed.updated;
	outputstr += '</div></div>';
	
	if(entries.length > 0){
    	if(entries.length > 10)
    		maxEntries = 10;
    	else 
    		maxEntries = entries.length;
    }
	
	outputstr +='<div class="content">';
	for (var i = 0; i < entries.length && entryIndex < maxEntries; i++)
	{
		var entryToShow = "entry"+entryIndex;
		outputstr += '<div id="entryn' + i + '" class="entry " onclick="';
		outputstr += 'mwl.setGroupTarget(\'#btns\',\'#btn' + (entryIndex) + '\', \'show\', \'hide\');';
		outputstr += 'mwl.switchClass(\'#views\', \'view1\', \'view2\');';
		outputstr += 'mwl.addClass(\'#entries\', \''+entryToShow+'\');';
		outputstr += 'mwl.scrollTo(\'#views\');';
		outputstr += 'mwl.addClass(\'#entries\', \'hortransition\');';
		outputstr += '">';
		outputstr += '<table cellspacing="0" cellpadding="0">';
		outputstr += '<tr>';
			
		outputstr += "<td valign='top'>";
		outputstr += '<div class="headlinePic">';
		outputstr += "<img width=\"" + ((entries[i].image && entries[i].image.width && parseInt(entries[i].image.width) <= 77)? entries[i].image.width: "75") + 
		             "\" height=\"" + ((entries[i].image && entries[i].image.height && parseInt(entries[i].image.height) <= 75)? entries[i].image.height: "50") + 
					 "\" src=\"" + ((entries[i].image && entries[i].image.url)? entries[i].image.url: "img/rss2.png") + "\"/>";
		outputstr += '</div>';
		outputstr += "</td>";
			
		outputstr += "<td class='valignTp'>";
		outputstr += '<div class="headline">';
		if(window.innerWidth>240){
			if((entries[i].title).length>=25){
	       	 outputstr += (entries[i].title).substring(0,25)+"...";
	       }
	       else {
	       	outputstr += entries[i].title;
	       }
		}
		else{
			if((entries[i].title).length>=13){
		       	 outputstr += (entries[i].title).substring(0,13)+"...";
	       }
	       else {
	       	outputstr += entries[i].title;
	       }
		}
		outputstr += '</div>';
		if (entries[i].updated)
		{
			outputstr += '<div class="pubDate">';
			outputstr += entries[i].updated;
			outputstr += '</div>';
		}
		outputstr += '</td>';
		outputstr += '</tr>';
		outputstr += '</table>';

		outputstr += '</div>'; // end entry
		outputstr += '<div class="greySep"></div>';	
		entryIndex++;
	}
	outputstr +='</div>';//end Content
	return outputstr;
}