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
		<title></title>
		<link rel="stylesheet" href="<%=tem%>css/bootstrap.min.css" />
		<link rel="stylesheet" href="<%=tem%>css/animate.min.css" />
		<link rel="stylesheet" href="<%=tem%>css/newPage.css" />
		<link rel="stylesheet" href="<%=tem%>css/sweetalert.css" />
		<script type="text/javascript" src="<%=tem%>js/jquery.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/bootstrap.min.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/request.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/newPage.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/test.js" ></script>
		<script type="text/javascript" src="<%=tem%>js/sweetalert.min.js" ></script>
		<script type="text/javascript" src="https://res.wx.qq.com/open/js/jweixin-1.1.0.js"></script>
        <script>
//      	var keywords = '${keywords}';//兑换码
        	var keywords = "<%= request.getParameter("keywords")%>"
	        var basePath= "<%=basePath%>";
	  		var tem="<%=tem%>";
	  		var activity = '${activity}';
			var activity_id = "";
        	var flag = false;//是否进入摇奖页面
			var shakecheck = false;//是否处于摇的过程
			var times = "";
			var get = "";//摇的的具体奖励
			var codecheck = false;
			var record_id = "";
			var p5_click = false;
			var redpaperFlag = false;
			var activity_name = "";
			var img_url = "";
        </script>
    </head>
   <body>
   		<!--备用提示页面-->
   		<div class="page" id="errorPage">
   			<div class="tip2">
				<h2>抱歉！</h2>
				<h2 id="errmsg"></h2>
				<h2>轻触页面继续...</h2>
			</div>
			<div class="export">©聚众科技</div>
   		</div>
		<!--摇奖页面-->
		<div class="page" id="page2"><div class="contain p2_con"><audio id= "shakeMusic" src="" controls="true" hidden="true"></audio></div><div class="export">©聚众科技</div></div>
		<!--红包页面-->
		<div class="page" id="page3"><div class="contain p3_con">
			<div class="stage">
		<div class="reward">
			<br>
			<h2>恭喜你获得</h2>
			<h3></h3>
		</div>
		<div class="top"></div>
		<div class="outer">
			<div class="circle"></div>
			<div class="button">点击拆红包</div>
		</div>
	</div>
		</div><div class="export">©聚众科技</div></div>
		<!--卡券页面-->
		<div class="page" id="page4">
			<div id="kaquan">
				<h2>点我查看卡券奖励^_^</h2>
			</div>
			<div class="export">©聚众科技</div>
		</div>
		<!--实物奖励页面-->
		<div class="page" id="page5">
			<div class="tip">
				<h2>恭喜！</h2>
				<h2>获得实物奖励！请点击礼盒！</h2>
			</div>
			<div class="export">©聚众科技</div>
		</div>
		<!--没中奖页面-->
		<div class="page" id="page6">
			<div class="tip2">
				<h2>真可惜！</h2>
				<h2>啥都没摇到！</h2>
			</div>
			<div class="export">©聚众科技</div>
		</div>
		<!--二维码页面-->
		<div class="page" id="codePage">
			<div class="opacity"></div>
	<div class="windows">
		<img id="code" alt="" src="http://pic.sxjzcm.cn/o_1aj11085u7841dro1svp7bnti19.jpg?imageView2/4/w/568/h/320/q/100"/>
		<div class="codetext1">
			<h3>长按上图识别二维码关注我们<br>随时随地获取福利信息</h3>
		</div>
	</div>
	<div class="export">©聚众科技</div>
		</div>
	</body>
</html>