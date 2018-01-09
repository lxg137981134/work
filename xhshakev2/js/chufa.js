$(function(){
	$(".page").height($(document.body).height());
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
	     jsApiList: ["closeWindow",/*"hideMenuItems"*/"hideOptionMenu","showMenuItems","onMenuShareTimeline","onMenuShareAppMessage","addCard"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2 // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
	});
	
	wx.ready(function(){
		wx.hideOptionMenu();
		wx.showMenuItems({
    		menuList: ["menuItem:share:appMessage","menuItem:share:timeline"] // 要显示的菜单项，所有menu项见附录3
		});
});

$(".redpackbutton").click(function(){
		if(!GLOBAL.redpaperFlag){
			//锁定，待解锁
			GLOBAL.redpaperFlag = true;
			getReward("redpack");
		}
	});
//点击消息提示奖的后续
$("#page7").click(function(){
	$("#page7").hide();
	$("#endPage").show();
});
	
	//报告服务器卡券领取情况
	function cardGetInfo(){
		$.ajax({
	    	type:"post",
	    	url:GLOBAL.path+"xuehua/gotCard",
	    	async:true,
	    	dataType:'json',
	    	data:{"record_id":GLOBAL.record_id},
	    	success:function(res){
	    		if(res){
	    			console.log(JSON.stringify(res));
	    		}
	    	},
	    	complete:function(res){
	    		swal("恭喜","奖品发放成功，请于公众号内领取","success");
				$(".confirm").click(function(){
					if(GLOBAL.times <= 0){
						$("#page4").hide();
						$("#endPage").show();
					}
				});
	    	}
	 	});
	}
	
		function lookMyRewards(actvityid,keywords,openid){
    			var InfoObj = {"activity_id":actvityid,"code":keywords,"openid":openid};
    			console.log(InfoObj);
    			$.ajax({
    				type:"post",
    				url:GLOBAL.path+"xuehua/getRecord",
    				async:true,
    				dataType:'json',
    				data:InfoObj,
    				beforeSend:function(){
    					$(".listContainer").empty();
    					$(".listContainer").text("查询中，请稍候…");
    				},
    				success:function(res){
    					if(res){
    						GLOBAL.endPageRewardList = res;
    						console.log(JSON.stringify(GLOBAL.endPageRewardList));
    						$(".listContainer").empty();
							for(var i =0;i < GLOBAL.endPageRewardList.length;i++){
								var myId = GLOBAL.endPageRewardList[i].record_id;
								console.log("myId:"+myId);
								if(GLOBAL.endPageRewardList[i].reward && GLOBAL.endPageRewardList[i].reward!= "none"){
									var myReward = JSON.parse(GLOBAL.endPageRewardList[i].reward);
									var myRewardName = null;
									if(myReward.name){
					 					myRewardName = myReward.name;
						 			}
						 			else{
						 				myRewardName = "";
						 			}
								}
								if(myReward.type =="cash"){
									$(".listContainer").append("<div class='endList' id='"+myId+"'>奖品名:自定义券:"+myRewardName+"<br/>卡号:"+myReward.cash_id+"<br/>卡密:"+myReward.cash_secret+"</div><hr>");
								}
								else{
									$(".listContainer").append("<div class='endList' id='"+myId+"'>奖励:"+myRewardName+"</div><hr />");
								}
				    			if(GLOBAL.endPageRewardList[i].got){
				    				$(".listContainer #"+myId).append("<span style='float:right; margin-right:5px;color: red;'>已领取</span>");
				    			}
				    			else{
				    				$(".listContainer #"+myId).append("<a style ='float:right;' href='javascript:;' class='button button-primary button-pill button-tiny endGet'>点击领取</a>");
				    			}
				    		}
    					}
    				},
    				error:function(res){
    					swal("提示","获取奖品信息出错,请重试","error");
						$(".listContainer").empty();
    				},
    				complete:function(res){
    					if(res){
    						console.log(res);
    					}
    				}
    			});
    		}
    		
		function endHaveOther(myRecordId){
	 		$.ajax({
				type:"post",
				url:GLOBAL.path+"xuehua/getReward",
				async:true,
				dataType:'json',
				data:{"record_id":myRecordId},
				beforeSend:function(res){
					$("#"+myRecordId+" .endGet").attr("disabled",true);
					$("#"+myRecordId+" .endGet").text("处理中");
				},
				success:function(res){
					if(res){
						if(res.result || res.data){
							$("#"+myRecordId+" .endGet").remove();
							$("#"+myRecordId).append("<span style='float:right; margin-right:5px;color: red;'>已领取</span>");
						}
						else{
							if(res.errmsg){
								swal("提示",res.errmsg,"error");
								$("#"+myRecordId+" .endGet").removeAttr("disabled");
								$("#"+myRecordId+" .endGet").text("点击领取");
							}
							else{
								swal("提示","奖品发放失败，请重试","error");
								$("#"+myRecordId+" .endGet").removeAttr("disabled");
								$("#"+myRecordId+" .endGet").text("点击领取");
							}
						}
					}
					else{
						swal("提示","奖品发放失败，请重试","error");
						$("#"+myRecordId+" .endGet").removeAttr("disabled");
						$("#"+myRecordId+" .endGet").text("点击领取");
					}
				},
				error:function(res){
					if(res){
						console.log(JSON.stringify(res));
						swal("提示","奖品发放失败","error");
						$("#"+myRecordId+" .endGet").removeAttr("disabled");
						$("#"+myRecordId+" .endGet").text("点击领取");
					}
				}
			});
		}
		
		function endHaveCard(cardid,myRecordId){
			if(GLOBAL.user.authorizer_appid && cardid && GLOBAL.user.openid){
				var ajaxHaveCard = $.ajax({
					type:"post",
					url:GLOBAL.path+"xuehua/cardExt",
					async:false,
					timeout:10000,
					dataType:'json',
					data:{"appid":GLOBAL.user.authorizer_appid,"card_id":cardid,"openid":GLOBAL.user.openid},
					success:function(res){
						if(res){
							console.log(JSON.stringify(res));
							if(res.statusCode == 200){
								GLOBAL.cardExt = res.data;
								console.log(GLOBAL.cardExt);
								wx.addCard({
								    cardList: [{
								        cardId: cardid,
								        cardExt: GLOBAL.cardExt
								    }], // 需要添加的卡券列表
								    success: function (res){
								        var cardList = res.cardList; // 添加的卡券列表信息
								        cardGetInfo(myRecordId);
								        $("#"+myRecordId+" .endGet").remove();
										$("#"+myRecordId).append("<span style='float:right; margin-right:5px;color:red;'>已领取</span>");
								    },
								    fail:function(res){
								    	if(res){
								    		console.log(res);
								    	}
								    },
								    cancel:function(res){
								    }
								});
							}
							else{
								console.log(res.statusText);
							}
						}
						else{
							swal("提示","获取卡券失败，请重试","error");
						}
					},
					error:function(res){
						console.log(JSON.stringify(res));
						swal("提示","获取卡券失败，请重试","error");
					},
					complete:function(XMLHttpRequest,status){
						if(status == 'timeout'){
							ajaxHaveCard.abort();
							swal("提示","服务器响应延时,请重试","error");
						}
					}
				});
			}
		}
	
	//结束页面
	$(".endClose").hide();
    $("#quit").click(function(){
    	wx.closeWindow();
    });
	$("#viewReward").click(function(){
		console.log("测试");
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
 		for(var i = 0;i < GLOBAL.endPageRewardList.length;i++){
 			if(GLOBAL.endPageRewardList[i].record_id == myRecordId){
 				if(GLOBAL.endPageRewardList[i].reward && GLOBAL.endPageRewardList[i].reward!= "none"){
 					var rewardType = JSON.parse(GLOBAL.endPageRewardList[i].reward);
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
	
	$("#showout").click(function(){
		if(!GLOBAL.cardExt){
			cardExt();
		}
		console.log("点击卡券");
		if(GLOBAL.get.cardid && GLOBAL.cardExt){
			console.log(GLOBAL.get.cardid);
			console.log(GLOBAL.cardExt);
		}
		
		//发放卡券
		if(!GLOBAL.getCard){
			GLOBAL.getCard = true;
			wx.addCard({
			    cardList: [{
			        cardId: GLOBAL.get.cardid,
			        cardExt: GLOBAL.cardExt
			    }], // 需要添加的卡券列表
			    success: function (res){
			        var cardList = res.cardList; // 添加的卡券列表信息
			        GLOBAL.times--;
			        cardGetInfo();
			    },
			    fail:function(res){
			    	if(res){
			    		console.log(res);
			    	}
			    	GLOBAL.getCard = false;
			    },
			    cancel:function(res){
			    	GLOBAL.getCard = false;
			    }
			});
		}
	});
});


				
//						setTimeout(function(){
//							if(GLOBAL.times > 0){
//								swal("还可摇"+GLOBAL.times+"次","点击确定返回摇奖");
//								$("button.confirm").click(function(){
//									$(".circle").fadeIn();
//									$(".circle").removeClass("circle_xuanzhuan");
//									$(".top").css("z-index","7");
//									$(".top").removeClass("top_fanzhe");
//									$(".reward").removeClass("reward_action");
//		    						$("#page3").hide();
//		    						$("#page2").show();
//		    						GLOBAL.flag = true;
//		    						GLOBAL.redpaperFlag = false;
//		    						GLOBAL.shakecheck = false;
//		    					});
//							}
//							else{
//								swal("摇奖次数已用完");
//								$("button.confirm").click(function(){
//		    						wx.closeWindow();
//									$("#page2").hide();
//		    						$("#page3").hide();
////		    						$("#codePage").show();
//		    					});
//							}
//						},1000);