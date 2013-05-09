radarlist = "{\"type\":\"stationlist\", \"data\":[{\"RadaID\":\"1\",\"FSPECA\":\"-3\",\"time\":\"48\",\"admin\":\"2\",\"personnel\":\"-103\",\"lon\":\"0\",\"utc\":\"[B@788315\",\"antenna_rotation_period\":\"44\",\"height\":\"50\",\"lon\":\"121.47471\",\"lat\":\"31.23070\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"5\",\"FSPECA\":\"-3\",\"time\":\"48\",\"admin\":\"2\",\"personnel\":\"-103\",\"lon\":\"85\",\"utc\":\"[B@1e5ed7b\",\"antenna_rotation_period\":\"44\",\"height\":\"70\",\"lon\":\"121.500\",\"lat\":\"31.230\",\"time\":\"-29-7-29\",\"personnel\":\"9\",\"admin\":\"11\"}, {\"RadaID\":\"6\",\"FSPECA\":\"-3\",\"time\":\"48\",\"admin\":\"3\",\"personnel\":\"-103\",\"lon\":\"106\",\"utc\":\"[B@4a4e31\",\"antenna_rotation_period\":\"44\",\"height\":\"80\",\"lon\":\"121.700\",\"lat\":\"31.240\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"}, {\"RadaID\":\"7\",\"FSPECA\":\"-3\",\"time\":\"48\",\"admin\":\"2\",\"personnel\":\"-103\",\"lon\":\"127\",\"utc\":\"[B@538cc2\",\"antenna_rotation_period\":\"44\",\"height\":\"77\",\"lon\":\"121.800\",\"lat\":\"31.23050\",\"time\":\"-29-7-29\",\"personnel\":\"7\",\"admin\":\"11\"} ]}";
var markers=[];
var Rsign = 2;//1表示radar显示了 2表示隐藏
var Dsign = 2;//1表示device显示 2表示隐藏
var deviceflag = true;
var liindex = 0;
var showallflag = true;
var downshowflag = true;
var radarId=0;
var req;
function onLoad() {
//	radarlist = <%=info%>;
//	radarlist = stringToJson(radarlist);
	loadDatas(radarlist);
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
    if (SocketCreated) {
        SocketCreated = false;
        ws.close();
    } else {
        try {
            if ("WebSocket" in window) {
                ws = new WebSocket("ws://192.168.2.239:5001/websocket");//服务器地址及端口
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
//    send("request_station_list");
};
function WSonMessage(event) {
 //   Log(event.data);
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
 //   if (type == "stationlist") {
 //       loadDatas(data);
 //       return;
 //   }
    if (type == "stationstate") {
        changeRadar(data);
        return;
    }
};
function loadDatas(datas) {
	
  //  if (stringToJson(radarlist) != datas) {
    	deleteAllMarkers();
 //   	deleteAllul();
        radarlist = datas;
        RShow();
 //       Addul();
  //  }    
};
/*function deleteAllul(){
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
*/
function changeRadar(data) {
	Log("RadaID:"+data.radar.RadaID);
	var len = radarlist.data.length;
//	var ul = document.getElementById("radars");
//	ul.childNodes[liindex].style.backgroundColor = "";
	
	
		var inx = 0;
	
		for (inx = 0; inx < len; inx++) {
			if(data.radar.RadaID==radarlist.data[inx].RadaID){
				radarlist.data[inx] = data.radar;
				if(downshowflag&&showallflag){
					var infostr = "RadaID:"+radarlist.data[inx].RadaID+';\n'+"radar_type:"+radarlist.data[inx].radar_type+";\n"+
		          	"时间:"+radarlist.data[inx].time+";\n"+"管理员:"+radarlist.data[inx].admin+";\n人数:"+radarlist.data[inx].personnel+";\n经度:"+
		           	radarlist.data[inx].lon+";\n纬度:"+radarlist.data[inx].lat+";\nis_on:"+
		           	radarlist.data[inx].is_on+";\nazi:"+radarlist.data[inx].azi+
		           	";\n高度:"+radarlist.data[inx].height+";\n状态:"+radarlist.data[inx].state+";";
		
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
			var infostr = "RadaID:"+data.radar.RadaID+';\n'+"雷达类型:"+data.radar.radar_type+";\n"+
	      	"时间:"+data.radar.time+";\n"+"管理员:"+data.radar.admin+";\n人数:"+data.radar.personnel+";\n经度:"+
	      	data.radar.lon+";\n纬度:"+data.radar.lat+";\nis_on:"+
	      	data.radar.is_on+";\nazi:"+data.radar.azi+
	       	";\n高度:"+data.radar.height+";\n状态:"+data.radar.state+";";
	
			var marker = new google.maps.Marker({
	       		map:map,
	       		title:infostr,
	       		position:new google.maps.LatLng(data.radar.lat,data.radar.lon)
	       	});
			markers.push(marker);
			google.maps.event.addListener(markers[inx],'click',RadarClick);
		}
	//	var li = document.createElement("li");
	//	li.innerHTML = "Radar "+data.radarID;
	//	ul.appendChild(li);
	}else{
		if(inx!=0){
	//		liindex = inx;
	//		ul.childNodes[liindex].style.backgroundColor = "#00ff00";
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
				downshowflag = true;
				RDownShow();
			}
			break;
	}
}
	if(i==sc.length){
		showallflag = false;
		downshowflag = false;
		deleteAllMarkers();
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
			if(i==0){
				document.all.mc.value =0+";"+radarId;
//				document.getElementById("mc").value = 0+";"+radarId;
		//		form3value=0;
				}
			else if(i==1){
				document.all.mc.value =1+";"+radarId;
		//		document.getElementById("mc").value = 1+";"+radarId;
		//		form3value = 1;
			}else if(i==2){
				document.all.mc.value =2+";"+radarId;
			//	document.getElementById("mc").value = 2+";"+radarId;
//				form3value = 2;
			}
			break;
		}else{
		}
	}


};
function RShow() {
	var len = radarlist.data.length;
	if(showallflag){
	for (var i = 0; i < len; i++) {
       		drawMarker(i);
    }
	}
};
function drawMarker(i){
	var infostr = "RadaID:"+radarlist.data[i].RadaID+';\n'+"radar_type:"+radarlist.data[i].radar_type+";\n"+
  	"时间:"+radarlist.data[i].time+";\n"+"管理员:"+radarlist.data[i].admin+";\n人数:"+radarlist.data[i].personnel+";\n经度:"+
   	radarlist.data[i].lon+";\n纬度:"+radarlist.data[i].lat+";\nis_on:"+
   	radarlist.data[i].is_on+";\nazi:"+radarlist.data[i].azi+
   	";\n高度:"+radarlist.data[i].height+";\n状态:"+radarlist.data[i].state+";";
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
     _cell.innerText = "radar_type:";
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
  	var index1 =info.indexOf(';');
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
  	var index1 = info.indexOf(';');
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
//     _cell.innerText = "管理员:";
//     _row.appendChild(_cell);
//     _cell = document.createElement("td"); 
//     var index = info.indexOf(':');
//  	var index1 = info.indexOf(';');
//      _cell.innerText = info.substring(index+1,index1);
//      info = info.substring(index1+1);
//     _row.appendChild(_cell);
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
        _cell.innerText = "RadaID:"+radarlist.data[i].RadaID+"    radar_type:"+radarlist.data[i].radar_type+"    时间:"+radarlist.data[i].time
        +"\n    管理员:"+radarlist.data[i].admin+"    人数:"+radarlist.data[i].personnel
        +"    经度:"+radarlist.data[i].lon+"\n    纬度:"+radarlist.data[i].lat
        +"    is_on:"+radarlist.data[i].is_on+"    azi:"+radarlist.data[i].azi+"    高度:"+radarlist.data[i].height
        +"\n    状态:"+radarlist.data[i].state;
	    _row.appendChild(_cell);
        _row.onclick = rowClick;
        _row.onmouseover = rowOver;
        _row.onmouseout = rowOut;
	}
	listdiv.scrollTop = listdiv.scrollHeight;
}
function rowOver(event){
	var row = event.currentTarget;
	row.bgColor = 'red';
}
function rowOut(event){
	var row = event.currentTarget;
	row.bgColor = '';
};
function rowClick(event){
	var row = event.currentTarget;
	var radacontrolpanel = document.getElementById("radaControlPanel");
	radacontrolpanel.style.display = "block";
	var config = document.getElementById("config");
	config.innerHTML = "Configuration"+"<br/>"+row.innerHTML;
//	var conf = document.createElement("div");
//	conf.innerHTML = row.innerHTML;
//	var index = row.innerHTML.indexOf("RadaID:")+7;
//	var index1 = row.innerHTML.indexOf(" ");
//	radarId = row.innerHTML.substring(index,index1);
//	config.appendChild(conf);
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
};

function radarDivclose(event){
	event.parentElement.style.display ="none";
};
function oksure(event){
	var info = document.all.mc.value;
//	info = info+"name";
//	document.form3.submit();
	var url = "oksure.do?id="+escape(info);
	if(window.XMLHttpRequest) {  
        //IE7, Firefox, Opera支持  
        req = new XMLHttpRequest();  
    }else if(window.ActiveXObject) {  
        //IE5,IE6支持  
        req = new ActiveXObject("Microsoft.XMLHTTP");  
    }  
	 req.open("GET", url, true);  
	    //onreadystatechange属性存有处理服务器响应的函数,有5个取值分别代表不同状态  
	    req.onreadystatechange = callback;  
	    //send函数发送请求  
	    req.send(null);  
//	document.getElementById("form3").submit();
	
//	String information = request.getParameter("info");
//	if(information!=null){
//	String ctl = information.substring(0,information.indexOf(";"));
//	MapGISService1Stub.ConfigureSensorByID conf = new MapGISService1Stub.ConfigureSensorByID();
//	conf.setCtl(ctl);
//	conf.setId(Integer.parseInt(information.substring(information.indexOf(";")+1)));
//	conf.setFlag(0);
//	boolean	 flag=rstub1.ConfigureSensorByID(conf).get_return();
//	System.out.println(flag);
	//}
	
	
	form3.SCC[0].checked = true;
	event.parentElement.parentElement.parentElement.style.display = "none";
}
function callback() {  
    if(req.readyState == 4 && req.status == 200) {  
        var check = req.responseText;  
        if(check == "OK") {  
            var show = "<font color='green'>配置成功！</font>";  
            document.all.mc.value = show;  
        }  
        else if( check == "NO") {  
            var show = "<font color='red'>配置失败！</font>";  
            document.all.mc.value = show;  
        }  
      
    }  
}  
function cancel(event){
	event.parentElement.parentElement.parentElement.style.display = "none";
}