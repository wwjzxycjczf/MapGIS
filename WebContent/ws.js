//radarlist = "{\"type\":\"stationlist\", \"data\":[{\"RadaID\":\"1\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"0\",\"utc\":\"[B@788315\",\"antenna_rotation_period\":\"44\",\"height\":\"50\",\"lon\":\"-78711.0\",\"lat\":\"3271.0\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"5\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"85\",\"utc\":\"[B@1e5ed7b\",\"antenna_rotation_period\":\"44\",\"height\":\"70\",\"lon\":\"136862.0\",\"lat\":\"-212342.0\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"6\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"3\",\"SAC\":\"-103\",\"sector_num\":\"106\",\"utc\":\"[B@4a4e31\",\"antenna_rotation_period\":\"44\",\"height\":\"80\",\"lon\":\"124043.0\",\"lat\":\"103803.0\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"}, {\"RadaID\":\"7\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"127\",\"utc\":\"[B@538cc2\",\"antenna_rotation_period\":\"44\",\"height\":\"77\",\"lon\":\"-104388.0\",\"lat\":\"204335.0\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"} ]}";
radarlist = "{\"type\":\"stationlist\", \"data\":[{\"RadaID\":\"1\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"0\",\"utc\":\"[B@788315\",\"antenna_rotation_period\":\"44\",\"height\":\"50\",\"lon\":\"121.47471\",\"lat\":\"31.23070\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"5\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"85\",\"utc\":\"[B@1e5ed7b\",\"antenna_rotation_period\":\"44\",\"height\":\"70\",\"lon\":\"121.500\",\"lat\":\"31.230\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"6\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"3\",\"SAC\":\"-103\",\"sector_num\":\"106\",\"utc\":\"[B@4a4e31\",\"antenna_rotation_period\":\"44\",\"height\":\"80\",\"lon\":\"121.700\",\"lat\":\"31.240\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"}, {\"RadaID\":\"7\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"127\",\"utc\":\"[B@538cc2\",\"antenna_rotation_period\":\"44\",\"height\":\"77\",\"lon\":\"121.800\",\"lat\":\"31.23050\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"} ]}";
var markers=[];
//radarlist="sss";
var Rsign = 2;//1表示radar显示了 2表示隐藏
var Dsign = 2;//1表示device显示 2表示隐藏
var deviceflag = true;
var liindex = 0;
var showallflag = true;
var downshowflag = true;
function onLoad() {
	
    Connection();
};


//websocket模块 
var ws;
var SocketCreated = false;
function Log(Text, MessageType) {
};
function Connection() {
//	radarlist = JSON.parse(radarlist);
//	RShow();
    if (SocketCreated) {
        SocketCreated = false;
        ws.close();
    } else {
        try {
            if ("WebSocket" in window) {
                ws = new WebSocket("ws://192.168.2.239:5001/websocket");
            } else if ("MozWebSocket" in window) {
                ws = new MozWebSocket("ws://192.168.2.239:5001/websocket");
            }
            SocketCreated = true;
        } catch (ex) {
            Log(ex, "ERROR");
            return;
        }

        ws.onopen = WSonOpen;
        ws.onmessage = WSonMessage;
        ws.onclose = WSonClose;
        ws.onerror = WSonError;
    }
    var allbody = document.getElementById('allbody');
    allbody.addEventListener('mouseover',function(event){
    	if(event.target.id=="Plate"){
    		document.getElementById("platepng").style.display = "block";
    		document.getElementById("Plate").style.display = "none";
    	}
    	else if(event.target.id=="platepng"){
    		document.getElementById("platepng").style.display = "none";
    		document.getElementById("Plate").style.display = "block";
    	}
    });
};
function send(message) {
    if (!window.WebSocket) { return; }
    if (ws.readyState == ws.OPEN) {
        ws.send(message);
    } else {
        alert("The socket is not open.");
    }
};
function WSonOpen() {
    Log("连接已建立", "OK");
//    send("request_station_list");
};
function WSonMessage(event) {
    Log(event.data);
    var data = event.data;
    if (!data) {
        return;
    }
    data = stringToJson(data);
    if (!data) {
        return;
    }
    var type = data.type;
    if (!type) {
        return;
    }
    if (type == "stationlist") {
        loadDatas(data);
        return;
    }
    if (type == "stationstate") {
        changeRadar(data);
        return;
    }
};
function loadDatas(datas) {
	
    if (stringToJson(radarlist) != datas) {
    	deleteAllMarkers();
    	deleteAllul();
        radarlist = datas;
        RShow();
        Addul();
    }    
};
function deleteAllul(){
	var ul = document.getElementById("radars");
	for(var i=ul.childNodes.length-1;i>=0;i--)
    {
		ul.removeChild(ul.childNodes[i]);
    }
	
}
function Addul(){
	var ul = document.getElementById("radars");
	for(var i=0;i<radarlist.data.length;i++){
		var li = document.createElement("li");
		li.innerHTML = "Radar "+radarlist.data[i].RadaID;
		ul.appendChild(li);
	}
}
function changeRadar(data) {
	
	var len = radarlist.data.length;
	var ul = document.getElementById("radars");
	ul.childNodes[liindex].style.backgroundColor = "";
	
	
		var inx = 0;
	
		for (inx = 0; inx < len; inx++) {
			if(data.radar.RadaID==radarlist.data[inx].RadaID){
				radarlist.data[inx] = data.radar;
				if(downshowflag&&showallflag){
					var infostr = "RadaID:"+radarlist.data[inx].RadaID+';\n'+"FSPECA:"+radarlist.data[inx].FSPECA+";\n"+
		          	"FSPECB:"+radarlist.data[inx].FSPECB+";\n"+"SIC:"+radarlist.data[inx].SIC+";\nSAC:"+radarlist.data[inx].SAC+";\nsector_num:"+
		           	radarlist.data[inx].sector_num+";\nutc:"+radarlist.data[inx].utc+";\nantenna_rotation_period:"+
		           	radarlist.data[inx].antenna_rotation_period+";\nheight:"+radarlist.data[inx].height+
		           	";\nlon:"+radarlist.data[inx].lon+";\nlat:"+radarlist.data[inx].lat+";\ntime:"+radarlist.data[inx].time+
		           	";\npersonnel:"+radarlist.data[inx].personnel+";\nadmin:"+radarlist.data[inx].admin+";";
		
					var marker = new google.maps.Marker({
		           		map:map,
		           		title:infostr,
		           		position:new google.maps.LatLng(radarlist.data[inx].lat,radarlist.data[inx].lon)
		           	});
					markers[inx].setMap(null);
					markers[inx] = marker;
		//       	 markers.push(marker);
					google.maps.event.addListener(markers[inx],'click',RadarClick);
				}
				break;
			}
		}
	
	if(inx==len){
		
		radarlist.data.push(data);
		radarlist.data.length++;
		if(downshowflag&&showallflag){
			var infostr = "RadaID:"+data.RadaID+';\n'+"FSPECA:"+data.FSPECA+";\n"+
	      	"FSPECB:"+data.FSPECB+";\n"+"SIC:"+data.SIC+";\nSAC:"+data.SAC+";\nsector_num:"+
	      	data.sector_num+";\nutc:"+data.utc+";\nantenna_rotation_period:"+
	      	data.antenna_rotation_period+";\nheight:"+data.height+
	       	";\nlon:"+data.lon+";\nlat:"+data.lat+";\ntime:"+data.time+
	       	";\npersonnel:"+data.personnel+";\nadmin:"+data.admin+";";
	
			var marker = new google.maps.Marker({
	       		map:map,
	       		title:infostr,
	       		position:new google.maps.LatLng(data.lat,data.lon)
	       	});
			markers.push(marker);
			google.maps.event.addListener(markers[inx],'click',RadarClick);
		}
		var li = document.createElement("li");
		li.innerHTML = "Radar "+data.RadaID;
		ul.appendChild(li);
	}else{
		if(inx!=0){
			liindex = inx;
			ul.childNodes[liindex].style.backgroundColor = "#00ff00";
		}
	}
};
function jsonToString(json) {
    return JSON.stringify(json);
};
function stringToJson(str) {
    try {
        str = str.replace(/\'/g, "\"");
        return JSON.parse(str);
    } catch (error) {
        Log(error);
    }
};
function WSonClose() {
    //     document.getElementById("ToggleConnection").innerHTML = "连接";

    Log("close", "ERROR");
};
function WSonError() {
    Log("远程连接中断", "ERROR");
};
function deleteAllMarkers() {
	
	for(var i=0;i<markers.length;i++){
		markers[i].setMap(null);
	}
      markers.length = 0;
    
};
function checkedthis(obj){
	var form1 = document.getElementById("form1");
	var sc = form1.SC;
	var sNum=0;
	for(var i=0;i<sc.length;i++){
		if(sc[i].checked){
			sNum++;
			if(i==0){
				showallflag = true;
				RShow();
				}
			else if(i==1){
				downshowflag = true;
				RDownShow();
			}
			break;
		}else{
			if(i==0){
				showallflag = false;
			}
			else if(i==1)
			{	downshowflag = false;
			}
			deleteAllMarkers();
			break;
		}
	}
		if(sNum>=1){
			for(var i=0;i<sc.length;i++){
				if(!sc[i].checked){sc[i].disabled=true;}
			}
		}else{
			for(var i=0;i<sc.length;i++){
				if(sc[i].disabled){sc[i].disabled=false;}
			}
		
	}

};

function checkedthis2(obj){
	var form3 = document.getElementById("form3");
	var scc = form3.SCC;
	var sNum=0;
	for(var i=0;i<scc.length;i++){
		if(scc[i].checked){
			sNum++;
			if(i==0){}
			else if(i==1){
			}
			break;
		}else{
		}
	}


};
function RShow() {
	var len = radarlist.data.length;
	if(downshowflag&&showallflag){
	for (var i = 0; i < len; i++) {
       		drawMarker(i);
    }
	}
};
function drawMarker(i){
	var infostr = "RadaID:"+radarlist.data[i].RadaID+';\n'+"FSPECA:"+radarlist.data[i].FSPECA+";\n"+
  	"FSPECB:"+radarlist.data[i].FSPECB+";\n"+"SIC:"+radarlist.data[i].SIC+";\nSAC:"+radarlist.data[i].SAC+";\nsector_num:"+
   	radarlist.data[i].sector_num+";\nutc:"+radarlist.data[i].utc+";\nantenna_rotation_period:"+
   	radarlist.data[i].antenna_rotation_period+";\nheight:"+radarlist.data[i].height+
   	";\nlon:"+radarlist.data[i].lon+";\nlat:"+radarlist.data[i].lat+";\ntime:"+radarlist.data[i].time+
   	";\npersonnel:"+radarlist.data[i].personnel+";\nadmin:"+radarlist.data[i].admin+";";
	var marker = new google.maps.Marker({
   		map:map,
   		title:infostr,
   		position:new google.maps.LatLng(radarlist.data[i].lat,radarlist.data[i].lon)
   	});
	 markers.push(marker);
	google.maps.event.addListener(markers[i],'click',RadarClick);
}
function RadarClick(event){
	var radaDiv = document.getElementById("radaDiv");
//	radaDiv.innerText = this.title;
	radaDiv.style.display = "block";
	radaDiv.style.cursor = "pointer";
	radaDiv.style.zIndex = 9999;
	
	var table = document.getElementById("_table");
	for(var i=table.rows.length-1;i>=0;i--)
    {
		table.deleteRow(i);
    }
	var _row;  
	var _cell;    	
	_row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "RadaID:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = this.title.indexOf(':');
 	var index1 = this.title.indexOf(';');
 	var info = this.title.substring(index1+1);
     _cell.innerText = this.title.substring(index+1,index1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "FSPECA:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
 	var index1 = info.indexOf(';');
     _cell.innerText = info.substring(index+1,index1);
     info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "FSPECB:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "SIC:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "SAC:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "sector_num:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "utc:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "antenna_rotation_period:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 =info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "height:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "lon:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "lat:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "time:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "personnel:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
     _cell = document.createElement("td"); 
     _cell.innerText = "admin:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
};
function RDownShow(){
	var len = radarlist.data.length;
	for(var i=0;i<len;i++){
		if(radarlist.data[i].status=="down"){
			drawMarker(i);
		}
	}
	
}

function MapType(Type) {
   
    for (var i = 1; i <= 2; i++) {
        if (i == Type) {
            document.getElementById("MapType_" + i).className = "btn_click";
        }
        else {
            document.getElementById("MapType_" + i).className = "btn_unclick";
        }
    }

    switch (Type) {
        case 1: var listdiv = document.getElementById("listdiv");listdiv.style.display = "none"; break; //雷达图
        case 2: Radalist();break; //设备图
        case 3:  break; //混合图
    }
};
function Radalist(){
	var listdiv = document.getElementById("listdiv");
	listdiv.style.display = "block";
	var table = document.getElementById("table2"); 
	 for(var i=table.rows.length-1;i>=0;i--)
	    {
		 table.deleteRow(i);
	    }
	 var _row;  
	 var _cell; 
	for(var i=0;i<radarlist.data.length;i++){
		_row = document.createElement("tr"); 
        table.appendChild(_row);  
        _cell = document.createElement("td"); 
        _cell.innerText = "RadaID:"+radarlist.data[i].RadaID+"    FSPECA:"+radarlist.data[i].FSPECA+"    FSPECB:"+radarlist.data[i].FSPECA
        +"\n    SIC:"+radarlist.data[i].SIC+"    SAC:"+radarlist.data[i].SAC
        +"    sector_num:"+radarlist.data[i].sector_num+"\n    utc:"+radarlist.data[i].utc
        +"    antenna_rotation_period:"+radarlist.data[i].antenna_rotation_period+"    height:"+radarlist.data[i].height
        +"\n    lon:"+radarlist.data[i].lon+"    lat:"+radarlist.data[i].lat+"    time:"+radarlist.data[i].time
        +"\n    personnel:"+radarlist.data[i].personnel+"    admin:"+radarlist.data[i].admin;
//	    _cell.innerText = radarlist.data[i].RadaID;  
	    _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//	    _cell.innerText = radarlist.data[i].FSPECA;  
//	    _row.appendChild(_cell);
//    	_cell = document.createElement("td");  
//	    _cell.innerText = radarlist.data[i].FSPECB;  
//	    _row.appendChild(_cell);
//    	_cell = document.createElement("td");  
//	    _cell.innerText = radarlist.data[i].SIC;  
//	    _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].SAC;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].sector_num;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].utc;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].antenna_rotation_period;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].height;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].lon;  
//        _row.appendChild(_cell);
//	    _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].lat;  
//        _row.appendChild(_cell);  
//        _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].time;  
//        _row.appendChild(_cell);  
//        _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].personnel;  
//        _row.appendChild(_cell);  
//        _cell = document.createElement("td");  
//        _cell.innerText = radarlist.data[i].admin;  
//        _row.appendChild(_cell);  
//        _row.attachEvent("onclick",rowClick);
        _row.onclick = rowClick;
        _row.onmouseover = rowOver;
        _row.onmouseout = rowOut;
	}
}
function rowOver(event){
	var row = event.currentTarget;
	row.bgColor = 'red';
}
function rowOut(event){
	var row = event.currentTarget;
	row.bgColor = '';
}
function rowClick(event){
	var row = event.currentTarget;
	var radacontrolpanel = document.getElementById("radaControlPanel");
	radacontrolpanel.style.display = "block";
	var config = document.getElementById("config");
	var conf = document.createElement("div");
	conf.innerHTML = row.innerHTML;
	config.appendChild(conf);
//	var str = "<h5>Configuration</h5><br/>"+row.innerHTML;
//	var str = "<h5>Configuration</h5><br/>"+"RadaID:"+row.childNodes[0].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+"FSPECA:"+row.childNodes[1].innerText+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+
//  	"FSPECB:"+row.childNodes[2].innerText+"<br/>"+"SIC:"+row.childNodes[3].innerText+"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;SAC:"+row.childNodes[4].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sector_num:'+
//  	row.childNodes[5].innerText+"<br/>utc:"+row.childNodes[6].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;antenna_rotation_period:'+
//  	row.childNodes[7].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;height:'+row.childNodes[8].innerText+
//   	"<br/>lon:"+row.childNodes[9].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lat:'+row.childNodes[10].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;time:'+row.childNodes[11].innerText+
//   	"<br/>personnel:"+row.childNodes[12].innerText+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;admin:'+row.childNodes[13].innerText;
//	config.innerHTML.append(row.innerHTML);
	var form2 = document.getElementById("form2");
	var sc = form2.SS;
	if(row.childNodes[13]=="online"){
		sc[0].checked = true;
	}else if(row.childNodes[13]=="Downline"){
		sc[1].checked = true;
	}else if(row.childNodes[13]=="Slience"){
		sc[2].checked = true;
	}else if(row.childNodes[13]=="Error"){
		sc[4].checked = true;
	}
}

function radarDivclose(event){
	event.parentElement.style.display ="none";
}




