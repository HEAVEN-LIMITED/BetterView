/*消息推送显示窗口文件 ybq 2016.12.20*/
var wnd_name;
var json_data;

window.addEvent('domready', function() { 
    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $cwe.close();
    });

    $cwe.addNotify('cweui.mktinfdata', function(value) {
        json_data = JSON.decode(value, true);
        InitData();  
    });

    $('MsgPushClose').addEvent('click', function() {
        try { 
            $cwe.postNotify('mktinfclose', wnd_name);
            //window.external.close(); 
            $cwe.close();
        } catch (e) { }
    });

    $cwe.postNotify('mktinfready');
});

//////////////////////////////////////////////////////////
function GetNonzeroValue(value, minuend)
{
    return (value-minuend) >= 0 ? (value-minuend) : 0;
}

/*! @brief [带logo，文字，关闭] */
function StyleOne(tips,width,height,url) {
    $('MessagePushLogo').setStyle('display','block');
    $('MessagePushTittle').setStyle('display','block');
    $('MessagePushText').set('text',tips);
    $('MessagePushTittle').setStyle('width',width+'px');
    $('MsgPushBody').setStyle('height',height);
    $('MsgPushBody').setStyle('width',width);
    $('MsgPush').setStyle('height',GetNonzeroValue(height, 32));
    $('MsgPush').setStyle('width',GetNonzeroValue(width, 4));
    $('MsgPush').set('src',url);
}
//////////////////////////////////////////////////////////
/*! @brief [带文字，关闭] */
function StyleTwo(tips,width,height,url) {
    $('MessagePushLogo').setStyle('display','none');
    $('MessagePushText').setStyle('margin','3px 0px 0px 5px');
    $('MessagePushText').set('text',tips);
    $('MessagePushTittle').setStyle('width',width+'px');
    $('MsgPushBody').setStyle('height',height);
    $('MsgPushBody').setStyle('width',width);
    $('MsgPush').setStyle('height',GetNonzeroValue(height, 32));
    $('MsgPush').setStyle('width',GetNonzeroValue(width, 4));
    $('MsgPush').set('src',url);
}
//////////////////////////////////////////////////////////
/*! @brief [只有url框] */
function StyleThree(width,height,url) {
    $('MessagePushTittle').setStyle('display','none');
    $('MessagePushTittle').setStyle('width',width+'px');
    $('MsgPushBody').setStyle('height',height);
    $('MsgPushBody').setStyle('width',width);
    $('MsgPush').setStyle('height',GetNonzeroValue(height, 0));
    $('MsgPush').setStyle('width',GetNonzeroValue(width, 4));
    $('MsgPush').set('src',url);
}
//////////////////////////////////////////////////////////
//初始化界面的值
function InitData() {
    if(typeof json_data != 'object'){
        alert('json_data is not object type');
        //window.external.close();
        $cwe.close();
        return;
    }

    wnd_name = json_data.strTitle;
    $('MsgPush').set('src',json_data.strUrl);
    if(json_data.IntShowType === '2'){  //欢迎消息
        var sizetype = "size:" + json_data.IntWidth + " " + json_data.IntHeight + ",position:0 0 center,toolicon:none";
        $cwe.feature(sizetype, function(){});
        if(!(json_data.IntWidth == '0' || json_data.IntHeight == '0'))
        {
            StyleOne(json_data.strTitle, json_data.IntWidth, json_data.IntHeight, json_data.strUrl);
        }
    }
    else{
         //设置宽高
        var sizetype = "size:" + json_data.IntWidth + " " + json_data.IntHeight + ",position:0 0 rightbottom,toolicon:none";
        $cwe.feature(sizetype, function(){});

        if(!(json_data.IntWidth == '0' || json_data.IntHeight == '0')) //当窗口为0时，设置宽高为负数会出现问题
        {
            if(json_data.IntShowType === '7' || json_data.IntShowType === '2'){  //网页-普通
                StyleOne(json_data.strTitle, json_data.IntWidth, json_data.IntHeight, json_data.strUrl);
            }
            if(json_data.IntShowType === '8'){  //网页-无图标
                StyleTwo(json_data.strTitle, json_data.IntWidth, json_data.IntHeight, json_data.strUrl);
            }
            if(json_data.IntShowType === '9' || json_data.IntShowType === '10'){  //网页-无边框  无按钮
                StyleThree(json_data.IntWidth, json_data.IntHeight, json_data.strUrl);
            } 
        }
    }

    //设置显示时间
    setTimeout('closeWnd()', parseInt(json_data.IntDisplay)*1000);

    //如果为0*0，则不需要设置窗口信息
    if(json_data.IntWidth == '0' ||  json_data.IntHeight == '0'){
         $cwe.feature('status:hide', function(){});
    }
    else{
         $cwe.feature('status:show,zorder:topmost,toolicon:hide', function(){});
    }
}
   

function closeWnd(){
    $cwe.postNotify('mktinfclose', wnd_name);
    //window.external.close(); 
    $cwe.close();
}