//卡券签名
function cardExt(){
	if(GLOBAL.user.authorizer_appid && GLOBAL.get.cardid && GLOBAL.user.openid){
		var ajaxCardExt = $.ajax({
			type:"post",
			url:GLOBAL.path+"xuehua/cardExt",
			async:false,
			timeout:5000,
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

function newRandomReward(){
		console.log(GLOBAL.keywords);
		console.log(GLOBAL.user.openid);
		console.log(GLOBAL.activity.activityId);
		GLOBAL.get = null;
		record_id = null;
		var ajaxNewRandomReward = $.ajax({
			type:"post",
			url:GLOBAL.path+"xuehua/random",
			async:false,
			timeout:5000,
			dataType:'json',
			data:{"keywords":GLOBAL.keywords,"openid":GLOBAL.user.openid,"activity_id":GLOBAL.activity.activityId},
			success:function(res){
				if(res && res.reward){
					if(GLOBAL.times > 0){
						GLOBAL.times--;
					}
					if(res.reward != "none"){
						console.log(JSON.stringify(res));
						GLOBAL.record_id = res.record_id;
						console.log(GLOBAL.record_id);
						GLOBAL.get = res.reward;
						GLOBAL.get = JSON.parse(GLOBAL.get);
						console.log(GLOBAL.get);
						if(GLOBAL.get.type == "redpack" || GLOBAL.get.type == "groupredpack"){
							setTimeout(function(){
								$(".p2_con").removeClass("yao_shake");
								$("#page2").hide();
								$("#page3").show();
								GLOBAL.flag = false;
							},1500);
						}
						else if(GLOBAL.get.type == "super" || GLOBAL.get.type == "cash"){
							setTimeout(function(){
								$(".p2_con").removeClass("yao_shake");
								//实物相关功能
								$("#page2").hide();
								$("#page5").show();
								GLOBAL.flag = false;
								var haveShown = false;
								$("#page5").click(function(){
									if(!haveShown){
										var sc = GLOBAL.get.super || GLOBAL.get.cash;
										$("#page5 .tip").append("<h2 class='new'>恭喜您获得"+sc+"</h2>");
										haveShown = true;
									}
									if(!GLOBAL.p5_click){
										GLOBAL.p5_click = true;
										//发奖
										newGetReward("shiwu");
									}
								});
							},1500);
						}
						else if(GLOBAL.get.type == "card"){
							setTimeout(function(){
								$(".p2_con").removeClass("yao_shake");
								$("#page2").hide();
								$("#page4").show();
								GLOBAL.flag = false;
							},1500);
						}
						else{
							//中了，其他（暂且当没中处理，一般不会进）
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
										GLOBAL.shakecheck = false;
									});
								}
								else{
									swal("摇奖次数已用完");
									$(".confirm").click(function(){
//										wx.closeWindow();
										$("#page2").hide();
										$("#page6").hide();
										$("#endPage").show();
									});
								}
							},1000);
						},1500);
						}
					}
					else{
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
										GLOBAL.shakecheck = false;
									});
								}
								else{
									swal("摇奖次数已用完");
									$(".confirm").click(function(){
//										wx.closeWindow();
										$("#page2").hide();
										$("#page6").hide();
										$("#endPage").show();
									});
								}
							},1000);
						},1500);
					}
				}
				else{
					setTimeout(function(){
						swal("提示","未知原因，奖品分配失败","error");
					},1500);
				}
			},
			error:function(res){
				if(res){
					swal("提示","奖品分配失败","error");
				}
			},
			complete:function(XMLHttpRequest,status){
				if(status == 'timeout'){
					ajaxNewRandomReward.abort();
					swal("提示","服务器响应延时","error");
				}
			}
		});
	}

function newGetReward(){
		if(arguments[0]){
			if(arguments[0] == "redpack"){
				var ajaxNewRedpack = $.ajax({
					type:"post",
					url:GLOBAL.path+"xuehua/getReward",
					async:false,
					timeout:5000,
					dataType:'json',
					data:{"record_id":GLOBAL.record_id},
					success:function(res){
						if(res){
							if(res.result || res.data){
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
												if(GLOBAL.times > 0){
													swal("还可摇"+GLOBAL.times+"次","点击确定返回摇奖");
													$("button.confirm").click(function(){
														$(".circle").fadeIn();
														$(".circle").removeClass("circle_xuanzhuan");
														$(".top").css("z-index","7");
														$(".top").removeClass("top_fanzhe");
														$(".reward").removeClass("reward_action");
							    						$("#page3").hide();
							    						$("#page2").show();
							    						GLOBAL.flag = true;
							    						GLOBAL.redpaperFlag = false;
							    						GLOBAL.shakecheck = false;
							    					});
												}
												else{
													swal("摇奖次数已用完");
													$(".confirm").click(function(){
//							    						wx.closeWindow();
														$("#page2").hide();
							    						$("#page3").hide();
														$("#endPage").show();
							    					});
												}
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
					timeout:5000,
					async:false,
					dataType:'json',
					data:{"record_id":GLOBAL.record_id},
					success:function(res){
						if(res){
							if(res.result || res.data){
								console.log(JSON.stringify(res));
								if(GLOBAL.times > 0){
									swal("恭喜","奖品发放成功，请于公众号内领取,还可以摇"+GLOBAL.times+"次","success");
									$(".confirm").click(function(){
										$("#page5").hide();
			    						$("#page2").show();
			    						GLOBAL.flag = true;
			    						GLOBAL.p5_click = false;
			    						GLOBAL.shakecheck = false;
									});
								}
								else{
									swal("恭喜","奖品发放成功，请于公众号内领取,摇奖次数已用完","success");
									$(".confirm").click(function(){
//			    						wx.closeWindow();
										$("#page2").hide();
			    						$("#page5").hide();
										$("#endPage").show();
			    					});
									
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
						if(status == 'timeout'){
							ajaxNewRedpack.abort();
							swal("提示","服务器响应超时,请重试","error");
							GLOBAL.p5_click = false;
						}
					}
				});
			}
		}
	}

function test(){
	console.log("test内部");
	$(".p2_con").addClass("yao_shake");
    var player = document.getElementById('shakeMusic');
    player.setAttribute('src','http://wx.sxjzcm.cn/mobile/xhshake/voice/shakevoice.mp3');
    player.load();//加载音频
    player.play();
	GLOBAL.shakecheck = true;
	newRandomReward();
}



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
	    			 setTimeout(function(){
							if(GLOBAL.times > 0){
								swal("还可摇"+GLOBAL.times+"次","点击确定返回摇奖");
								$(".confirm").click(function(){
		    						$("#page4").hide();
		    						$("#page2").show();
		    						GLOBAL.flag = true;
		    						GLOBAL.shakecheck = false;
		    						GLOBAL.getCard = false;
		    						GLOBAL.cardExt = null;
		    					});
		    				}
							else{
								swal("摇奖次数已用完");
								$(".confirm").click(function(){
//									wx.closeWindow();
									$("#page2").hide();
		    						$("#page4").hide();
									$("#endPage").show();
		    					});
							}
						},1000);
	    		}
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
    						console.log(GLOBAL.endPageRewardList);
    						$(".listContainer").empty();
							for(var i =0;i < GLOBAL.endPageRewardList.length;i++){
								var myId = GLOBAL.endPageRewardList[i].record_id;
								console.log("myId:"+myId);
								if(GLOBAL.endPageRewardList[i].reward && GLOBAL.endPageRewardList[i].reward!= "none"){
									var myReward = JSON.parse(GLOBAL.endPageRewardList[i].reward);
									console.log('--------myReward--------');
									console.log(myReward);
									var myRewardName = null;
									if(myReward.name){
					 					myRewardName = myReward.name;
						 			}
						 			else{
						 				myRewardName = "";
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
								else{
									
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

$(function(){
	$(".button").click(function(){
		if(!GLOBAL.redpaperFlag){
			//锁定，待解锁
			GLOBAL.redpaperFlag = true;
			newGetReward("redpack");
		}
	});
	
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
		lookMyRewards(GLOBAL.activity.activityId,GLOBAL.keywords,GLOBAL.user.openid);
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
			        cardGetInfo();
			    },
			    fail:function(res){
			    	GLOBAL.getCard = false;
			    	setTimeout(function(){
			    		if(GLOBAL.times > 0){
			    			swal({
								title: "确认",
								text: "您尚未领取卡券，需要直接进行下一次摇奖吗，您还可摇"+GLOBAL.times+"次（若点击“确定”，将无法领取该卡券）？",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								closeOnConfirm: true,
								closeOnCancel: true
							}, function(isConfirm) {
								if(isConfirm) {
									$("#page4").hide();
		    						$("#page2").show();
		    						GLOBAL.flag = true;
		    						GLOBAL.shakecheck = false;
		    						GLOBAL.getCard = false;
		    						GLOBAL.cardExt = null;
								}
							});
			    		}
			    	},300);
			    },
			    cancel:function(res){
			    	GLOBAL.getCard = false;
			    	setTimeout(function(){
			    		if(GLOBAL.times > 0){
			    			swal({
								title: "确认",
								text: "您尚未领取卡券，需要直接进行下一次摇奖吗，您还可摇"+GLOBAL.times+"次（若点击“是”，将无法领取该卡券）？",
								type: "warning",
								showCancelButton: true,
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "是",
								cancelButtonText: "否",
								closeOnConfirm: true,
								closeOnCancel: true
							}, function(isConfirm) {
								if(isConfirm) {
									$("#page4").hide();
		    						$("#page2").show();
		    						GLOBAL.flag = true;
		    						GLOBAL.shakecheck = false;
		    						GLOBAL.getCard = false;
		    						GLOBAL.cardExt = null;
								}
							});
			    		}
			    	},300);
			    },
			});
		}
	});
});
	



