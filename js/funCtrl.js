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
var FUN_PROVINCE               = "Province"        ;   //??????
var FUN_UPDATE                 = "Update"          ;   //??????-??????
var FUN_AD                     = "AdUrl"              ;  //??????-??????-?????????
var FUN_MYACCOUNT              = "MyAccount"       ;   //??????-?????????-?????????
var FUN_INFORURL               = "InforURL"        ;   //??????-??????
var FUN_WEATHER                = "Weather"         ;   //??????-??????
var FUN_NOTICE                 = "Notice"          ;   //??????-??????
var FUN_SPEEDUP                = "SpeedUp"         ;   //??????-?????????
var FUN_HELPURL                = "HelpUrl"         ;   //????????????-??????
var FUN_CHARGEURL              = "ChargeUrl"       ;   //??????-??????
var FUN_PASSWORDURL            = "PasswordUrl"     ;   //????????????-??????
var FUN_INTERNETTIME           = "internetTime"    ;   //????????????-??????
var FUN_FREEACCOUNTURL         = "FreeAccountUrl";   //????????????-??????
var FUN_HANDLEUNIVERSITYURL    = "HandleUniversityUrl";   //????????????-??????
var FUN_CLEARTOOL              = "ClearTool"       ;   //????????????-??????-????????????
var FUN_MKTINFT                = "MktIntf"         ;   //????????????-??????
var FUN_ERRORPOST              = "ErrorPost"       ;   //????????????-?????????
var FUN_NETTERMINAL            = "NetTerminal"     ;   //??????????????????-??????
var FUN_NETCARDCHECK           = "NetCardCheck"    ;   //??????????????????
var FUN_WARNINGHOTLINE         = "WarningHotlineUrl"  ;   //??????????????????-?????????
var FUN_BRANDBAND              = "BrandbandUrl"    ;    //??????????????????
var FUN_SELFSTOPREPLY          = "SelfStopReply"    ;   //???????????????
var FUN_FORGORPASSWORD         = "ForgotPassword"   ;   //????????????
var FUN_OFFICIALURL            = "OfficialUrl"      ;   //????????????
var FUN_UPDATEINFO             = "UpdateInfo"       ;   //??????????????????
var FUN_FEEDBACKURL            = "FeedBackUrl"      ;   //????????????
var FUN_SELFDEBUGTOOL          = "SelfDebugTool"    ;   //??????????????????????????????
var FUN_WELCOMEURL             = "WelcomeUrl"       ;   //??????????????????
var FUN_CHATURL                = "ChatUrl"          ;   //??????????????????
var FUN_SEARCHURL              = "SearchUrl"        ;   //????????????????????????
var FUN_ADCLICKUPLOAD          = "AdClickUpload"    ;   //?????????????????????
var FUN_QQ                     = "QQNumber"         ;   //qq????????????
var FUN_MONETREMIND            = "MoneyRemind"      ;   //??????????????????
var FUN_SEARCHBILL             = "SearchBill"      ;   //???????????? zhangliangming 2020-04-08
var FUN_SEARCHCHARGE = "SearchCharge"; //???????????? zhangliangming 2020-04-09
var FUN_DEVINFOR = "DevInfor";   //????????????

//??????????????????-?????????
//??????-??????
//??????-?????? ????????????
//????????????-??????
//??????-?????? ????????????

var $funCtrl={
    //??????????????????
    schoolId:'',
    area:'',
    account:'',
    province:'', //??????
    getFunCfg : function(funName,cbFun){
        var FUN_funName='FUN_'+ funName; //????????????FUN_
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

    /*????????????????????? ??????/??????  ybq 2012.12.21 visibility:hidden ????????????
    divName?????????????????? funName:????????????????????????FUN_INFORURL(??????)???atname???????????????????????????????????? */
    SetButtonState : function(divName, funName, atname){
        if($(divName) == undefined){
            //log('lost div name '+divName);
            return;
        }
        $(divName).setStyle('display', 'block');
        this.getFunCfg(funName,function(cfg){
            if(cfg==null){ //?????????????????????
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            if(cfg[funName + '_attributes']==undefined || cfg[funName + '_attributes'][atname]==undefined){//?????????????????????
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            if(cfg[funName + '_attributes'][atname] == '0'){ //??????enable???????????????0???????????????
                $(divName).setStyle('visibility', 'hidden');
                return;
            }

            var url=cfg[funName + '_attributes']['url'];
            if(url==''){
                $(divName).setStyle('visibility', 'hidden');
                return;
            }
            $(divName).url = url;
            //??????????????????
            if(cfg[funName + '_attributes']['inteval']!=undefined){ //????????????
                $(divName).inteval = cfg[funName + '_attributes']['inteval'];
            }

        });
    },
	/**
	 * ??????funName?????????????????????????????????
	 * @param {Object} funName 
	 * @param {Object} atname ?????????????????????????????????
	 * @param {Object} cbFun ??????(funName,cfg)
	 * 
	 */
	GetState: function(funName, atname, cbFun) {
		this.getFunCfg(funName, function(cfg) {
			if(cfg == null) { //?????????????????????
				cbFun(funName, null);
				return;
			}

			if(cfg[funName + '_attributes'] == undefined || cfg[funName + '_attributes'][atname] == undefined) { //?????????????????????
				cbFun(funName, null);
				return;
			}

			if(cfg[funName + '_attributes'][atname] == '0') { //??????enable???????????????0???????????????
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
    if(value==""){//??????????????????
        cbFun(null);
        return;
    }

    try{
        var jsonObj = xmlToJson(parseXML(value));
        //??????????????????????????????????????????????????????????????????????????????
        //??????????????? 'blackSch'???????????? 'whiteSch'
        //??????????????? 'blackArea'???????????? 'whiteArea'
        //??????????????? 'blackAcc', ????????? 'whiteArea'
        if(!filterFun(jsonObj[funName + '_attributes'],_schoolId,_area,_account)){
            cbFun(null);
            return;
        }

        cbFun(jsonObj);
    }catch(e){alert('_getFunCfg' +  e.message);cbFun(null);} //????????????
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
            if(blacklist[i]==_schoolId) return false;  //????????????????????????????????????????????????
        }
    }
    if(attr[whiteName]){//????????????????????????,??????????????????????????????????????????????????????
        var whitelist=attr[whiteName].split(',');
        for(var i=0;i<whitelist.length;i++){
            if(whitelist[i]==_schoolId) return true;
        }
        return false;
    }
    return true; //???????????????????????????????????????????????????
}