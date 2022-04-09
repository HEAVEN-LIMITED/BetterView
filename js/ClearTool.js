var UnInstallWifiName = null;
var UninstallFlag = false;
var CheckWifiToolTimeout;
var Hooked=false;
window.addEvent('domready', function() {
    InitData();
    Response();
});


/*! @brief [在这里进行工具的初始化] */
function InitData() {
    $cwe.plugin('CleanApp').call('Init', 'CleanApp', '', function(value) { if(value=='isHooked') Hooked=true;});
    StateOne();
}

/*! @brief [在这里编写控件的响应函数] */
function Response() {
    
    /*! @brief [关闭按钮] */
    $('CearToolClose').addEvent('click', function() {
        clearTimeout(CheckWifiToolTimeout);
        $cwe.close();
    });

    /*! @brief [检测按钮] */
    $('FirstButton').addEvent('click', function() {
        StateThree();
        CheckSetupInfo();
    });

    /*! @brief [确定按钮] */
    $('SecondButton').addEvent('click', function() {
        $cwe.close();
    });

    /*! @brief [检测过程中取消按钮] */   
    $('ThirdButton').addEvent('click', function() {
        StateOne();
    });

    /*! @brief [一键卸载按钮] */
    $('FourthButton').addEvent('click', function() {
        StateSevent();
        /*执行卸载命令*/
        $cwe.plugin('CleanApp').call('UnInstallApp', 'CleanApp', '', function() { });

        /*定时器循环判断是否已经卸载*/
        GetInfo();
        GetLastInfo();
    });

    /*! @brief [我知道了 按钮] */
    $('FifthButton').addEvent('click', function() {
        $cwe.close();
    });

    /*! @brief [检测结束后：重新检测按钮] */
    $('SeventhButton').addEvent('click', function() {
        UnInstallWifiName = null;
        UninstallFlag = false;
        StateOne();
    });

    /*! @brief [稍后重启按钮] */
    $('EighthButton').addEvent('click', function() {
        $cwe.close();
    });

    /*! @brief [立刻重启按钮] */
    $('NinthButton').addEvent('click', function() {
        $cwe.plugin('CleanApp').call('RebootSystem', 'CleanApp', '', function() { });
    });
}

/*在进行卸载后开始检测安装软件及残留信息,先检测软甲是否清理完毕，如果检测到没有卸载软件，，再进行残留驱动检测*/
function GetInfo() {
    $cwe.plugin('CleanApp').call('GetWiFiInfo', 'CleanApp', '', function(FindWiFiTool) {
        if (FindWiFiTool == false) {
            UninstallFlag = true;
        }
    });
 
    CheckWifiToolTimeout = setTimeout(GetInfo, 2000);
}


function GetLastInfo() {
    if (UninstallFlag==true) {
        clearTimeout(CheckWifiToolTimeout);
        $cwe.plugin('CleanApp').call('UnloadingResidue', 'CleanApp', '', function(flag) {
            if (flag == true) {
                StateEight(UnInstallWifiName);

            }
            else {
                StateSix(UnInstallWifiName);
            }

        });

    }
    setTimeout(GetLastInfo, 2000);
}

function CheckSetupInfo() {
    $cwe.plugin('CleanApp').call('GetSetupInfo', 'CleanApp', '', function() {
        for (var i = 0; i < arguments.length - 1; i++) {
            var temp = parseInt((i / (arguments.length - 1)) * 100);
            var temps = temp + '%';
            var displayname = arguments[i];
            /*检测过程界面变动*/
            $('progessbar').setStyle('width', temps);
            $('displayname').set('text', '系统已安装 ' + arguments[i]);
        };
        if (arguments[arguments.length - 1] == false) {
            /*找不到共享软件*/
            StateTwo();
            /*在找不到共享软件的情况下，再查找是否有残留驱动*/
            $cwe.plugin('CleanApp').call('UnloadingResidue', 'CleanApp', '', function(flag,name) {
                if (flag == true) { 
                    StateFive(name);
                }
                else {
                        /*等服务和驱动都检查完毕后，再检查是否有注入*/
                       if (Hooked == true) {
                            StateEight(null);
                            $('uninstalltips').set('text', '客户端遭到篡改！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！');
                        }
                }
            });
        }
        else if (arguments[arguments.length - 1] == true) {
            /*找到共享软件*/
            UnInstallWifiName = displayname;
            $('tips').set('text', '发现可能和客户端发生上网冲突的软件' + displayname + '，请卸载后再试。');
            StateFour();
        }
    });
}


/*界面状态一：检测*/
function StateOne() {
    $('tips').set('text', '                               　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　请检测系统中是否有与客户端上网相冲突的软件。');
    $('progessbar').setStyle('width', '0%');
    $('displayname').set('text', '');
    $('ButtonStyleOne').setStyle('display', 'block');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
    
    $('stateone').setStyle('display', 'block');
    $('statetwo').setStyle('display', 'none');
    $('ButtonStyle').setStyle('display', 'block');
}

/*界面状态二：确定*/
function StateTwo() {
    $('tips').set('text', '                               　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　本次检测暂未发现上网冲突软件。');
    $('displayname').set('text', '检测完成');
    $('progessbar').setStyle('width', '100%');
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'block');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
    $('stateone').setStyle('display', 'block');
    $('statetwo').setStyle('display', 'none');
    $('ButtonStyle').setStyle('display', 'block');
}

/*界面状态三：取消*/
function StateThree() {
    $('tips').set('text', '正在检测系统软件，请稍候……');
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'block');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
    $('stateone').setStyle('display', 'block');
    $('statetwo').setStyle('display', 'none');
    $('ButtonStyle').setStyle('display', 'block');
}

/*界面状态四：一键卸载*/
function StateFour() {
    $('progessbar').setStyle('width', '100%');
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'block');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'none');
    $('stateone').setStyle('display', 'block');
    $('statetwo').setStyle('display', 'none');
    $('ButtonStyle').setStyle('display', 'block');
    $('tips').setStyle('height', '35px');
}

/*界面状态五：我知道了，手动帮助指引*/
function StateFive(name) {
    $('tips').set('text', '发现可能和客户端发生上网冲突的软件' + name + '残留驱动，请尝试重新安装' + name + '后手动卸载。');
    $('tips').setStyle('color', 'red');
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'block');
    $('ButtonStyleSix').setStyle('display', 'none');

    $('stateone').setStyle('display', 'block');
    $('statetwo').setStyle('display', 'none');
    $('ButtonStyle').setStyle('display', 'block');

}

/*界面状态六：重新检测，稍后重启，立刻重启*/
function StateSix(name) {
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'none');
    $('ButtonStyleSix').setStyle('display', 'block');

    $('stateone').setStyle('display', 'none');
    $('statetwo').setStyle('display', 'block');
    $('ButtonStyle').setStyle('display', 'block');

    $('uninstalltips').set('text', name + '卸载完毕，请重启电脑后再试。');
    
}

/*界面状态七：卸载过程提示*/
function StateSevent() {
    $('stateone').setStyle('display', 'none');
    $('statetwo').setStyle('display', 'block');
    $('ButtonStyle').setStyle('display', 'none');
    $('uninstalltips').set('text', '正在卸载共享软件，请稍候……　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　（若您已在软件卸载界面取消卸载，则本次卸载不成功，请关闭本窗口后重新检测。）');
}

/*界面状态八：我知道了，手动帮助指引：无进度条*/
function StateEight(name) {
    $('ButtonStyleOne').setStyle('display', 'none');
    $('ButtonStyleTwo').setStyle('display', 'none');
    $('ButtonStyleThree').setStyle('display', 'none');
    $('ButtonStyleFour').setStyle('display', 'none');
    $('ButtonStyleFive').setStyle('display', 'block');
    $('ButtonStyleSix').setStyle('display', 'none');

    $('stateone').setStyle('display', 'none');
    $('statetwo').setStyle('display', 'block');
    $('ButtonStyle').setStyle('display', 'block');
    $('uninstalltips').set('text',name+ '卸载完毕，但系统中仍有残留驱动，若自动清理可能会影响系统稳定性，请尝试重新安装'+name+'后手动卸载。');
}
