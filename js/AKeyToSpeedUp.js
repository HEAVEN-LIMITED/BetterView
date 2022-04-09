var SPEED_LEAF_TIME = "Speed.leaveTime";   /*!< [int 提速剩余时间] */
var SPEED_OLD_RATE = "Speed.oldRate";  /*!< int 原始速率*/
var SPEED_NEW_RATE = "Speed.newRate";   /*!< int 提速后的速率*/
var SPEED_OUT_TIME = "Speed.outTime"; /*!< int 提速数据过期时间*/
var SPEED_LAST_TIME = "Speed.lastTime"; /*!< int 最后一次提速的时间*/
var SPEED_TOTAL_TIME = "Speed.totalTime"; /*!< 每天首次可以提速的时间*/
var SPEED_CANCEL_TIME = "Speed.cancelTime"; /*!< 每天退出提速的时间*/

var RequestType = 0;
/*! @brief [界面设置函数] */
var $InterfaceControl =
{
    percent: 0,
    timeOut: undefined,
    SetProgress: function(percent, isShow) {
        if (isShow) {
            $('ProgressBarBg').setStyle('display', 'block');
            $('ProgressBar').setStyle('width', percent + '%');
        }
        else {
            $('ProgressBarBg').setStyle('display', 'none');
            $('ProgressBar').setStyle('width', '0%');
        }
    },
    SetUserInfo: function(userinfo, fontcolor) {
        $('UserInfo').set('text', userinfo);
        $('UserInfo').setStyle('color', fontcolor)
    },
    SetSrcSpeed: function(srcspeed) {
        $('SrcConcreteSpeed').set('text', srcspeed + 'M');
    },
    SetTarSpeed: function(tarspeed) {
        $('TarConcreteSpeed').set('text', tarspeed + 'M');
    },
    SetProgressBar: function() {   //循环设置进度条
        if ($InterfaceControl.percent >= 100) {
            $InterfaceControl.percent = 0;
        }
        else {
            $InterfaceControl.percent += 10;
        }
        $('ProgressBar').setStyle('width', $InterfaceControl.percent + '%');
        $InterfaceControl.timeOut = setTimeout($InterfaceControl.SetProgressBar, 500);
    },
    SetSpeedBtn: function(available) {
        if (available) {
            $('SpeedUpButton').setStyle('color', '#4CB551');
            $('SpeedUpButton').erase('disabled');
        }
        else {
            $('SpeedUpButton').setStyle('color', 'Gray');
            $('SpeedUpButton').setStyle('disabled', 'disabled');
        }
    },
    SetSpeedBtnText: function(value) {
        $('SpeedUpButton').set('value', value);
    },
    Init: function() {
        $InterfaceControl.SetSpeedBtn(false);
        $InterfaceControl.SetUserInfo('数据正在加载中...', 'White');
        $InterfaceControl.SetProgress(0, true);
        $InterfaceControl.SetProgressBar();
    },
    /*! @brief [flag:true,读取中界面;false,读取失败界面] */
    SetLoadingUI: function(flag) {
        if (flag) {
            clearTimeout($InterfaceControl.timeOut);
            $InterfaceControl.SetProgress(0, true);
            $InterfaceControl.SetSpeedBtn(false);
            $InterfaceControl.SetUserInfo($UserInfo.LoadTips, 'White');

        }
        else {
            $InterfaceControl.SetUserInfo($UserInfo.LoadTips, 'Red');
            $InterfaceControl.SetProgress(0, false);
        }
    },
    ShowSpeedData: function() {

        if (parseInt($UserInfo.strSrcSpeed) <= 0 || parseInt($UserInfo.strTarSpeed) <= 0) {
            return false;
        }
        $InterfaceControl.SetSpeedBtn(true);
        $InterfaceControl.SetSrcSpeed($UserInfo.strSrcSpeed);
        $InterfaceControl.SetTarSpeed($UserInfo.strTarSpeed);
    },
    ShowFirstUI: function() {
        $InterfaceControl.SetUserInfo('今日首次使用，您将有30分钟的免费提速时间，快去体验吧！');
        CountTimeObject.ShowTime();
        $InterfaceControl.ShowSpeedData();
        $InterfaceControl.SetSpeedBtn(true);
    },
    ShowNormalUI: function() {
        $InterfaceControl.SetUserInfo('一键提速，开启快速生活！');
        CountTimeObject.ShowTime();
        $InterfaceControl.ShowSpeedData();
    },
    ShowNoTimeUI: function() {
        $InterfaceControl.SetUserInfo('免费提速时间已用完，可使用千兆浏览器继续免费提速哦！');
        $InterfaceControl.SetSpeedBtn(false);
        $InterfaceControl.ShowSpeedData();
        CountTimeObject.ShowTime();
        $InterfaceControl.SetSpeedBtnText('打开千兆浏览器');
    },
    ShowUI: function() {    //显示界面
        $InterfaceControl.SetProgress(0, false);
        $InterfaceControl.SetSpeedBtn(true);
        $UserInfo.CheckData();
        if ($UserInfo.IsFirst) {
            $InterfaceControl.ShowFirstUI();
        }
        else if (parseInt($UserInfo.strSrcSpeed) <= 0 || parseInt($UserInfo.strTarSpeed) <= 0) {
            $InterfaceControl.ShowNormalUI();
        }
        else {
            if (parseInt($UserInfo.strLeaveTime) <= 0) {
                $InterfaceControl.ShowNoTimeUI();
            }
            else {
                $InterfaceControl.ShowNormalUI();
            }

        }


    }
}

/*! @brief [计时模块] */
var CountTimeObject = {
    Second: 0,
    Minute: 0,
    Hour: 0,
    CleatTimeCount: undefined,

    /*!
    * @brief [倒计时函数] 
    * 
    * [用于登录成功后开始计时，封装在CountTimePlus函数里]
    * @return function
    * Edited by xzw in 07.24.2016  
    */
    CountTime: function() {
        if (($UserInfo.strLeaveTime) <= 0) {
            CleatTimeCount(CleatTimeCount);
            return false;
        }
        if (parseInt($UserInfo.strSrcSpeed) <= 0 || parseInt($UserInfo.strTarSpeed) <= 0) {
            CountTimeObject.SetTimeText('second_icon', '--');
            CountTimeObject.SetTimeText('minute_icon', '--');
            CountTimeObject.SetTimeText('hour_icon', '--');
            CleatTimeCount(CleatTimeCount);
            return false;
        }
        CountTimeObject.Second = parseInt(($UserInfo.strLeaveTime) % 60);
        CountTimeObject.Minute = parseInt(($UserInfo.strLeaveTime / 60) % 60);
        CountTimeObject.Hour = parseInt($UserInfo.strLeaveTime / 3600);

        $UserInfo.strLeaveTime = $UserInfo.strLeaveTime - 1;

        CountTimeObject.SetTimeText('second_icon', CountTimeObject.Second);
        CountTimeObject.SetTimeText('minute_icon', CountTimeObject.Minute);
        CountTimeObject.SetTimeText('hour_icon', CountTimeObject.Hour);
        
        CountTimeObject.CleatTimeCount = setTimeout(CountTimeObject.CountTime, 1000);
    },

    ShowTime: function() {
        var Second = parseInt(($UserInfo.strLeaveTime) % 60);
        var Minute = parseInt(($UserInfo.strLeaveTime / 60) % 60);
        var Hour = parseInt($UserInfo.strLeaveTime / 3600);

        CountTimeObject.SetTimeText('second_icon', Second);
        CountTimeObject.SetTimeText('minute_icon', Minute);
        CountTimeObject.SetTimeText('hour_icon', Hour);
    },

    /*! @brief [计时显示优化，如果只有个位，则在前面加个0] */
    SetTimeText: function(id, num) {
        if (num < 10) {
            $(id).set('text', '0' + num);
        }
        else {
            $(id).set('text', num);
        }
    },

    /*!
    * @brief [倒计时函数加强版] 
    * 
    * [用于登录成功后开始计时，在调用计时模块前先清空计时内容以及原有的计时定时器，每秒触发一次]
    * [此函数在切换到登录界面时会被自动调用，封装在SwitchToNetInfoWnd()函数中]
    * @return function
    * Edited by xzw in 07.24.2016  
    */
    CountTimePlus: function() {
        clearTimeout(CountTimeObject.CleatTimeCount);
        CountTimeObject.Second = 0;
        CountTimeObject.Minute = 0;
        CountTimeObject.Hour = 0;
        CountTimeObject.CountTime();
    },
    StopCountTime: function() {
        clearTimeout(CountTimeObject.CleatTimeCount);
    }
};

var $UserInfo =
{
    strLeaveTime: 0,  //当天剩余可以提速的时间
    strOldRate: 0,    //原速率
    strNewRate: 0,    //可以提升的速率
    IsFirst: true,    //是否首次使用
    IsOut: false,      //数据是否过期
    IsUping: false,   //正在提速

    strOutTime: 0,    //提速数据过期的时间
    strLastTime: 0,   //每天最后一次提速的时间点
    strTotalTime: 0,  //每天首次可以提速的总时间
    strCancelTime: 0, //每天退出提速的时间点

    strSrcSpeed: 0,    //提速前速率
    strTarSpeed: 0,    //提速后速率
    SpeedUpError: undefined,   //提速错误
    LoadTips: undefined, //加载提示
    PostData: undefined, //加密后需要传输的数据
    Account: undefined, //用户账号
    SpeedUpUrl: undefined,
    Init: function() {
        $funCtrl.getFunCfg(FUN_SPEEDUP, function(cfg) {
            if(cfg == undefined || cfg[FUN_SPEEDUP + '_attributes'] == undefined) return;
            $UserInfo.SpeedUpUlr = cfg[FUN_SPEEDUP + '_attributes'].url;
            $infoCenter.getGlobalValue('DialAccount', function(value) {
                $UserInfo.Account = value;
                $UserInfo.InitConfig();
            });
        });
    },
    InitConfig: function() {
        var myTime = new Array();
        myTime[0] = 0;    //剩余时间：LeftTime
        myTime[1] = 0;    //提速前速率：OldRate
        myTime[2] = 0;    //提速后速率：NewRate
        myTime[3] = 0;    //数据过期时间：OutTime
        myTime[4] = 0;    //最后一次提速时间：LastTim
        myTime[5] = 0;    //提速总时长：TotalTime
        myTime[6] = 0;    //退出提速时间：CancelTime

        $cwe.plugin('infocentermodule').call('GetEncryptValue',
            SPEED_LEAF_TIME + $UserInfo.Account,
            SPEED_OLD_RATE + $UserInfo.Account,
            SPEED_NEW_RATE + $UserInfo.Account,
            SPEED_OUT_TIME + $UserInfo.Account,
            SPEED_LAST_TIME + $UserInfo.Account,
            SPEED_TOTAL_TIME + $UserInfo.Account,
            SPEED_CANCEL_TIME + $UserInfo.Account,
            function() {
                for (var i = 0; i < arguments.length; i++) {
                    //判断是否数字及是否有效
                    if (arguments[i] != false && !isNaN((arguments[i]))) {
                        myTime[i] = parseInt(arguments[i]);

                    }
                    else {
                        myTime[i] = 0;
                        //数据无效，以及数据过期
                        $UserInfo.IsOut = true;
                    }
                }



                $UserInfo.strLeaveTime = myTime[0];  //当天剩余可以提速的时间
                $UserInfo.strOldRate = myTime[1];    //原速率
                $UserInfo.strNewRate = myTime[2];    //可以提升的速率

                $UserInfo.strOutTime = myTime[3];    //提速数据过期的时间
                $UserInfo.strLastTime = myTime[4];   //每天最后一次提速的时间点
                $UserInfo.strTotalTime = myTime[5];  //每天首次可以提速的总时间
                $UserInfo.strCancelTime = myTime[6]; //每天退出提速的时间点


                //判断是否首次使用
                if (parseInt(getCurrentTime() / 24 / 3600) > parseInt($UserInfo.strLastTime / 24 / 3600)) {
                    $UserInfo.IsFirst = true;
                }
                else {
                    $UserInfo.IsFirst = false;
                }

                //判断数据是否超过24小时，如果超过，就是过期
                if (getCurrentTime() - $UserInfo.strOutTime > 24 * 60 * 60) {
                    $UserInfo.IsOut = true;
                }
                else {
                    $UserInfo.IsOut = false;
                }

                //如果今天是首次使用，则剩余时长等于获取到的提速总时长
                if ($UserInfo.IsFirst) {
                    $UserInfo.strLeaveTime = $UserInfo.strTotalTime;
                }

                //判断推出时间是否存在
                if ($UserInfo.strCancelTime == 0) {
                    if (!$UserInfo.IsFirst) {
                        $UserInfo.strLeaveTime = 0;
                    }
                }
                else {
                    if ($UserInfo.strLastTime > $UserInfo.strCancelTime && !$UserInfo.IsFirst) {
                        $UserInfo.strLeaveTime = 0;
                    }
                }
                $UserInfo.RequestRate();
            });
    },
    CheckData: function() {
        if ($UserInfo.IsFirst && $UserInfo.strLeaveTime <= 0) {
            $UserInfo.IsFirst = false;
        }
        if (parseInt($UserInfo.strSrcSpeed) <= 0 || $UserInfo.strTarSpeed <= 0) {
            $UserInfo.strSrcSpeed = 0;
            $UserInfo.strTarSpeed = 0;
            $InterfaceControl.Init();
        }
    },
    CancelChangeData: function() {
        $UserInfo.IsUping = false;
        $UserInfo.strLeaveTime = 0;
        var nowDate = new Date();
        $infoCenter.setConfigValue(SPEED_CANCEL_TIME + $UserInfo.Account, String(nowDate.getTime()), false, function() { });
    },
    GetPostData: function(type) {
        var CrypeData = '';
        var temp = new Date();
        var data = $UserInfo.Account + '$' + temp.format("yyyy-MM-dd hh:mm:ss") + '$' + type + '$' + $UserInfo.strLeaveTime;
        $cwe.plugin('infocentermodule').call('CrypeTo', data, function(value) {
            $UserInfo.PostData = value;
            PostHTTP($UserInfo.SpeedUpUlr, $UserInfo.PostData,
                function(responseText, responseXML) {    //http请求成功函数
                    if (RequestType == 1) {         //请求提速
                        $InterfaceControl.SetUserInfo('您已进入提速模式！', 'White');
                        $UserInfo.IsUping = true;
                        $UserInfo.IsFirst = false;
                        CountTimeObject.CountTimePlus($UserInfo.strLeaveTime);
                        $infoCenter.setConfigValue(SPEED_LAST_TIME + $UserInfo.Account, String(getCurrentTime()), false, function() { });
                        $InterfaceControl.SetSpeedBtnText('退出提速');
                        $InterfaceControl.SetSpeedBtn(true);
                        //开启主界面一键提速图标，发送广播消息
                        $cwe.postNotify('AKeySpeedUp',true, function() { });
                    }
                    else if (RequestType == 2) {    //请求退出提速
                        $UserInfo.CancelChangeData();
                        $UserInfo.SaveConfig();
                    }
                    else if (RequestType == 3) {    //请求速率
                        if ($UserInfo.SpeedUpDataAnalysis(responseXML)) {
                            $InterfaceControl.ShowUI();
                            $infoCenter.setConfigValue(SPEED_OUT_TIME + $UserInfo.Account, String(getCurrentTime()), false, function() { });
                        }
                        else {
                            $InterfaceControl.SetLoadingUI(false);

                        }
                    }
                },
                function() {         //http请求失败函数
                    //设置请求速率失败界面
                    $InterfaceControl.SetLoadingUI(false);
                    if (RequestType == 1) {         //请求提速

                    }
                    else if (RequestType == 2) {    //请求退出提速
                        $cwe.close();
                    }
                    else if (RequestType == 3) {    //请求速率

                    }
                });
        });
    },
    SaveConfig: function() {
        $infoCenter.setConfigValue(SPEED_LEAF_TIME + $UserInfo.Account, String($UserInfo.strLeaveTime), false, function(value) {
            $infoCenter.setConfigValue(SPEED_OLD_RATE + $UserInfo.Account, String($UserInfo.strOldRate), false, function() {
                $infoCenter.setConfigValue(SPEED_NEW_RATE + $UserInfo.Account, String($UserInfo.strNewRate), false, function() {
                    $cwe.close();
                });
            });
        });


    },
    SpeedUpDataAnalysis: function(responseXML) {    //对返回来的xml数据做解析
        var xmlJson = xmlToJson(responseXML);
        if(xmlJson == undefined || xmlJson.response == undefined) return;
        var SpeedUpJson = xmlJson.response;
        var ret = parseInt(SpeedUpJson.result);
        if (ret != 0) {
            $UserInfo.LoadTips = SpeedUpJson.errordescription;
            $UserInfo.SpeedUpError = SpeedUpJson.errordescription;
            return false;
        }
        if(SpeedUpJson.UserInfo == undefined) return;
        
        $UserInfo.strSrcSpeed = parseInt(SpeedUpJson.UserInfo.Obandwidth) / 1024;
        $UserInfo.strTarSpeed = parseInt(SpeedUpJson.UserInfo.Sbandwidth) / 1024;
        $infoCenter.setConfigValue(SPEED_TOTAL_TIME + $UserInfo.Account, String(SpeedUpJson.UserInfo.TotalTime), false, function() { });
        if ($UserInfo.IsFirst) {
            $UserInfo.strLeaveTime = parseInt(SpeedUpJson.UserInfo.TotalTime);
        }
        return true;
    },
    RequestRate: function() {   //请求返回界面参数，包括提速前速率，提速后速率，剩余时长
        if ($UserInfo.Account == '') {
            $UserInfo.LoadTips = '账号不存在';
            $InterfaceControl.SetLoadingUI(false);
            return false;
        }
        RequestType = 3;
        $UserInfo.GetPostData(3);
    },
    RequestSpeed: function() {
        RequestType = 1;
        $UserInfo.GetPostData(1); //请求提速，类型为1

    },
    RequestCancelSpeed: function() {
        RequestType = 2;
        $UserInfo.GetPostData(2); //请求退出提速，类型为2
    }
}

Date.prototype.format = function(format){ 
    var o = { 
        "M+" : this.getMonth()+1, //month 
        "d+" : this.getDate(), //day 
        "h+" : this.getHours(), //hour 
        "m+" : this.getMinutes(), //minute 
        "s+" : this.getSeconds(), //second 
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter 
        "S" : this.getMilliseconds() //millisecond 
        } 

        if(/(y+)/.test(format)) { 
            format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
        } 

        for(var k in o) { 
            if(new RegExp("("+ k +")").test(format)) { 
                format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length)); 
            } 
        } 
    return format;
}

function getCurrentTime() {
    var nowDate = new Date();
    return parseInt(nowDate.getTime() / 1000);
}

function Init() {
    $InterfaceControl.Init();
    $UserInfo.Init();
}

function Response() {
    $('SpeedUpButton').addEvent('click', function() {
        $InterfaceControl.SetSpeedBtn(false);
        if ($('SpeedUpButton').get('value') == '一键提速') {
            $UserInfo.RequestSpeed();
        }
        else if ($('SpeedUpButton').get('value') == '退出提速') {
            closeEvent();
        }
        else if ($('SpeedUpButton').get('value') == '打开千兆浏览器') {
            $InterfaceControl.SetSpeedBtn(true);
            $cwe.plugin('IOUtil').call('QianZhao', function(ret){});
        }
    });
    $('SpeedUpClose').addEvent('click',closeEvent);
}

function closeEvent()
{
    if($UserInfo.IsUping==true)
    {
        ShowLastError('提示', 40000001, '', MB_OKCANCEL,function(value){
            if(value.type=='mb_ok')
            {
                //关闭主界面一键提速图标，发送广播消息
                $cwe.postNotify('AKeySpeedUp',false, function() { });
                CountTimeObject.StopCountTime();
                $UserInfo.RequestCancelSpeed(); 
            }
        });
    }
    else
    {
        $cwe.close();
    }      
}

window.addEvent('domready', function() {
    $('SpeedUpButton').setStyle('font-family','Microsoft YaHei');
    Init();
    Response();
    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $UserInfo.SaveConfig();
    });
});
