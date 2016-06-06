$(document).ready(function() {
	chrome.extension.sendMessage({name: "getInfo"}, function(info) {
		console.log(info);
		if (info == undefined) {return;}
		var isCanShow = info.isCanShow;
		if (isCanShow == true) {
			var ip = info.detail.ip;
			var headerObj = {};
			var headerArray = info.detail.responseHeaders;
			for(var i = 0,len = headerArray.length;i < len;i++){
				headerObj[headerArray[i].name] = headerArray[i].value;
			}
			// console.log(headerObj);
			var t = "";
			t += "<table>";
			t += "<tr>";
			if( headerObj.pipe_log_timestamp != undefined ) {
				t += "<td>" + headerObj.pipe_log_timestamp +  "</td>";
			}
			t += "<td>" + ip +"</tr>";
			if(headerObj.pipe_front_times != undefined){
				t += "<tr><td>" + info.detail.url + "</td><td>" + headerObj.pipe_front_times +" ms</tr>";
			}	
			if(headerObj.pipe_back_times != undefined){
				var backTimes = eval('(' + headerObj.pipe_back_times +')');
				var backTimesArray =[];
				for(var key in backTimes){
					backTimesArray.push({"key":key,"time":backTimes[key]});	
				}
				backTimesArray.sort(backTimesSortOrder);
				for(var i = 0,len = backTimesArray.length;i<len;i++){
					t += "<tr><td>" + backTimesArray[i].key + "</td><td>";
					if (backTimesArray[i].time < 0) {
						if (backTimesArray[i].time == -1) {
							t += "异常</tr>";	
						} else if(backTimesArray[i].time == -2){
							t += "5s超时</tr>";
						}
					} else {
						t += backTimesArray[i].time +" ms</tr>";
					}
				}
			}
			t += "</table>";
			$("body").append('<div id="pipe_show" class="pipe_show_right">' + t + '</div>');
		} else {
			// $("body").append('<div id="pipe_show" class="pipe_show_right">wrong</div>');
		}
	});
		
	
	$("#pipe_show").live('mouseover', function() {
		if ($(this).hasClass('pipe_show_right')) {
			$(this).removeClass("pipe_show_right");
			$(this).addClass("pipe_show_left");
		}
		else {
			$(this).removeClass("pipe_show_left");
			$(this).addClass("pipe_show_right");
		}
	});
	

});

function backTimesSortOrder(o1,o2) {
	return o2.time - o1.time;
}


// popup button clicked
document.addEventListener('DOMContentLoaded', function () {
	chrome.extension.sendMessage({name: "getOptions"}, function(response) {
		if(response.isCanShow == false){
			$("#isCanShow").val('Enable');	
		} else {
			$("#isCanShow").val('Disable');	
		}
		
	});
	
	document.querySelector('input').addEventListener('click', function() {
		if ($('#isCanShow').val() == "Disable") {
			chrome.extension.sendMessage({name: "setOptions", isCanShow:true}, function(response) {
				console.log(response.isCanShow);
			});
			$('#isCanShow').val('Enable')	
		}
		else if ($('#isCanShow').val() == "Enable") {
			chrome.extension.sendMessage({name: "setOptions", isCanShow:false}, function(response) {
				console.log(response.isCanShow);
			});
			$('#isCanShow').val('Disable')
		}
	});
});
