// Examples of use: get url for use in IMG tag
//  -> all supported values entered
/*	new OviMap({
        server : "http://m.ovi.me/",
        setMap({ coords : { latitude : "61.4988", longitude : "23.7637" }}); 
        zoom : 12, 
        radius : { value : 0, unit : "" }, 
        uncertainty : { value : 0, unit : "" }, 
        maptype : defs.types.grey, 
        size : { width : 240, height : 320 }, 
        overlays : { scale : false, dot : true },
        language : defs.languages.eng
    }).getUrl()


// Other examples of use: get formatted url for use in CSS
//  -> only the essential values entered
    new OviMap({
        center : { lat : "61.4988", lon : "23.7637" }, 
        zoom : 12, 
        size : { width : 240, height : 320 } 
    }).getCSSUrl()
*/

// Predefined values (optional)
var defs = {
	
	// Supported map types
    types : {
        normal : 0,
        satellite : 1,
        terrain : 2,
        hybrid : 3,
        transit : 4,
        grey : 5
    },	
	
	// Supported languages
    languages : {
        eng : "eng",
        chi : "chi",
        ger : "ger",
        fre : "fre",
        ita : "ita",
        spa : "spa",
        rus : "rus"
    }
};

// OviMap class constructor
function OviMap(jsonData) {
    this.jsonData = jsonData ? jsonData : {};
}

// Returns Ovi Map url
OviMap.prototype.getUrl = function () {
    
    var jsonData = this.jsonData;
    var url = "";
    
    // Set server (use default if not defined)
    url += jsonData.server ? jsonData.server : "http://m.ovi.me/";
    
	// Force the service to provide mobile maps
	url+= "?nord";
    
    // Set center coordinates
    if (jsonData.center && jsonData.center.lat && jsonData.center.lon) {
        url += "&c=" 
            + jsonData.center.lat 
            + "," 
            + jsonData.center.lon;
    }
    
    // Set radius of the visible area
    if(jsonData.radius && jsonData.radius.value && jsonData.radius.value != 0) {
        url += "&r="
            + jsonData.radius.value
            // Use unit if available
            + (jsonData.radius.unit ? jsonData.radius.unit : "");
    } else {
        // Zoom (ignored if radius is defined)
        if(jsonData.zoom) {
            url += "&z="
            + ((jsonData.zoom <= 20 && jsonData.zoom > 0) ? jsonData.zoom : 15);
        }
    }
    
    // Set uncertainty value
    if(jsonData.uncertainty && jsonData.uncertainty.value && jsonData.uncertainty.value != 0) {
        url += "&u="
            + jsonData.uncertainty.value 
            // Use unit if available
            + (jsonData.uncertainty.unit ? jsonData.uncertainty.unit : "");
    }
    
    // Set maptype
    if(jsonData.maptype) {
        url += "&t="
            + jsonData.maptype;
    }
    
    // Set width
    if(jsonData.size && jsonData.size.width) {
        url += "&w="
            + jsonData.size.width;
    }

    // Set height
    if(jsonData.size && jsonData.size.height) {
        url += "&h="
            + jsonData.size.height;
    }

    // Set language
    if(jsonData.language) {
        url += "&ml="
            + jsonData.language;
    }
    
    // Set overlay-options
    if(jsonData.overlays) {
        
        // Set scalebar
        if(jsonData.overlays.scale) {
            url += "&sb=km,mk";
        }
        
        // Set the visibility of the pointer dot
        if(!jsonData.overlays.dot) {
            url += "&nodot";
        }		
    }
    
	// Return formatted map url
    return url;
}

// Returns Ovi Map url for use in CSS (adds "url" and brackets)
OviMap.prototype.getCSSUrl = function () {
	
	// Uses getUrl function as the core, just adds formatting
    return 'url("' + this.getUrl() + '")';	
}
