$(function(){
	$(".page").height($(document.body).height());
	$(".endClose").hide();
	
	function getShare(){
		$.ajax({
			type:"post",
			url:GLOBAL.path+"xuehua/getShare",
			async:true,
			dataType:"json",
			data:{"activity_id":GLOBAL.activityId},
			success:function(res){
				if(res){
					console.log(res);
				}
			},
			error:function(res){
				if(res){
					console.log(res);
				}
			},
			complete:function(res){
				if(res){
					console.log(res);
					if(res.responseJSON){
						var shareObj = res.responseJSON;
						console.log(shareObj);
						GLOBAL.FinalShareTitle = shareObj.title;
						GLOBAL.FinalShareLink = shareObj.link;
						GLOBAL.FinalShareImgUrl = shareObj.img_url;
						GLOBAL.FinalShareDesc = shareObj.desc;
						GLOBAL.FinalShareType = shareObj.type;
						GLOBAL.FinalShareDateUrl = shareObj.date_url;
					}
					else{
						GLOBAL.FinalShareTitle = GLOBAL.activity.activity_name;
						GLOBAL.FinalShareLink = GLOBAL.shareUrl;
						GLOBAL.FinalShareImgUrl = GLOBAL.activity.img_url;
						GLOBAL.FinalShareDesc = GLOBAL.activity.act_wish;
					}
				}
				console.log("GLOBAL.FinalShareTitle:"+GLOBAL.FinalShareTitle);
				console.log("GLOBAL.FinalShareLink:"+GLOBAL.FinalShareLink);
				console.log("GLOBAL.FinalShareImgUrl:"+GLOBAL.FinalShareImgUrl);
				console.log("GLOBAL.FinalShareDesc:"+GLOBAL.FinalShareDesc);
				console.log("GLOBAL.FinalShareType:"+GLOBAL.FinalShareType);
				console.log("GLOBAL.FinalShareDateUrl:"+GLOBAL.FinalShareDateUrl);
			}
		});
	}
	
   	//截取URL,获取activityid
	 function getAId(str1,str2)  
    {  
    	console.log(str1);
    	var length = str2.length;
    	var result = "";
        var iStart = str1.indexOf(str2);//获取你该参数名称的起始索引
      	iStart += length;
   		var iEnd = str1.indexOf("?");
   		if(iEnd == -1){
   			var iEnd = str1.length;
   		}
   		result = str1.substring(iStart,iEnd);
      	return result;
    }
   		var totalUrl = document.location.href;
   		GLOBAL.activityId = getAId(totalUrl,"index_");
   		GLOBAL.activityId = parseInt(GLOBAL.activityId);
   		console.log(GLOBAL.activityId);
   		
   		
   		//userInfo
function UserInfo(){
	var ajaxUserInfo = $.ajax({
		type:"get",
		url:GLOBAL.path+"xuehua/userInfo",
		async:false,
		dataType:'json',
		timeout:5000,
		success:function(res){
			if(res){
				console.log(JSON.stringify(res));
				if(res.statusCode != 200){
					//无用户，跳转到404页面
					location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
				}
				else{
					GLOBAL.user = res.data;
					console.log(GLOBAL.user );
				}
			}
			else{
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		},
		error:function(res){
			if(res){
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status == 'timeout'){
				ajaxUserInfo.abort();
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		}
	});
}


//ActInfo
function ActInfo(){
	var ajaxActInfo = $.ajax({
		type:"post",
		url:GLOBAL.path+"xuehua/actInfo",
		async:false,
		timeout:5000,
		dataType:'json',
		data:{"activity_id":GLOBAL.activityId},
		success:function(res){
			if(res){
				console.log(JSON.stringify(res));
				if(res.statusCode != 200){
					//无用户，跳转到404页面
					location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
				}
				else{
					GLOBAL.activity = res.data;
					console.log(GLOBAL.activity);
					document.title = GLOBAL.activity.activity_name;
					//设置封面
				   	$("#page1").css("background-image","url("+GLOBAL.activity.img_url+")");
				   	$("#page1").css("background-size","100% 100%");
				   	if(!GLOBAL.activity.subscribe){
				   		$("#p1_bottom").hide();
				   		$("#saoImg").hide();
				   		$("#clickForReward").show();
				   	}
				   	else{
			   			if(GLOBAL.activity.scan){
							////扫码'
							//隐藏输码组件,显示扫码按钮
							$("#p1_bottom").hide();
							$("#clickForReward").hide();
							$("#saoImg").show();
						}
					   	else{
					   		$("#p1_bottom").show();
							$("#saoImg").hide();
							$("#clickForReward").hide();
					   	}
				   	}
				}
			}
			else{
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		},
		error:function(res){
			if(res){
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		},
		complete:function(XMLHttpRequest,status){
			if(status == 'timeout'){
				ajaxActInfo.abort();
				location.href = "http://wx.sxjzcm.cn/mobile/404/index.html";
			}
		}
		
	});
}
function shareUrl(appid,host){
	var retUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=';
	var Enco = '';
	if(host.indexOf("http://") == -1){
		Enco = encodeURIComponent("http://"+host) + 'redirect%2Fxuehua_index_'+GLOBAL.activityId;
	}
	else{
		Enco = encodeURIComponent(host) + 'redirect%2Fxuehua_index_'+ GLOBAL.activityId;
	}
	console.log(Enco);
	retUrl = retUrl + Enco + '&response_type=code&scope=snsapi_userinfo&state=123&component_appid=wx6d109d7957e0da41&connect_redirect=1#wechat_redirect';
	console.log(retUrl);
	return retUrl;
}
//获取二维码扫描返回的兑换码
	function getCode(str){  
    	if(str){
    		console.log(str);
	    	var result = "";
	    	var iStart = "";
	    	var iEnd = str.length;
	    	if(str.lastIndexOf('/')!=-1){
	    		iStart = str.lastIndexOf('/') + 1;
	    		result = str.substring(iStart,iEnd);
	    	}
	      	return result;
    	}
    }

	function ifRightActivity(str){
		if(str){
			console.log(str);
			var iEnd = "";
			var result = "";
			var iStart = "";
			if(str.lastIndexOf('/')!=-1){
	    		iEnd = str.lastIndexOf('/');
	    		result = str.substring(0,iEnd);
	    		console.log(result);
	    		if(result.lastIndexOf('/')!=-1){
	    			iStart = result.lastIndexOf('/') + 1;
	    			iEnd = result.length;
	    			result = str.substring(iStart,iEnd);
	    			console.log(result);
	    			if(result == GLOBAL.activityId){
	    				return true;
	    			}
	    			else{
	    				return false;
	    			}
	    		}
	    	}
		}
	}
	
	

   	//执行获取地理位置
   	function getPosition(){
   		var geolocation = new BMap.Geolocation();
		geolocation.getCurrentPosition(function(r){
			if(this.getStatus() == BMAP_STATUS_SUCCESS){
//				var mk = new BMap.Marker(r.point);
//				map.addOverlay(mk);
//				map.panTo(r.point);
				console.log('您的位置：'+r.point.lng+','+r.point.lat);
				GLOBAL.lat = r.point.lat;
				GLOBAL.lng = r.point.lng;
//				alert('您的位置：'+r.point.lng+','+r.point.lat);
			}
			else {
				alert('failed'+this.getStatus());
			}        
		},{enableHighAccuracy: true})
   	}
   	
   	function getParameter() {
                var args = new Object();
                var query = location.search.substring(1); //获取查询串   
                var pairs = query.split("&"); //在逗号处断开   
                for (var i = 0; i < pairs.length; i++) {
                    var pos = pairs[i].indexOf('='); //查找name=value   
                    if (pos == -1) continue; //如果没有找到就跳过   
                    var argname = pairs[i].substring(0, pos); //提取name   
                    var value = pairs[i].substring(pos + 1); //提取value   
                    args[argname] = unescape(value); //存为属性   
                }
                return args;
            }
   	
   	
   	
   	
   	//获取地理位置
   	getPosition();
   	//用户请求
     	UserInfo();
   	//活动请求
   		ActInfo();
   		$("#saoImg").click(function(){
			wx.scanQRCode({
			    needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
			    scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
			    success: function (res){
			    	if(res){
//			    		if(ifRightActivity(res.resultStr) == true){
//			    			GLOBAL.keywords = getCode(res.resultStr);
//				    		if(GLOBAL.keywords && GLOBAL.keywords!=""){
//								console.log(GLOBAL.keywords);
//				    			checkCode();
//				    		}
//				    		else{
//				    			swal("提示","请重新扫码！","error");
//				    		}
//			    		}
//			    		else{
//			    			swal("提示","不是同一次活动!","error");
//			    		}
						GLOBAL.keywords = getCode(res.resultStr);
						if(GLOBAL.keywords && GLOBAL.keywords!=""){
							console.log(GLOBAL.keywords);
			    			checkCode();
			    		}
			    		else{
			    			swal("提示","请重新扫码！","error");
			    		}
			    	}
			    	else{
			    		swal("提示","请重新扫码！","error");
			    	}
			    }
			});				
		});

	$(".pageCommit").click(function(){
		//没进可以一直点，进了就阻止
//			if(!GLOBAL.into){
				GLOBAL.keywords = $("#inputCode").val();
				GLOBAL.keywords = $.trim(GLOBAL.keywords);
				console.log(GLOBAL.keywords);
				if(GLOBAL.keywords && GLOBAL.keywords!=""){
					checkCode();
				}
				else{
					swal("提示","兑奖码不能为空！","error");
				}
//			}
	});
	
	$("#clickForReward").click(function(){
		var ret = getParameter();
		if(ret){
			if(ret.keyword){
				GLOBAL.keywords = ret.keyword;
				checkCode();
			}
			else{
				swal("提示","获取keywords出错，请重进页面","error");
			}
		}
		else{
			swal("提示","网页加载出错，请刷新页面","error");
		}
	});
	GLOBAL.shareUrl = shareUrl(GLOBAL.user.authorizer_appid,GLOBAL.path);
	
	$(".endClose").hide();
	$("#viewReward").click(function(){
		$(".endopacity").fadeIn();
		$(".endwindows").fadeIn();
		$(".endClose").fadeIn();
		lookMyRewards(GLOBAL.activityId,GLOBAL.keywords,GLOBAL.user.openid);
	});
	$(".endClose").click(function(){
		$(".endopacity").fadeOut();
		$(".endwindows").fadeOut();
		$(".endClose").fadeOut();
	});
    		
	$(".listContainer").on('click','.endGet',function(){
 		var myRecordId = $(this).parent().has(this).attr('id');
 		console.log(myRecordId);
 		for(var i = 0;i < GLOBAL.GLOBAL.endPageRewardList.length;i++){
 			if(GLOBAL.GLOBAL.endPageRewardList[i].record_id == myRecordId){
 				if(GLOBAL.GLOBAL.endPageRewardList[i].reward && GLOBAL.GLOBAL.endPageRewardList[i].reward!= "none"){
 					var rewardType = JSON.parse(GLOBAL.GLOBAL.endPageRewardList[i].reward);
 					if(rewardType.type != "card"){
 						endHaveOther(myRecordId);
 					}
 					else{
 						endHaveCard(rewardType.cardid,myRecordId);
 					}
 				}
 				break;
 			}
 		}
	});
	
	getShare();
	
	var re = location.href.split('#')[0];
	var ts,ns,sg;
	//re = encodeURIComponent(re);
	$.ajax({
			type:"post",
			async:false,
			url:GLOBAL.path+"config",
			data:{
				'appid':GLOBAL.user.authorizer_appid,
				'url':re
			},
			dataType: "json",
			success:function(data){
				if(data != null){
					ts = data.timestamp;
					ns = data.nonceStr;
					sg = data.signature;
				}
			}
		});
		
	wx.config({
	    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
	    appId: GLOBAL.user.authorizer_appid, // 必填，公众号的唯一标识
	    timestamp: ts, // 必填，生成签名的时间戳
	    nonceStr: ns, // 必填，生成签名的随机串
	    signature: sg,// 必填，签名，见附录1
	     jsApiList: ["closeWindow",/*"hideMenuItems"*/"hideOptionMenu","showMenuItems","onMenuShareTimeline","onMenuShareAppMessage","addCard","scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
	wx.ready(function(){
		wx.hideOptionMenu();
		wx.showMenuItems({
    		menuList: ["menuItem:share:appMessage","menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
		});
			
			wx.onMenuShareTimeline({
		    title: GLOBAL.FinalShareTitle, // 分享标题
		    link: GLOBAL.FinalShareLink,// 分享链接
		    imgUrl:GLOBAL.FinalShareImgUrl, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        //wx.closeWindow();
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	
		wx.onMenuShareAppMessage({
		    title: GLOBAL.FinalShareTitle, // 分享标题
		    desc: GLOBAL.FinalShareDesc, // 分享描述
		    link:GLOBAL.FinalShareLink,
		    imgUrl:GLOBAL.FinalShareImgUrl, // 分享图标
		    type: GLOBAL.FinalShareType, // 分享类型,music、video或link，不填默认为link
		    dataUrl: GLOBAL.FinalShareDateUrl, // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        //wx.closeWindow();
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	});
});
