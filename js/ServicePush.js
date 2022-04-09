var refresh='true';
var failed_view='failed_view'

window.addEvent('domready', function(){

    InitWnd();

    ReceiveMsg();

    Response();

});

function Response()
{
    $('info_close').addEvent('click',function(){
        if(refresh=='true')
        {
            $cwe.postNotify('ServicePushRefresh',function(){
                $cwe.close();
            });
        }
        else
        {
            $cwe.close();
        }     
    });

    /*! @brief [在页面完全加载后才显示出来] */
    $('frame_view').addEvent('load', function() {
        var iframe = document.getElementById("frame_view");
        if(!iframe.readyState || iframe.readyState == "complete"){
            $('loading_img').setStyle('display', 'none');
            $(failed_view).setStyle('display', 'none');
            $('frame_view').setStyle('display', 'block');
        }
        else{
            $('loading_img').setStyle('display', 'none');
            $('frame_view').setStyle('display', 'none');
            $(failed_view).setStyle('display', 'block');
        }
    });
}

function ReceiveMsg()
{
    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $cwe.close();
    });
    //页面发送关闭消息时，关闭窗口
    $cwe.addNotify('cweui.CloseServicePushWnd', function(isRefresh) {
        if(isRefresh == true){ //是否要刷新套餐信息界面
            $cwe.postNotify('RefreshMyAccount');
        }
        $cwe.close();
    });
    $cwe.addNotify('cweui.RefreshNetWord', function(value){
        if(value == true){
            $('loading_img').setStyle('display', 'none');
            $('frame_view').setStyle('display', 'none');
            $(failed_view).setStyle('display', 'block');
        }
        else{
            if($('frame_view').style.display == 'none')
                $('frame_view').src = $('frame_view').src;
        }
        // var url = $('frame_view').src;
        // if(url.indexOf('?') > 0){
        //     url = url + '&';
        // }
        // else{
        //     url = url + '?';
        // }
        // url = url + 'random=' + Math.random()*100000;
        // $('frame_view').src = url;
        // alert(url);
    });
}

function InitWnd()
{
    var temp=GetRequest();
    if(typeof temp != 'object')
    {
        return;
    }
    $('logo_text').set('text',temp.tittle);
    $('frame_view').setStyle('width',temp.width);
    $('frame_view').setStyle('height',temp.height);
    $('loading_img').setStyle('margin',(temp.height-31)/2+' '+'auto');
    refresh=temp.refresh;
    if(temp.failedView != undefined){
        failed_view=temp.failedView;
        $('loading_img').setStyle('display', 'none');
        $(failed_view).setStyle('display', 'block');
    }
    
    document.title = temp.tittle;
    ShowInfomation(temp.funName,'frame_view', 'url');
}

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function ShowInfomation(windowsName,divId,adUrlName){
    $funCtrl.getFunCfg(windowsName,function(cfg){
        if(cfg==null) return ;
        if(cfg[windowsName + '_attributes']==undefined) return;
        if(cfg[windowsName + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[windowsName + '_attributes'][adUrlName];
        if(url=='') return ;

        $infoCenter.getMulValue('global','ticket', 'DialAccount', 'schoolId', function(values){
            if(values == undefined) values = {};
            if(url.indexOf('?') > 0){
                url = url + '&';
            }
            else{
                url = url + '?';
            }
            url=url+'schoolid='+values.schoolId+'&username='+values.DialAccount+'&ticket='+values.ticket+"&random="+new Date().getTime();
            $(divId).src = url;
        });
        
    });
}