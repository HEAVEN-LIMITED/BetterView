//在id为divId的div上显示广告
// function ShowAd(divId,adUrlName){
//     $funCtrl.getFunCfg(FUN_AD,function(cfg){
//         if(cfg==null
//             || cfg[FUN_AD + '_attributes']==undefined
//             || cfg[FUN_AD + '_attributes'][adUrlName]==undefined){
//             return ;
//         }
//         var url=cfg[FUN_AD + '_attributes'][adUrlName];
//         if(url=='') return ;
//         $infoCenter.getMulValue('global','version','DialType','DialAccount','schoolId',function(values){
//             if(values == undefined) values = {};
//             url=url+'&ostype=1&height=110&width=320&dialupaccount=' + values.DialAccount + '&dialuptype=' + values.DialType + '&version=' + values.version + '&cid=' + values.schoolId ;
//             RequestHTTP(url, function(responseText, responseXML){
//                 if(typeof responseXML != "object") return;
//                 //var xmlDom = createXMLDom();
//                 //xmlDom.load(responseXML);
//                 var xmlDom = parseXML(responseText);
//                 if(xmlDom == undefined || xmlDom.documentElement == undefined) return;

//                 //获得根节点
//                 var root = xmlDom.documentElement;
//                 var url = root.getElementsByTagName('url');
//                 var markUrl = url[0].childNodes[0].nodeValue;
//                 if(typeof markUrl != "string") return;
                
//                 var html = [];
//                 var id = 'adverUrl' + divId;
//                 var strUrl = AddParam(markUrl, 'rand='+ Math.random()*100000);
//                 //alert(strUrl);
//                 html.push('<iframe id="'+id+'" src="'+strUrl+'" frameborder="0" height="110px" width="320px" scrolling="no" ></iframe>');
//                 $(divId).innerHTML = html.join('');
//                 var show = function() {
//                     strUrl = AddParam(markUrl, 'rand='+ Math.random()*100000);
//                     //alert(strUrl);
//                     $(id).src = strUrl;
//                 };
//                 show.delay(500);
//             });
//         })
//     });
// }

function ShowAd(divId,adUrlName,key){
    $funCtrl.getFunCfg(FUN_AD,function(cfg){
        if(cfg==null
            || cfg[FUN_AD + '_attributes']==undefined
            || cfg[FUN_AD + '_attributes'][adUrlName]==undefined){
            return ;
        }
        var url=cfg[FUN_AD + '_attributes'][adUrlName];
        if(url=='') return ;
        $infoCenter.getMulValue('global','version','DialType','DialAccount','schoolId', 'clientId', function(values){
            if(values == undefined) values = {};
            if(values.schoolId == undefined || values.schoolId == '') values.schoolId = 0;
            
            var urlParam = 'ostype=1&height=110&width=320&dialupaccount=' + values.DialAccount + '&dialuptype=' + 
                values.DialType + '&version=' + values.version + '&cid=' + values.schoolId + '&adtype=0&clientid=' +
                values.clientId+'&key='+key;
            url = AddParam(url, urlParam);
            JsonHTTP(url, function(responseJSON){
                var resDataObj = JSON.decode(responseJSON);

                if(resDataObj.url == undefined || resDataObj.url == '') return;
                //strUrl = 'http://192.168.99.253:8081/ad/advertisements.html?adid=114&getadurl=http://192.168.99.252:8081/EsurfingClient/getadvertisements/byadid';
                
                var html = [];
                var id = 'adverUrl' + divId;
                var markUrl = AddParam(resDataObj.url, urlParam+'&adid='+resDataObj.adid+'&getadurl='+resDataObj.getadurl);
                var strUrl = AddParam(markUrl, 'rand='+ Math.random()*100000);
               // strUrl = 'http://192.168.99.253:8081/ad/advertisements.html?version=10041&dialupaccount=123&ostype=1&width=302&height=93&adid=114&getadurl=http://192.168.99.252:8081/EsurfingClient/getadvertisements/byadid&tdsourcetag=s_pcqq_aiomsg';
                html.push('<iframe id="'+id+'" src="'+strUrl+'" frameborder="0" width="320px" height="110px" scrolling="no" ></iframe>');
                $(divId).innerHTML = html.join('');

                var show = function() {
                    strUrl = AddParam(markUrl, 'rand='+ Math.random()*100000);
                    $(id).src = strUrl;
                };
                show.delay(500);
            });
        })
    });
}

/**
 * 上传AD点击量
 * @param {Object}  adid
 * @param {Object} success
 * @param {Object} error
 */
function uploadADClickInfo(adStr) {
    //alert(adStr);
    var adJson = JSON.decode(adStr);
	if(adJson == undefined) return;
    SetClickModule(2, adJson.id);
    // $funCtrl.getFunCfg(FUN_ADCLICKUPLOAD, function(cfg) {
    //     if(cfg==null
    //         || cfg[FUN_ADCLICKUPLOAD + '_attributes']==undefined
    //         || cfg[FUN_ADCLICKUPLOAD + '_attributes']['url']==undefined){
    //         return ;
    //     }
    //     var url=cfg[FUN_ADCLICKUPLOAD + '_attributes']['url'];
    //     if(url != undefined && url != null && url != '') {
    //         $infoCenter.getMulValue('global','DialAccount', 'version', 'schoolId', function(values) {
                
    //             var data = {};
    //             data.adid = adid;
    //             data.ostype = 1;
    //             data.version = values.version;
    //             data.account = values.DialAccount;
    //             data.cid = values.schoolId;

    //             JsonPostHTTP(url, data, function(responseJSON){});
    //         });
    //     }
    // });
}


//显示公告
var hasReqNofice=false;
function showNotice(){
    if(hasReqNofice) return ;//只请求一次
    hasReqNofice=true;
    $('notice_more').setStyle('display', 'none');
    $funCtrl.getFunCfg(FUN_NOTICE,function(cfg){
        if(cfg==null
            || cfg[FUN_NOTICE + '_attributes']==undefined
            || cfg[FUN_NOTICE + '_attributes']['url']==undefined){
            return ;
        }
        var url=cfg[FUN_NOTICE + '_attributes']['url'];
        if(url=='') return ;
        var province=cfg[FUN_NOTICE + '_attributes']['province'];  
        if(province=='GD'){
            _showNoticeForGD(url);
        }else{
            _showNofice(url);
        }
    });
}

function _showNofice(url){
    $infoCenter.getMulValue('global','version','DialType','DialAccount','schoolId',function(values) {
        if(values == undefined) values = {};
        var reqUrl='{0}?Account={1}&Version={2}&DialupType={3}&CID={4}&IP={5}'.format(url,values.DialAccount,values.version,values.DialType,values.schoolId,'');
        RequestHTTP(reqUrl,  function (responseText, responseXML){       
            if(responseXML == undefined || responseXML.getElementsByTagName('code') == undefined) return;  
            var code=responseXML.getElementsByTagName('code')[0].childNodes[0].nodeValue;
            if(code!=0) return ;
            var notices=responseXML.getElementsByTagName('Notice');
            if(notices.length==0) return;
            //在显示公告前先清理一遍公告
            $('default_message').dispose();  
            for(var i=0;i<notices.length;i++){
                var notice=notices[i];
                var title=notice.getElementsByTagName('Content')[0].childNodes[0].nodeValue;
                var noticeUrl=notice.getElementsByTagName('URL')[0].childNodes[0].nodeValue;
                AddNotice(noticeUrl,title);
                if(noticeUrl!=''){
                    $('notice_more').href = noticeUrl;
                    $('notice_more').setStyle('display', '');
                }else{
                    $('notice_more').setStyle('display', 'none');
                }
            }
        });
    });
}
//广东版显示公告
function _showNoticeForGD(url){
    $infoCenter.getMulValue('global','schoolId',function(values) {
        var schoolid = values.schoolId;
        //schoolid=361;
        var timestamp = new Date().getTime();
        var authenticator = md5(schoolid + '' + timestamp + 'Eshore!@#');
        var data = {"schoolid": schoolid + "", "timestamp": timestamp, "authenticator": authenticator};
        var dataStr = JSON.encode(data);
        PostHTTP(url, dataStr, function (responseText, responseXML) {
            var notices = JSON.decode(responseText);
            if(notices == undefined) return;
            
            if (notices.rescode == 0) {
                var len = notices.content.length;
                if (notices.moreurl != undefined && notices.moreurl != '') {
                    $('notice_more').href = notices.moreurl;
                    $('notice_more').setStyle('display', '');
                } else {
                    $('notice_more').setStyle('display', 'none');
                }
                //在显示公告前先清理一遍公告
                if(len >= 1){
                    $('default_message').dispose(); 
                }
                for (var i = 0; i < len; i++) {
                    AddNotice(notices.content[i].url, notices.content[i].title);
                }
            }
        })
    })
}

function AddNotice(url,title) {
    var noticeA = new Element('a');
    noticeA.addClass('notice_item');
    if (url != '') {
        noticeA.href = url;
        noticeA.target = "_blank";
        noticeA.onclick = function(){SetClickModule(3, CLICK_NOTICE);}
        noticeA.setStyle('outline', 'none'); //去掉点击链接后出现的虚线框
    }
    noticeA.appendText(title);
    $('noficeList').adopt(noticeA);
}

//我的账户界面链接请求 ybq 2012.12.23
function ShowMyAccount(divId,adUrlName){
    $funCtrl.getFunCfg(FUN_MYACCOUNT,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_MYACCOUNT + '_attributes']==undefined) return;
        if(cfg[FUN_MYACCOUNT + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[FUN_MYACCOUNT + '_attributes'][adUrlName];
        if(url=='') return ;

        var province = $funCtrl.GetProvince();
        if(province == "GD"){ //广东
            $infoCenter.getMulValue('global', 'domain', 'area', 'DialAccount', 'DialPassword',function(values){
                if(values == undefined) values = {};
                url=url+'?domain='+values.domain+'&param1='+values.DialAccount+'&param2='+values.DialPassword+'&param3='+values.area;

                ShowLoadingOrNormal('loading_account', 'AccountInfo', 1);
                $('AccountInfo').src = url;
                //iframeLoadEvent('AccountInfo');
            });
        }else{ //其他省份
            $infoCenter.getMulValue('global', 'version', 'DialType', 'DialAccount',function(values){
                var tmpDate = GetLocalStringTime();
                var strToken = values.DialAccount+'$$'+tmpDate;
                $cwe.plugin('infocentermodule').call('CrypeTo', strToken, function(value){
                    if(value && typeof(value) == "string"){ //加密成功
                        strToken = encodeURI(value);  
                        url=url+'?Version='+values.version+'&Action=1&DialupType='+values.DialType+'&Token='+strToken;
                        ShowLoadingOrNormal('loading_account', 'AccountInfo', 1);
                        $('AccountInfo').src = url;
                        //iframeLoadEvent('AccountInfo');
                    }
                });
            });
        }
    });
}

//////////////////////////////////////////////////////////////////////////////
//上网时长 ybq 2012.12.28
function ShowIntervalTime(adUrlName){
    $funCtrl.getFunCfg(FUN_INTERNETTIME,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_INTERNETTIME + '_attributes']==undefined) return;
        if(cfg[FUN_INTERNETTIME + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[FUN_INTERNETTIME + '_attributes'][adUrlName];
        if(url=='') return ;

        //用messagebox弹
        //ShowUrlWnd(url, '上网时长', 270,184);  365 163
         $infoCenter.getMulValue('global', 'account', 'domain', function(values){
            if(values == undefined) values = {};
            var timestamp = new Date().getTime();
            var authenticator = md5(values.account + values.domain + timestamp + 'Eshore!@#');
            url=url+'?'+'username='+values.account+'&domain='+values.domain+'&timestamp='+timestamp+'&authenticator='+authenticator;
            //alert(url);
            ShowUrlWnd(url, '上网时长');
         });
    });
}

//wifi清理工具
function ShowWifiClear(){
    $funCtrl.getFunCfg(FUN_CLEARTOOL,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_CLEARTOOL + '_attributes']==undefined) return;
        if(cfg[FUN_CLEARTOOL + '_attributes']['url']==undefined) return;
        var url=cfg[FUN_CLEARTOOL + '_attributes']['url'];
        if(url=='') return ;
        $cwe.plugin('ioutil').call('OpenExe', App.appPath + '\\ShareAppCleaner.exe',url, function() { });
    });

}

//版本禁用 ybq 2017.1.2
function ErrorJudge(code, subCode){
    if(code == 140003)
    {
        ShowLastError('', code, '',MB_VLIMIT, function(value){
            if(value.type=="mb_ok")
            { 
                $cwe.close();
            }
        });
        return true;
    }
    return false;
}

//打开跳转页面 ybq 2017.1.2
function OpenUrlWithParam(funName, adUrlName, externParam){
   $infoCenter.getMulValue('global', 'account', 'version', 'schoolId', 'area', 'domain', 'ip', 'clientId', 'wlans', function(values){
        if(values == undefined) values = {};
        var strParam = '?';
        if(!(externParam == undefined || externParam == "" || externParam == null))
        {
            strParam += externParam + '&';
        }
        strParam += 'account='+values.account+'&Versions='+values.version+'&schoolID='+values.schoolId+
            '&area='+values.area+'&domain='+values.domain+'&IPAddress='+values.ip+'&ClientID2='+values.clientId+
            '&'+values.wlans;
        OpenUrl(funName, adUrlName, strParam);
    });
    
}
//////////////////////////////////////////////////////////////////
//天气功能 ybq 2016.12.21
function WeatherReg(){
    $cwe.addNotify('cweui.weatherIcon', function(city, photo){
        if(wWeather && wWeather.isValid()){ //只有窗口有效的情况才打开图标
            $('weather_png').src = photo;
            $('weather_city').innerHTML = city;
            $('weather').setStyle('display', 'block'); //打开天气图标
        }   
    });

    //其他窗口发起天气请求
    $cwe.addNotify('cweui.weatherupdate', function(){
        WeatherRequest();
    });

    var fShowWeather = function(){
        if (wIsEnterWnd && wWeather && wWeather.isValid()) {
            var me = $cwe.get('rect');
            if (me) wWeather.postNotify('weather', true, me.left, me.top, me.width);
        }
    };
    $('weather').addEvent('mouseenter', function(){
        if (!wIsEnterWnd) {
            wIsEnterWnd=true;
            fShowWeather.delay(500);
        }
    });
    $('weather').addEvent('mouseleave', function(){
        wIsEnterWnd=false;
        if (wWeather && wWeather.isValid()) {
            wWeather.postNotify('weather', false);
        }
    });
    $('weather').addEvent('click', function(){
        window.open('http://www.weather.com.cn/forecast/', '_blank');
    });

    $cwe.addNotify('cweui.weatherhide', function(w) {});
    
    $cwe.open('', 'weather.html', 'status:hide', function(w){wWeather=w;});
}

//请求天气
function WeatherRequest(){
    if(wWeather && wWeather.isValid()) {
        wWeather.postNotify('weatherRequest');
    }
}

/////////////////////////资讯/////////////////////////////////
var $InfoWnd = {
    isManShow:false,
    showed:false,
    instWnd:null,//已经显示出来的窗口
    tempWnd:null,//自动打开窗口
    /*! @brief [自动弹出资讯窗口,要是已经有窗口了，就不再弹出窗口了，改为显示已打开窗口] */
    IsShowed:function(){
        return this.showed && this.instWnd!=null && this.instWnd.isValid();
    },
    ShowInfoWnd:function (autoShow) {
    	//alert('serverInfoLastDate:' + mServerInfoLastDate);
    	if(mServerInfoLastDate != ''){
    		$infoCenter.setConfigValue('OtherSetting.InfoLastDate', mServerInfoLastDate, false, function() { });
    	}
    	$('InforURL_Dot').setStyle('display', 'none');
            if (this.IsShowed()) { //已经显示了
                return;
            }
            if (autoShow != true) { //手动点击则马上显示
                this.isManShow = true;
                this.showed = true;
                $cwe.open('thread', 'info.html', '', function (info) {
                     $InfoWnd.instWnd = info;
                });
            } else {
                $cwe.open('thread', 'info.html', 'status:hide', function (info) {
                    $InfoWnd.tempWnd=info;
                });
            }
    },
    /*! @brief [隐藏资讯窗口] */
    HideInfoWnd:function() {
        if(this.IsShowed()) this.instWnd.postNotify('infoWndStateChange','hide');
    },
    ShowInst:function(){
        if(this.IsShowed() || this.isManShow){
            if(this.tempWnd != null && this.tempWnd.isValid()){
                this.tempWnd.postNotify('infoWndStateChange','close');
                this.tempWnd=null;
            }
        }else{
            this.showed=true;
            this.instWnd=this.tempWnd;
            this.tempWnd=null;
            this.instWnd.postNotify('infoWndStateChange','show');
        }
    }
};

/*! @brief [打开检测修复工具] */
function OpenCheckAndRepaireTool(){
    $funCtrl.getFunCfg(FUN_SELFDEBUGTOOL,function(cfg){
        var url = '';
        if(cfg!=null){
            if(cfg[FUN_SELFDEBUGTOOL + '_attributes']!=undefined){
                url = cfg[FUN_SELFDEBUGTOOL + '_attributes']['url'];
            }
            if(url == undefined) url = '';
        }
        var me = $cwe.get('rect');
        var ml = me.left + me.width - 2;
        if (ml + 438 > screen.availWidth) ml = me.left - 438 - 5;
        var features = 'position:'+ml+' '+(me.top+3)+' lefttop';
        var param = me.left + ';' + me.top + ';' + url;
        $cwe.plugin('IOUtil').call('OpenExe', '\\SelfDebugTool\\SelfDebugTool.exe', param, function() {});
    }); 
    //App.openWindow('DetectionAndRepairTool',true,'thread', 'DetectionAndRepairTool.html', features, function() { });
}

/*! @brief [打开网络质量监控程序] */
function OpenNetCardCheckEXE(){
//msg.Format(_T("<M><P><account>q</account><version>1009</version><cid>201</cid><dialtype>51</dialtype><sendurl>http://192.168.200.17:12231/EsurfingClient/Other/PostNetCheck.ashx</sendurl><url>http://192.168.200.17:12231/EsurfingClient/Other/GetNetCheck.aspx</url></P></M>"));
    $funCtrl.getFunCfg(FUN_NETCARDCHECK,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_NETCARDCHECK + '_attributes']==undefined) return;
        if(cfg[FUN_NETCARDCHECK + '_attributes']['param']==undefined) return;
        var paramUrl=cfg[FUN_NETCARDCHECK + '_attributes']['param'];
        if(paramUrl=='') return ;

        var sendUrl = cfg[FUN_NETCARDCHECK + '_attributes']['sendUrl'];
        $infoCenter.getMulValue('global', 'account', 'version', 'schoolId', 'DialType', function(values){
            if(values == undefined) values = {};
            var account = values.account || '';
            var version = values.version || '';
            var schoolId = values.schoolId || '';
            var DialType = values.DialType || '';
            var url = '<M><P><account>'+account+'</account><version>'+version+'</version><cid>'+schoolId
                +'</cid><dialtype>'+DialType+'</dialtype><sendurl>'+sendUrl+'</sendurl><url>'+paramUrl+'</url></P></M>';
            //alert(url);
            $cwe.plugin('ioutil').call('OpenExe', App.appPath + '\\NetCardManager.exe',url, function() { });
        });
    });
}

/*! @brief [结束网络质量监控程序] */
function KillNetCardCheckEXE(){
    $cwe.plugin('ioutil').call('KillEXE', 'NetCardManager.exe', function(ret) {});
}

//报障热线 功能 added by xzw in 6.1.2017
function WaringHotline()
{
    var ret=false;
    var WarningHotlineUrl=undefined;
    var CID=undefined;

    $funCtrl.getFunCfg(FUN_WARNINGHOTLINE, function(cfg) {      
        if(cfg == undefined || cfg[FUN_WARNINGHOTLINE + '_attributes'] == undefined) return;
        WarningHotlineUrl = cfg[FUN_WARNINGHOTLINE + '_attributes'].url;
        $infoCenter.getGlobalValue("schoolId",function(value){
            if(value == undefined || value == "") return;
            CID=value;
            WarningHotlineUrl=WarningHotlineUrl+"?cid="+CID;
            PostHTTP(WarningHotlineUrl, '',
                function(responseText, responseXML) {    //http请求成功函数
                    var retJson = JSON.decode(responseText);
                    if(retJson == undefined || retJson.rescode == undefined) return;

                    var HotlineJson = parseInt(retJson.rescode);
                    if(HotlineJson == -1) return;

                    var result = retJson.result[0];
                    if(result == '' || result == undefined) return;

                    var title=retJson.title;
                    if(title == '' || title == undefined) return;

                    $('WarningHotline').setStyle('display','block');
                    $('WarningHotline').set('text',title+'：'+result);
                },
                function() {         //http请求失败函数
                });
            });
    });

}

//错误码上报 功能 added by ybq in 6.12.2017
function PostErrorCode(ErrorCode, subErrorCode){
    $funCtrl.getFunCfg(FUN_ERRORPOST,function(cfg){
        if(cfg==null
            || cfg[FUN_ERRORPOST + '_attributes']==undefined
            || cfg[FUN_ERRORPOST + '_attributes']['submit']==undefined){
            return;
        }

        //获取上传地址
        var submitUrl=cfg[FUN_ERRORPOST + '_attributes']['submit'];
        if(submitUrl=='') return ;

        $infoCenter.getMulValue('global','DialAccount','schoolId','version','clientId',function(values){
           if(subErrorCode != undefined && subErrorCode!='') ErrorCode=ErrorCode + '.' + subErrorCode;
           var strParam=submitUrl+'?Account='+values.DialAccount+'&ErrType=pc&ErrCode='+ErrorCode
                +'&ClientID='+values.clientId+'&CID='+values.schoolId+'&version='+values.version;

            RequestHTTP(strParam, function(){}, function(){});
        })
    });
}

//升级信息上报 功能 added by ybq in 7.17.2017
function PkgGetInfo()
{
    $funCtrl.getFunCfg(FUN_UPDATEINFO,function(cfg){
        if(cfg==null
            || cfg[FUN_UPDATEINFO + '_attributes']==undefined
            || cfg[FUN_UPDATEINFO + '_attributes']['url']==undefined){
            return;
        }

        var strUrl = cfg[FUN_UPDATEINFO + '_attributes']['url'];
        if(strUrl == '') return;

        //获取注册表的信息
        $cwe.plugin('ESurfingUpdate').call('GetUpdaterInfo',function(value){
            if(!value) return;   
            var RegArry = JSON.decode(value, true);

            //获取文件内容
            $cwe.plugin('ioutil').call('ReadFile', App.appdataPath+'\\ChinatelecomJSPortal\\Config\\reg.txt', function(strValue){
                var FileArry = [];
                if(strValue){
                    FileArry = strValue.split(',');
                }
                
                PkgDataSend(RegArry, FileArry, strUrl);
            });
        });
    });
}

//注册表信息和文件的信息做比较
function PkgCompare(ArryReg, ArryFile)
{
    if(typeof(ArryReg) != 'object' || typeof(ArryFile) != 'object') return;
    var strData = [];
    for(var key in ArryReg){
        if(key != 'ctc_cpclient' && !FindJsonData(ArryFile, key))
        {
            strData.push(key);
        }
    }
    return strData;
}

//封装发送数据
function PkgDataSend(ArryReg, ArryFile, strUrl)
{
    var ArryData = PkgCompare(ArryReg, ArryFile);
    if(ArryData.length <= 0) return;

    $infoCenter.getMulValue('global','DialAccount','DialType','clientId',function(values){
        var strParam = 'dialaccount='+values.DialAccount+'&dialuptype='+values.DialType+'&clientid='+values.clientId+'&onlyupdateinfo=1&token=0';
        for(var i = 0; i < ArryData.length; i++){
            var key = ArryData[i];
            strParam = strParam + '&pkg' + i + '=' + key + '&ver' + i + '=' + ArryReg[key];
            ArryFile.push(key);
        }
        strParam = strUrl+'?'+strParam;
        //alert(strParam);
        RequestHTTP(strParam, function(str){
            //alert(str);
            //写入本地文件
            var strData = ArryFile.toString();
            $cwe.plugin('ioutil').call('DeleteFile', App.appdataPath+'\\ChinatelecomJSPortal\\Config\\reg.txt', function(ret){
                $cwe.plugin('ioutil').call('WriteFile', App.appdataPath+'\\ChinatelecomJSPortal\\Config\\reg.txt', strData, function(ret){});
            });
        });
    });
}

var key = CryptoJS.enc.Utf8.parse("9vApxLk5G3PAsJrM");
var iv = CryptoJS.enc.Utf8.parse('FnJL7EDzjqWjcaY9');

function Encrypt(word) {
    srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    //    return encrypted.ciphertext.toString().toUpperCase();
    return encrypted.ciphertext.toString();
}

function Decrypt(word) {
    var encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    var decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

function DevInfor() {
    $funCtrl.getFunCfg(FUN_DEVINFOR, function(cfg) {
        if (
        cfg == null
        || cfg[FUN_DEVINFOR + '_attributes'] == undefined
        || cfg[FUN_DEVINFOR + '_attributes']['url'] == undefined
        )
            return;

        var Url = cfg[FUN_DEVINFOR + '_attributes']['url'];

        if (Url == '')
            return;

        var RSSIThreshold = cfg[FUN_DEVINFOR + '_attributes']['rssi'];

        if (RSSIThreshold == undefined || RSSIThreshold == '') {
            RSSIThreshold = '-100';
        }

        var DevInforInterval = cfg[FUN_DEVINFOR + '_attributes']['interval']; 

        if (DevInforInterval == undefined || DevInforInterval == '') {
	//alert(DevInforInterval);
	DevInforInterval = 4 * 60 * 60;	         
        }

        setTimeout("DevInfor()", DevInforInterval * 1000);

        $infoCenter.getMulValue(
        'global'
        , 'DialAccount'
        , 'clientId'
        , 'schoolId'
        , 'version'
        , 'MAC'
        , 'IPv4'
        , 'IPv6'
        , 'Gateway'
        , 'wlanacip'
        , 'Mask'
        , function(values) {

            var param = new Object;

            param.account = values.DialAccount;
            param.clientid = values.clientId;
            param.schoolid = values.schoolId;
            param.ostype = 1;   //终端类型(PC:1 linux:2 MacOS:3 android:4 iOS:5)
            param.version = values.version;
            param.mac = values.MAC;
            param.ipv4 = values.IPv4;
            param.ipv6 = values.IPv6;
            param.gateway = values.Gateway;
            param.brasip = values.wlanacip;
            param.mask = values.Mask;

            param.hotspotduration = '';

            param.longitude = 0.0;
            param.latitude = 0.0;
            param.starttime = GetLocalStringTime();

            $cwe.plugin('NetwordUtil').call('GetLocalData', RSSIThreshold, function(strNetworkList, APSSID, APMAC, Result) {
                param.hotspotmac = APMAC;
                param.hotspot = APSSID;

                var NetworkList = JSON.decode(strNetworkList);

                param.nearbyhotspots = NetworkList;

                var Array = [];

                Array.push(param);

                var strArray = JSON.encode(Array);

                //                alert(strArray);

                var EncryptParam = Encrypt(strArray);

                //var DecrptParam = Decrypt(EncryptParam);

                PostHTTP(Url, EncryptParam, function(responseJSON, responseXML) {
                //如果成功                
                    var reJson;                    
                    try {
                        reJson = JSON.decode(responseJSON);
                    }
                    catch (e) {
                        return;
                    }

                    if (reJson != undefined && reJson.code == 0) {

                    } else {

                    }
                });
            });

        });

    });
}

//启动感知exe
function OpenPerceptionExe(){
    //获取账号
    $infoCenter.getGlobalValue("DialAccount",function(value){
        if(value == '' || value == undefined) return;
        var strParam = 'login ' + value;
        $cwe.plugin('IOUtil').call('OpenExe', '\\qoe\\ta.exe', strParam, function() {});
    });
}

function GetHandleTips() {
    $funCtrl.getFunCfg(FUN_HANDLEUNIVERSITYURL, function(cfg) {
        if (cfg == undefined
            || cfg[FUN_HANDLEUNIVERSITYURL + '_attributes'] == undefined
            || cfg[FUN_HANDLEUNIVERSITYURL + '_attributes'].clientname == undefined
            ) {
            $('login_qr_title').setStyle('visibility', 'hidden');
        }
        else {
            $('handled').set('text', cfg[FUN_HANDLEUNIVERSITYURL + '_attributes'].clientname);
            $('login_qr_title').setStyle('visibility', 'visible');
        }
    });
}

//自助排障工具日志上报
function ToolLogSubmit(){
    $funCtrl.getFunCfg(FUN_ERRORPOST,function(cfg){
        if(cfg==null
            || cfg[FUN_ERRORPOST + '_attributes']==undefined
            || cfg[FUN_ERRORPOST + '_attributes']['submit']==undefined){
            return ;
        }

        //获取上传地址
        var submitUrl=cfg[FUN_ERRORPOST + '_attributes']['submit'];
        if(submitUrl=='') return ;

        $infoCenter.getMulValue('global','DialAccount','schoolId','wlanuserip','version','clientId','appdataPath',function(values){
            try{
                $cwe.plugin('datasubmit').call('SetLogUrl','submit',submitUrl);
                $cwe.plugin('datasubmit').call('SetLogParam','DialAccount',values.DialAccount);
                $cwe.plugin('datasubmit').call('SetLogParam','schoolId',values.schoolId);
                $cwe.plugin('datasubmit').call('SetLogParam','wlanuserip',values.wlanuserip);
                $cwe.plugin('datasubmit').call('SetLogParam','version',values.version);
                $cwe.plugin('datasubmit').call('SetLogParam','clientId',values.clientId);
                $cwe.plugin('datasubmit').call('SetLogDir','server',values.appdataPath + '\\ChinatelecomJSPortal\\record');

                $cwe.plugin('datasubmit').call('ToolLogSubmit',GetLocalData()+'tool.txt',function(){});
            }catch(e){
               
            }

        })
    });
}

//动态生成的模态弹框
function OpenServicePush(tittle,outWidth,outHeight,inWidth,inHeight,urlName,refresh,failedView)
{
    // $cwe.open('modal','ServicePush.html'
    //     +'?'+'tittle='+escape(tittle)+'&'+'funName='+urlName+'&'+'width='+inWidth+'&'+'height='+inHeight+'&refresh='+refresh+'&failedView='+failedView,
    //     "size:" + outWidth + " " + outHeight 
    //     + ",margin:9 6 9 9,bgimg:img/border.png,bgtype:grid",function(){});

    App.openWindow('ServicePush',true,'thread', 'ServicePush.html'
        +'?'+'tittle='+escape(tittle)+'&'+'funName='+urlName+'&'+'width='+inWidth+'&'+
        'height='+inHeight+'&refresh='+refresh+'&failedView='+failedView, 
        "size:" + outWidth + " " + outHeight + ",margin:9 6 9 9,bgimg:img/border.png,bgtype:grid",
        function() {});
}

//设置点击模块记录 
function SetClickModule(type, moduleId){
    if(JSON.encode(mClickModuleJson) == '{}'){ //json数据还没有数据
        mClickModuleJson["data"] = [];  
    }

    var nowTime = GetLocalData();
    var clickJson = {}; //记录当天日期的数据
    var index = -1; //记录当天日期的数据下标
    for(var i=0; i<mClickModuleJson["data"].length; i++){
        if(mClickModuleJson["data"][i] != undefined){
            if(mClickModuleJson["data"][i].stattime==nowTime && mClickModuleJson["data"][i].account == mAccount){
                clickJson = mClickModuleJson["data"][i];
                index = i;
                break;
            }
        }
    }

    if(index == -1){ //如果没找到，说明这个时间的数据还没定义
        clickJson["stattime"] = nowTime;
        clickJson["account"] = mAccount;
        clickJson["click"] = [];
        index = mClickModuleJson["data"].length;
        $infoCenter.getMulValue('global','clientId', 'version', 'schoolId', function(values){
            clickJson["version"] = values.version;
            clickJson["clientid"] = values.clientId;
            clickJson["cid"] = values.schoolId;
            clickJson["ostype"] = 1;

            clickJson["click"][moduleId] = {};
            clickJson["click"][moduleId].count = 1;
            clickJson["click"][moduleId].moduleid = moduleId;
            clickJson["click"][moduleId].type = type;

            mClickModuleJson["data"][index] = clickJson;
        });
    }
    else{
        if(clickJson["click"][moduleId] == undefined){
            clickJson["click"][moduleId] = {};
            clickJson["click"][moduleId].count = 0;
            clickJson["click"][moduleId].moduleid = moduleId;
            clickJson["click"][moduleId].type = type;
        }

        clickJson["click"][moduleId].count = clickJson["click"][moduleId].count+1;
        mClickModuleJson["data"][index] = clickJson;
    }  
}

//读取点击模块记录
function ReadClickModuleData(){
     $infoCenter.getGlobalValue('appdataPath', function(appdatapath){
        if(appdatapath == undefined) return;
        $cwe.plugin('ioutil').call('ReadFile', appdatapath +'\\ChinatelecomJSPortal\\Config\\ClickModule.txt', function(strValue){
            if(strValue == undefined || strValue =='' || strValue == '{}') return;

            mClickModuleJson = JSON.decode(strValue);
        });
    });
}

//写入点击模块记录
function WriteClickModuleData(dataJson){
    //在写入前先删除原来的文件 
    $cwe.plugin('ioutil').call('DeleteFile', App.appdataPath+'\\ChinatelecomJSPortal\\Config\\ClickModule.txt', function(){});
    $cwe.plugin('ioutil').call('WriteFile', App.appdataPath+'\\ChinatelecomJSPortal\\Config\\ClickModule.txt', JSON.encode(dataJson),function(){});
}

//发送数据到后台
function SendClickModuleData(dataJson){
    $funCtrl.getFunCfg(FUN_ADCLICKUPLOAD, function(cfg) {
        if(cfg==null
            || cfg[FUN_ADCLICKUPLOAD + '_attributes']==undefined
            || cfg[FUN_ADCLICKUPLOAD + '_attributes']['url']==undefined){
            return ;
        }
        var url=cfg[FUN_ADCLICKUPLOAD + '_attributes']['url'];
        if(url != undefined && url != null && url != '' && JSON.encode(mClickModuleJson) != '{}') {
            JsonPostHTTP(url, mClickModuleJson, function(responseJSON){
                //如果成功，删除json数据
                var reJson = JSON.decode(responseJSON);
                if(reJson != undefined && reJson.code == 0)
                {
                    mClickModuleJson = {};
                    var nowTime = GetLocalData();
                    $infoCenter.setConfigValue('ClickUploadTime', nowTime, false, function(){});
                }
            });
        }
    });
}

//打开在线客服
function OpenQQ(){
    $infoCenter.getConfigValue('QQ.qqNumber', false, function(value){
        if(value == undefined || value == '') value = 1508723261;
        var url = 'tencent://message/?uin=' + value;
        $cwe.plugin('ioutil').call('OpenExe', url, '', function() { });
    });
    
    //ShellExecute(NULL, _T(“open”), _T(“tencent://message/?uin=要发起链接的QQ号”), NULL, NULL, SW_SHOW); 'http://wpa.qq.com/msgrd?v=3&uin=1508723261&site=qq&menu=yes'
}

//更新qq信息到本地
function UpdateQQNumber(){
     $funCtrl.getFunCfg(FUN_QQ, function(cfg) {
        if(cfg==null
            || cfg[FUN_QQ + '_attributes']==undefined
            || cfg[FUN_QQ + '_attributes']['number']==undefined){
            return ;
        }
        var number = cfg[FUN_QQ + '_attributes']['number'];
        var isEable = cfg[FUN_QQ + '_attributes']['enable'];
        $infoCenter.setConfigValue('QQ.qqNumber', number, function(){});

        if(isEable != undefined || isEable != ''){
            $infoCenter.setConfigValue('QQ.enable', isEable, function(){});
        }
    });
}

//检测qq是否要开启
function CheckQQIsOpen(){
    $infoCenter.getConfigValue('QQ.enable', false, function(value){
        if(value == "0"){ //qq默认开启，只有配置了关闭才关闭
            $MenuObject.setMenuItemStatus('在线客服', 'disable');
        }
    });
}

//话费余额提醒
function MoneyRemind(adUrlName){
    $funCtrl.getFunCfg(FUN_MONETREMIND, function(cfg) { //1.获得后台地址
        if(cfg==null
            || cfg[FUN_MONETREMIND + '_attributes']==undefined
            || cfg[FUN_MONETREMIND + '_attributes'][adUrlName]==undefined){
            return ;
        }
        var url = cfg[FUN_MONETREMIND + '_attributes'][adUrlName];
        if(url == '') return;

        $infoCenter.getMulValue('global','DialAccount','version','schoolId','wlans', function(values){
            if(values == undefined) values = {};
            var param = 'ostype=1&version='+values.version+'&dialupaccount='+values.DialAccount+'&cid='+values.schoolId+'&'+values.wlans;
            url = AddParam(url, param);
            RequestHTTP(url, ParseMoneyRemind); //2.请求后台地址
        });
    });
}

//话费余额提醒数据解析
var mMoneyRemindWnd;
//zhangliangming 2020.03.09 提醒窗口标识
var mMoneyDialogFlag = false;
function ParseMoneyRemind(responseText, responseXML){ //3.解析后台数据
    //alert(responseText);
    var dataJson = JSON.decode(responseText);
    if(dataJson == undefined || typeof dataJson != "object") return;

    var status = dataJson.status; //0 success -1 fail
    if(status != 0) return;

    var text = dataJson.tooltips; //tips
    if(text == undefined || text == '') return;
    
    //zhangliangming 2020.03.09 对返回的数据含有换行符进行替换
    text = text.replace(/\r\n/g,"<br>")
	text = text.replace(/\n/g,"<br>");
    
    var SendJson = '{"title":"话费余额提醒","position":"rightbottom","text":"'+text+'","url":"'+dataJson.url+'"}';
    if(mMoneyRemindWnd != undefined){
    	mMoneyDialogFlag = false;
        mMoneyRemindWnd.postNotify('closemsgbox');
    }
    
    $cwe.open('thread', 'msgbox.html', 'status:hide', function(w){ //4.打开提醒框
        mMoneyRemindWnd = w;
        mMoneyDialogFlag = true;
        var openFun = function(){
            mMoneyRemindWnd.postNotify('msgboxtextmsg', SendJson);
        }
        
        //zhangliangming 2020.03.09 添加窗口加载完成事件监听
        $cwe.addNotify('cweui.MsgboxOpened', function() {
        	if(mMoneyDialogFlag){
        		openFun();
        	}
        });
    }); 
}


/////////////////////////账单查询-zlm 2020.04.08/////////////////////////////////
var $BillWnd = {
    isManShow:false,
    instWnd:null,//已经显示出来的窗口
    /*! @brief [要是已经有窗口了，就不再弹出窗口了，改为显示已打开窗口] */
    IsShowed:function(){
        return this.isManShow && this.instWnd!=null && this.instWnd.isValid();
    },
    ShowBillWnd:function () {
            if (this.IsShowed()) { //已经显示了
                return;
            }
            this.isManShow = true;
            $cwe.open('thread', 'SearchBill.html', '', function (info) {
            	$BillWnd.instWnd = info;
           });
    },
    /*! @brief [隐藏窗口] */
    HideBillWnd:function() {
        if(this.IsShowed()) this.instWnd.postNotify('billWndStateChange','hide');
    },
    ShowInst:function(){
    	if (this.IsShowed()) { //已经显示了
            return;
        }
    	this.instWnd.postNotify('billWndStateChange','show');
    }
};

/////////////////////////充值缴费查询-zlm 2020.04.09/////////////////////////////////
var $ChargeWnd = {
    isManShow:false,
    instWnd:null,//已经显示出来的窗口
    /*! @brief [要是已经有窗口了，就不再弹出窗口了，改为显示已打开窗口] */
    IsShowed:function(){
        return this.isManShow && this.instWnd!=null && this.instWnd.isValid();
    },
    ShowChargeWnd:function () {
            if (this.IsShowed()) { //已经显示了
                return;
            }
            this.isManShow = true;
            $cwe.open('thread', 'SearchCharge.html', '', function (info) {
            	$ChargeWnd.instWnd = info;
           });
    },
    /*! @brief [隐藏窗口] */
    HideChargeWnd:function() {
        if(this.IsShowed()) this.instWnd.postNotify('chargeWndStateChange','hide');
    },
    ShowInst:function(){
    	if (this.IsShowed()) { //已经显示了
            return;
        }
    	this.instWnd.postNotify('chargeWndStateChange','show');
    }
};
