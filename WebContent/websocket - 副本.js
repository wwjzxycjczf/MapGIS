//radarlist = "{\"type\":\"stationlist\", \"data\":[{\"RadaID\":\"1\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"0\",\"utc\":\"[B@788315\",\"antenna_rotation_period\":\"44\",\"height\":\"50\",\"lon\":\"-78711.0\",\"lat\":\"3271.0\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"5\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"85\",\"utc\":\"[B@1e5ed7b\",\"antenna_rotation_period\":\"44\",\"height\":\"70\",\"lon\":\"136862.0\",\"lat\":\"-212342.0\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"6\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"3\",\"SAC\":\"-103\",\"sector_num\":\"106\",\"utc\":\"[B@4a4e31\",\"antenna_rotation_period\":\"44\",\"height\":\"80\",\"lon\":\"124043.0\",\"lat\":\"103803.0\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"}, {\"RadaID\":\"7\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"127\",\"utc\":\"[B@538cc2\",\"antenna_rotation_period\":\"44\",\"height\":\"77\",\"lon\":\"-104388.0\",\"lat\":\"204335.0\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"} ]}";
radarlist = "{\"type\":\"stationlist\", \"data\":[{\"RadaID\":\"1\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"0\",\"utc\":\"[B@788315\",\"antenna_rotation_period\":\"44\",\"height\":\"50\",\"lon\":\"121.47471\",\"lat\":\"31.23070\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"5\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"85\",\"utc\":\"[B@1e5ed7b\",\"antenna_rotation_period\":\"44\",\"height\":\"70\",\"lon\":\"121.500\",\"lat\":\"31.230\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"6\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"3\",\"SAC\":\"-103\",\"sector_num\":\"106\",\"utc\":\"[B@4a4e31\",\"antenna_rotation_period\":\"44\",\"height\":\"80\",\"lon\":\"121.700\",\"lat\":\"31.240\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"}, {\"RadaID\":\"7\",\"FSPECA\":\"-3\",\"FSPECB\":\"48\",\"SIC\":\"2\",\"SAC\":\"-103\",\"sector_num\":\"127\",\"utc\":\"[B@538cc2\",\"antenna_rotation_period\":\"44\",\"height\":\"77\",\"lon\":\"121.800\",\"lat\":\"31.23050\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"} ]}";
networkdevicelist="{\"type\":\"netnodelist\", \"data\":[{\"Nodeid\":\"1\",\"Iphostname\":\"192.168.1.166\",\"Ipaddr\":\"192.168.1.166\",\"ISON\":\"true\"} ]}";
var markers=[];
var ndmarkers =[];
//radarlist="sss";
//var Rsign = 2;//1表示radar显示了 2表示隐藏
//var Dsign = 2;//1表示device显示 2表示隐藏
//var deviceflag = true;
//var liindex = 0;
var showallflag = true;
var onshowflag = false;
var slientshowflag = false;
var mistakeshowflag = false;
var downshowflag = false;
var imageArr=["images/onradar.png","images/silentradar.png","images/downradar.png","images/mistakeradar.png"];
function onLoad() {
    Connection();
};


//websocket模块 
var ws;
var SocketCreated = false;
function Log(Text, MessageType) {
    if (MessageType == "OK") Text = "<span style='color: green;'>" + Text + "</span>";
    if (MessageType == "ERROR") Text = "<span style='color: red;'>" + Text + "</span>";
    document.getElementById("eventlist").innerHTML = document.getElementById("eventlist").innerHTML + Text + "<br />";
    var eventlist = document.getElementById("eventlist");
    
    eventlist.scrollTop = eventlist.scrollHeight;
};
function Connection() {
//	radarlist = JSON.parse(radarlist);
//	RShow();
	networkdevicelist = JSON.parse(networkdevicelist);
    if (SocketCreated) {
        SocketCreated = false;
        ws.close();
    } else {
        try {
            if ("WebSocket" in window) {
                ws = new WebSocket("ws://219.239.227.116:5001/websocket");

//                ws = new WebSocket("ws://192.168.2.239:5001/websocket");
            } else if ("MozWebSocket" in window) {
                ws = new MozWebSocket("ws://219.239.227.116:5001/websocket");

//                ws = new MozWebSocket("ws://192.168.2.239:5001/websocket");
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
//    var allbody = document.getElementById('allbody');
//    allbody.addEventListener('mouseover',function(event){
//    	if(event.target.id=="Plate"){
//    		document.getElementById("platepng").style.display = "block";
//    		document.getElementById("Plate").style.display = "none";
//    	}
//    	else if(event.target.id=="platepng"){
//    		document.getElementById("platepng").style.display = "none";
//    		document.getElementById("Plate").style.display = "block";
//    	}
//    });
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
    send("request_station_list");
    send("request_netnode_list");
};
function WSonMessage(event) {
//    Log(event.data);
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
        loadDatas(data,1);
        return;
    }
    if(type == "netnodelist"){
    	loadDatas(data,2);
    }
    if (type == "stationstate") {
        changeRadar(data);
        return;
    }
    if(type=="netnodestate"){
    	changeNetnode(data);
    }
};
function loadDatas(datas,flag) {
	if(flag==1){
		if (stringToJson(radarlist) != datas) {
	    	deleteAllMarkers();
	   // 	deleteAllul();
	        radarlist = datas;
	        RShow();
   //     Addul();
		}    	
    }else if(flag==2){
    	if (stringToJson(netnodelist) != datas) {
	    	deleteAllndMarkers();
	   // 	deleteAllul();
	        netnodelist = datas;
//	        RShow(2);
   //     Addul();
		}  
    }
};
//function deleteAllul(){
//	var ul = document.getElementById("radars");
//	for(var i=ul.childNodes.length-1;i>=0;i--)
//    {
//		ul.removeChild(ul.childNodes[i]);
//    }
//	
//}
//function Addul(){
//	var ul = document.getElementById("radars");
//	for(var i=0;i<radarlist.data.length;i++){
//		var li = document.createElement("li");
//		li.innerHTML = "Radar "+radarlist.data[i].RadaID;
//		ul.appendChild(li);
//	}
//}
function changeNetnode(data){
	var state="";
	if(data.node.ISON=="0"){
		state = "在线";
	}else if(data.node.ISON=="1"){
		state ="离线";
	}
	Log("Nodeid:"+data.node.Nodeid+"   主机状态:"+state);
	var len = netnodelist.data.length;
//	var ul = document.getElementById("radars");
//	ul.childNodes[liindex].style.backgroundColor = "";
	
	
		var inx = 0;
	
		for (inx = 0; inx < len; inx++) {
			if(data.node.Nodeid==netnodelist.data[inx].Nodeid){
				netnodelist.data[inx] = data.node;
//				if(showallflag){
//					var infostr = "RadaID:"+radarlist.data[inx].RadaID+';\n'+"雷达类型:"+radarlist.data[inx].radar_type+";\n"+
//		          	"时间:"+radarlist.data[inx].time+";\n"+"管理员:"+radarlist.data[inx].admin+";\n人数:"+radarlist.data[inx].personnel+";\n经度:"+
//		           	radarlist.data[inx].lon+";\n纬度:"+radarlist.data[inx].lat+";\nis_on:"+
//		           	radarlist.data[inx].is_on+";\nazi:"+radarlist.data[inx].azi+
//		           	";\n高度:"+radarlist.data[inx].height+";\n状态:"+radarlist.data[inx].state+";";
//		
//					var marker = new google.maps.Marker({
//		           		map:map,
//		           		title:infostr,
//		           		position:new google.maps.LatLng(radarlist.data[inx].lat,radarlist.data[inx].lon)
//		           	});
//					markers[inx].setMap(null);
//					markers[inx] = marker;
//					google.maps.event.addListener(markers[inx],'click',RadarClick);
//				}
				break;
			}
		}
	
	if(inx==len){
		
		netnodelist.data.push(data);
		netnodelist.data.length++;
//		if(showallflag){
//			var infostr ="RadaID:"+data.radar.RadaID+';\n'+"雷达类型:"+data.radar.radar_type+";\n"+
//          	"时间:"+data.radar.time+";\n"+"管理员:"+data.radar.admin+";\n人数:"+data.radar.personnel+";\n经度:"+
//          	data.radar.lon+";\n纬度:"+data.radar.lat+";\nis_on:"+
//          	data.radar.is_on+";\nazi:"+data.radar.azi+
//           	";\n高度:"+data.radar.height+";\n状态:"+data.radar.state+";";
//	
//			var marker = new google.maps.Marker({
//	       		map:map,
//	       		title:infostr,
//	       		position:new google.maps.LatLng(data.radar.lat,data.radar.lon)
//	       	});
//			markers.push(marker);
//			google.maps.event.addListener(markers[inx],'click',RadarClick);
//		}
//		var li = document.createElement("li");
//		li.innerHTML = "Radar "+data.RadaID;
//		ul.appendChild(li);
	}else{
	}
};
function changeRadar(data) {
	var state="";
	if(data.radar.state=="1"){
		state = "在线";
	}else if(data.radar.state=="2"){
		state ="静默";
	}else if(data.radar.state=="3"){
		state ="离线";
	}else if(data.radar.state=="4"){
		state ="错误";
	}
	Log("RadaID:"+data.radar.RadaID+"   状态:"+state);
	var len = radarlist.data.length;
//	var ul = document.getElementById("radars");
//	ul.childNodes[liindex].style.backgroundColor = "";
	
	
		var inx = 0;
	
		for (inx = 0; inx < len; inx++) {
			if(data.radar.RadaID==radarlist.data[inx].RadaID){
				radarlist.data[inx] = data.radar;
				if(showallflag==true
					||((showallflag==false)&&((data.radar.state=="1"&&onshowflag)||(data.radar.state=="2"&&silentshowflag)||
						(data.radar.state=="3"&&downshowflag)||(data.radar.state=="4"&&mistakeshowflag)))){
				
					var infostr = "RadaID:"+radarlist.data[inx].RadaID+';\n'+"雷达类型:"+radarlist.data[inx].radar_type+";\n"+
		          	"时间:"+radarlist.data[inx].time+";\n"+"管理员:"+radarlist.data[inx].admin+";\n人数:"+radarlist.data[inx].personnel+";\n经度:"+
		           	radarlist.data[inx].lon+";\n纬度:"+radarlist.data[inx].lat+";\nis_on:"+
		           	radarlist.data[inx].is_on+";\nazi:"+radarlist.data[inx].azi+
		           	";\n高度:"+radarlist.data[inx].height+";\n状态:"+radarlist.data[inx].state+";";
					
					var marker = new google.maps.Marker({
						icon:imageArr[parseInt(radarlist.data[inx].state)-1],
		           		map:map,
		           		title:infostr,
		           		position:new google.maps.LatLng(radarlist.data[inx].lat,radarlist.data[inx].lon)
		           	});
					var ll;
					for(ll = 0;ll<markers.length;ll++){
						if(markers[ll].title.indexOf("RadaID:"+data.radar.RadaID+";")>=0){
							markers[ll].setMap(null);
							markers[ll] = marker;
							google.maps.event.addListener(markers[ll],'click',RadarClick);
									
						}
					}
					if(ll==markers.length){
						markers.push(marker);
						google.maps.event.addListener(markers[markers.length-1],'click',RadarClick);
					}
//					markers[inx].setMap(null);
//					markers[inx] = marker;
//					google.maps.event.addListener(markers[inx],'click',RadarClick);
				}
				break;
			}
				
		
		}
	
	if(inx==len){
		
		radarlist.data.push(data);
		radarlist.data.length++;
		if(showallflag==true
			
		||((showallflag==false)&&((data.radar.state=="1"&&onshowflag)||(data.radar.state=="2"&&silentshowflag)||
				(data.radar.state=="3"&&downshowflag)||(data.radar.state=="4"&&mistakeshowflag)))){
			var infostr ="RadaID:"+data.radar.RadaID+';\n'+"雷达类型:"+data.radar.radar_type+";\n"+
          	"时间:"+data.radar.time+";\n"+"管理员:"+data.radar.admin+";\n人数:"+data.radar.personnel+";\n经度:"+
          	data.radar.lon+";\n纬度:"+data.radar.lat+";\nis_on:"+
          	data.radar.is_on+";\nazi:"+data.radar.azi+
           	";\n高度:"+data.radar.height+";\n状态:"+data.radar.state+";";
			
			var marker = new google.maps.Marker({
				icon:imageArr[parseInt(data.radar.state)-1],
	       		map:map,
	       		title:infostr,
	       		position:new google.maps.LatLng(data.radar.lat,data.radar.lon)
	       	});
			
			markers.push(marker);
			google.maps.event.addListener(markers[markers.length-1],'click',RadarClick);
		}
//		var li = document.createElement("li");
//		li.innerHTML = "Radar "+data.RadaID;
//		ul.appendChild(li);
	}else{
//		if(inx!=0){
//			liindex = inx;
//			ul.childNodes[liindex].style.backgroundColor = "#00ff00";
//		}
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
	
	var i;
	for(i=0;i<sc.length;i++){
		if(sc[i].checked){
			for(var j=0;j<sc.length;j++){
				if(j!=i){
					sc[j].disabled=true;
				}
			}
//			sNum++;
			if(i==0){
				showallflag = true;
				RShow();
				}
			else if(i==1){
				onshowflag=true;
				ROkShow();
			}
			else if(i==2){
				downshowflag = true;
				RDownShow();
			}else if(i==3){
				silentshowflag = true;
				RSilentShow();
			}else if(i==4){
				mistakeshowflag = true;
				RMistakeShow();
			}
			break;
		}
	}
	if(i==sc.length){
		showallflag = false;
		downshowflag = false;
		onshowflag = false;
		silentshowflag = false;
		mistakeshowflag = false;
		deleteAllMarkers();
		for(var i=0;i<sc.length;i++){
			if(sc[i].disabled){sc[i].disabled=false;}
		}
	}
	

};
/*function checkedthis(obj){
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

};*/

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
//	if(showallflag){
	for (var i = 0; i < len; i++) {
       		drawMarker(i);
    }
//	}
};
function ROkShow(){
	var len = radarlist.data.length;
	for(var i=0;i<len;i++){
		if(radarlist.data[i].state=="1"){
			drawMarker(i);
		}
	}
}
function RSilentShow(){
	var len = radarlist.data.length;
	for(var i=0;i<len;i++){
		if(radarlist.data[i].state=="2"){
			drawMarker(i);
		}
	}
}

function RDownShow(){
	var len = radarlist.data.length;
	for(var i=0;i<len;i++){
		if(radarlist.data[i].state=="3"){
			drawMarker(i);
		}
	}
	
}
function RMistakeShow(){
	var len = radarlist.data.length;
	for(var i=0;i<len;i++){
		if(radarlist.data[i].state=="4"){
			drawMarker(i);
		}
	}
}

function drawMarker(i){
	var infostr = "RadaID:"+radarlist.data[i].RadaID+';\n'+"雷达类型:"+radarlist.data[i].radar_type+";\n"+
  	"时间:"+radarlist.data[i].time+";\n"+"管理员:"+radarlist.data[i].admin+";\n人数:"+radarlist.data[i].personnel+";\n经度:"+
   	radarlist.data[i].lon+";\n纬度:"+radarlist.data[i].lat+";\nis_on:"+
   	radarlist.data[i].is_on+";\nazi:"+radarlist.data[i].azi+
   	";\n高度:"+radarlist.data[i].height+";\n状态:"+radarlist.data[i].state+";";
	
	var marker = new google.maps.Marker({
		icon:imageArr[parseInt(radarlist.data[i].state)-1],
   		map:map,
   		title:infostr,
   		position:new google.maps.LatLng(radarlist.data[i].lat,radarlist.data[i].lon)
   	});
	 markers.push(marker);
	google.maps.event.addListener(markers[markers.length-1],'click',RadarClick);
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
     _cell.innerText = "雷达类型:";
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
     _cell.innerText = "时间:";
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
     _cell.innerText = "管理员:";
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
     _cell.innerText = "人数:";
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
     _cell.innerText = "经度:";
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
     _cell.innerText = "纬度:";
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
     _cell.innerText = "is_on:";
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
     _cell.innerText = "azi:";
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
     _cell.innerText = "高度:";
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
     _cell.innerText = "状态:";
     _row.appendChild(_cell);
     _cell = document.createElement("td"); 
     var index = info.indexOf(':');
  	var index1 = info.indexOf(';');
      _cell.innerText = info.substring(index+1,index1);
      info = info.substring(index1+1);
     _row.appendChild(_cell);
     _row = document.createElement("tr");  
     table.appendChild(_row);  
//     _cell = document.createElement("td"); 
//     _cell.innerText = "time:";
//     _row.appendChild(_cell);
//     _cell = document.createElement("td"); 
//     var index = info.indexOf(':');
//  	var index1 = info.indexOf(';');
//      _cell.innerText = info.substring(index+1,index1);
//      info = info.substring(index1+1);
//     _row.appendChild(_cell);
//     _row = document.createElement("tr");  
//     table.appendChild(_row);  
//     _cell = document.createElement("td"); 
//     _cell.innerText = "personnel:";
//     _row.appendChild(_cell);
//     _cell = document.createElement("td"); 
//     var index = info.indexOf(':');
//  	var index1 = info.indexOf(';');
//      _cell.innerText = info.substring(index+1,index1);
//      info = info.substring(index1+1);
//     _row.appendChild(_cell);
//     _row = document.createElement("tr");  
//     table.appendChild(_row);  
//     _cell = document.createElement("td"); 
//     _cell.innerText = "admin:";
//     _row.appendChild(_cell);
//     _cell = document.createElement("td"); 
//     var index = info.indexOf(':');
//  	var index1 = info.indexOf(';');
//      _cell.innerText = info.substring(index+1,index1);
//      info = info.substring(index1+1);
//     _row.appendChild(_cell);
};


function MapType(Type) {
   
    for (var i = 1; i <= 4; i++) {
        if (i == Type) {
            document.getElementById("MapType_" + i).className = "btn_click";
        }
        else {
            document.getElementById("MapType_" + i).className = "btn_unclick";
        }
    }

    switch (Type) {
        case 1: var listdiv = document.getElementById("listdiv");listdiv.style.display = "none"; break; //雷达图
        case 2: Radalist(0);break; //雷达设备图
        case 3: Radalist(1); break; //网络设备混合图
        case 4: break;
    }
};


function Radalist(flag){
	var listdiv = document.getElementById("listdiv");
	listdiv.style.display = "block";
	var table = document.getElementById("table2"); 
	 for(var i=table.rows.length-1;i>=0;i--)
	    {
		 table.deleteRow(i);
	    }
	 var _row;  
	 var _cell; 
	 if(flag==0){
		for(var i=0;i<radarlist.data.length;i++){
			_row = document.createElement("tr"); 
	        table.appendChild(_row);  
	        _cell = document.createElement("td"); 
	        _cell.innerText = "RadaID:"+radarlist.data[i].RadaID+"    雷达类型:"+radarlist.data[i].radar_type+"    时间:"+radarlist.data[i].time
	        +"\n    管理员:"+radarlist.data[i].admin+"    人数:"+radarlist.data[i].personnel
	        +"    经度:"+radarlist.data[i].lon+"\n    纬度:"+radarlist.data[i].lat
	        +"    is_on:"+radarlist.data[i].is_on+"    azi:"+radarlist.data[i].azi+"    高度:"+radarlist.data[i].height
	        +"\n    状态:"+radarlist.data[i].state;
		    _row.appendChild(_cell);
	        _row.onclick = rowClick;
	        _row.onmouseover = rowOver;
	        _row.onmouseout = rowOut;
		}
	 }else if(flag==1){
		 for(var i=0;i<networkdevicelist.data.length;i++){
				_row = document.createElement("tr"); 
		        table.appendChild(_row);  
		        _cell = document.createElement("td"); 
		        _cell.innerText = "RadaID:"+networkdevicelist.data[i].networkID+"    类型:"+networkdevicelist.data[i].Type+"    管理员:"+networkdevicelist.data[i].admin
		        +"\n    IP:"+networkdevicelist.data[i].IP+"    状态:"+networkdevicelist.data[i].status;
			    _row.appendChild(_cell);
		        _row.onclick = rowClick;
		        _row.onmouseover = rowOver;
		        _row.onmouseout = rowOut;
		 
		 }
	 }
//	var listdiv = document.getElementById("listdiv");
	listdiv.scrollTop = listdiv.scrollHeight;
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
	config.innerHTML = "Configuration"+"<br/>"+row.innerHTML;
//	var conf = document.createElement("div");
//	conf.innerHTML = row.innerHTML;
//	config.appendChild(conf);
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




