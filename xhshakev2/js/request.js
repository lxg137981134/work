//$(function(){
//	$(function(){
		function ajaxPage(){
	$.ajax({
		type:"get",
		url:"./spa.html",
		async:false,
		dataType:'html',
		success:function(res){
			if(res){
				console.log(JSON.stringify(res));
				//赋页面
				$("#aPage").html(res);
				$("#aPage").show();
				$("#fc").hide();
			}
		}
	});
}
//卡券签名
function cardExt(){
	if(GLOBAL.user.authorizer_appid && GLOBAL.get.cardid && GLOBAL.user.openid){
		var ajaxCardExt = $.ajax({
			type:"post",
			url:GLOBAL.path+"xuehua/cardExt",
			async:false,
			timeout:10000,
			dataType:'json',
			data:{"appid":GLOBAL.user.authorizer_appid,"card_id":GLOBAL.get.cardid,"openid":GLOBAL.user.openid},
			success:function(res){
				if(res){
					console.log(JSON.stringify(res));
					if(res.statusCode == 200){
						GLOBAL.cardExt = res.data;
						console.log(GLOBAL.cardExt);
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
					ajaxCardExt.abort();
					swal("提示","服务器响应延时,请重试","error");
				}
			}
		});
	}
}

//发奖
function getReward(){
	if(arguments[0]){
		if(arguments[0] == "redpack"){
			var ajaxRedpack = $.ajax({
				type:"post",
				url:GLOBAL.path+"xuehua/getReward",
				async:false,
				timeout:10000,
				dataType:'json',
				data:{"record_id":GLOBAL.record_id},
				success:function(res){
					if(res){
						if(res.result || res.data){
							if(res.errcode == 200){
								//次数-1
								GLOBAL.times--;
								console.log(JSON.stringify(res));
								var redpack = GLOBAL.get.redpack || GLOBAL.get.groupredpack;
								$(".reward h3").text(redpack/100 + "元红包！");
								$(".circle").fadeIn();
								$(".stage").addClass("redPaper_shake");
								setTimeout(function(){
									$(".stage").removeClass("redPaper_shake");
									$(".circle").addClass("circle_xuanzhuan");
									setTimeout(function(){
										$(".circle").fadeOut();
										$(".top").addClass("top_fanzhe");
										setTimeout(function(){
											$(".reward").addClass("reward_action");
											$(".top").css("z-index","-1");
											setTimeout(function(){
												swal("恭喜","红包发放成功，请于公众号内领取","success");
	//											GLOBAL.redpaperFlag = false;
												$(".confirm").click(function(){
													if(GLOBAL.times <= 0){
														$("#page3").hide();
														$("#endPage").show();
													}
												});
											},1000);
										},1000);
									},1500);
								},1000);
							}
							else{
								if(res.errmsg){
									GLOBAL.redpaperFlag = false;
									swal("提示",res.errmsg,"error");
								}
								else{
									GLOBAL.redpaperFlag = false;
									swal("提示","红包发放失败，请重试","error");
								}
							}
						}
						else{
							if(res.errmsg){
								GLOBAL.redpaperFlag = false;
								swal("提示",res.errmsg,"error");
							}
							else{
								GLOBAL.redpaperFlag = false;
								swal("提示","红包发放失败，请重试","error");
							}
						}
					}
					else{
						GLOBAL.redpaperFlag = false;
						swal("提示","红包发放失败，请重试","error");
					}
				},
				error:function(res){
					if(res){
						GLOBAL.redpaperFlag = false;
						console.log(JSON.stringify(res));
						swal("提示","红包发放失败","error");
					}
				},
				complete:function(XMLHttpRequest,status){
					if(status == 'timeout'){
						ajaxRedpack.abort();
						swal("提示","服务器响应超时,请重试","error");
						GLOBAL.redpaperFlag = false;
					}
				}
			});
		}
		else if(arguments[0] == "shiwu"){
			var ajaxShiwu = $.ajax({
				type:"post",
				url:GLOBAL.path+"xuehua/getReward",
				timeout:10000,
				async:false,
				dataType:'json',
				data:{"record_id":GLOBAL.record_id},
				beforeSend:function(res){
					$("#waiting").show();
				},
				success:function(res){
					if(res){
						if(res.result || res.data){
							if(res.errcode == 200){
								GLOBAL.times--;
								console.log(JSON.stringify(res));
								swal("恭喜","奖品发放成功，请于公众号内领取","success");
								$(".confirm").click(function(){
									if(GLOBAL.times <= 0){
										$("#page5").hide();
										$("#endPage").show();
									}
								});
							}
							else{
								if(res.errmsg){
									swal("提示",res.errmsg,"error");
									GLOBAL.p5_click = false;
								}
								else{
									swal("提示","未知原因，奖品发放失败，请重试","error");
									GLOBAL.p5_click = false;
								}
							}
						}
						else{
							if(res.errmsg){
								swal("提示",res.errmsg,"error");
								GLOBAL.p5_click = false;
							}
							else{
								swal("提示","未知原因，奖品发放失败，请重试","error");
								GLOBAL.p5_click = false;
							}
						}
					}
					else{
						swal("提示","奖品发放失败，请重试","error");
						GLOBAL.p5_click = false;
					}
				},
				error:function(res){
					if(res){
						console.log(JSON.stringify(res));
						swal("提示","奖品发放失败，请重试","error");
						GLOBAL.p5_click = false;
					}
				},
				complete:function(XMLHttpRequest,status){
					$("#waiting").hide();
					if(status == 'timeout'){
						ajaxShiwu.abort();
						swal("提示","服务器响应超时,请重试","error");
						GLOBAL.p5_click = false;
					}
				}
			});
		}
		else if(arguments[0] == "message"){
			$.ajax({
				type:"post",
				url:GLOBAL.path+"xuehua/getReward",
				async:false,
				timeout:10000,
				dataType:'json',
				data:{"record_id":GLOBAL.record_id},
				complete:function(XMLHttpRequest,status){
					GLOBAL.times--;
//					if(GLOBAL.times <= 0){
//						$("#page7").hide();
//						$("#endPage").show();
//					}
				}
			});
		}
	}
}


//随奖
function randomReward(){
	console.log(GLOBAL.keywords);
	console.log(GLOBAL.user.openid);
	console.log(GLOBAL.activityId);
	
	var ajaxRandomReward = $.ajax({
		type:"post",
		url:GLOBAL.path+"xuehua/random",
		async:false,
		timeout:10000,
		dataType:'json',
		data:{"keywords":GLOBAL.keywords,"openid":GLOBAL.user.openid,"activity_id":GLOBAL.activityId},
		beforeSend:function(res){
			$("#waiting").show();
		},
		success:function(res){
			if(res && res.reward){
				console.log(JSON.stringify(res));
				GLOBAL.record_id = res.record_id;
				console.log(GLOBAL.record_id);
				GLOBAL.get = res.reward;
				GLOBAL.get = JSON.parse(GLOBAL.get);
				console.log(GLOBAL.get);
				ajaxPage();
				if(GLOBAL.get.type == "redpack" || GLOBAL.get.type == "groupredpack"){
					$(".p3_con").css("background-image","url("+GLOBAL.activity.img_url+")");
				   	$(".p3_con").css("background-size","100% 100%");
					$("#page2").hide();
					$("#page3").show();
				}
				else if(GLOBAL.get.type == "super" || GLOBAL.get.type == "cash"){
					if(GLOBAL.activity.awarding_mode == 0 || GLOBAL.activity.awarding_mode == null){
						$("#page5").css("background-image","url("+GLOBAL.activity.img_url+")");
					   	$("#page5").css("background-size","100% 100%");
						//实物相关功能
						$("#page2").hide();
						$("#page5").show();
						var haveShown = false;
						$("#page5").click(function(){
							if(!haveShown){
								var sc = GLOBAL.get.super || GLOBAL.get.cash;
	//							$("#page5 .tip").append("<h2 class='new'>恭喜您获得"+sc+"</h2>");
								haveShown = true;
							}
							if(!GLOBAL.p5_click){
								GLOBAL.p5_click = true;
								//发奖
								getReward("shiwu");
							}
						});
					}
					else if(GLOBAL.activity.awarding_mode == 1){
						location.href = "http://wx.sxjzcm.cn/xuehua/custom_"+GLOBAL.record_id;
					}
				}
				else if(GLOBAL.get.type == "card"){
					$("#page4").css("background-image","url("+GLOBAL.activity.img_url+")");
				   	$("#page4").css("background-size","100% 100%");
					$("#page2").hide();
					$("#page4").show();
					
				}
				else if(GLOBAL.get.type == "message"){
				    $("#page7").css("background-image","url("+GLOBAL.activity.img_url+")");
				    $("#page7").css("background-size","100% 100%");
				    $("#page2").hide();
				    $("#page7 .mstip").append("<p>" + GLOBAL.get.message + "</p>" );
				    $("#page7").show();
				    getReward("message");
				    
				}
				else{
					//没中
					$("#page2").hide();
					$("#page6").show();
				}
			}
			else{
				swal("提示","未知原因，奖品分配失败","error");
			}
		},
		error:function(res){
			if(res){
				swal("提示","奖品分配失败","error");
			}
		},
		complete:function(XMLHttpRequest,status){
			$("#waiting").hide();
			if(status == 'timeout'){
				ajaxRandomReward.abort();
				swal("提示","服务器响应延时","error");
			}
		}
	});
}

//核销
function writeOffCode() {
	console.log(GLOBAL.lat);
	console.log(GLOBAL.lng);
	var ajaxWriteOffCode = $.ajax({
		type:"post",
		url:GLOBAL.path+"xuehua/writeOffCode",
		async:false,
		dataType:'json',
		timeout:10000,
		data:{"keywords":GLOBAL.keywords,"openid":GLOBAL.user.openid,"activity_id":GLOBAL.activityId,"lat":GLOBAL.lat,"lng":GLOBAL.lng},
		beforeSend:function(res){
			$("#waiting").show();
		},
		success:function(res){
			if(res){
				console.log(JSON.stringify(res));
				if(res.errcode == 0 || res.errcode == 200){
					if(GLOBAL.codeReward.type == "shake"){
						////摇逻辑
						console.log("摇");
						if(GLOBAL.activity.activity_name){
							var tempActivityName = escape(GLOBAL.activity.activity_name);
						}
						else{
							var tempActivityName = "";
						}
						if(GLOBAL.activity.act_wish){
							var tempActWish = escape(GLOBAL.activity.act_wish);
						}
						else{
							var tempActWish = "";
						}
						location.href = GLOBAL.path+"mobile/xhshakev2/newPage.html?act_wish="+tempActWish+"&img_url="+GLOBAL.activity.img_url+"&keywords="+GLOBAL.keywords+"&user_openid="+GLOBAL.user.openid +"&activity_id="+GLOBAL.activityId+"&times="+GLOBAL.times+"&appid="+GLOBAL.user.authorizer_appid+"&activity_name="+tempActivityName+"&share_url="+GLOBAL.shareUrl;
					}
					else{
						console.log("不摇");
							//随机奖品
							randomReward();
					}
				}
				else{
					swal("提示",res.errmsg,"error");
				}
			}
			else{
				swal("提示","未知原因，核销失败","error");
			}
		},
		error:function(res){
			if(res){
				console.log(JSON.stringify(res));
				swal("提示","核销失败","error");
			}
		},
		complete:function(XMLHttpRequest,status){
			$("#waiting").hide();
			if(status == 'timeout'){
				ajaxWriteOffCode.abort();
				swal("提示","服务器连接延迟，请重试","error");
			}
		}
	});
}

function haveOther(myRecordId){
 		$.ajax({
		type:"post",
		url:GLOBAL.path+"xuehua/getReward",
		async:true,
		dataType:'json',
		data:{"record_id":myRecordId},
		beforeSend:function(res){
			$("#"+myRecordId+" .beginGet").attr("disabled",true);
			$("#"+myRecordId+" .beginGet").text("处理中");
		},
		success:function(res){
			if(res){
				if(res.result || res.data){
					$(".beginListContainer #"+myRecordId+" .beginGet").remove();
					$(".beginListContainer #"+myRecordId).append("<span style='float:right; margin-right:5px;color:red;'>已领取</span>");
				}
				else{
					if(res.errmsg){
						swal("提示",res.errmsg,"error");
						$(".beginListContainer #"+myRecordId+" .beginGet").removeAttr("disabled");
						$(".beginListContainer #"+myRecordId+" .beginGet").text("点击领取");
					}
					else{
						swal("提示","奖品发放失败，请重试","error");
						$(".beginListContainer #"+myRecordId+" .mybutton").removeAttr("disabled");
						$(".beginListContainer #"+myRecordId+" .beginGet").text("点击领取");
					}
				}
			}
			else{
				swal("提示","奖品发放失败，请重试","error");
				$(".beginListContainer #"+myRecordId+" .beginGet").removeAttr("disabled");
				$(".beginListContainer #"+myRecordId+" .beginGet").text("点击领取");
			}
		},
		error:function(res){
			if(res){
				console.log(JSON.stringify(res));
				swal("提示","奖品发放失败","error");
				$(".beginListContainer #"+myRecordId+" .beginGet").removeAttr("disabled");
				$(".beginListContainer #"+myRecordId+" .beginGet").text("点击领取");
			}
		}
	});
}

//报告服务器卡券领取情况
	function cardGetInfo(myRecordId){
		$.ajax({
	    	type:"post",
	    	url:GLOBAL.path+"xuehua/gotCard",
	    	async:true,
	    	dataType:'json',
	    	data:{"record_id":myRecordId},
	    	success:function(res){
	    		if(res){
	    			console.log(JSON.stringify(res));
	    		}
	    	}
	 	});
	}

function haveCard(cardid,myRecordId){
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
						        $(".beginListContainer #"+myRecordId+" .beginGet").remove();
								$(".beginListContainer #"+myRecordId).append("<span style='float:right; margin-right:5px;color:red;'>已领取</span>");
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

//兑换码校验
function checkCode(){
	var ajaxcheckCode = $.ajax({
		type:"post",
		url:GLOBAL.path+"xuehua/checkCode",
		async:true,
		timeout:10000,
		dataType:'json',
		data:{"keywords":GLOBAL.keywords,"openid":GLOBAL.user.openid,"activity_id":GLOBAL.activityId},
		beforeSend:function(res){
			$(".pageCommit").attr("disabled",true);
			$("#waiting").show();
		},
		success:function(res){
			if(res){
				console.log(JSON.stringify(res));
				if(res.errcode != 404){
					if(GLOBAL.errorNum >= 0){
						GLOBAL.errorNum = 0;
					}
				}
				if(res.errcode == 0 || res.errcode == 200){
					if(res.data && res.data.reward){
						GLOBAL.into = true;
						GLOBAL.codeReward = JSON.parse(res.data.reward);
						if(GLOBAL.codeReward.count){
							GLOBAL.times = GLOBAL.codeReward.count;
						}
						else{
							GLOBAL.times = 1;
						}
						console.log(GLOBAL.times+"次");
						if(GLOBAL.activity.awarding_mode == 1){
							randomReward();
						}
						else if(GLOBAL.activity.awarding_mode == null || GLOBAL.activity.awarding_mode == 0){
							writeOffCode();
						}
					}
				}
				else{
					if(res.errcode == 408){
						GLOBAL.list =[];//清空全局数组
						GLOBAL.list = res.data;//赋值
						if(GLOBAL.list.length == 0){
							swal("提示","该兑换码已被使用","error");
						}
						else{
							swal({
								title:"提示",
								text:res.errmsg+"，点击'查看奖励'按钮，前往领取你的奖励",
								type:"warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: '查看奖励',
								cancelButtonText: '取消',
							},function(isConfirm){
								 if (isConfirm){
								 	$(".beginOpacity").fadeIn();
									$(".beginWindows").fadeIn();
									$(".beginClose").fadeIn();
								 	$(".beginListContainer").empty();
								 	for(var i = 0;i < GLOBAL.list.length;i++){
										var myId = GLOBAL.list[i].record_id;
										console.log("myId:"+myId);
										if(GLOBAL.list[i].reward && GLOBAL.list[i].reward!= "none"){
											var myReward = JSON.parse(GLOBAL.list[i].reward);
											var myRewardName = null;
											if(myReward.name){
							 					myRewardName = myReward.name;
								 			}
								 			else{
								 				myRewardName = "";
								 			}
										}
										if(myReward.type =="cash"){
											$(".beginListContainer").append("<div class='endList' id='"+myId+"'>奖品名:自定义券:"+myRewardName+"<br/>卡号:"+myReward.cash_id+"<br/>卡密:"+myReward.cash_secret+"</div><hr>");
										}else if(myReward.type =="super"){
											//var myCode = GLOBAL.list[i].myId;
											$(".beginListContainer").append("<div class='endList' id='"+myId+"' name='"+myId+"' >奖励:"+myRewardName+"</div><hr />");
										}else{
											$(".beginListContainer").append("<div class='endList' id='"+myId+"'>奖励:"+myRewardName+"</div><hr />");
										}
						    			if(GLOBAL.list[i].got){
						    				$(".beginListContainer #"+myId).append("<span style='float:right; margin-right:5px;color: red;'>已领取</span>");
						    			}
						    			else{
						    				$(".beginListContainer #"+myId).append("<a style ='float:right;' href='javascript:;' class='btn btn-primary btn-sm beginGet'>点击领取</a>");
						    			}
						    		}
//								 	$(".mywindows").empty();
//								 	$(".mywindows").append("<a href='javascript:;'><div class='myclose'><img src='img/close.png'></div></a>");
//								 	$(".mywindows").append("<div style='text-align:center; font-weight:bold;font-size:2em;margin-top:10px;'>查看中奖详情</div>");
//								 	for(var i = 0;i < GLOBAL.list.length;i++){
//								 		var myId = GLOBAL.list[i].record_id;
//								 		if(GLOBAL.list[i].reward && GLOBAL.list[i].reward!= "none"){
//								 			var myReward = JSON.parse(GLOBAL.list[i].reward);
//								 			var myRewardName = null;
//								 			if(myReward.name){
//							 					myRewardName = myReward.name;
//								 			}
//								 			else{
//								 				myRewardName = "";
//								 			}
//								 		}
//								 		if(myReward.type =="cash"){
//								 			$(".mywindows").append("<div class='myReward' id='"+myId+"'>奖品名:自定义券:"+myRewardName+"<br/>卡号:"+myReward.cash_id+"<br/>卡密:"+myReward.cash_secret+"</div><hr>");
//								 		}
//								 		else{
//								 			$(".mywindows").append("<div class='myReward' id='"+myId+"'>奖品名:"+myRewardName+"</div><hr>");
//								 		}
//								 		if(GLOBAL.list[i].got){
//								 			$(".mywindows #"+myId).append("<span style='float:right; margin-right:5px;'>已领取</span>");
//								 		}
//								 		else{
//								 			$(".mywindows #"+myId).append("<button  type='button' class='btn btn-info btn-sm mybutton' style='float:right;margin-right:5px;'>点击领取</a>");
//								 		}
//								 	}
//								 	$(".mywindows").on('click','.mybutton',function(){
//								 		console.log("点击");
//								 		var myRecordId = $(this).parent().has(this).attr('id');
//								 		console.log(myRecordId);
//								 		for(var i = 0;i < GLOBAL.list.length;i++){
//								 			if(GLOBAL.list[i].record_id == myRecordId){
//								 				if(GLOBAL.list[i].reward && GLOBAL.list[i].reward!= "none"){
//								 					var rewardType = JSON.parse(GLOBAL.list[i].reward);
//								 					if(rewardType.type != "card"){
//								 						haveOther(myRecordId);
//								 					}
//								 					else{
//								 						haveCard(rewardType.cardid,myRecordId);
//								 					}
//								 				}
//								 				break;
//								 			}
//								 		}
//							 		});
//								  $(".mywindows").fadeIn();
//	                			  $(".myopacity").fadeIn();
								 }
								 $(".beginClose").click(function(){
									$(".beginOpacity").fadeOut();
									$(".beginWindows").fadeOut();
									$(".beginClose").fadeOut();
								});
								
								$(".beginListContainer").on('click','.beginGet',function(){
							 		var myRecordId = $(this).parent().has(this).attr('id');
							 		var myRecordCode = $(this).parent().has(this).attr('name');
							 		if(myRecordCode!=null){
							 			location.href = GLOBAL.path+"xuehua/custom_"+myRecordCode;
							 		}else{
								 		console.log(myRecordId);
								 		for(var i = 0;i < GLOBAL.list.length;i++){
								 			if(GLOBAL.list[i].record_id == myRecordId){
								 				if(GLOBAL.list[i].reward && GLOBAL.list[i].reward!= "none"){
								 					var rewardType = JSON.parse(GLOBAL.list[i].reward);
								 					if(rewardType.type != "card"){
								 						haveOther(myRecordId);
								 					}
								 					else{
								 						haveCard(rewardType.cardid,myRecordId);
								 					}
								 				}
								 				break;
								 			}
								 		}
							 		}
								});
								 
								 
//								 $(".myclose").click(function() {
//								 	console.log("重复测试");
//						            $(this).parent().fadeOut();
//						            $(".myopacity").fadeOut();
//						            $(".mywindows").css("display", "none");
//						       });
							});
						}
					}
					else{
						if(res.errcode == 404){
							GLOBAL.errorNum++;
							swal({
								title:"提示",
								text:res.errmsg,
								type:"error",
							});
							$(".confirm").click(function(){
								if(GLOBAL.errorNum >= 5){
	//								swal("提示",res.errmsg+"(已连续输错"+GLOBAL.errorNum+"次兑换码，若连续输错十次，今日将不能参加活动)","error");
									swal({
										title:"提示",
										text:res.errmsg+"(已连续输错"+GLOBAL.errorNum+"次兑换码，若连续输错十次，今日将不能参加活动)，4秒后自动关闭…",
										type:"warning",
										timer:4000,
										showConfirmButton:false
									});
								}
							});
						}
						else{
							swal({
								title:"提示",
								text:res.errmsg,
								type:"error",
							});
						}
					}
				}
			}
			else{
				swal("提示","未知原因，兑换码验证不通过","error");
			}
		},
		error:function(res){
			if(res){
				swal("提示","兑换码验证不通过","error");
			}
		},
		complete:function(XMLHttpRequest,status){
			$(".pageCommit").removeAttr("disabled");
			$("#waiting").hide();
			if(status == 'timeout'){
				ajaxcheckCode.abort();
				swal("提示","服务器请求超时,请重试","error");
			}
		}
	});
}


function ajax2(){
	var ajaxtest2 = $.ajax({
		type:"post",
		url:basePath+"xuehua/shake",
		async:false,
		timeout:10000,
		dataType:'json',
		data:{"keywords":GLOBAL.keywords,"activity_id":GLOBAL.activityId},
		success:function(data){
			GLOBAL.times--;
			console.log(JSON.stringify(data));
			if(data && data.reward){
				if(GLOBAL.mode == 4){
					//没中奖处理
					setTimeout(function(){
						$(".p2_con").removeClass("yao_shake");
						$("#page2").hide();
						$("#page6").show();
						GLOBAL.flag = false;
							setTimeout(function(){
							if(GLOBAL.times > 0){
								swal("还可摇"+GLOBAL.times+"次","点击确定返回摇奖");
								$("button.confirm").click(function(){
		    						$("#page6").hide();
		    						$("#page2").show();
		    						GLOBAL.flag = true;
		    					});
		    				}
							else{
								swal("摇奖次数已用完");
								$("button.confirm").click(function(){
									$("#page2").hide();
		    						$("#page6").hide();
		    						$("#codePage").show();
		    					});
							}
						},1000);
					},1500);
				}
				else{
					get = $.parseJSON(data.reward);
					record_id = data.record_id;
					console.log(get);
					console.log(record_id);
					setTimeout(function(){
						$(".p2_con").removeClass("yao_shake");
						if(get.type == "redpack"){
							$("#page2").hide();
							$("#page3").show();
							flag = false;
							ajax3();
						}
						else if(get.type == "super"){
							//实物相关功能
							$("#page2").hide();
							$("#page5").show();
							flag = false;
							$("#page5").click(function(){
								if(!p5_click){
									p5_click = true;
									$("#page5 .tip").append("<h2 class='new'>恭喜您获得"+get.super+"!</h2>");
									ajax3();
									setTimeout(function(){
										if(times > 0){
											swal("还可摇"+times+"次","点击确定返回摇奖");
											$("button.confirm").click(function(){
												$(".new").remove();
					    						$("#page5").hide();
					    						$("#page2").show();
					    						flag = true;
					    						p5_click = false;
					    					});
					    				}
										else{
											swal("摇奖次数已用完");
											$("button.confirm").click(function(){
												$("#page2").hide();
					    						$("#page5").hide();
					    						$("#codePage").show();
					    					});
										}
									},1000);
								}
							});
						}
					},1500);
				}
				setTimeout(function(){
					shakecheck = false;
				},3000);
			}
			else{
				swal("抱歉","您参加活动的次数已达上限","error");
			}
		},
//				get = $.parseJSON(data.reward);
//				record_id = data.record_id;
//				console.log(get);
//				console.log(record_id);
//				setTimeout(function(){
//					$(".p2_con").removeClass("yao_shake");
//					if(get.type == "redpack"){
//						$("#page2").hide();
//						$("#page3").show();
//						flag = false;
//					}
		//			else{
		//				if(get == "卡券"){
		//					//卡券相关功能
		//					$("#page2").hide();
		//					$("#page4").show();
		//					flag = false;
		//				}
//					else{
//						if(get.type == "super"){
//							//实物相关功能
//							$("#page2").hide();
//							$("#page5").show();
//							flag = false;
//							$("#page5").click(function(){
//								if(!p5_click){
//									p5_click = true;
//									ajax3();
//									$("#page5 .tip").append("<h2 class='new'>恭喜您获得"+get.super+"!</h2>");
//									setTimeout(function(){
//										if(times > 0){
//											swal("还可摇"+times+"次","点击确定返回摇奖");
//											$("button.confirm").click(function(){
//												$(".new").remove();
//					    						$("#page5").hide();
//					    						$("#page2").show();
//					    						flag = true;
//					    						p5_click = false;
//					    					});
//					    				}
//										else{
//											swal("摇奖次数已用完","点击确定将关闭页面");
//											$("button.confirm").click(function(){
//												wx.closeWindow();
//					    						$("#page5").hide();
//					    					});
//										}
//									},2000);
//								}
//							});
//						}
//						else{
//							//没中奖处理
//							$("#page2").hide();
//							$("#page6").show();
//							flag = false;
//							setTimeout(function(){
//								if(times > 0){
//									swal("还可摇"+times+"次","点击确定返回摇奖");
//									$("button.confirm").click(function(){
//			    						$("#page6").hide();
//			    						$("#page2").show();
//			    						flag = true;
//			    					});
//			    				}
//								else{
//									swal("摇奖次数已用完","点击确定将关闭页面");
//									$("button.confirm").click(function(){
//										wx.closeWindow();
//			    						$("#page6").hide();
//			    					});
//								}
//							},1000);
//						}
//					}
//					setTimeout(function(){
//						shakecheck = false;
//					},3000);
//				},2000);
//			}
//		},
		complete:function(XMLHttpRequest,status){
			if(status == 'timeout'){
				ajaxtest2.abort();
				swal("呃...","服务器请求超时","error");
			}
		}
	});
}

//发放奖品
//function ajax3(){
//	var ajaxtest3 = $.ajax({
//		type:"post",
//		url:basePath+"xuehua/getReward",
//		async:true,
//		timeout:5000,
//		dataType:'json',
//		data:{"record_id":record_id},
//		success:function(data){
//			console.log(JSON.stringify(data));
//		},
//		complete:function(XMLHttpRequest,status){
//			if(status == 'timeout'){
//				ajaxtest3.abort();
//				swal("呃...","服务器请求超时","error");
//			}
//		}
//	});
//}
//	});
