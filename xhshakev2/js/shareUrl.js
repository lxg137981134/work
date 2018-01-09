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
