var CLIENT_START ='ClientStart'  //客户端启动
var CLIENT_START_COMPLETE='ClientStartComplete' //服务启动完成
var SERVER_STATUS_RESP ='ServerStatusResp' //服务状态    ESERVERSTATUS
var CHECK_ENV ='CheckEnv' //检测网络环境
var CHECK_ENV_RESP ='CheckEnvResp' //返回网络环境状态
var GET_NETINFO_RESP ='GetNetInfoResp' //返回网络信息
var PORTAL_CONNECT ='PortalConnect' //请求连接
var PORTAL_CONNECT_RESP ='PortalConnectResp' //连接请求返回
var PORTAL_DISCONNECT ='PortalDisConnect' //请求断开连接
var PORTAL_DISCONNECT_RESP ='PortalDisconnectResp' //断开连接返回
var APP_ERR ='AppErr'  //程序出错
var CHECK_WIFI_RESP ='CheckWifiResp' //Wifi共享软件检测结果

var NET_STATE_MESSAGE_RESP ='NetStateMessageResp' //拨号消息
var NET_STATE_MESSAGE_RESP_EX ='NetStateMessageRespEx' //拨号消息
var TICKET_RESP ='TicketResp'    //返回ticket

var SET_VALUE ='SetValue' //设置数据
var GET_VALUE ='GetValue' //获取数据
var FUN_CFG =	"FunCfg"  //功能配置

var LOG_TRACE ='Log' //日志跟踪
var LOG_CHECK_WIFI_POST ='LogCheckWifiPost' //检测到共享软件后错误上报

var TERMINAL_REQUEST ='GetTerminalData' //请求终端信息
var TERMINAL_RESP ='SetTerminalData' //终端信息返回
var TERMINAL_TERM_REQUEST ='TerminalTermSend' //上网终端界面请求其他设备下线
var TERMINAL_TERM_RESP ='TerminalTermReturn' //上网终端界面请求其他设备下线返回

var CHECK_SYSTEM_TIME ='CheckSystemTime' //系统时间检测

var DATA_SUBMIT = 'DataSubmit' //错误上报
var DISASTER_URL = 'DisasterUrl' //打开应急页面

var UPDATE_COMPLETE = 'UpdateComplete';

function SvrMgr() {
    var svrMsgs = new Object();
    var getSvrMsgs = function () {
        return svrMsgs;
    };

    this.start = function (cbFun) {
        this.recvSvrMsg();
        $cwe.plugin('servermodule').call('StartSvr', cbFun);
    }

    this.recvSvrMsg=function(){
        $cwe.addNotify('servermodule.SvrMsg', this.DealSvrMsg);
        $cwe.addNotify('esurfingupdate.UpdateMsg', this.DealSvrMsg);
    }

    this.setValueMsg = function (key, value) {
        var param = '<Key>' + key + '</Key><Value>' + value + '</Value>';
        $cwe.plugin('servermodule').call('PostServerMsg', 'Portal', 'InfoCenter', SET_VALUE, param, function () {
        });
    }
    //注册服务消息
    this.regSvrMsg = function (svrMsg, cbFun) {
        try {
            var svrMsgs = getSvrMsgs();
            var svrMsgListers = svrMsgs[svrMsg];
            if (svrMsgListers == undefined) {
                svrMsgs[svrMsg] = new Array();
                svrMsgListers = svrMsgs[svrMsg];
            }
            svrMsgListers.push(cbFun);
        } catch (e) {
            log('regSvrMsg error is' + e.message);
        }
    }

    this.DealSvrMsg = function (svrMsg) {
        try {
            var jsonObj = xmlToJson(parseXML(svrMsg));
            if (jsonObj == null) return;
            var svrMsgs = getSvrMsgs();
            var svrMsgListers = svrMsgs[jsonObj.M.OpC];
            if (svrMsgListers == undefined) {
                return;
            } //没有监听者

            for (var i = 0; i < svrMsgListers.length; i++) {
                svrMsgListers[i](jsonObj);
            }
        } catch (e) {
            log('DealSvrMsg ' + svrMsg + '  error is ' + e.message);
        }
    }

    this.PostSvrMsg = function(source,opCode,param){
        $cwe.plugin('servermodule').call('PostServerMsg', source, 'Portal', opCode,param,function(){});
    }
}
function DialMgr(){
    var userName;
    var password;
}

    DialMgr.prototype.postPortalMsg=function(opCode,param,cbFun){
        $cwe.plugin('servermodule').call('PostServerMsg', 'Portal', 'Portal', opCode,param,cbFun);
    }

    DialMgr.prototype.start=function(){
        DialMgr.prototype.postPortalMsg(CLIENT_START,'');
    }

    //检查网络
    DialMgr.prototype.checkNet=function(){
        DialMgr.prototype.postPortalMsg('CheckEnv','');
    }
    //上线
    DialMgr.prototype.connect=function(userName,password){
        var param='<user>'+ userName + '</user><password>' + password +'</password>';
        DialMgr.prototype.postPortalMsg(PORTAL_CONNECT,param);
    }
    //下线
    DialMgr.prototype.disconnect=function(tip,cbFun){
        var param ='<src>' + tip +'</src>';
        DialMgr.prototype.postPortalMsg(PORTAL_DISCONNECT,param,cbFun);
    }
    //错误上报
    DialMgr.prototype.datasubmit=function(str){
        DialMgr.prototype.postPortalMsg(DATA_SUBMIT,str);
    }
