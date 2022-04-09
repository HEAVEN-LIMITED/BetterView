var $ESTATE ={
    ES_NONE : 0,	//该种网络类型不可用
    ES_CONNECTING : 1,
    ES_CONNECTED : 2,
    ES_CONNECTFAIL : 3,
    ES_DISCONNECTING : 11,
    ES_DISCONNECTED : 12,
    ES_DISCONNECTFAIL : 13,
    ES_PREDISCONNECTED : 14,
    ES_CANCELING : 21,
    ES_CANCELED : 22,
    ES_PRECONNECTED:31,
    ES_PRECONNECTFAIL:32,
    ES_PRECONNECTING:33
};

var $ETYPE ={
    ET_UNKNOWN : 0,
    ET_LAN : 1,
    ET_MODEM : 2,
    ET_PPPOE : 3,
    ET_WLANEHOME : 11,
    ET_WLANOTHER : 12,
    ET_WIFI : 21,
    ET_WIFIVPN : 22,
    ET_CDMA1X : 31,
    ET_CDMA3G : 32,
    ET_BLUETOOTH : 41,
    ET_PORTAL:51
};
var $DIS_REASON = {
    DIS_REASON_MANUAL: "1",           //1：用户主动下线（点击下线）；
    DIS_REASON_EXIT: "2",           //2：客户端退出下线（客户端主动退出）；
    DIS_REASON_PLUSE: "3",          //3：心跳超时下线（客户端发送心跳失败）；
    DIS_REASON_PASSIVE: "4",         //4：被踢下线（客户端发送心跳产生跳转）；
    DIS_REASON_STARTUP: "5",        //5：客户端启动自动下线（上次退出未正常下线）；
    DIS_REASON_WIFI: "6",            //6：检测到共享软件下线；
    DIS_REASON_EXCEPTION: "7",        //7：客户端异常下线（客户端与服务非正常断开等）；
    DIS_REASON_OTHER_MAN: "8"          //8：被其他终端踢下线
};

/*弹框样式* ybq 2016.12.28*/
var MB_OK = 0;
var MB_OKCANCEL = 1;
var MB_YES = 2;
var MB_YESNO = 3;
var MB_VLIMIT = 4;
var MB_HELP = 5;
var MB_WIFI = 6;
var MB_CHARGE = 7;

var $ESERVERSTATUS = {
    notStart:0,  //未启动
    installing:1,  //安装服务
    runing:2,   //运行中
    starting:3,  //启动中
    updating:4,  //更新中
    startFail:5,  //无法启动
    connectFail:6,  //无法连接
    disconnect:7,   //与服务断开
    execption:8,   //异常
    unprotected:9, //驱动异常
    notsign:10,      //指定的文件没有签名
    startouttime:11    //启动超时
};

/*模块定义*/
var CLICK_AD                     = 1;  //广告
var CLICK_MYACCOUNT              = 2;   //账户
var CLICK_INFORURL               = 3;   //资讯
var CLICK_WEATHER                = 4;   //天气
var CLICK_NOTICE                 = 5;   //公告
var CLICK_SPEEDUP                = 6;   //提速
var CLICK_HELPURL                = 7;   //帮助文档
var CLICK_CHARGEURL              = 8;   //充值
var CLICK_PASSWORDURL            = 9;   //修改密码
var CLICK_INTERNETTIME           = 10;   //剩余时长
var CLICK_FREEACCOUNTURL         = 11;   //体验帐号
var CLICK_HANDLEUNIVERSITYURL    = 12;   //掌上大学
var CLICK_CLEARTOOL              = 13;   //wifi清理工具
var CLICK_ERRORPOST              = 14;   //错误上报
var CLICK_NETTERMINAL            = 15;   //上网终端管理
var CLICK_BRANDBAND              = 16;    //宽带套餐办理
var CLICK_SELFSTOPREPLY          = 17;   //自助停复机
var CLICK_FORGORPASSWORD         = 18;   //忘记密码
var CLICK_OFFICIALURL            = 19;   //官方网站
var CLICK_SELFDEBUGTOOL          = 20;   //自助排障工具
var CLICK_CHATURL                = 21;   //智能客服
var CLICK_SETTING                = 22;   //设置
var CLICK_QQ                     = 23;  //在线客服
var CLICK_BROKEN_NETWORK         = 24; //防断网指引
var CLICK_FEEDBACKURL            = 25; //反馈建议
var CLICK_MY_FEEDBACK            = 26; //我的反馈
var CLICK_QRCODE                 = 27; //扫码认证
var CLICK_SEARCHBILL             = 28; //账单查询
var CLICK_SEARCHCHARGE           = 29; //充值查询