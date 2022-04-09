var m_totalItemNum = 0;
var m_progress = 0;
///////////////////////界面设置相关////////////////////////////////////////////////
//创建界面
function ShowWnd(ItemNum, title, desc){
    $('ToolItem').set('html', ToolItem.get('html') + CreateCheckItem(ItemNum, title, desc));
    m_totalItemNum = m_totalItemNum + 1*5;
}

//更改界面信息
function ChangeWndItem(ItemNum, State, desc, progress){
    SetIconState(ItemNum, State);
    SetItemError(ItemNum, desc);
    SetItemResult(ItemNum, State);
    SetProgress(progress);
    SetProcessTip(ItemNum);
}

/*! @brief [动态创建检测项] */
//$('ToolItem').set('html', ToolItem.get('html') + CreateCheckItem(1));
//ItemNum是指创建的第几项, 标题，描述
function CreateCheckItem(ItemNum, title, desc) {
    var CheckItemHtml = '<div " class="ConcreteCheckProject">        <div id="StateIcon' + ItemNum
    + '" class="Check_Pre"></div>        <div " class="ConcreteCheckTips">            <div id="CheckItem' + ItemNum 
    + '" class="ConcreteCheckItem">'+ItemNum+'.'+title+'</div>            <div id="ErrorDesc' + ItemNum
    + '" class="ConcreteErrorDesc">'+desc+'</div>        </div>        <div id="CheckResult' + ItemNum 
    + '" class="CheckPreResult">未检测</div>        <div class="division"></div>    </div>' ;
    return CheckItemHtml;
}

/*! @brief [设置进度条提示] */
function SetProcessTip(ItemNum){
    var Item = 'CheckItem' + ItemNum;
    $('ToolTips').set('text',$(Item).innerText);
}


/*! @brief [设置图标状态] */
//SetIconState(1, 'Check_Pre');
function SetIconState(ItemNum, State) {
    var Item = 'StateIcon' + ItemNum;
    if(State=='Check_Pre') {                 //未检测
        $(Item).set('class', 'Check_Pre');
    }
    else if (State == 'Check_Tested') {     //检测完成,正常
        $(Item).set('class', 'Check_Tested');
    }
    else if (State == 'Check_TestError') {  //检测完成，出错
        
        /*! @brief [简要说明] */$(Item).set('class', 'Check_TestError');
    }
    else if (State == 'Check_Testing') {    //检测中
        $(Item).set('class', 'Check_Pre');
    }
    else if (State == 'Check_Reparing') {   //修复中
        $(Item).set('class', 'Check_Pre');
    }
}


/*! @brief [设置检测项描述] */
//SetItemDesc(1,'1、网卡有效检测');
function SetItemDesc(ItemNum,ItemDesc) {
    var Item = 'CheckItem' + ItemNum;
    $(Item).set('text',ItemDesc);
}

/*! @brief [设置错误描述] */
//SetItemError(1, '检测网线是否插好');
function SetItemError(ItemNum, ItemError) {
    var Item = 'ErrorDesc' + ItemNum;
    $(Item).set('text', ItemError);
}

function CheckOver(){
    $('CheckButton').set('value', '检测修复');
    $('ToolTips').set('text','请点击修复按钮修复环境');
    SetProgress(0);
}


/*! @brief [设置检测结果描述] */
//SetItemResult(1, 'Check_Pre');
function SetItemResult(ItemNum, State) {
    var Item = 'CheckResult' + ItemNum;
    if (State == 'Check_Pre') {                 //未检测
        $(Item).set('text', '未检测');
        $(Item).setStyle('color', '#A7A7A7');
    }
    else if (State == 'Check_Tested') {     //检测完成,正常
        $(Item).set('text', '正常');
        $(Item).setStyle('color', '#3c8118');
    }
    else if (State == 'Check_TestError') {  //检测完成，出错
        $(Item).set('text', '异常');
        $(Item).setStyle('color', '#ff0000');
    }
    else if (State == 'Check_Testing') {    //检测中
        $(Item).set('text', '检测中');
        $(Item).setStyle('color', '#55d7d7');
    }
    else if (State == 'Check_Reparing') {   //修复中
        $(Item).set('text', '修复中');
        $(Item).setStyle('color', '#FF5555');
    }
}

/*! @brief [设置进度条] */
//eg:SetProgress(50);
function SetProgress(Percent) {
    $('ProgressBar').setStyle('width', Percent + '%');
}


/*! @brief [修复按钮的响应函数] */
function SetButtonState() {
    $('CheckButton').addEvent('click', function() {
        if ($('CheckButton').get('value') == '检测修复') {
            $('CheckButton').set('value', '取消');
            //响应函数：开始检测修复CheckRepair.dll
            //$cwe.plugin('CheckRepair').call('ShowWnd','', function(){});
            $cwe.plugin('checkrepair').call('StartCheck','', function(){});
        }
        else if ($('CheckButton').get('value') == '取消') {
            CheckOver();
            $cwe.plugin('checkrepair').call('Stop','', function(){});
            //响应函数：取消检测修复

        }
    });
}

/////////////////////////初始化/////////////////////////////////////////
window.addEvent('domready', function() {
    $cwe.plugin('CheckRepair').call('ShowWnd','', function(){});

    $cwe.addNotify('checkrepair.checkrepairshow', function(ItemNum, title, desc){ //需要判断返回失败的情况？？
        ShowWnd(ItemNum, title, desc);
    });

    $cwe.addNotify('checkrepair.checkrepairchange', function(ItemNum, State, desc){
        m_progress = m_progress + ItemNum;
        ChangeWndItem(ItemNum, State, desc, m_progress);
    });

    $cwe.addNotify('checkrepair.checkrepaiready', function(ItemNum, State, desc){
        ChangeWndItem(ItemNum, State, desc, 0);
    });

    $cwe.addNotify('checkrepair.checkrepairerror', function(ErrorTitle, ErrorDesc){
        MessageBox(ErrorTitle, ErrorDesc, MB_OK);
        CheckOver();
    });

    $cwe.addNotify('checkrepair.checkrepairover', function(ErrorDesc){
        CheckOver();
    });
    SetButtonState();

    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $cwe.close();
    });
})


