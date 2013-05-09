 var map;
 var myCenter = new google.maps.LatLng(31.23070, 121.47471);   
function CoordMapType() {
}
CoordMapType.prototype.tileSize = new google.maps.Size(256,256);
CoordMapType.prototype.maxZoom = 11;
CoordMapType.prototype.minZoom = 5;

CoordMapType.prototype.getTile = function(coord, zoom, ownerDocument) {
  var div = ownerDocument.createElement('div');
  div.innerHTML = '<img name="" src="http://219.239.227.116:4040/Map5/' + zoom + '/' + coord.x + '/' + coord.y + '.png"/>';
  //alert(div.innerHTML);
//  div.innerHTML = coord.x + '    ' +  coord.y   + '    ' + zoom;
//  div.innerHTML = coord;
  div.style.width = this.tileSize.width + 'px';
  div.style.height = this.tileSize.height + 'px';
  div.style.fontSize = '10';
  div.style.borderStyle = 'solid';
  div.style.borderWidth = '1px';
  div.style.borderColor = '#AAAAAA';
  return div;
};


CoordMapType.prototype.name = "Tile #s";
CoordMapType.prototype.alt = "Tile Coordinate Map Type";

var coordinateMapType = new CoordMapType();

function initialize() {
	

  var mapOptions = {
    zoom: 10,
    center: myCenter,
    mapTypeControl: false,
	mapTypeId: "coordinate"
  };
  map = new google.maps.Map(document.getElementById("map_canvas"),
      mapOptions);
      
   map.mapTypes.set('coordinate',coordinateMapType);

   onLoad();
}
