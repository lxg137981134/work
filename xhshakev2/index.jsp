<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
String tem = basePath + "mobile/xhshake/";
%>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
		<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<title>${activity.activity_name}</title>
		<link rel="stylesheet" href="<%=tem%>css/bootstrap.min.css" />
		<link rel="stylesheet" href="<%=tem%>css/style.css" />
		<link rel="stylesheet" href="<%=tem%>css/sweetalert.css" />
		<script type="text/javascript" src="<%=tem%>js/jquery.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/bootstrap.min.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/request.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/js.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/sweetalert.min.js" ></script>
		<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>
        <script>
        	var keywords = "";//兑换码
	        var basePath= "<%=basePath%>";
	  		var tem="<%=tem%>";
//	  		var activity = '${activity}';
//      	var activity_id = '${activity.activity_id}';
//      	var flag = false;//是否进入摇奖页面
//			var shakecheck = false;//是否处于摇的过程
//			var times = '${activity.shake_count}';//总可摇的次数
//			var get = "";//摇的的具体奖励
			var ajaxtimes = "";//第一次ajax获得可抽奖次数
			var imgUrl = '${activity.img_url}';//首页背景图片地址
//			var activity_name = '${activity.activity_id}';
			var codecheck = false;
			var record_id = "";
			var p5_click = false;
			var redpaperFlag = false;
			var activityName = '${activity.activity_name}';
			var activityId = '${activity.activity_id}';
        </script>
    </head>
   <body>
		<!--初始页面-->
		<div class="container">
			<div class="page" id="page1">
				<div class="col-xs-12" id="p1_bottom">
					<div id="page1Bottom">
						<div class="pageText">
							<input type="text" class="form-control" id="inputCode" placeholder="输入红包兑换码，100%中奖"/>
						</div>
						<div class="pageCommit">点击兑换</div>
					</div>
					
				</div>
				<div class="export">©聚众科技</div>
		</div>
		</div>
	</body>
</html>