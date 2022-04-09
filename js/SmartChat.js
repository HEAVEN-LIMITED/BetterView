var Msgs={}; //记录消息
var mIndex=0;
var mAppdataPath;
var mMsgCurrentIndex = 0; //记录更多消息显示到什么位置
var mTextMsgs=[]; //文本消息
var mWelcomeUrl = 'http://192.168.142.243/api/welcome';
var mChatUrl = 'http://192.168.142.243/api/';
var mSearchUrl = 'http://192.168.142.243/api/question';
var mCurrentScropHeight=0;
var mVersion = '';
var mAccount = '';
var mSchoolid = '';
var mCurrentOSType = 'windows'; //初始OS为windwos
var mOldTime = 0;
/*!
* @brief [在界面所有标签及相应资源加载完成后执行的函数] 
*/
window.addEvent('load', function() {  
    //任务栏图标及提示,在界面加载完成后再加载此项，否则会影响界面加载速度
    
});
//地址保持在哪里？
//聊天内容保存在本地
//增加消息发送状态
window.addEvent('domready', function() {
    Init();

    $('input_box').addEvent('keyup', function(e) { //键盘按下事件
         if (window.event)//如果window.event对象存在，就以此事件对象为准  
            e = window.event;  
        var code = e.charCode || e.keyCode;  
        if (code == 13) {  
            //此处编写用户敲回车后的代码
            sendData();
            return;
        }
        var num = '<span class="red">'+$('input_box').value.length+'</span>'+'/55';
        $('NumCountId').innerHTML=num;
    });

    $('input_box').addEvent('focus', function(){ //编辑框获取焦点事件
        if($('input_box').get('class') == 'textClass') {
            $('input_box').set('class', 'writeCLass');
            $('input_box').value = '';
        }
    });

    $('send').addEvent('click', function() { //发送按钮
        sendData();
    });

    $('seachMoreID').addEvent('click', function(){ //查看更多消息
        SHowMsg();
    });

    $('MainWnd_Close').addEvent('click', function() {//关闭事件
        WriteData();
    });

    $$(".terminal").addEvent('click', function(){ //各种终端监听事件
        changeCurrentOSType(this.innerText, this.get('os'));
    });

    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        WriteData(function(){
            $cwe.close();
        });
    });
});


//ie7,ie8 不支持document.getElementsByClassName
//if(!document.getElementsByClassName){
document.getElementsByClassName = function(className, element){
    var children = (element || document).getElementsByTagName('*');
    var elements = new Array();
    for (var i=0; i<children.length; i++){
        var child = children[i];
        var classNames = child.className.split(' ');
        for (var j=0; j<classNames.length; j++){
            if (classNames[j] == className){
                elements.push(child);
                break;
            }
        }
    }
    return elements;
};

//初始化
function Init(){
    $funCtrl.getFunCfg(FUN_WELCOMEURL,function(cfg){ //欢迎接口url
        if(cfg==null
            || cfg[FUN_WELCOMEURL + '_attributes']==undefined
            || cfg[FUN_WELCOMEURL + '_attributes']['url']==undefined){
            return ;
        }
        mWelcomeUrl=cfg[FUN_WELCOMEURL + '_attributes']['url'];

        $infoCenter.getMulValue('global', 'DialAccount', 'version', 'schoolId', 'appdataPath', function(values){
            if(values == undefined) values = {};
            mAppdataPath = values.appdataPath;
            mVersion = values.version;
            mAccount = values.DialAccount;
            mSchoolid = values.schoolId;

            GetChatAnswer(mWelcomeUrl, 0, 'welcome', '');

            ReadData();
        });
    });
    $funCtrl.getFunCfg(FUN_CHATURL,function(cfg){ //问答接口url
        if(cfg==null
            || cfg[FUN_CHATURL + '_attributes']==undefined
            || cfg[FUN_CHATURL + '_attributes']['url']==undefined){
            return ;
        }
        mChatUrl=cfg[FUN_CHATURL + '_attributes']['url'];
    });
    $funCtrl.getFunCfg(FUN_SEARCHURL,function(cfg){ //搜索接口url
        if(cfg==null
            || cfg[FUN_SEARCHURL + '_attributes']==undefined
            || cfg[FUN_SEARCHURL + '_attributes']['url']==undefined){
            return ;
        }
        mSearchUrl=cfg[FUN_SEARCHURL + '_attributes']['url'];
    });
}

//发送事件实现
function sendData(){
    var text = document.getElementById('input_box');
    var questText = deleteHtmlTag(text.value.replace(/(^\s*)|(\s*$)/g, '')).replace(/</g, '&lt;');
    if(questText =='' || $('input_box').get('class') == 'textClass'){
        return;
    }
    mIndex++;
    SetHTML(GetMeStyle(mIndex, questText, true));

    text.value = '';
    text.style.background="#fff";

    $('NumCountId').innerHTML='<span class="red">0</span>/55';
    SetSayData(mIndex, questText, 'me');
    
    GetChatAnswer(mChatUrl, mIndex, 'say', questText);
}

//http post接口实现，发送和接受数据
function GetChatAnswer(url, index, type, questText){ //{ "os": "windows", "kw": "网络不通了" }
    var loadingID = 'LodingID'+index;
    var loadFailID = 'LoadFailID'+index;

    if(url == undefined){
        $(loadingID).setStyle('display', 'none');
        return;
    } 

    var data = {};
    data.os = mCurrentOSType;
    data.kw = stripscript(questText); //过滤特殊字符
    if(type == 'search'){ //search类型的接口，发送的是id，不是问题
        data.id = questText;
        Msgs[index].id = questText;
    }
    JsonPostHTTP(url, data, function(responseJSON){
        if(!isJson(responseJSON)) { //如果不是json格式，则可能是发生了跳转
            if(type == 'welcome'){
                SetHTML(GetOtherStyle(index, '您好！请问有什么能帮助您的吗？', mCurrentOSType));
            }else{
                SetMsgStaus('loading_type', index, false);
                SetMsgStaus('load_error', index, true);
            }
            return;
        }
        var resDataObj = JSON.decode(responseJSON);
        if(resDataObj == undefined) resDataObj = {};

        if(resDataObj.answer == undefined){ //返回{}怎么处理
            resDataObj.answer = '您输入的文字有误，请重新输入！';
            //return;
        }
    
        if(type != 'welcome'){ //欢迎接口不存在消息状态
            $(loadingID).setStyle('display', 'none');
            mIndex++;
        }

        SetHTML(GetOtherStyle(mIndex, resDataObj.answer, mCurrentOSType));
    },function(){
        if(type == 'welcome'){ //欢迎
            SetHTML(GetOtherStyle(index, '您好！请问有什么能帮助您的吗？', mCurrentOSType));
        }else{
            SetMsgStaus('loading_type', index, false);
            SetMsgStaus('load_error', index, true);
        }
    });

}

//我的消息失败重试点击事件
function aMethod(obj){
    var index = obj.get('index');
    SetMsgStaus('load_error', index, false);
    SetMsgStaus('loading_type', index, true);
    
    if(Msgs[index] == undefined) return false;
    if(Msgs[index].id != undefined) {
        GetChatAnswer(mSearchUrl, index, 'search', Msgs[index].id);
    }
    else{
        GetChatAnswer(mChatUrl, index, 'resay', Msgs[index].data);
    }
    return false;
}

//打开客服返回的图片
function openPic(path){
    try{
        window.external.openPic(path);
    }catch(e){
        window.open(path);
    }
}

//搜索接口实现
function sendQuestionMsg(id, answer){
    mIndex++;
    SetHTML(GetMeStyle(mIndex, answer, true));
    SetSayData(mIndex, answer, 'me');
    GetChatAnswer(mSearchUrl, mIndex, 'search', id);
}

//点击界面的其他终端-切换终端类型
function changeCurrentOSType(title, answer){ //切换图标
    mIndex++;
    SetHTML(GetMeStyle(mIndex, title, true));
   
    //更换图标和按钮
    var terminalObj = document.getElementsByClassName('terminal');
    for(var i = 0; i < terminalObj.length; i++){
        var os = terminalObj[i].get('os');
        if(os != undefined && os == answer){
            terminalObj[i].set('os', mCurrentOSType);
            terminalObj[i].innerText = mCurrentOSType + '客户端';
        }
    }

    //alert($$('.windows_terminal').innerHTML);
    mCurrentOSType = answer;
    SetSayData(mIndex, title, 'me');
    GetChatAnswer(mWelcomeUrl, mIndex, 'switch', '');
}

//获取我的聊天样式
function GetMeStyle(index, text, isLoading){
    var str = '<div class="me" id="leftMeID'+index+'"><img class="leftpng" src="img/img_body_me.png" title="我"><div class="rightBubble" ></div><div class="leftSpan">'+text+'</div>';
    if(isLoading){
        str += '<img id="LodingID'+index+'" class="aLoading" src="img/msgloading.gif"></img></div>';
    }else{
        str += '</div>';
    }
    if(index >= 0){
        var strTime = GetLocalStringTime();
        if(mOldTime == 0 || TimeDifferent(mOldTime, strTime) > 2*60*1000){
            str = '<div class="timeClass">'+strTime+'</div>' + str;
            mOldTime = strTime;
        }
    }
    return str;
}

//获取客服的聊天样式
function GetOtherStyle(index, result, currentOS){
    var strMsg = '<div class="other"><img class="otherpng" src="img/'+currentOS+'.png" title="客服"><div class="leftBubble"></div><div class="rightSpan">';
    if(index >= 0){
        var strTime = GetLocalStringTime();
        if(mOldTime == 0 || TimeDifferent(mOldTime, strTime) >= 2*60*1000){
            strMsg = '<div class="timeClass">'+strTime+'</div>' + strMsg;
            mOldTime = strTime;
        }
        if(index > 0)
            SetSayData(index, result, 'other');
    }

    var patt = /\{[^\}]+\}/g;
    var replaceResult = result;
    replaceResult = replaceResult.replace(/\n{/g, "{"); //除了纯文字，如果其他类型数据前有<br>，会导致有空白行
    replaceResult = replaceResult.replace(/\r\n/g, "<br>");
    replaceResult = replaceResult.replace(/\n/g, "<br>");
    var tags = result.match(patt);
    if(tags != null && tags != undefined && tags.length != undefined && tags.length > 0) {
        for(var i = 0; i < tags.length; i++) {
            var tag = tags[i];
            if(isJson(tag)) {
                var tagObj = JSON.decode(tag);
                if(tagObj.type != undefined) {
                    if(tagObj.type == 'link') {
                        var aTagHtml = '<a target="_blank" href="' + tagObj.url + '">' + tagObj.title + '</a>';
                        replaceResult = replaceResult.replace(tag, aTagHtml);
                    } else if(tagObj.type == 'image') {
                        var imgTagHtml = '<img onclick="openPic(this.href)" width="330" height="200" src="' + tagObj.url + '"/>';
                        replaceResult = replaceResult.replace(tag, imgTagHtml);
                    }else if(tagObj.type == 'search') {
                        var aTagHtml = '<label onclick="sendQuestionMsg(\'' + tagObj.id + '\',\'' + tagObj.keyword + '\')" class="indexClass">' + tagObj.title + "</label>";
                        replaceResult = replaceResult.replace(tag, aTagHtml);
                    } else if(tagObj.type == 'switch') {
                        var aTagHtml = '<label onclick="changeCurrentOSType(\'' + tagObj.title + '\',\'' + tagObj.os + '\')" class="indexClass">' + tagObj.title + "</label>";
                        replaceResult = replaceResult.replace(tag, aTagHtml);
                    }
                }
            }
        }
    }
    strMsg = strMsg + replaceResult + '</div></div>';
    return strMsg;
}

//我的消息发送状态显示  param：类型，下标，显示/删除
function SetMsgStaus(type, index, isShow){
    var leftSpanID = 'leftMeID'+index;
    if(isShow){
        if(type == 'loading_type'){
            if($('LodingID'+index) != undefined) return;
            $(leftSpanID).innerHTML += '<img id="LodingID'+index+'" class="aLoading" src="img/msgloading.gif"></img>';
            //$('LodingID'+index).setStyle('display', 'block');
        }
        else if(type == 'load_error'){
            if($('LoadFailID'+index) != undefined) return;
            $(leftSpanID).innerHTML += '<img class="aFail" id="LoadFailID'+index+'" index="'+index+'" src="img/msg_fail.png" title="点击重新发送"></img>'; 
            SetMsgFaild();
        }
    }else{
        var parent = document.getElementById(leftSpanID);
        var strchild;
        if(type == 'loading_type'){
            strchild = 'LodingID'+index;
        }
        else if(type == 'load_error'){
            strchild = 'LoadFailID'+index;
        }
        var child = document.getElementById(strchild);
        if(child == undefined || child == null || typeof child != 'object') return;
        parent.removeChild(child);
    }
}

//我的消息发送失败设置点击事件
function SetMsgFaild(){
    for(var i =0; i <= mIndex; i++){
        if($('LoadFailID'+i) != undefined ){
            var child = document.getElementById('LoadFailID'+i);
            if(child.onclick != null) continue;
            child.onclick = function(){
                aMethod(this);
            }
           
            // $('LoadFailID'+i).addEvent('click', function(){
            //     alert(this.id);
            //     aMethod(this);
            // });
        }
    }
}

//更新聊天窗口内容-每次在html后叠加，不允许删除或者中间插入html
function SetHTML(strHtml){
    var chat = document.getElementById('chatbox');
    var scrollbox = document.getElementById("windowsID");

    chat.innerHTML += strHtml;

    if(scrollbox != undefined){
        scrollbox.scrollTop = scrollbox.scrollHeight + 5;
        mCurrentScropHeight = scrollbox.scrollHeight;
    } 
    SetMsgFaild();
}

//查看更多消息中，一次性更新聊天窗口的内容 区别于SetHTML函数，主要是滚动位置的设置问题
function SetMoreMsg(strHtml){
    if(strHtml == '') return;
    var chat = document.getElementById('chatbox');
    var scrollbox = document.getElementById("windowsID");

    var oldHtml = strHtml + chat.innerHTML;
    chat.innerHTML = oldHtml;

    SetMsgFaild();

    if(scrollbox != undefined){
        var newHeight = chat.clientHeight||chat.offsetHeight; //scrollHeight更新很慢，之行到此时scrollHeight的值不对
        scrollbox.scrollTop = newHeight-mCurrentScropHeight;//Math.abs(scrollbox.scrollHeight - mCurrentScropHeight);
        mCurrentScropHeight = newHeight;
    }
}

//保存聊天内容到内存
function SetSayData(index, text, type){
    if(Msgs[index] == undefined){
        Msgs[index] = {};
    }

    if(isJson(text)){
        Msgs[index].data = {};
    }

    var time = GetLocalStringTime();
    Msgs[index].time = time;
    Msgs[index].type = type;
    Msgs[index].os = mCurrentOSType;
    Msgs[index].data = text;
}

//显示更多消息
function SHowMsg(){
    var strHtml = ''
    var readLength = 0;

    for(var i = mMsgCurrentIndex; i >= 0; i--){
        var subObjs = JSON.decode(mTextMsgs[i]);
        if(subObjs == undefined) continue;
        //时间
        var strTime = '';
        var strSubHtml = '';
        for(var item in subObjs){
            var subObj = subObjs[item];
            if(subObj == undefined || subObj['data'] == undefined) continue;

            if(strTime == '') {
                strTime = subObj['time'];
                strSubHtml += '<div class="timeClass">'+strTime+'</div>';
            }
            else{
                //计算时间间隔是否大于5分钟
                var diff = TimeDifferent(strTime, subObj['time']);
                if(diff >= 2*60*1000){
                    strTime = subObj['time'];
                    strSubHtml += '<div class="timeClass">'+strTime+'</div>';
                }
            }

            if(subObj['type'] == 'me'){
                strSubHtml += GetMeStyle(-1, subObj['data'], false);
            }
            else{
                strSubHtml += GetOtherStyle(-1, subObj.data, subObj.os);
            }
            readLength++;
            
        }
        
        strHtml = strSubHtml + strHtml;
        mMsgCurrentIndex = i-1;
        if(readLength > 5){ //一次显示n条消息  
            break;
        }

    }
    if(strHtml == ''){
        strHtml = '<div class="timeClass">没有更多消息了</div>';
        $('seachMoreID').setStyle('display', 'none');
    }
    SetMoreMsg(strHtml);
}

//读取本地的消息
function ReadData(){
    $cwe.plugin('ioutil').call('ReadFile', mAppdataPath +'\\ChinatelecomJSPortal\\Config\\smartchat.txt', function(strValue){
        if(strValue == undefined || strValue =='') return;

        strValue = strValue.substring(0, strValue.length-2); //要减2，因为分割字符为;!
        mTextMsgs = strValue.split(';!');//倒叙 由于html字符与；冲突，所以需要使用html可能没有的字符组合
        mMsgCurrentIndex = mTextMsgs.length -1;

        $('seachMoreID').setStyle('display', 'block');
    });
}

//写入消息到本地
function WriteData(cbFun){
    if(JSON.encode(Msgs) == '{}') return;
    if(cbFun == 'function') cbFun = function(){};
    $cwe.plugin('ioutil').call('WriteFile', mAppdataPath+'\\ChinatelecomJSPortal\\Config\\smartchat.txt', JSON.encode(Msgs)+';!', cbFun);
}

/**
 * 判断是否是json字符串
 * @param {String} str
 */
function isJson(str) {
    if(typeof str == 'string') {
        try {
            var obj = JSON.decode(str);
            return true;
        } catch(e) { }
    }
    return false;
}

/*
 * 字符串过滤特殊字符
 */
function stripscript(str) {
    var pattern = new RegExp("[`~!#$^&*=|{}':;',\\[\\].<>/?~！#￥……&*——|{}【】‘；：”“'？%]")
    var rs = "";
    for(var i = 0; i < str.length; i++) {
        rs = rs + str.substr(i, 1).replace(pattern, '');
    }
    return rs;
}

//去除html标签
function deleteHtmlTag(str){
    str = str.replace(/<[^>]+>|&[^>]+;/g,"").trim();//去掉所有的html标签和&nbsp;之类的特殊符合
    return str;
}