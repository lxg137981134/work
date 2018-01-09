$(function(){
	
	var shake=3000, last_update=0, count=0,x=y=z=last_x=last_y=last_z=0;
	GLOBAL.flag = true;
	console.log(GLOBAL.activity);
	var ret = getParameter();
	console.log(ret);
	if(ret.activity_name){
		GLOBAL.activity.activityName = unescape(ret.activity_name);
	}
	else{
		GLOBAL.activity.activityName = "";
	}
	document.title = GLOBAL.activity.activityName;
	GLOBAL.activity.activityId = parseInt(ret.activity_id);
	GLOBAL.user.authorizer_appid = ret.appid;
	GLOBAL.keywords = ret.keywords;
	if(ret.img_url){
		GLOBAL.activity.img_url = ret.img_url;
	}
	else{
		GLOBAL.activity.img_url = "";
	}
	GLOBAL.times = parseInt(ret.times);
	GLOBAL.user.openid = ret.user_openid;
	GLOBAL.shareUrl = ret.share_url;
	if(ret.act_wish){
		GLOBAL.activity.act_wish = unescape(ret.act_wish);
	}
	
//	$("#page2").click(function(){
//		test();
//	});
	$("#page2").show();
	console.log(GLOBAL.times);
	console.log(GLOBAL.shakecheck);
	console.log(GLOBAL.flag);
		
		function init(){
		window.event.preventDefault();
		if(window.DeviceMotionEvent){
        window.addEventListener("devicemotion",deviceMotionHandler,false);
	   }else{
	     sweetAlert("亲", "您的设备不支持devicemotion事件", "error");	
	   }
	}
   init();
   function deviceMotionHandler(eventData){
        var acceleration = eventData.accelerationIncludingGravity,
        currTime=new Date().valueOf(),
        diffTime=currTime-last_update;

        if(diffTime>100){
           last_update=currTime;
           x=acceleration.x;
           y=acceleration.y;
           z=acceleration.z;
           var speed=Math.abs(x+y+z-last_x-last_y-last_z)/diffTime*10000;
           if(speed>shake && GLOBAL.times > 0 && !GLOBAL.shakecheck && GLOBAL.flag == true){
				test();
           }
           last_x = x;
           last_y = y;
           last_z = z;
        }
   }
   
// $("#page2").click(function(){
// 		test();
// });
//	
	
	
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
		    title: GLOBAL.activity.activity_name, // 分享标题
		    link: GLOBAL.shareUrl,// 分享链接
		    imgUrl:GLOBAL.activity.img_url, // 分享图标
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		        //wx.closeWindow();
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	
		wx.onMenuShareAppMessage({
		    title: GLOBAL.activity.activity_name, // 分享标题
		    desc: GLOBAL.activity.act_wish, // 分享描述
		    link:GLOBAL.shareUrl,
		    imgUrl:GLOBAL.activity.img_url, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
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
