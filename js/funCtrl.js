/*
 <config><ticket-url><![CDATA[http://{HTTP_HOST}/ticket.cgi?{QUERY_STRING}]]></ticket-url><query-url><![CDATA[http://{HTTP_HOST}/query.cgi]]></query-url><auth-url><![CDATA[http://{HTTP_HOST}/auth.cgi]]></auth-url><state-url><![CDATA[http://{HTTP_HOST}/state.cgi]]></state-url><auth><type>cdc-http-pap</type></auth><auth><type>cdc-mobile-qr</type><default>yes</default></auth><auth><type>cdc-mobile-sw</type></auth><account><modify><type>del-domain</type></modify></account><notify>
 <register>udp://192.168.132.251:9000</register>
 <register>udp://192.168.132.252:9001</register>
 <option>0,4,GFK0</option>
 <option>0,1,072704z0d0</option>
 </notify><FunCfg>
 <Update url="http://192.168.200.17:12231/esurfingclient/GetPkg.ashx" inteval="60" />
 <Ad url="http://zsteduapp.10000.gd.cn/Esurfingclient/GetPortalInterface.aspx?key=GD_0003" accountUrl="http://zsteduapp.10000.gd.cn/Esurfingclient/GetPortalInterface.aspx?key=GD_0002"/>
 <MyAccount url="http://zsteduapp.10000.gd.cn/GDTC/PackRedirect.html" />
 <InforURL url="http://192.168.200.11:3000/CampusInfo/page/pc/index.html" ifurl="http://192.168.200.11:3000/esurfingclient/getcampusinfo" inteval="5" bgInteval="5" enable="1"/>
 <Weather Province="http://zsteduapp.10000.gd.cn/EsurfingClient/Other/Citys.xml" Param="http://zsteduapp.10000.gd.cn/CityWeather" CurrentCity="http://202.102.41.168:8080/esurfingclient/Other/QueryUserCity.ashx?" MoreWeather="http://www.weather.com.cn/forecast/"/>
 <Notice url="http://enet.10000.gd.cn:10001/client/queryannouncement" />
 <SpeedUp url="http://202.102.41.168:8080/SGWBroadbandSpeed/ActionCenter.ashx?" />
 <HelpUrl url="http://pre.f-young.cn/faq.html" local="true"/>
 <ChargeUrl url="http://zsteduapp.10000.gd.cn/More/Recharge/index.html"/>
 <PasswordUrl url="http://enet.10000.gd.cn:10001/transfer.jsp" />
 <internetTime url="http://zsteduapp.10000.gd.cn/EsurfingClient/Other/GetUseredTime.aspx" />
 <FreeAccountUrl url="http://zsteduapp.10000.gd.cn/More/Registration/PC/Registration.html" />
 <ClearTool url="http://192.168.200.17:12211/esurfingclient/other/Configuration.json" />
 <HandleUniversityUrl url="http://www.baidu.com" />
 <WarningHotlineUrl url="http://192.168.200.17:12231/GD.Proxy/GetHotline.ashx" />
 <BrandbandUrl url="www.baidu.com" />
 <SelfStopReply url="http://zsteduapp.10000.gd.cn/more/stopmachine/index.html"/>
 <ForgotPassword url="http://zsteduapp.10000.gd.cn/More/retrievepassword/index_new.html" />
 <OfficialUrl url="http://www.youku.com" />
 <UpdateInfo url="http://192.168.200.17:12231/EsurfingClient/GetUpdateInfo.ashx"/>
 <SelfDebugTool url="http://zsteduapp.10000.gd.cn/esurfingclient/other/NetCheckConfig.xml" />
 <SearchBill url="http://192.168.200.11:3000/CampusInfo/page/pc/billSearch.html" ifurl="http://192.168.200.11:3000/esurfingclient/getcampusinfo"/>
 <SearchCharge url="http://192.168.200.11:3000/CampusInfo/page/pc/chargeSearch.html" ifurl="http://192.168.200.11:3000/esurfingclient/getcampusinfo" />
 </FunCfg>
 </config>
 */
var FUN_PROVINCE               = "Province"        ;   //省份
var FUN_UPDATE                 = "Update"          ;   //升级-已做
var FUN_AD                     = "AdUrl"              ;  //广告-已做-需测试
var FUN_MYACCOUNT              = "MyAccount"       ;   //账户-姚柏清-在测试
var FUN_INFORURL               = "InforURL"        ;   //咨询-已做
var FUN_WEATHER                = "Weather"         ;   //天气-已做
var FUN_NOTICE                 = "Notice"          ;   //公告-已做
var FUN_SPEEDUP                = "SpeedUp"         ;   //提速-徐志旺
var FUN_HELPURL                = "HelpUrl"         ;   //帮助文档-已做
var FUN_CHARGEURL              = "ChargeUrl"       ;   //充值-已做
var FUN_PASSWORDURL            = "PasswordUrl"     ;   //修改密码-已做
var FUN_INTERNETTIME           = "internetTime"    ;   //剩余时长-已做
var FUN_FREEACCOUNTURL         = "FreeAccountUrl";   //体验帐号-已做
var FUN_HANDLEUNIVERSITYURL    = "HandleUniversityUrl";   //掌上大学-已做
var FUN_CLEARTOOL              = "ClearTool"       ;   //清理工具-已做-重复打开
var FUN_MKTINFT                = "MktIntf"         ;   //消息推送-已做
var FUN_ERRORPOST              = "ErrorPost"       ;   //错误上报-徐志旺
var FUN_NETTERMINAL            = "NetTerminal"     ;   //上网终端管理-已做
var FUN_NETCARDCHECK           = "NetCardCheck"    ;   //网络质量监控
var FUN_WARNINGHOTLINE         = "WarningHotlineUrl"  ;   //报障联系方式-徐志旺
var FUN_BRANDBAND              = "BrandbandUrl"    ;    //宽带套餐办理
var FUN_SELFSTOPREPLY          = "SelfStopReply"    ;   //自助停复机
var FUN_FORGORPASSWORD         = "ForgotPassword"   ;   //忘记密码
var FUN_OFFICIALURL            = "OfficialUrl"      ;   //官方网站
var FUN_UPDATEINFO             = "UpdateInfo"       ;   //上传升级信息
var FUN_FEEDBACKURL            = "FeedBackUrl"      ;   //反馈建议
var FUN_SELFDEBUGTOOL          = "SelfDebugTool"    ;   //自助排障工具配置文件
var FUN_WELCOMEURL             = "WelcomeUrl"       ;   //智能客服欢迎
var FUN_CHATURL                = "ChatUrl"          ;   //智能客服聊天
var FUN_SEARCHURL              = "SearchUrl"        ;   //智能客服搜索地址
var FUN_ADCLICKUPLOAD          = "AdClickUpload"    ;   //广告点击量上报
var FUN_QQ                     = "QQNumber"         ;   //qq号码配置
var FUN_MONETREMIND            = "MoneyRemind"      ;   //话费余额提醒
var FUN_SEARCHBILL             = "SearchBill"      ;   //账单查询 zhangliangming 2020-04-08
var FUN_SEARCHCHARGE = "SearchCharge"; //充值查询 zhangliangming 2020-04-09
var FUN_DEVINFOR = "DevInfor";   //设备信息

//检测修复工具-姚柏清
//关于-已做
//设置-已做 还需优化
//错误弹框-已做
//菜单-已做 还需优化

var $funCtrl={
    //获取功能配置
    schoolId:'',
    area:'',
    account:'',
    province:'', //省份
    getFunCfg : function(funName,cbFun){
        var FUN_funName='FUN_'+ funName; //自动补上FUN_
        if(this.schoolId=='' || this.area=='' || this.account==''){
            $infoCenter.getMulValue('global','schoolId','area','DialAccount',FUN_funName,function(values){
                this.schoolId=values['schoolId'];
                this.area=values['area'];
                this.account=values['DialAccount'];
                _getFunCfg(this.schoolId, this.area, this.account, funName, values[FUN_funName], cbFun);
            })
        }else{
            $infoCenter.getGlobalValue(FUN_funName,function(value){
                _getFunCfg(this.schoolId,this.area,this.account,funName,value,cbFun);
            })
        }
    },

    GetProvince : function(){
        this.getFunCfg(FUN_PROVINCE, function(cfg){
            if(cfg == null) return;
            if(cfg[FUN_PROVINCE + '_attributes'] == undefined || cfg[FUN_PROVINCE + '_attributes']['province']==undefined) return;
            this.province = cfg[FUN_PROVINCE + '_attributes']['province'];
            return this.province;
        });
    },

    /*设置按钮的状态 开启/隐藏  ybq 2012.12.21 visibility:hidden 属性占位
    divName：按钮名字， funName:功能名字，例如：FUN_INFORURL(资讯)，atname：节点下的属性名，可为空 */
    SetButtonState : function(divName, funName, atname){
        if($(divName) == undefined){
            //log('lost div name '+divName);
            return;
        }
        $(divName).setStyle('display', 'block');
        this.getFunCfg(funName,function(cfg){
            if(cfg==null){ //没有找到该节点
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            if(cfg[funName + '_attributes']==undefined || cfg[funName + '_attributes'][atname]==undefined){//没有配置属性值
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            if(cfg[funName + '_attributes'][atname] == '0'){ //如果enable属性配置了0，则不显示
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            var url=cfg[funName + '_attributes']['url'];
            if(url==''){
                $(divName).setStyle('visibility', 'hidden');
                return;
            }
            $(divName).url = url;
            //获取其他属性
            if(cfg[funName + '_attributes']['inteval']!=undefined){ //定时配置
                $(divName).inteval = cfg[funName + '_attributes']['inteval'];
            }

        });
    },
	/**
	 * 获取funName的状态（显示或者隐藏）
	 * @param {Object} funName 
	 * @param {Object} atname 节点下的属性名，可为空
	 * @param {Object} cbFun 回调(funName,cfg)
	 * 
	 */
	GetState: function(funName, atname, cbFun) {
		this.getFunCfg(funName, function(cfg) {
			if(cfg == null) { //没有找到该节点
				cbFun(funName, null);
				return;
			}

			if(cfg[funName + '_attributes'] == undefined || cfg[funName + '_attributes'][atname] == undefined) { //没有配置属性值
				cbFun(funName, null);
				return;
			}

			if(cfg[funName + '_attributes'][atname] == '0') { //如果enable属性配置了0，则不显示
				cbFun(funName, null);
				return;
			}

			var url = cfg[funName + '_attributes']['url'];
			if(url == '') {
				cbFun(funName, null);
				return;
			}
			cbFun(funName, cfg);
		});
	}
}

function _getFunCfg (_schoolId,_area,_account,funName,value,cbFun){
    if(value==""){//不提供该功能
        cbFun(null);
        return;
    }

    try{
        var jsonObj = xmlToJson(parseXML(value));
        //根据学校，区域，帐号，以及黑白名单判断是否启用该功能
        //学校黑名单 'blackSch'，白名单 'whiteSch'
        //区域黑名单 'blackArea'，白名单 'whiteArea'
        //帐号黑名单 'blackAcc', 白名单 'whiteArea'
        if(!filterFun(jsonObj[funName + '_attributes'],_schoolId,_area,_account)){
            cbFun(null);
            return;
        }

        cbFun(jsonObj);
    }catch(e){alert('_getFunCfg' +  e.message);cbFun(null);} //配置出错
}

function filterFun(attr,_schoolId,_area,_account){
    if(undefined==attr) return true;
    return (_filterFun('blackSch','whiteSch',attr,_schoolId)
            && _filterFun('blackArea','whiteArea',attr,_area)
            && _filterFun('blackAcc','whiteArea',attr,_account));
}
function _filterFun(blackName,whiteName,attr,_schoolId){
    if(attr[blackName]){
        var blacklist=attr[blackName].split(',');
        for(var i=0;i<blacklist.length;i++){
            if(blacklist[i]==_schoolId) return false;  //如果匹配到黑名单，则不启用该功能
        }
    }
    if(attr[whiteName]){//如果配置了白名单,则没有匹配到白名单的，都不启用该功能
        var whitelist=attr[whiteName].split(',');
        for(var i=0;i<whitelist.length;i++){
            if(whitelist[i]==_schoolId) return true;
        }
        return false;
    }
    return true; //不在黑名单里面，并且没有配置白名单
}