//超时函数
var mIframeLoadTimeout =  null;

window.addEvent('domready', function() {
	ShowLoadingView();
	UIMsgReg();
	/*! @brief [在资讯页面完全加载后才显示出来] */
	$('frame_view').addEvent('load', function() {
		ShowFrameView();
		$cwe.postNotify('InfoWndShowed');
	});

	/*! @brief [在资讯页面完全加载后才显示出来] */
	$cwe.addNotify('cweui.infoWndStateChange', function(state) {
		if(state == 'show') {
			$cwe.feature('status:show', function() {});
		} else if(state == 'hide') {
			$cwe.feature('status:hide', function() {});
		} else if(state == 'close') {
			$cwe.close();
		}
	});

	ShowInfomation('frame_view', 'url', 'ifurl');

	//主窗口关闭时通知消息推送窗口关闭
	$cwe.addNotify('cweui.CloseWnd', function() {
		$cwe.close();
	});

});

//事件注册 #zhangliangming 2020.02.13
function UIMsgReg() {
	$('retry_btn').addEvent('click', function() { //重试
		ShowLoadingView();
		ShowInfomation('frame_view', 'url', 'ifurl'); 
	});
}

//显示加载中界面 #zhangliangming 2020.02.13
function ShowLoadingView() {
	if(mIframeLoadTimeout != null){
		clearTimeout(mIframeLoadTimeout);
	}
	mIframeLoadTimeout = setTimeout(function() {
		ShowErrorView();
	}, 30 * 1000);
	$('loading_img').setStyle('display', 'block');
	$('frame_view').setStyle('display', 'none');
	$('failed_view').setStyle('display', 'none');
}

//显示iframe界面 #zhangliangming 2020.02.13
function ShowFrameView() {
	if(mIframeLoadTimeout != null){
		clearTimeout(mIframeLoadTimeout);
	}
	$('loading_img').setStyle('display', 'none');
	$('frame_view').setStyle('display', 'block');
	$('failed_view').setStyle('display', 'none');
}

//显示error界面 #zhangliangming 2020.02.13
function ShowErrorView() {
	if(mIframeLoadTimeout != null){
		clearTimeout(mIframeLoadTimeout);
	}
	$('loading_img').setStyle('display', 'none');
	$('frame_view').setStyle('display', 'none');
	$('failed_view').setStyle('display', 'block');
}

//显示资讯 ybq 2016.12.21
function ShowInfomation(divId, adUrlName, ifurlName) {
	$funCtrl.getFunCfg(FUN_INFORURL, function(cfg) {
		if(cfg == null) return;
		if(cfg[FUN_INFORURL + '_attributes'] == undefined) return;
		if(cfg[FUN_INFORURL + '_attributes'][adUrlName] == undefined) return;
		if(cfg[FUN_INFORURL + '_attributes'][ifurlName] == undefined) return;
		var url = cfg[FUN_INFORURL + '_attributes'][adUrlName];
		if(url == '') return;

		var ifurl = cfg[FUN_INFORURL + '_attributes'][ifurlName];
		if(ifurl == '') return;

		$infoCenter.getMulValue('global','account', 'version', 'schoolId', function(values) {
			if(values == undefined) values = {};
			var account = values.account || '';
			var version = values.version || '';
			var cid = values.schoolId || '';
			var ostype = '1'; 
			var infotype = '0';

			url += '?account=' + account;
			url += '&cid=' + cid;
			url += '&ostype=' + ostype;
			url += '&version=' + version;
			url += '&infotype=' + infotype;
			url += '&ifurl=' + ifurl;
			url += '&pcClient=true';
			

			$(divId).src = url;
		});
	});
}