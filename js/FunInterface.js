/*功能接口文件 ybq 2016.12.28
*描述：与业务逻辑相关的接口，统一写在该文件
*/

//打开跳转页面 divName:控件id， extermParam:url链接附加参数  ？？？？还没测试过
function OpenUrl(funName, adUrlName, extermParam){
   $funCtrl.getFunCfg(funName,function(cfg){
        if(cfg==null) return ;
        if(cfg[funName + '_attributes']==undefined) return;
        if(cfg[funName + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[funName + '_attributes'][adUrlName];
        if(url=='') return ;
        if(extermParam != undefined) url = url + extermParam;
        window.open(url);
    });
}

/*! @brief [根据错误码显示弹框内容] ybq 2016.12.28
 *参数描述：iProcode:错误码  SubCode:子错误码  sType:弹框类型(MB_OK=确定 MB_OKCANCEL=确定+取消 MB_YES=是
 *                      MB_YESNO=是+否 MB_VLIMIT=确定+版本禁用链接 MB_HELP=确定+帮助指引链接
 *ShowLastError还支持点击事件回调，用法：ShowLastError('150000', '', MB_HELP, function(value){
        if(value.type=="mb_ok")
        {}
 });
 */
function ShowLastError(title, iProcode, SubCode, sType){
    //获取错误码对应的描述  全部写成%s 参数在传递过程中，全部转为string
    if(sType == undefined) sType = 0;
    var uid = GenerateUUID();
    var boxHtml = 'msgbox.html?iProcode=' + iProcode + '&sType=' + sType + '&SubCode=' + SubCode + '&UID=' + uid + '&title=' + title;

    var args = [];
    var len = arguments.length - 1;
    var cbFun = arguments[len];
    if (typeof cbFun != "function") 
    {
        cbFun = function(){};
    }
    else  
    {
        //如果最后一个参数是回调函数，则回调函数不加入传到msgbox.html的参数里，否则会无法找到msgbox.html
        len=len-1;
    }

    for (var i = 4; i <= len; i++){
        boxHtml = boxHtml + '&desc' + i + '=' + escape(arguments[i]);
    } 
    $cwe.addNotify('cweui.msgboxmsg', function(param){
        var paramJson = JSON.decode(param);
        if(paramJson.uid == uid){
            cbFun(paramJson);
        }
    });
    $cwe.open('modal', boxHtml, '', function(){}); 
}

/*! @brief [显示带有url的弹框] ybq 2016.12.28
 *url:弹框要显示的url，title：标题 可为空
 */
function ShowUrlWnd(url, title){
    if(url == undefined) return;
    //var boxHtml = 'msgbox.html?url=' + url + '&title=' + title + '&width=' + width + '&height=' + height;
    //log(boxHtml);
    SendJson = new Object;
    SendJson.url = url;
    SendJson.title =title;
    
    $cwe.open('modal', 'msgbox.html', 'status:show', function(w){
        var openFun = function(){
            w.postNotify('msgboxurlmsg', SendJson);
        }
        openFun.delay(100);
    });   

}

/**
 * zlm 2020.06.14 显示欠费充值窗口
 */
function ChargeMessageBox(url,text) {
	SendJson = new Object;
    SendJson.url = url;
    var boxHtml = 'msgbox.html?text=' + text + '&title=' + '温馨提示' + '&sType=' + MB_CHARGE;
    $cwe.open('modal', boxHtml, 'status:show', function(w){
        var openFun = function(){
            w.postNotify('msgboxlinkmsg', SendJson);
        }
        openFun.delay(100);
    });
}

/*! @brief [显示文字弹框] ybq 2016.12.28
 *title：标题 可为空, text:弹框的文字显示， type：弹框的样式(确定/取消 是/否) MB_OK
 */
function MessageBox(title, text, sType){
    if(text == undefined) return;

    var boxHtml = 'msgbox.html?text=' + text + '&title=' + title + '&sType=' + sType;
    $cwe.open('modal', boxHtml, '', function(){}); 
}

//interfacenum=1、显示loading界面；=2、切换到正常界面
function ShowLoadingOrNormal(loadingDiv, divname, interfacenum)
{
    if(interfacenum==1)
    {
        $(loadingDiv).setStyle('display','block');
        $(divname).setStyle('display','none');
    }
    else if(interfacenum==2)
    {
        $(loadingDiv).setStyle('display','none');
        $(divname).setStyle('display','block');

    }


}

/*! @brief [是否有效字符串，没有特殊字符] ybq 2017.1.1*/
function IsValidString(str){
    if(str == undefined || str.length > 60) return false;
    for(var i=0;i<str.length;i++){ 
        var oneStr=str.substring(i,i+1); 
        var strToNum = oneStr.charCodeAt();
        if (strToNum<32 || strToNum>126) {
            return false; 
        }    
    } 
    return true; 
}

//设置button是否可点，需要在html文档全部加载完成后初始化，否则会拿不到color属性值
var ButtonAvailable=new Class({
    id:"",
    srcColor:"",
    initialize:function(inputID){
        this.id=inputID;
        this.srcColor=$(this.id).getStyle('color');
    },
    SetDisabledTrue:function(){
        $(this.id).setStyle('color', 'Gray');
        $(this.id).setStyle('disabled', 'disabled');
    },
    SetDisabledFalse:function(){
        $(this.id).setStyle('color', this.srcColor);
        $(this.id).erase('disabled');
    }
});

//在json数据中查找值
function FindJsonData(strJson, str){
    if(typeof(strJson) != 'object') return false;
    for(var i = 0; i < strJson.length; i++)
    {
        if(strJson[i] == str)
        {
            return true;
        }
    }
    return false;
}

//拼接参数到url
function AddParam(url, param){
    if(url.indexOf('?') >= 0){
        url = url + '&' + param;
    }
    else{
        url = url + '?' + param;
    }
    return url;
}