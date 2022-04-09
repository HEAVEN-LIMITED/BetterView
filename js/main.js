var wWeather = false,
wIsEnterWnd = false,
m_isPreConnected = false,
m_isConnected = false,
m_isAccountWnd = false;
var svrMgr = new SvrMgr();
var dialMgr = new DialMgr();
var m_gFunJson = {
    "0": "InforURL",
    "1": "ChargeUrl",
    "2": "FreeAccountUrl",
    "3": "SpeedUp",
    "4": "ForgotPassword",
    "5": "ChatUrl"
}; //配置在此处的功能，html中的id必须要与此名字保持一致
var needStop = {
    /*'MktIntf': '0'*/
};
var ClearDownUpTimeCount;
var NetType; //网络状态
var OpenRepairTool = false;
var isOpenWifiTip = false; //是否打开过共享提示
var isOpenUpdateTip = false; //是否打开过升级提示
var mClickModuleJson = {};
var mAccount = '';

var mInfoTimer = null; //校园信息专区定时器 zlm 2020.06.08
var INFO_DEF_TIME = 4 * 3600 * 1000; //校园信息专区默认时间间隔是4小时 zlm 2020.06.08
var mInfoBgIntevalTime = INFO_DEF_TIME;
var mServerInfoLastDate = ''; //校园信息专区默认最新消息时间 zlm 2020.06.09
var time = 5;
var AutoLoginCountDown = undefined;

function init() {
    App.currentView = 'login_checkstate';
    svrMgr.regSvrMsg(CLIENT_START_COMPLETE, svrStartComplete);
    svrMgr.regSvrMsg(NET_STATE_MESSAGE_RESP, handleMessage);
    svrMgr.regSvrMsg(SET_VALUE, svrSetInfoCenter);
    svrMgr.regSvrMsg(TICKET_RESP, ticketResp);
    svrMgr.regSvrMsg(FUN_CFG, funCfg);
    svrMgr.regSvrMsg(CHECK_WIFI_RESP, CheckWifiResp);
    svrMgr.regSvrMsg(SERVER_STATUS_RESP, DealServerStatus);
    svrMgr.regSvrMsg(DISASTER_URL, OpenDisasteUrl);
    svrMgr.regSvrMsg(APP_ERR, DealAppErr);
    svrMgr.regSvrMsg(UPDATE_COMPLETE, UpdateComplete);

    App.start(function(flag) {
        if (!flag) {
            $cwe.close();
            return; //要退出
        }
        //zhangliangming 2019.12.23修改其它设置资讯的状态
        $infoCenter.setConfigValue('OtherSetting.showRemindInfo', '0', false,
        function() {});
        $cwe.feature('status:show',
        function() {});
        //天气注册函数
        WeatherReg();
        UIMsgReg(); //界面消息注册
        TimeOutEvent(); //定时任务
        svrMgr.start(function(flag) {
            if (!flag) return; //启动服务器失败
            dialMgr.start();
        });

        ReadClickModuleData();

        CheckQQIsOpen();
    });

}

//初始化时启动的定时任务
function TimeOutEvent() {
    //速率
    GetSpeedAndFlow();
}

function regButtonState() {
    //按钮
    for (var i in m_gFunJson) {
        $funCtrl.SetButtonState(m_gFunJson[i], m_gFunJson[i], 'enable');
    }
}

function onKeyUpEvent(divName, e) {
    if (window.event) //如果window.event对象存在，就以此事件对象为准  
    e = window.event;
    var code = e.charCode || e.keyCode;
    if (code == 13) {
        //此处编写用户敲回车后的代码
        DoLoginPAP();
    }
}

//界面消息注册ShowOrHidePwd
function UIMsgReg() {
    $userInput = new InputEx('txt_userid', '请输入账号');
    $passwordInput = new InputEx('txt_passwd', '请输入密码', onKeyUpEvent);

    $('net').addEvent('click',
    function() { //网络连接界面
        AccountInfoToNetInfo();
    });

    $('account').addEvent('click',
    function() { //我的账号界面
        NetInfoToAccoutnInfo();
        SetClickModule(3, CLICK_MYACCOUNT);
    });

    $('AccountInfo').addEvent('load',
    function() { //等待我的账户url加载完成才显示
        $('loading_account').setStyle('display', 'none');
        $('AccountInfo').setStyle('display', 'block');
    });

    $('InforURL').addEvent('click',
    function() { //资讯
        //App.openWindow('info',true,'thread', 'info.html', '', function() { });
        $InfoWnd.ShowInfoWnd();
        SetClickModule(3, CLICK_INFORURL);
    });
    $cwe.addNotify('cweui.InfoWndShowed',
    function() {
        $InfoWnd.ShowInst();
    });

    //添加账单查询界面打开监听 zlm 2020.04.08
    $cwe.addNotify('cweui.BillWndShowed',
    function() {
        $BillWnd.ShowInst();
    });

    //添加充值缴费查询界面打开监听 zlm 2020.04.09
    $cwe.addNotify('cweui.ChargeWndShowed',
    function() {
        $ChargeWnd.ShowInst();
    });

    $('login_qr_button').addEvent('click',
    function() { //切换到账号登录界面按钮
        m_isAccountWnd = true;
        login_view('login_qr', 'login_pad');
        //login_view('login_qr','login_complete');
    });
    $('login_pad_button').addEvent('click',
    function() { //切换到二维码界面按钮
        if (App.eState == $ESTATE.ES_CONNECTING) return;
        login_view('login_pad', 'login_qr');
    });
    $('chk_save_pwd').addEvent('click',
    function() { //记住密码
        $('lab_save_pwd').set('class', $('chk_save_pwd').get('checked') ? 'chklabel': 'unchklabel');
    });

    $('chk_auto_login').addEvent('click',
    function() { //自动登录
        $('lab_auto_login').set('class', $('chk_auto_login').get('checked') ? 'chklabel': 'unchklabel');
        var autologin = $('chk_auto_login').get('checked') ? '1': '0';
        $infoCenter.setConfigValue('Account.autologin', autologin, false,
        function() {});
    });

    $('login_pad_done').addEvent('click', DoLoginPAP); //登录按钮
    $('loginout_pad_done').addEvent('click', DoLoginoutPAP); //断开按钮
    $('SpeedUp').addEvent('click',
    function() {
        App.openWindow('AboutWnd', true, 'thread', 'AKeyToSpeedUp.html', '',
        function() {});
    });

    $('ChargeUrl').addEvent('click',
    function() { //充值缴费
        OpenUrlWithParam(FUN_CHARGEURL, 'url');
        SetClickModule(3, CLICK_CHARGEURL);
    });
    $('FreeAccountUrl').addEvent('click',
    function() { //异网体验
        OpenUrlWithParam(FUN_FREEACCOUNTURL, 'url');
        SetClickModule(3, CLICK_FREEACCOUNTURL);
    });

    $('ForgotPassword').addEvent('click',
    function() {
        OpenUrlWithParam(FUN_FORGORPASSWORD, 'url', 'action=reset');
        SetClickModule(3, CLICK_FORGORPASSWORD);
    });

    $('handled').addEvent('click',
    function() { //掌上大学
        OpenUrl(FUN_HANDLEUNIVERSITYURL, 'url');
        SetClickModule(3, CLICK_HANDLEUNIVERSITYURL);
    });

    $('MainWnd_Close').addEvent('click',
    function() { //关闭事件
        DealCloseEvent();
    });

    $('ShowOrHidePwd').addEvent('click',
    function() {
		var x = document.getElementById("txt_passwd");
		if (x.type === "password") {
			x.type = "text";
		} else {
			x.type = "password";
		}
        $passwordInput.showInput();
        $('ShowOrHidePwd').focus();
        if ($('ShowOrHidePwd').get('class') == 'ShowPwd') {
            $('ShowOrHidePwd').set('class', 'HidePwd');
            $('ShowOrHidePwd').set('title', '隐藏密码');

        } else if ($('ShowOrHidePwd').get('class') == 'HidePwd') {
            $('ShowOrHidePwd').set('class', 'ShowPwd');
            $('ShowOrHidePwd').set('title', '显示密码');
        }
    });

    $('NetCheckRefresh').addEvent('click',
    function() {
        login_view(App.currentView, 'login_checkstate');
        dialMgr.start();
    });

    $('NetCheckHelp').addEvent('click',
    function() {
        $cwe.plugin('IOUtil').call('OpenURL', '\\ErrorView\\ErrorInfo.html',
        function() {});
    });

    $('NetCheckTool').addEvent('click',
    function() {
        OpenCheckAndRepaireTool();
        //App.openWindow('DetectionAndRepairTool', true, 'thread', 'DetectionAndRepairTool.html', '', function() { });
    });

    $cwe.addNotify('cweui.openchangepassword',
    function() {
        OpenUrlWithParam(FUN_PASSWORDURL, 'url', 'action=modifyPassword');
    });

    $cwe.addNotify('cweui.moduleclickmsg',
    function(adid) {
        uploadADClickInfo(adid);
    });

    $('ChatUrl').addEvent('click',
    function() {
        App.openWindow('SmarkChat', true, 'thread', 'SmartChat.html', '',
        function() {});
        SetClickModule(3, CLICK_CHATURL);
    });

    MenuItem();
}

function ReceiveMsg() {
    //接收右下角图标的响应信息
    $cwe.addNotify('cweui.shellnotify.lbuttonup',
    function() {
        $cwe.feature('status:max',
        function() {});
    });

    $cwe.addNotify('cweui.shellnotify.rbuttonup',
    function(x, y) {
        $cwe.popupMenu($MenuObject.IconMenuJson, x, y,
        function(SelectedItem) {
            if (SelectedItem != undefined && SelectedItem.label === '打开主窗口') {
                $cwe.feature('status:show',
                function() {});
            } else if (SelectedItem != undefined && SelectedItem.label === '退出') {
                $cwe.feature('status:hide',
                function() {});
                DoLoginoutPAP();
                $cwe.close();
            }
        });
    });

    $cwe.addNotify('cweui.MainWnd',
    function(isCloseClient) {
        if (isCloseClient) {
            CloseOperation();
        } else {
            $cwe.feature('status:hide',
            function() {});
        }
    });

    $cwe.addNotify('cweui.AKeySpeedUp',
    function(isOpenSpeedIcon) {
        if (isOpenSpeedIcon) {
            $('net_speed_up').setStyle('display', 'block');
        } else {
            $('net_speed_up').setStyle('display', 'none');
        }
    });

    $cwe.addNotify('cweui.accountcallback',
    function() {
        ShowLoadingOrNormal('loading_account', 'AccountInfo', 2);
    });

    $cwe.addNotify('cweui.opensettingwnd',
    function() {
        App.openWindow('SettingWnd', true, 'modal', 'SettingWnd.html', '',
        function() {});
    });

}

/*!
* @brief [在界面所有标签及相应资源加载完成后执行的函数] 
* 
* @return function
* Edited by xzw in 07.25.2016  
*/
window.addEvent('load',
function() {
    //任务栏图标及提示,在界面加载完成后再加载此项，否则会影响界面加载速度
    $cwe.shellNotifyIcon({
        tip: '天翼校园',
        icon: 128
    },
    function() {});
});

window.addEvent('domready',
function() {

    init();
    ReceiveMsg();
});

//服务返回的变量信息
function svrSetInfoCenter(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    $infoCenter.setGlobalValue(opParam.key, opParam.value);
}

//功能配置
function funCfg(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
}
//服务启动完成
function svrStartComplete(svrMsgObj) {
    dialMgr.checkNet();
}
//wifi检测结果
function CheckWifiResp(svrMsgObj) {
    if (isOpenWifiTip) return;
    isOpenWifiTip = true;
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    ShowLastError('', opParam.Code, '', MB_WIFI, opParam.displayName);
    //ShowLastError('', opParam.Code, '', MB_HELP, opParam.displayName);
}

//程序出错
function DealAppErr(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    ShowLastError('', opParam.Code, '', MB_HELP, '');
}

//升级包下载完成
function UpdateComplete(svrMsgObj) {
    if (isOpenUpdateTip == true) return;
    isOpenUpdateTip = true;
    ShowLastError('', 50000005, '', MB_OKCANCEL,
    function(paramJson) {
        if (paramJson.type == 'mb_ok') { //立即升级
            CloseOperation(false); //下线
            App.start(function(flag) {
                $cwe.close();
            });
        }
    });
}

function OpenDisasteUrl(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }

    var url = opParam.url;
    if (url == undefined || url == '') return;
    $cwe.plugin('IOUtil').call('OpenExe', url, '',
    function() {});
}

//接收服务发过来的消息
function DealServerStatus(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    if (opParam.Code == $ESERVERSTATUS.startFail) //启动失败
    {
        checkResultShow(20010201, '', false);
    } else if (opParam.Code == $ESERVERSTATUS.connectFail) //连接失败
    {
        checkResultShow(20010202, '', false);
    } else if (opParam.Code == $ESERVERSTATUS.execption) //异常断开
    {
        checkResultShow(20010203, '', false);
    } else if (opParam.Code == $ESERVERSTATUS.unprotected) //驱动异常
    {
        checkResultShow(20020200, opParam.SubCode, false);
    } else if (opParam.Code == $ESERVERSTATUS.notsign) //dll签名校验失败
    {
        checkResultShow(20030200, '', false);
    } else if (opParam.Code == $ESERVERSTATUS.startouttime) //服务启动超时
    {
        checkResultShow(20010209, '', false);
    } else if (opParam.Code == $ESERVERSTATUS.starting) {
        checkResultShow(30000001, '', true);
    } else if (opParam.Code == $ESERVERSTATUS.updating) {
        checkResultShow(30000002, '', true);
    } else if (opParam.Code == $ESERVERSTATUS.installing) {
        checkResultShow(30000003, '', true);
    } else if (opParam.Code == $ESERVERSTATUS.runing) {
        checkResultShow(30000004, '', true);
    }
    if (opParam.Code >= $ESERVERSTATUS.startFail) {
        PostErrorCode(opParam.Code, '');
    }
}

function handleMessage(svrMsgObj) {
    //<type>%d</type><oldState>%d</oldState><newState>%d</newState><ErrorCode>%d</ErrorCode><subType>%s</subType><extern>%s</extern>
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    App.eState = opParam.newState;
    if (opParam.newState == $ESTATE.ES_PRECONNECTING) {
        handlePreConnectingMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_PRECONNECTED) {
        handlePreConnectedMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_PRECONNECTFAIL) {
        handlePreConnectFailMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_CONNECTED) {
        handleConnectedMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_CONNECTFAIL) {
        handleConnectFailMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_DISCONNECTED) {
        handleDisconnectedMsg(svrMsgObj);
    } else if (opParam.newState == $ESTATE.ES_DISCONNECTFAIL) {
        handleDisconnectFail(svrMsgObj);
    }

}

//登录准备中事件 ybq 2016.12.20
function handlePreConnectingMsg(svrMsgObj) {
    if (m_isAccountWnd) return; //如果在账号登录界面，或者正在登录，则不切界面
    m_isConnected = false;
    m_isPreConnected = false;
    isOpenWifiTip = false;
    Logining(false);
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    $MenuObject.updateMenu($MenuObject.itemDefaultStatus);
    checkResultShow(opParam.ErrorCode, opParam.subErrCode, true, opParam.extern);
}

//登录准备中失败事件
function handlePreConnectFailMsg(svrMsgObj) {
    m_isPreConnected = false;
    m_isAccountWnd = false;
    m_isConnected = false;
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    if (ErrorJudge(opParam.ErrorCode, opParam.subErrCode)) {
        return false;
    }
    //界面提示

    checkResultShow(opParam.ErrorCode, opParam.subErrCode, false, opParam.extern);

    //上报错误码
    //   PostErrorCode(opParam.ErrorCode, opParam.subErrCode);
    if (OpenRepairTool != true) {
        //       OpenRepairTool = true;
        //自动弹出检测修复工具
        //       OpenCheckAndRepaireTool();
    }
}

//登录准备完成事件
function handlePreConnectedMsg(svrMsgObj) {
    if (m_isPreConnected) return;
    m_isPreConnected = true;
    m_isConnected = false;
    $('loginout_pad_done').disabled = false; //恢复下线按钮
    //由于菜单第一次显示时不能正确按照后台配置的显示，需要主动调用一次，改写内存的数据
    $MenuObject.createMenuCfg($MenuObject.itemPreConnStatus,
    function() {
        item
    });
	
	time = 5;
	
	AutoLoginCountDown = setInterval(function() {
                if (time <= 0) {
                    $('AutoSignCountDown').set('text', '自动登录倒计时: 0');
                    DoLoginPAP();
                    $('AutoSignCountDown').set('text', '');

					if(AutoLoginCountDown != undefined){
						clearinterval(AutoLoginCountDown);
						AutoLoginCountDown = undefined;
					}
                } else {
                    if (!$('chk_auto_login').get('checked')
						|| App.currentView == 'login_checkstate'
						) {
                        $('AutoSignCountDown').set('text', "");
						 time = 5;
						
						if($('chk_auto_login').get('checked'))
						 $('AutoSignCountDown').set('text', '自动登录倒计时: ' + time);
                        return;
                    }
                    $('AutoSignCountDown').set('text', '自动登录倒计时: ' + time);
                    time--;
                }
            },
            1000);

    //设置按钮状态
    regButtonState();

    //报障热线 功能 added by xzw in 6.1.2017
    WaringHotline();

    //发起天气请求
    WeatherRequest();

    //获取扫码登录的终端名称
    GetHandleTips();

    //界面切换 
    if (App.currentView == 'login_checkstate') {
        //判断后台配置的登录方式
        $infoCenter.getMulValue('global', 'authType', 'authDefautType',
        function(values) {
            if (values == undefined) {
                login_view('login_checkstate', 'login_qr');
            } else {
                var haveQR = values.authType & 2;
                var strView = 'login_qr'; //默认是存在二维码登录方式，默认是优先显示二维码登录方式
                if (haveQR == 0) { //没有二维码登录方式
                    strView = 'login_pad';
                    $('login_pad_button').setStyle('display', 'none');
                    $('adDivBefore').setStyle('display', 'block');
                    m_isAccountWnd = true;
                }
                var authDefautType = values.authDefautType & 7;
                if (authDefautType == 0 || authDefautType == 1) { //账号登录方式优先，否则是二维码
                    strView = 'login_pad';
                }
                login_view('login_checkstate', strView);
            }
        });

    }

    //请求更新接口
    App.update();

    //  ShowAd('adDivBefore','accountUrl',0); //广告
    showNotice(); //公告
    $MenuObject.updateMenu($MenuObject.itemPreConnStatus); //设置菜单状态
    //set account
    $infoCenter.getConfigValue('Account.Portal', false,
    function(value) {
        $userInput.setValue(value);
        $infoCenter.setGlobalValue('account', value,
        function() {});
        mAccount = value;
    });
    $infoCenter.getConfigValue('Account.Save', false,
    function(value) {
        if (value == '0') {
            $('chk_save_pwd').checked = false;
        } else {
            $('chk_save_pwd').checked = true;
            $infoCenter.getConfigValue('Account.PortalPassword', true,
            function(value) {
                $passwordInput.setValue(value);
            });
        }
        $('lab_save_pwd').set('class', $('chk_save_pwd').get('checked') ? 'chklabel': 'unchklabel');

    });

    $infoCenter.getConfigValue('Account.autologin', false,
    function(value) {
        if (value == '0') {
            $('chk_auto_login').checked = false;
        } else {
            $('chk_auto_login').checked = true;
        }
        $('lab_auto_login').set('class', $('chk_auto_login').get('checked') ? 'chklabel': 'unchklabel');

    });
    ToolLogSubmit(); //上报工具日志
    UpdateQQNumber();

    DevInfor(); //设备信息
    //zhangliangming 2019.12.23资讯 当天只显示一次
    $funCtrl.GetState("InforURL", "enable",
    function(funName, cfg) {
        if (cfg != null) {

            $infoCenter.setConfigValue('OtherSetting.showRemindInfo', '1', false,
            function() {});

            // zhangliangming 2020.03.11 添加资讯点击量上报的监听事件
            $cwe.addNotify('cweui.InfoModuleClick',
            function(param) {
                var paramJson = JSON.decode(param);
                var moduletype = paramJson.moduletype;
                var moduleid = paramJson.moduleid;
                SetClickModule(moduletype, moduleid);
            });

            //zhangliangming 2020.06.13 添加更新最后时间事件监听
            $cwe.addNotify('cweui.InfoUpdateLastDate',
            function(param) {
                var paramJson = JSON.decode(param);
                var lastCreateTime = paramJson.lastDate;
                if (lastCreateTime != undefined && lastCreateTime != null && lastCreateTime != '') {
                    mServerInfoLastDate = lastCreateTime;
                    // alert(mServerInfoLastDate);
                    $infoCenter.setConfigValue('OtherSetting.InfoLastDate', mServerInfoLastDate, false,
                    function() {});
                }
            });

            var bgInteval = cfg[funName + '_attributes']['bgInteval'];
            if (bgInteval != undefined && bgInteval != null && bgInteval != '') {
                mInfoBgIntevalTime = bgInteval * 1000;
            }

            //zhangliangming 2019.12.23资讯
            $infoCenter.getConfigValue('OtherSetting.RemindInfo', false,
            function(isRemindInfoStart) {
                if (isRemindInfoStart == '1') {
                    $infoCenter.getConfigValue('OtherSetting.RemindDate', false,
                    function(remindDate) {
                        if (remindDate != '' && remindDate != undefined && remindDate == GetLocalData()) {
                            return;
                        }
                        $infoCenter.setConfigValue('OtherSetting.RemindDate', GetLocalData(), false,
                        function() {});
                        var inteval = cfg[funName + '_attributes']['inteval'];
                        //zhangliangming 2019.12.23 
                        if (inteval != undefined && inteval != null && inteval != '') { //自动弹出资讯功能
                            setTimeout('$InfoWnd.ShowInfoWnd()', inteval * 1000);
                        } else {
                            setTimeout('$InfoWnd.ShowInfoWnd()', 5 * 60 * 1000);
                        }
                    });
                }
            });
            handleInfoTimerEvent();
        }
    });
}

/**
 * 处理资讯定时器事件
 * zlm 2020.06.08
 */
function handleInfoTimerEvent() {
    if (mInfoTimer == null) {
        doInfoTimerEvent();
        mInfoTimer = setInterval("doInfoTimerEvent()", mInfoBgIntevalTime);
    }
}

/**
 * 执行资讯定时器事件
 * zlm 2020.06.08
 */
function doInfoTimerEvent() {
    $funCtrl.getFunCfg(FUN_INFORURL,
    function(cfg) {
        // alert(cfg);
        if (cfg == null) return;
        if (cfg[FUN_INFORURL + '_attributes'] == undefined) return;
        if (cfg[FUN_INFORURL + '_attributes']['ifurl'] == undefined) return;
        var ifurl = cfg[FUN_INFORURL + '_attributes']['ifurl'];
        // alert(ifurl);
        if (ifurl == '') return;

        $infoCenter.getMulValue('global', 'account', 'version', 'schoolId',
        function(values) {
            if (values == undefined) values = {};
            var account = values.account || '';
            var version = values.version || '';
            var cid = values.schoolId || '';
            var ostype = '1';
            var infotype = '0';

            JsonPostHTTP(ifurl, {
                "account": account,
                "cid": cid,
                "ostype": ostype,
                "version": version,
                "infotype": infotype
            },
            function(responseText) {
                //alert(responseText);
                var response = JSON.decode(responseText);
                if (response != undefined && response.code == 0) {
                    if (response.data == undefined) return;
                    var allPageData = response.data;
                    if (allPageData == null || allPageData == '' || allPageData == undefined || allPageData.length == undefined || allPageData.length == 0) {} else {
                        handleInfoPageData(allPageData);
                    }
                }
            });

        });
    });
}

/**
 * 处理资讯返回的数据
 * zlm 2020.06.08
 * @param allPageData
 */
function handleInfoPageData(allPageData) {
    $infoCenter.getConfigValue('OtherSetting.InfoLastDate', false,
    function(localInfoLastDate) {
        if (localInfoLastDate == '' || localInfoLastDate == undefined) {
            localInfoLastDate = '';
        }
        // alert('localInfoLastDate:' + localInfoLastDate);
        var serverInfoLastDate = '';
        for (var i = 0; i < allPageData.length; i++) {
            var infos = allPageData[i].infos;
            for (var j = 0; j < infos.length; j++) {
                var info = infos[j];
                var createtime = info.createtime;
                if (serverInfoLastDate < createtime) {
                    serverInfoLastDate = createtime;
                }
            }
        }
        // alert('serverInfoLastDate:' + serverInfoLastDate);
        //有新消息
        if (localInfoLastDate < serverInfoLastDate) {
            localInfoLastDate = serverInfoLastDate;
            mServerInfoLastDate = serverInfoLastDate;
            $('InforURL_Dot').setStyle('display', 'block');
        }

    });
}

//登录完成事件 ybq 2016.12.20
function handleConnectedMsg(svrMsgObj) {
    if (m_isConnected) return;
    $infoCenter.getMulValue('global', 'authType', 'authDefautType',
    function(values) {
        m_isConnected = true;
        m_isPreConnected = false;
        m_isAccountWnd = false;
        isOpenWifiTip = false;
        var opParam = svrMsgObj.M.P;
        if (opParam == undefined) {
            opParam = {};
        }

        //重新请求天气
        WeatherRequest();
        showNotice(); //公告
        login_view('login_pad', 'login_complete'); //切换界面
        CountTimeObject.CountTimePlus(); //上网计时
        ShowAd('adDiv', 'url', 1); //登录后广告
        App.update(); //请求更新接口
        PkgGetInfo(); //升级信息上报
        OpenNetCardCheckEXE();
        MoneyRemind('url'); //话费余额提醒
        NetType = opParam.type;
        if (opParam.type == $ETYPE.ET_UNKNOWN) {
            $('net_state_desc').set('text', '已连接Internet');
            $('loginout_pad_done').disabled = true; //按钮不可点
            $('loginout_pad_done').setStyle('color', 'gray');
        } else {
            $('net_state_desc').set('text', '已连接校园光网');
            $('loginout_pad_done').setStyle('color', '#de8262');
            $('loginout_pad_done').disabled = false;
            RequestMKtInf('url'); //消息推送
            $MenuObject.updateMenu($MenuObject.itemConnectStatus);
            var save = $('chk_save_pwd').get('checked') ? '1': '0';
            $infoCenter.setConfigValue('Account.Save', save, false,
            function() {});
            if (!$('chk_save_pwd').checked) {
                $passwordInput.setValue('');
            }
            //zhangliangming 2019.12.23修改为网络检测完成后执行
            //if ($('InforURL').inteval > 0) { //自动弹出资讯功能
            //    setTimeout('$InfoWnd.ShowInfoWnd()', $('InforURL').inteval * 1000);
            //}            
        }
    });
}

//登录失败事件
function handleConnectFailMsg(svrMsgObj) {
    m_isAccountWnd = false;
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    //alert(opParam.ErrorCode + opParam.subErrCode);
    //zlm 2020.06.14 处理欠费充值
    if (opParam.ErrorCode == '140102' && opParam.subErrCode == '13017000') {
        //alert(1)
        var text = GetProcCode(opParam.ErrorCode, opParam.subErrCode);
        var funName = FUN_CHARGEURL;
        $funCtrl.getFunCfg(funName,
        function(cfg) {

            //alert(JSON.encode(cfg))
            //alert(2)
            if (cfg == null) return;
            //alert(3)
            if (cfg[funName + '_attributes'] == undefined) return;
            //alert(4)
            if (cfg[funName + '_attributes']['url'] == undefined) return;
            var url = cfg[funName + '_attributes']['url'];
            //alert(url)
            if (url == '') {
                ShowLastError('', opParam.ErrorCode, opParam.subErrCode, MB_HELP, opParam.extern);
            } else {
                $infoCenter.getMulValue('global', 'account', 'version', 'schoolId', 'area', 'domain', 'ip', 'clientId', 'wlans',
                function(values) {
                    if (values == undefined) values = {};
                    var strParam = '?';

                    strParam += 'account=' + values.account + '&Versions=' + values.version + '&schoolID=' + values.schoolId + '&area=' + values.area + '&domain=' + values.domain + '&IPAddress=' + values.ip + '&ClientID2=' + values.clientId + '&' + values.wlans;
                    url = url + strParam;

                    //alert(url)
                    ChargeMessageBox(url, text);
                });
            }

        });
    } else {
        ShowLastError('', opParam.ErrorCode, opParam.subErrCode, MB_HELP, opParam.extern);
    }

    if (App.currentView == 'login_complete') {
        login_view(App.currentView, 'login_checkstate'); //切换界面
    }
    PostErrorCode(opParam.ErrorCode, opParam.subErrCode);
}

//下线成功事件
function handleDisconnectedMsg(svrMsgObj) {
    m_isConnected = false;
    login_view('login_complete', 'login_checkstate');
    $MenuObject.updateMenu($MenuObject.itemDefaultStatus);
    KillNetCardCheckEXE();
}

//下线失败事件
function handleDisconnectFail(svrMsgObj) {
    $('loginout_pad_done').disabled = false; //恢复下线按钮
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    ShowLastError('', opParam.ErrorCode, opParam.subErrCode, MB_HELP);
    PostErrorCode(opParam.ErrorCode, opParam.subErrCode);
}

//////////////////////////////////////////////////////////
function ticketResp(svrMsgObj) {
    var opParam = svrMsgObj.M.P;
    if (opParam == undefined) {
        opParam = {};
    }
    var qrImage = App.appdataPath + '/ChinatelecomJSPortal/loginQRImage.bmp';
    $cwe.plugin('ioutil').call('CreateQRIamge', qrImage, opParam.qr,
    function(ret) {
        if (ret) {
            $('login_qr_image').src = '';
            $('login_qr_image').src = qrImage;
        } else {
            $('login_tips').set('text', GetProcCode(50000003, '')); //"二维码无法生成";
        }
    });
}

function DoLoginPAP() {
	try { 
		if(AutoLoginCountDown != undefined){
			clearinterval(AutoLoginCountDown);
			AutoLoginCountDown = undefined;
		}
    } catch(err) { 
	}
    var userid = $userInput.getValue().replace(/(^\s*)|(\s*$)/g, '');
    if (userid == '') {
        ShowLastError('提示', 50000001, '', MB_OK);
        $userInput.focus();
        return;
    }

    var passwd = $passwordInput.getValue().replace(/(^\s*)|(\s*$)/g, '');
    if (passwd == '') {
        ShowLastError('提示', 50000002, '', MB_OK);
        $passwordInput.focus();
        return;
    }

    Logining(true);
    dialMgr.connect(userid, passwd);

    //保存账号密码到本地
    $infoCenter.setConfigValue('Account.Portal', userid, false,
    function() {});
    $infoCenter.setConfigValue('Account.PortalPassword', passwd, true,
    function() {});

    mAccount = userid;
    var nowTime = GetLocalData();
    $infoCenter.getConfigValue('ClickUploadTime', nowTime,
    function(recordTime) {
        if (recordTime != nowTime) {
            SendClickModuleData(mClickModuleJson);
        }
    });

}

function DoLoginoutPAP() {
    $('loginout_pad_done').disabled = true; //按钮不可点
    dialMgr.disconnect($DIS_REASON.DIS_REASON_MANUAL);
}

//检测结果显示界面
function checkResultShow(ErrorCode, subErrCode, flag, displayName) {
    LoadingInterface(flag);
    $('login_tips').set('text', GetProcCode(ErrorCode, subErrCode, displayName));
    login_view(App.currentView, 'login_checkstate');
}

//这个函数还存在问题，需要修改***********************************************errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
function login_view(view1, view2) {
    if (App.currentView == view2) return; //如果当前界面已经是要切换的界面，则不切换
    App.currentView = view2;
    var views = new Array();
    views[0] = 'login_checkstate'; //检查界面+检查失败界面
    views[1] = 'login_qr'; //二维码界面
    views[2] = 'login_pad'; //账号界面
    views[3] = 'login_complete'; //登录完成界面
    var srcView = 0;
    var tarView = 0;

    $(view1).setStyle('display', 'block');
    $(view2).setStyle('display', 'block');

    for (var i = 0; i < views.length; i++) {
        if (views[i] == view1) {
            srcView = i;
        }

        if (views[i] == view2) {
            tarView = i;
        }
    }
    for (i = 0; i < views.length; i++) {
        if (views[i] != view1 && views[i] != view2) {
            $(views[i]).setStyle('display', 'none');
        }

    }
    if (srcView < tarView) {
        $('login_view').tween('margin-left', '0px', '-320px');
    } else {
        $('login_view').tween('margin-left', '-320px', '0');
    }
}

/*! @brief [计时模块] */
var CountTimeObject = {
    counter: 0,
    Second: 0,
    Minute: 0,
    Hour: 0,
    CleatTimeCount: undefined,

    /*!
    * @brief [计时函数] 
    * 
    * [用于登录成功后开始计时，封装在CountTimePlus函数里]
    * @return function
    * Edited by xzw in 07.24.2016  
    */
    CountTime: function() {
        CountTimeObject.Second = parseInt((CountTimeObject.counter) % 60);
        CountTimeObject.Minute = parseInt((CountTimeObject.counter / 60) % 60);
        CountTimeObject.Hour = parseInt(CountTimeObject.counter / 3600);

        CountTimeObject.counter = CountTimeObject.counter + 1;

        CountTimeObject.SetTimeText('second_icon', CountTimeObject.Second);
        CountTimeObject.SetTimeText('minute_icon', CountTimeObject.Minute);
        CountTimeObject.SetTimeText('hour_icon', CountTimeObject.Hour);

        CountTimeObject.CleatTimeCount = setTimeout(CountTimeObject.CountTime, 1000);
    },

    /*! @brief [计时显示优化，如果只有个位，则在前面加个0] */
    SetTimeText: function(id, num) {
        if (num < 10) {
            $(id).set('text', '0' + num);
        } else {
            $(id).set('text', num);
        }
    },

    /*!
    * @brief [计时函数加强版] 
    * 
    * [用于登录成功后开始计时，在调用计时模块前先清空计时内容以及原有的计时定时器，每秒触发一次]
    * [此函数在切换到登录界面时会被自动调用，封装在SwitchToNetInfoWnd()函数中]
    * @return function
    * Edited by xzw in 07.24.2016  
    */
    CountTimePlus: function() {
        clearTimeout(CountTimeObject.CleatTimeCount);
        CountTimeObject.counter = 0;
        CountTimeObject.Second = 0;
        CountTimeObject.Minute = 0;
        CountTimeObject.Hour = 0;
        CountTimeObject.CountTime();
    }
};

/////////////////////////////////////////////////////////////////
//登陆成功后状态界面切换函数
/*! @brief [切换到“网络状态”界面] */
function AccountInfoToNetInfo() {
    $('net_connect').setStyle('display', 'block');
    $('net_account').setStyle('display', 'none');
    $('login_complete_state').set('class', 'login_net_state');
}

/*! @brief [切换到“我的账户”界面] */
function NetInfoToAccoutnInfo() {
    //界面切换
    $('net_connect').setStyle('display', 'none');
    $('net_account').setStyle('display', 'block');
    $('loading_account').setStyle('display', 'block');
    $('AccountInfo').setStyle('display', 'none');
    $('login_complete_state').set('class', 'login_account_state');
    //请求链接
    ShowMyAccount('AccountInfo', 'url');
}

function GetSpeedAndFlow() {
    $cwe.plugin('NetwordUtil').call('GetCurNetSpeedAndFlow',
    function(UpLoadSpeed, UpLoadTotal, DownLoadSpeed, DownLoadTotal) {
        $('up_speed_desc').set('text', parseFloat(UpLoadSpeed).toFixed(2) + 'KB/s');
        $('down_speed_desc').set('text', parseFloat(DownLoadSpeed).toFixed(2) + 'KB/s');
    });
    ClearDownUpTimeCount = setTimeout(GetSpeedAndFlow, 1000);
}

function LoadingInterface(flag) {
    if (flag) {
        $('login_loading').set('src', 'img/netJudgeLoading.gif');
        $('login_loading').set('Class', 'rightLoading');
        $('login_tips').setStyle('color', '#25a52c');
        $('login_fail_button').setStyle('display', 'none');
        $('login_fail_button').setStyle('margin-top', '0px');
    } else {
        $('login_loading').set('src', 'img/LoadingFail.png');
        $('login_loading').set('Class', 'wrongLoading');
        $('login_tips').setStyle('color', '#ff5d04');
        $('login_fail_button').setStyle('display', 'block');
        $('login_fail_button').setStyle('margin-top', '40px');

        window.setTimeout(function restart() {
            login_view(App.currentView, 'login_checkstate');
            dialMgr.start();
        },
        1000);
    }
}

function Logining(flag) {
    if (flag) {
        $('login_pad_done').setStyle('display', 'none');
        $('Logining').setStyle('display', 'block');

    } else {
        $('login_pad_done').setStyle('display', 'block');
        $('Logining').setStyle('display', 'none');
    }

}

/////////////////////////////////关闭处理////////////////////////////////////////////////////////
function DealCloseEvent() {
    $infoCenter.getConfigValue('SystemSetting.Prompt', false,
    function(isSaveClose) {
        if (isSaveClose === '1') {
            $infoCenter.getConfigValue('SystemSetting.Close', false,
            function(MinOrExit) {
                if (MinOrExit == '0') {
                    $cwe.feature('status:hide',
                    function() {});
                } else {
                    CloseOperation();
                }
            });
        } else {
            $cwe.open('modal', 'DlgExit.html', '',
            function() {});
        }
    });
}

//关闭客户端进行的清除资源及关闭窗口操作 ybq 2017.1.13
function CloseOperation(isClose) {
    $cwe.plugin('IOUtil').call('CloseExeByName', '', 'SelfDebugTool',
    function() {});
    $cwe.feature('status:hide',
    function() {});
    $cwe.shellNotifyIcon({},
    function() {});
    WriteClickModuleData(mClickModuleJson);
    dialMgr.disconnect($DIS_REASON.DIS_REASON_MANUAL,
    function() {
        //closeEvent();
        function delayClose() {
            Stop();
            if (isClose == false) return;
            $cwe.close();
        }
        delayClose.delay(500); //这里需要做延长，否则客户端退出的时候命令还未发到服务
    });

}

//关闭时清理资源  采用闭包的写法 ybq 2017.1.13
function Stop() {
    //清理界面上的setTimeout
    CountTimeObject.CleatTimeCount && clearTimeout(CountTimeObject.CleatTimeCount);
    ClearDownUpTimeCount && clearTimeout(ClearDownUpTimeCount);
    $InfoWnd.HideInfoWnd();
    $cwe.postNotify('CloseWnd');
    KillNetCardCheckEXE();

    //调用插件的stop清理资源
    /*for(var i in needStop){
        var module_name = i;
        (function(modName){
            $cwe.plugin(modName).call('Stop', modName, '', function(flag){
            if(flag)
                needStop[modName] = '1';
            });
        }(module_name)); 
    }*/
}

//关闭事件 ybq 2017.1.13
function closeEvent() {
    var timestamp = Date.parse(new Date());
    var newtimestamp;

    checkClose = function() {
        var bok = true;
        for (var i in needStop) {
            if (needStop[i] === '0') {
                bok = false;
                break;
            }
        }
        newtimestamp = Date.parse(new Date());
        if (newtimestamp - timestamp > 10 * 1000 || bok) {
            $cwe.close();
        } else {
            setTimeout(checkClose, 2000);
        }
    }

    checkClose();
}