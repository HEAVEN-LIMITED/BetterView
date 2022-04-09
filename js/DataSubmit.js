/*
    数据上报模块
    目前只支持日志上报，后续可扩展其他数据上报
 */

var submitBtn;

window.addEvent('load',function(){
    submitBtn=new ButtonAvailable('datasubmit_submit');
});

window.addEvent('domready', function() {
    $accountInput = new InputEx('datasubmit_account', '例如:18028800000');
    $('datasubmit_submit').addEvent('click', function() {//我的账号界面
        submitBtn.SetDisabledTrue();
        // $('datasubmit_submit').disabled='disabled';
        try {
            logSubmit($accountInput.getValue());
        } catch (e) {
            //alert(e.message);
            ShowLastError('', '170001', '', MB_OK);
        }
    });

    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $cwe.close();
    });
});
/*
    日志上报
    account 用户标识，是后台配置的上报帐号，不一定是登录帐号
    C++模块会根据后台返回的上报帐号列表来决定是否真的上传
 */
var datasubmited=false;
function logSubmit(submitAccount){
    if(submitAccount==''){
        ShowLastError('', '170001', '31', MB_OK);
        return;
    }
    if(datasubmited) {
        submitBtn.SetDisabledFalse();
        ShowLastError('', '170001', '32', MB_OK);
        return;
    }
    datasubmited=true;
    $funCtrl.getFunCfg(FUN_ERRORPOST,function(cfg){
        if(cfg==null
            || cfg[FUN_ERRORPOST + '_attributes']==undefined
            || cfg[FUN_ERRORPOST + '_attributes']['query']==undefined
            || cfg[FUN_ERRORPOST + '_attributes']['submit']==undefined){
            return ;
        }

        //获取查询和上传地址
        var queryUrl=cfg[FUN_ERRORPOST + '_attributes']['query'];
        var submitUrl=cfg[FUN_ERRORPOST + '_attributes']['submit'];
        if(queryUrl=='' || submitUrl=='') return ;

     /*
        var queryUrl='http://192.168.200.17:12231/Portal.EsurfingClient/GetCollectList.ashx';
        var submitUrl='http://192.168.200.17:12231/EsurfingClient/other/PostErrorLog.ashx';
        */

        $infoCenter.getMulValue('global','DialAccount','schoolId','wlanuserip','version','clientId','appPath',function(values){
            try{
                $cwe.plugin('datasubmit').call('SetLogUrl','query',queryUrl);
                $cwe.plugin('datasubmit').call('SetLogUrl','submit',submitUrl);
                $cwe.plugin('datasubmit').call('SetLogParam','DialAccount',values.DialAccount);
                $cwe.plugin('datasubmit').call('SetLogParam','schoolId',values.schoolId);
                $cwe.plugin('datasubmit').call('SetLogParam','wlanuserip',values.wlanuserip);
                $cwe.plugin('datasubmit').call('SetLogParam','version',values.version);
                $cwe.plugin('datasubmit').call('SetLogParam','clientId',values.clientId);
                $cwe.plugin('datasubmit').call('SetLogDir','server',values.appPath + '/log');

                $cwe.plugin('datasubmit').call('LogSubmit',submitAccount,values.clientId,function(result){
                    if(result!=0) datasubmited=false;
                    submitBtn.SetDisabledFalse();
                    result=-result;
                    ShowLastError('', '170001', result, MB_OK);
                });
            }catch(e){
                datasubmited=false;
                ShowLastError('', '170001', '', MB_OK);
            }

        })
    });
}
