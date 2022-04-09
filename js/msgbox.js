/*弹框文件 ybq 2012.12.28
*描述：该窗口支持错误码弹框和url弹框,可设置标题
*/
/*弹框按钮返回类型：mb_ok, mb_cancel, mb_yes, mb_no
*/
var uid;
var m_code;
var LinkBtn=["帮助指引","下载新版客户端","戳我解决"];
var DefaultPath="\\ErrorView\\ErrorInfo.html";
var OfficialPath = "http://zsteduapp.10000.gd.cn/index.html";
var NextTips = "nextOper";

//zlm 2020.06.14 欠费充值
var mChargeTime = 5 * 1000;
var mChargeTimer = null;

window.addEvent('domready', function(){
    InitData();
 
    $('certain').addEvent('click', function() {
        returnClickResult('mb_ok');
    });
    $('yesbutton').addEvent('click', function() {
        returnClickResult('mb_yes');
    });
    $('yes').addEvent('click', function() {
        returnClickResult('mb_yes');
    });
    $('no').addEvent('click', function() {
        returnClickResult('mb_no');
    });
    $('sure').addEvent('click', function() {
        returnClickResult('mb_ok');
    });
    $('cancel').addEvent('click', function() {
        returnClickResult('mb_cancel');
    });
    $('chargebutton').addEvent('click', function(){
        //alert($('chargebutton').get('myurl'));
        window.open($('chargebutton').get('myurl'));
        //$cwe.postNotify('openchargemsg',function(){});
        $cwe.close();
    });

    $('MsgBoxClose').addEvent('click',function(){
        if($('HelpLink').get('text')== LinkBtn[1])
        {
            $cwe.postNotify('MainWnd', true, function() 
            {
                $cwe.close();
            });
        }
        else 
        {
            $cwe.close();
        }
    });
    
    $cwe.addNotify('cweui.msgboxurlmsg', function(urlJson) {
        UrlWnd(urlJson);
    });
    $cwe.addNotify('cweui.msgboxtextmsg', function(urlJson) {
        UseButtonCharge();
        textWnd(urlJson);
    });
    $cwe.addNotify('cweui.closemsgbox', function(urlJson) {
        $cwe.close();
    });
    
    //zhangliangming 2020.03.09 发送窗口加载完成通知
    $cwe.postNotify('MsgboxOpened');
    
    //zhangliangming 2020.06.14 欠费充值
    $('cancelBtn').addEvent('click', function() {
        returnClickResult('mb_cancel');
    });
    
    $('chargeBtn').addEvent('click', function(){
        window.open($('chargeBtn').get('myurl'));
        $cwe.close();
    });
    
    $cwe.addNotify('cweui.msgboxlinkmsg', function(urlJson) {
    	$('chargeBtn').set('myurl', urlJson.url);
    	if(mChargeTimer != null){
    		clearTimeout(mChargeTimer);
    		mChargeTimer = null;
    		mChargeTime = 5 * 1000;
    	}
    	updateChargeText();
    });
});
/**
 * 更新充值按钮文字
 */
function updateChargeText() {
	mChargeTimer = setTimeout(function() {
		if(mChargeTime < 0){
			document.getElementById("chargeBtn").value= '去充值';
			window.open($('chargeBtn').get('myurl'));
		}else{
			document.getElementById("chargeBtn").value= '去充值' + '(' + (mChargeTime/1000)+ ')';
			updateChargeText();
		}
		mChargeTime = mChargeTime - 1000;
	},1000);
}

/////////////////////////////////////////////////////////////////
function returnClickResult(type){
    var param = new Object;
    param.type = type;
    param.uid = uid;
    $cwe.postNotify('msgboxmsg', JSON.encode(param), function(){
        $cwe.close();
    });
}

function InitData() 
{
    var strRequest = GetRequest();
    if(strRequest == undefined) strRequest = {};
    if(strRequest.iProcode != undefined){
        ErrorWnd(strRequest);
    }
    else if(strRequest.url != undefined){
        UrlWnd(strRequest);
    }
    else if(strRequest.text != undefined){
        textWnd(strRequest);
    }
    
    //统一处理样式
    if(strRequest.sType != undefined){
        var type = parseInt(strRequest.sType);
        if(type == MB_OK){
            UseButtonCertain();
        }
        else if(type == MB_OKCANCEL){
            UseButtonSureCancel();
        }
        else if(type == MB_YES){
            UseButtonYes();
        }
        else if(type == MB_YESNO){
            UseButtonYesNo();
        }
        else if(type == MB_VLIMIT){//版本禁用框
            UseButtonCertain();
            SetLinkBtn(LinkBtn[1]);
        }
        else if(type == MB_HELP){
            UseButtonCertain();
            SetLinkBtn(LinkBtn[0]);
        }
        else if(type == MB_WIFI){
            UseButtonCertain();
            SetLinkBtn(LinkBtn[2]);
        }
        else if(type == MB_CHARGE){
        	UseButtonAutoCharge();
        }
    }
    //统一处理标题
    if(strRequest.title != undefined || strRequest.title != ''){
        $('logo_text').set('text',strRequest.title?strRequest.title:'提示');
    }
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    uid = theRequest.UID;
    return theRequest;
}

/*文字弹框*/
function textWnd(strRequest){
    if(typeof strRequest != "object"){
        strRequest = JSON.decode(strRequest);
    }

    if(strRequest.title != undefined || strRequest.title != ''){
        if(strRequest.title.length > 3){
            var len = (strRequest.title.length - 2)*12.5 + 85;
            $('logo_text').setStyle('width', len+'px');
        }
        $('logo_text').innerText = strRequest.title;
    }
    if(strRequest.text != ''){
        $('tips').innerHTML = strRequest.text;
    }
    $('content').setStyle('display', 'block');
    $('urlDiv').setStyle('display', 'none');

     //处理位置
    if(strRequest.position != undefined || strRequest.position != ''){ //有位置信息
        var sizetype='';
        if(strRequest.position == 'rightbottom'){ //右下角
            sizetype = "size:368 204,position:0 0 rightbottom,toolicon:none";
        }

        if(sizetype != ''){
            $cwe.feature(sizetype, function(){});
        }
    }
    $cwe.feature('status:show,zorder:topmost,toolicon:hide', function(){});

    if(strRequest.url != undefined && strRequest.url != ''){
        $('chargebutton').set('myurl', strRequest.url);
    }
    else{
        $('chargebutton').setStyle('display', 'none');
    }
}

/*url弹框*/
function UrlWnd(strRequest){
    var html = [];
    html.push('<iframe id="urlwnd" src="" frameborder="0" height="160px" width="357px" scrolling="no"></iframe>');
    $('urlDiv').innerHTML = html.join('');
    $('urlwnd').src=strRequest.url;

    $('content').setStyle('display', 'none');
    $('urlDiv').setStyle('display', 'block');
    $('loading_msgbox').setStyle('display', 'none');

   // $cwe.feature('status:show', function(){});
}

/*错误弹框的信息设置*/
function ErrorWnd(strRequest){
    var strDesc = GetProcCode(strRequest.iProcode, strRequest.SubCode);

    var i = 4;
    var desc = 'desc' + i;
    while (strRequest[desc] != undefined) {
        strDesc = strDesc.replace('%s', strRequest[desc]);
        i++;
        desc = 'desc' + i;
    }
    var key=strRequest.iProcode;
    if(strRequest.SubCode!='') key=key + '.' + strRequest.SubCode;

    m_code = key;
    $('content').setStyle('display', 'block');
    $('urlDiv').setStyle('display', 'none');
    $('tips').set('text',strDesc);

    UseButtonCertain();
}

/*版本禁用框*/
function VersionLimit(){
    $('HelpLink').innerHTML = '下载新版客户端';
}

/*帮助指引*/
function AddHelpLink(){
    $('HelpLink').setStyle('display', 'block');
}

/////////////////////////////////////////////////////////////////
/*! @brief [选择使用样式一：确定] */
function UseButtonCertain() {
    $('ButtonStyleOne').setStyle('display', 'block');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
}
/*! @brief [选择使用样式二：确定/取消] */
function UseButtonSureCancel() {
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'block');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
}
/*! @brief [选择使用样式三：是] */
function UseButtonYes() {
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'block');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
}
/*! @brief [选择使用样式四：是/否] */
function UseButtonYesNo() {
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'block');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
}
/*! @brief [选择使用样式五：去充值] */
function UseButtonCharge(){
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'block');
    $('ButtonStyleSix').setStyle('display', 'none');
}

/**
 * 欠费充值
 * zhangliangming 2020.06.14
 */
function UseButtonAutoCharge(){
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'block');
}
/////////////////////////////////////////////////////////////////

function SetLinkBtn(tittle)
{
    $('HelpLink').set('text',tittle);
    var ChainHelpLink = new Chain(HelpLinkOper);
    var ChainOfficialLink = new Chain(OfficialLinkOper);
    var ChainWifiLink = new Chain(WifiLinkOper);
    ChainHelpLink.setNextOper(ChainOfficialLink);
    ChainOfficialLink.setNextOper(ChainWifiLink);
    $('HelpLink').addEvent('click',function(){
        ChainHelpLink.passRequest(tittle);
    });
    $('HelpLink').setStyle('display','block');
}

function HelpLinkOper(tittle)
{
    if(tittle!=LinkBtn[0])
        return NextTips;
    $funCtrl.getFunCfg(FUN_HELPURL, function(cfg) {   
        if(    cfg == undefined 
            || cfg[FUN_HELPURL + '_attributes'] == undefined
            || cfg[FUN_HELPURL + '_attributes'].url == undefined) 
            {   
                $cwe.plugin('IOUtil').call('OpenURL', DefaultPath+'#'+m_code,function(){ 
                    $cwe.close();
                });
                return;
            }
        var docUrl;
        var flag;
        docUrl = cfg[FUN_HELPURL + '_attributes'].url;
        flag = cfg[FUN_HELPURL + '_attributes'].local;
        if(flag=='true')
        {
            $cwe.plugin('IOUtil').call('OpenURL', docUrl+'#'+m_code,function(){ 
                $cwe.close();
            }); 
        }
        else
        {
            window.open(docUrl);
            $cwe.close();
        }
    });
}

function OfficialLinkOper(tittle)
{
    if(tittle!=LinkBtn[1])
        return NextTips;
    $funCtrl.getFunCfg(FUN_OFFICIALURL, function(cfg) {   
        if(    cfg == undefined 
            || cfg[FUN_OFFICIALURL + '_attributes'] == undefined
            || cfg[FUN_OFFICIALURL + '_attributes'].url == undefined) 
            {
                window.open(OfficialPath);
                return;
            }
        var docUrl;
        docUrl = cfg[FUN_OFFICIALURL + '_attributes'].url;
        window.open(docUrl);
        $cwe.postNotify('MainWnd', true, function() {
            $cwe.close();
        });
    });
}

function WifiLinkOper(title)
{
    if(title != LinkBtn[2])
        return NextTips;
    $funCtrl.getFunCfg(FUN_CLEARTOOL,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_CLEARTOOL + '_attributes']==undefined) return;
        if(cfg[FUN_CLEARTOOL + '_attributes']['url']==undefined) return;
        var url=cfg[FUN_CLEARTOOL + '_attributes']['url'];
        if(url=='') return ;
        $cwe.plugin('ioutil').call('OpenExe', '\\ShareAppCleaner.exe',url, function() { });
        $cwe.close();
    });
    
}


var Chain = function( fn ){  
   this.fn = fn;  
   this.operation = null;  
};  
  
Chain.prototype.setNextOper = function( operation ){  
   return this.operation = operation;  
};  
  
Chain.prototype.passRequest = function(){  
   var res = this.fn.apply( this, arguments );  
   if( res === NextTips ){  
      return this.operation.passRequest.apply( this.operation, arguments );  
   }  
     
   return res;  
};  