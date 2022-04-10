/**
 * Created by Lijunf on 2016/12/20.
 */
var App={
    bUpdated: true,//是否已经启动更新
    updateInteval : 21600,//请求更新频率,默认6个小时
    wndSet: {}, //窗口集合
    eState:0,   //网络状态
    updateTimeOut:null,
    start: function (cbFun) {
        App._init(function(bInit){
            if(!bInit){
                alert("客户端初始化失败");
                cbFun(false);
            }else{
                //检查客户端更新
                try{
                    App._needUpdate(function(flag){
                        if(flag==false){  //无需更新
                            cbFun(true);
                        }else{
                            cbFun(false);
                        }
                    });
                }catch(e){
                    alert(e.message);cbFun(false);
                }

            }
        })

    },

    _init: function(cbFun){
        $infoCenter.getMulValue('global','appPath','appdataPath','tempPath','appFilename','dialSvrName','dialSvrPipe','imgPath','version',function(values){
            if(values == undefined) {
                cbFun(false);
                return;
            }
            App.appPath=values['appPath'];
            App.appdataPath=values['appdataPath'] ;
            App.tempPath=values['tempPath'];
            App.appFilename=values['appFilename'];
            App.dialSvrName=values['dialSvrName'];
            App.dialSvrPipe=values['dialSvrPipe'];
            App.imgPath=values['imgPath'];
            App.version=values['version'];
            cbFun(true);
        })
    },

    openWindow:function(wndId,bSingleton,mode, url, features, cb){
        try{
            if(bSingleton){
                var wndInst=App.wndSet[wndId];
                if(wndInst==undefined || !wndInst.isValid()){   //如果没有打开过，或者已经关闭了，则重新打开
                    $cwe.open(mode,url, features, function(wnd){
                        App.wndSet[wndId]=wnd;
                        if (typeof cb == "function"){
                            cb(wnd);
                        }
                    });
                }else{
                    wndInst.postNotify('feature','status:restore',cb);
                    wndInst.postNotify('feature','status:show',cb);
                }
            }else{
                $cwe.open(mode,url, features, cb);
            }
        }catch(e){
            alert(e.message);
        }

    },

    //检查客户端更新
    _needUpdate : function (cbFun){
             var params='<conf>\
<version>{0}</version>\
<updateInstId>{1}</updateInstId>\
<decompressDir>{2}</decompressDir>\
<updateDir>{3}</updateDir>\
<mainProgram>{4}</mainProgram>\
<mainProgramWnd>{5}</mainProgramWnd>\
<mainProgramId>{6}</mainProgramId>\
<backupPath>{7}</backupPath>\
<recordFile>{8}</recordFile>\
<downloadDir>{9}</downloadDir>\
<imgDir>{10}</imgDir>\
\
</conf>'.format(
                App.version,
                'UpdateInst_B5FF888E-C6EB-4a14-A3FD-622D682077A8',
                App.tempPath+'\\ChinaNet\\decompress',
                App.appPath,
                App.appPath+'\\ESurfingClient.exe',
                '',
                'CInstanceChecker_JSP_78CF29B3-6CF6-47a4-85AF-1E584B8EBD1D',
                '',
                App.appPath+'\\Config\\client.xml',
                //App.tempPath+'\\ChinaNet\\AutoSetupAuth',
	App.appdataPath+'\\ChinatelecomJSPortal\\AutoSetupAuth',
                App.imgPath
            );
            $cwe.plugin('esurfingupdate').call('Init', params,function(){
                $cwe.plugin('esurfingupdate').call('NeedUpdate', cbFun);
        });

    },

    //调用该函数到服务器访问是否需要更新
    update:function(){
        if(App.bUpdated==false){
           // App.bUpdated=true;
            $funCtrl.getFunCfg(FUN_UPDATE,function(cfg){
                if(cfg==null) return ;
                if(cfg[FUN_UPDATE + '_attributes']==undefined) return;
                if(cfg[FUN_UPDATE + '_attributes']['url']==undefined) return;
                var url=cfg[FUN_UPDATE + '_attributes']['url'];
                if(url=='') return ;
                App.setUrl(url);
                if(cfg[FUN_UPDATE + '_attributes']['inteval']!=undefined){
                    App.updateInteval=cfg[FUN_UPDATE + '_attributes']['inteval'];
                }

                $infoCenter.getMulValue('global','version','DialType','DialAccount','schoolId',function(values){
                    if(values == undefined) values = {};
                    //url=url+'&DialUpAccount=' + values.DialAccount + 'DialUpType=' + values.DialType + '&version=' + values.version + '&CID=' + values.schoolId ;
                    App.setParam('keyword', '%28auto%29');
                    App.setParam('version', values.version);
                    App.setParam('clientid', values.clientId);
                    App.setParam('dialaccount', encodeURI(values.DialAccount));
                    App.setParam('cid', values.schoolId); 
                    App.updateTimeOut && window.clearTimeout(App.updateTimeOut); //在调用update之前先清掉定时器，避免重复
                    App._update();

                })
            });

        }
    },

    setUrl:function(url){
        $cwe.plugin('esurfingupdate').call('SetUrl',url);
    },

    setParam: function(key,value){
        $cwe.plugin('esurfingupdate').call('SetParam',key,value);
    },

    UpdateStop:function(){
        $cwe.plugin('esurfingupdate').call('UpdateStop');
    },

    _update:function(){
        $cwe.plugin('esurfingupdate').call('UpdateStart');
        if(App.updateInteval!=0){
            App.updateTimeOut = setTimeout(App._update,App.updateInteval*1000);        }
    }
}

