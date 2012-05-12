/* jFeed : jQuery feed parser plugin
 * Copyright (C) 2007 Jean-François Hovinne - http://www.hovinne.com/
 * Dual licensed under the MIT (MIT-license.txt)
 * and GPL (GPL-license.txt) licenses.
 */

/* UPDATED by Nokia, Inc.
 * Populates an 'image' property on each feed item (undefined if not available)
 */

function getXHRObject(){
	var xhr = null;
	//call the right constructor for the browser being used
    if (window.ActiveXObject) {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
    } else { 
        if (window.XMLHttpRequest) 
            xhr = new XMLHttpRequest();
        else 
            alert("AJAX request not supported");
    } 
    
    return xhr;
}

jQuery.getFeed = function(options) {

    options = jQuery.extend({
    
        url: null,
        data: null,
        success: null
        
    }, options);

    if(options.url) {
            	
    	//prepare the xmlhttprequest object
    	xhr = getXHRObject();
    	if(xhr) {
	        xhr.open("GET", options.url, true);
	        xhr.setRequestHeader("Cache-Control", "no-cache");
	        xhr.setRequestHeader("Pragma", "no-cache");
	        xhr.onreadystatechange = function(){
	        	//alert(xhr.readyState);
	        	try{
	            if (xhr.readyState == 4) {
	                if (xhr.status == 200) {	                	
	                	var header = xhr.getResponseHeader("Content-Type");
	                	var arr = header.split(';');
	                	if(arr[0] == null || arr[0] == "")
	                		return;
	                	console.log(arr[0]);
	                	if(arr[0].toLowerCase() == "text/xml"){
	    	                if (xhr.responseText != null) { 	    	                	
	    	                	var feed = new JFeed(xhr.responseXML);
	    	                    if(jQuery.isFunction(options.success)) options.success(feed);
	    	                }
	    	                else {
	    	                	console.log("Failed to receive RSS file from the server - file not found.");
	    	                    return false;
	    	                }
	                	}
	                	else{
	                		console.log("Invalid RSS feed!");
	                		return;
	                	}
	                }
	                else {
	                	console.log("Error code " + xhr.status + " received: " + xhr.statusText);
	                }
	            }
	        	} catch(ex){
	        		console.log(ex);
	        	}
	        };
	        
	        //send the request
	        xhr.send(null);
    	}
    }
};

function JFeed(xml) {
    if(xml) this.parse(xml);
};

JFeed.prototype = {

    type: '',
    version: '',
    title: '',
    link: '',
    description: '',
    parse: function(xml) {
        
        if(jQuery('channel', xml).length == 1) {
        
            this.type = 'rss';
            var feedClass = new JRss(xml);

        } else if(jQuery('feed', xml).length == 1) {
        
            this.type = 'atom';
            var feedClass = new JAtom(xml);
        }
        
        if(feedClass) jQuery.extend(this, feedClass);
    }
};

function JFeedItem() {};

JFeedItem.prototype = {

    title: '',
    link: '',
    description: '',
    updated: '',
    id: ''
};

function JAtom(xml) {
    this._parse(xml);
};

JAtom.prototype = {
    
    _parse: function(xml) {
    
        var channel = jQuery('feed', xml).eq(0);

        this.version = '1.0';
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').attr('href');
        this.description = jQuery(channel).find('subtitle:first').text();
        this.language = jQuery(channel).attr('xml:lang');
        this.updated = jQuery(channel).find('updated:first').text();
        
        this.items = new Array();
        
        var feed = this;
        
        jQuery('entry', xml).each( function() {
        
            var item = new JFeedItem();
            console.log("item");
            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).attr('href');
            item.description = jQuery(this).find('content').eq(0).text();
            item.updated = jQuery(this).find('updated').eq(0).text();
            item.id = jQuery(this).find('id').eq(0).text();
			
			/*Nokia code start*/
			var media = jQuery(this).find("link[type='image/gif']," + 
			                              "link[type='image/jpeg']," +
										  "link[type='image/jpg']," + 
										  "link[type='image/png']");
			
			if(media.length > 0){
			  item.image = {width: media.eq(0).attr('width'),
			                height: media.eq(0).attr('height'),
							url : media.eq(0).attr('href')};
			}
            /*Nokia code end*/
			
			feed.items.push(item);
        });
    }
};

function JRss(xml) {
    this._parse(xml);
};

JRss.prototype  = {
    
    _parse: function(xml) {
    
        if(jQuery('rss', xml).length == 0) this.version = '1.0';
        else this.version = jQuery('rss', xml).eq(0).attr('version');

        var channel = jQuery('channel', xml).eq(0);
    
        this.title = jQuery(channel).find('title:first').text();
        this.link = jQuery(channel).find('link:first').text();
        this.description = jQuery(channel).find('description:first').text();
        this.language = jQuery(channel).find('language:first').text();
        this.updated = jQuery(channel).find('lastBuildDate:first').text();
        this.updated = jQuery(channel).find('dc:date').text();        
		/*Nokia code start*/
		if(this.updated === ''){			
			this.updated = jQuery(channel).find('pubDate:first').text();			
			//this.updated = jQuery(channel).find('dc:date:first').text();
		}
        /*Nokia code end*/
        this.items = new Array();
        
        var feed = this;
        
        jQuery('item', xml).each( function() {
        
            var item = new JFeedItem();
            
            item.title = jQuery(this).find('title').eq(0).text();
            item.link = jQuery(this).find('link').eq(0).text();
            item.description = jQuery(this).find('description').eq(0).text();
            item.updated = jQuery(this).find('pubDate').eq(0).text() || jQuery(this).find('date').eq(0).text() || jQuery(this).find('lastBuildDate').eq(0).text();            
            item.id = jQuery(this).find('guid').eq(0).text();			
			/*Nokia code start*/
			var media = jQuery(this).find("media\\:thumbnail[url]");				
			if(media.length == 0){
		      media = jQuery(this).find("media\\:content[url]");
			}
			//Fix for local preview
			if(media.length == 0){ 
			  media = jQuery(this).find("content[url]");
			}
			//end here
			if(media.length == 0){
		      media = jQuery(this).find("enclosure[url]");
			}

			if(media.length > 0 && jQuery.inArray(media.eq(0).attr('type'), ['image/gif', 'image/jpeg', 'image/jpg', 'image/png'])) {
			  	item.image = {
			  		width: media.eq(0).attr('width'),
			  		height: media.eq(0).attr('height'),
			  		url: media.eq(0).attr('url')
			  	};
			}
			/*Nokia code end*/
						
            feed.items.push(item);
        });
    }
};


