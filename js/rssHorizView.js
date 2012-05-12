/**
 * Constructs an HTML string that will be inserted into the content container.
 * 
 * Parses through the RSS entries and creates a "slideshow" representation
 * of the RSS entries. Cycling through stories is done through left/right
 * swipe gestures. The picture (if available), title, and short summary of the
 * article are shown.
 */
/*global variable
 * var maxEntries;
 */ 
var maxEntries = 0;
function getHorizViewHTML(feed){

    var nextImg = '<img src="img/nextArrow.png" width="10" height="23">';
    var prevImg = '<img src="img/prevArrow.png" width="10" height="23">';
    var entryIndex = 0;
    
	var entries = feed.items;

    var outputstr = "";
	outputstr += '<div class="horContainer">';
	outputstr += '<div class="header_contnr"><table cellspacing="0" cellpadding="0" border="0" summary="Header" width="100%"><tr><td class="alignC"><img src="img/title_news.png" width="113" height="40" alt="News" onclick="mwl.switchClass(\'#views\',\'view2\', \'view0\');mwl.removeClass(\'#entries\', \'entry*\');mwl.removeClass(\'#entries\', \'hortransition\');"></td>';
    outputstr += '<td class="alignR w45"><span onclick="mwl.switchClass(\'#views\',\'view2\', \'view1\');mwl.removeClass(\'#entries\', \'entry*\');mwl.removeClass(\'#entries\', \'hortransition\');"><img src="img/back_arrow.png"></span></td></tr></table></div>';
    outputstr += '<div id="btns">';
	
    if(entries.length > 0){
    	if(entries.length > 10)
    		maxEntries = 10;
    	else 
    		maxEntries = entries.length;
    }
    for (var i = 0; i < entries.length && i < maxEntries; i++)
    {
        if (i == 0)
            outputstr += '<div class="show" id="btn' + i + '">';
        else
            outputstr += '<div class="hide" id="btn' + i + '">';
            
        outputstr += '<table cellpadding="0" cellspacing="0" class="navBar">'; 
        outputstr += '<tr>';
        if (i == 0)
        {
            outputstr += '<td class="alignC navBar_sep navBar_dis"><div>'+prevImg+'</div></td>';
            outputstr += '<td class="alignC">';
            outputstr += '<div onclick="mwl.setGroupTarget(\'#btns\',\'#btn1\', \'show\', \'hide\');mwl.switchClass(\'#entries\', \'entry' + i + '\',  \'entry' + (i + 1) + '\');">' + nextImg + '</div>';
            outputstr += '</td>';
        }
        else if ( (i == entries.length - 1) || (i == maxEntries - 1) )
        {
            outputstr += '<td class="alignC navBar_sep">';                    
            outputstr += '<div onclick="mwl.setGroupTarget(\'#btns\',\'#btn' + (i - 1) + '\', \'show\', \'hide\');mwl.switchClass(\'#entries\', \'entry' + i + '\',  \'entry' + (i - 1) + '\');">' + prevImg + '</div>';
            outputstr += '</td>';
            outputstr += '<td class="alignC navBar_dis"><div>'+nextImg+'</div></td>';
        }
        else
        {
            outputstr += '<td class="alignC navBar_sep">';
            outputstr += '<div onclick="mwl.setGroupTarget(\'#btns\',\'#btn' + (i - 1) + '\', \'show\', \'hide\');mwl.switchClass(\'#entries\', \'entry' + i + '\',  \'entry' + (i - 1) + '\');">' + prevImg + '</div>';
            outputstr += '</td>';
            outputstr += '<td class="alignC">';
            outputstr += '<div onclick="mwl.setGroupTarget(\'#btns\',\'#btn' + (i + 1) + '\', \'show\', \'hide\');mwl.switchClass(\'#entries\', \'entry' + i + '\',  \'entry' + (i + 1) + '\');">' + nextImg + '</div>';
            outputstr += '</td>';
        }
        outputstr += '</tr>';
        outputstr += '</table>';
        
        outputstr += '</div>';
                        
    }
    outputstr += '</div>'; // end btns
    outputstr += '  <div class="horstrip" id="entries">'; 
    outputstr += '      <table cellspacing="0" cellpadding="0" border="0">'; 
    outputstr += '      <tr>';
        
    for (var i = 0; i < entries.length && i < maxEntries; i++)
    {
        outputstr += '<td class="valignTp">';
        outputstr += '<div id="entry'+i+'" class="horEntry">';

        outputstr += '<table cellspacing="0" cellpadding="0">';
        outputstr += '<tr>';
        outputstr += '<td class="valignTp">';
        outputstr += '<div class="headlinePic">';
        outputstr += "<img width=\"" + ((entries[i].image && entries[i].image.width && parseInt(entries[i].image.width) <= 75)? entries[i].image.width: "75") + 
		             "\" height=\"" + ((entries[i].image && entries[i].image.height && parseInt(entries[i].image.height) <= 75)? entries[i].image.height: "75") + 
					 "\" src=\"" + ((entries[i].image && entries[i].image.url)? entries[i].image.url: "img/rss2.png") + "\"/>";
        outputstr += '</div>';
        outputstr += "</td>";
                
        outputstr += '<td class="valignTp">';
        outputstr += '<div class="headline">';
        outputstr += entries[i].title;
        outputstr += '</div>';
        outputstr += "</td>";
        outputstr += "</tr>";
        outputstr += '</table>';
        if (entries[i].updated)
        {
            outputstr += '<div class="pubDate">';
            outputstr += entries[i].updated;
            outputstr += '</div>';
        }       
        outputstr += '<div class="headlineDesc" id="headlineDesc'+i+'">';
        outputstr += entries[i].description;
        outputstr += '<p><a style="color:#000000" href="'+entries[i].link+'"><img src="img/readfull.png" /></a></p>';
        outputstr += '</div>'; // end headlineDesc+i
        outputstr += '</div>'; // end entry
        outputstr += '</td>';   
    }

    outputstr += '  </tr>';
    outputstr += '  </table>'; 
    outputstr += '  </div>'; // end entries
    outputstr += '</div>'; // end container
    return outputstr;
}