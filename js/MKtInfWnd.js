/*消息推送功能说明 ybq 2016.12.20
*功能描述：在帐号登录成功之后发送，只发送一次；重登后重新发送一次
*登录后调用RequestMKtInf函数
*/
//消息推送未显示窗口的数据
var wnd_list = {};  
//当前显示窗口对象
var wndObject;


//////////////////////////////////////////////////////////
//消息推送窗口数据接收函数
$cwe.addNotify('cweui.mktinfwnd', function(value) {
    if(value === undefined) return;
    wnd_list = value;
    if(wndObject && wndObject.isValid()){
        wndObject.close();
    }

    setTimeout('CreateWnd()', 3000);
});


//消息推送窗口关闭回调函数
$cwe.addNotify('cweui.mktinfclose', function(name) {
    //先清理当前窗口的数据
    ClearWndData(name);
    //创建下一个窗口
    CreateWnd();
});


//////////////////////////////////////////////////////////
//创建窗口
function CreateWnd(){
    var j_data;
    var name;

    for(var i in wnd_list){
        j_data = wnd_list[i];
        name = i;
        break;
    }

    if(j_data === undefined) return;

    $cwe.addNotify('cweui.mktinfready', function(){
        //log('send data to mkntf');
        wndObject.postNotify('mktinfdata', JSON.encode(j_data), function(){});
    });

    $cwe.open('thread', 'MessagePush.html', 'status:hide', function(w){
        if(!w) alert('create thread window false');
        wndObject=w;
    });

    delete wnd_list[name];
}

//清理窗口数据
function ClearWndData(name){
    wndObject = undefined;
    if(wnd_list[name] === undefined) return;
    delete wnd_list[name];
}


///////////////////////////////////////////////////
//请求消息推送
function RequestMKtInf(adUrlName){
    //MktIntf
    $funCtrl.getFunCfg(FUN_MKTINFT,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_MKTINFT + '_attributes']==undefined) return;
        if(cfg[FUN_MKTINFT + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[FUN_MKTINFT + '_attributes'][adUrlName];

        if(url=='') return ;
        //获取当前时间
        var currentTime = GetLocalStringTime();
        //获取参数
        $infoCenter.getMulValue('global','version','DialType','DialAccount','schoolId', 'language', 'clientId', 'netcardType', 'ticket', function(values){
            if(values == undefined) values = {};
            url=url+'?Account=' + values.DialAccount + '&Token=' + '&UpdateTime=' + currentTime+ '&IsFirstTime=1' 
             + '&Versions=' + values.version +  '&Language=' + values.language + '&DialUpnum=' + '&DialUptype=' + values.DialType
             + '&ATI=' + '&IPv6=' + '&UpLoad=0' + '&DownLoad=0' + '&ClientID=' + values.clientId + '&IsSupportUw=' 
             + '&WifiMac=' + '&CID=' + values.schoolId + '&Networktype=' + values.netcardType + '&Ticket=' + values.ticket;

            RequestHTTP(url, ParseMKtInf);
        })
    });
}

//解析消息推送的数据
function ParseMKtInf(responseText, responseXML){
   // alert(responseText);
    if(typeof responseXML != "object" || responseXML.getElementsByTagName('Item') == undefined) return;
    var isHaveData;
    var MKtInf_Json = new Object;

    for(var i=0;i<responseXML.getElementsByTagName('Item').length - 1;i++){ 
        //...遍历操作...  
        var t_json = new Object;

        t_json.strGuid = responseXML.getElementsByTagName('Item')[i].childNodes[0].nodeValue;
        t_json.strTitle = responseXML.getElementsByTagName('Item')[i].childNodes[1].childNodes[0].nodeValue;
        t_json.strUrl = responseXML.getElementsByTagName('Item')[i].childNodes[2].childNodes[0].childNodes[0].nodeValue;
        t_json.IntShowType = responseXML.getElementsByTagName('Item')[i].childNodes[3].childNodes[0].nodeValue;
        t_json.IntDisplay = responseXML.getElementsByTagName('Item')[i].childNodes[4].childNodes[0].nodeValue;
        t_json.IntWidth = responseXML.getElementsByTagName('Item')[i].childNodes[5].childNodes[0].nodeValue;
        t_json.IntHeight = responseXML.getElementsByTagName('Item')[i].childNodes[6].childNodes[0].nodeValue;

        MKtInf_Json[t_json.strTitle] = t_json;
        isHaveData = true;
    }
    if(isHaveData){
        $cwe.postNotify('mktinfwnd', MKtInf_Json);
    }
}
