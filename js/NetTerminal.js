var svrMgr=new SvrMgr();

function CreateTerminal(name,message,iconCls,opType,opTypeName,ticket){
    var TERMINALHTML = '' +
        '<div  class="ConcreteTerminal">' +
        '<div  class="{2}"></div>' +
        '<div  class="MachineTips">' +
        '<div  class="MachineName">{0}</div>' +
        '<div  class="MachineMessage">{1}</div>' +
        '</div>' +
        '<div id=\'{5}\' class="{3}" onclick="terminalTerm(\'{5}\')">{4}</div>' +
        '<div class="division">' +
        '</div>' +
        '</div>';
    TERMINALHTML=TERMINALHTML.format(name,message,iconCls,opType,opTypeName,ticket);
    return TERMINALHTML;
}

function terminalTerm(ticket){
    if(ticket=='') return;
    $(ticket).setStyle('display','none');
    svrMgr.PostSvrMsg('TerminalWnd',TERMINAL_TERM_REQUEST,'<ticket>'+ticket+'</ticket>');
}

window.addEvent('domready', function() {
    svrMgr.recvSvrMsg();
    svrMgr.regSvrMsg(TERMINAL_RESP,function(svrMsgObj){
        $('Terminal').set('html','');
        var opParam=svrMsgObj.M.P;
        if(opParam == undefined || opParam.response == undefined || opParam.response.client==undefined) return ;//正常情况下肯定会有当前设备的client，这种情况不会发生
        var myTicket=opParam.ticket;
        if(opParam.response.client instanceof Array) { //如果是数组，则有多个
            var clients=opParam.response.client;
            for(var i=0;i<clients.length;i++){
                if(clients[i].ticket==myTicket) insertClient(clients[i],0);
                else insertClient(clients[i],1);
            }
        }else{
            insertClient(opParam.response.client,0);
        }
    })

    svrMgr.regSvrMsg(TERMINAL_TERM_RESP,function(svrMsgObj){
        var opParam=svrMsgObj.M.P;
        if(opParam == undefined) opParam = {};
        if(opParam.code!=0){
            svrMgr.PostSvrMsg('TerminalWnd',TERMINAL_REQUEST,'');
        }
    });

    svrMgr.PostSvrMsg('TerminalWnd',TERMINAL_REQUEST,'');

    //主窗口关闭时通知消息推送窗口关闭
    $cwe.addNotify('cweui.CloseWnd', function() {
        $cwe.close();
    });

    $('ChangePassword').addEvent('click',function(){
        $cwe.postNotify('openchangepassword');
    });
});
/*
    插入终端信息
    pos是插入的位置
 */
function insertClient(client,pos){
    var clientDiv=new Element('div');
    var icon;
    var name;
    var opType;
    var opTypeName;
    var ticket;
    if(pos==0){
        opType='Local';
        opTypeName='本机';
        ticket='';
    }else{
        opType='offline';
        opTypeName='下线';
        ticket=client.ticket;
    }
    if(client.ostype=='pc'){
        icon='PCIcon';
        name=client.hostname;
    }else{
        icon='PhoneIcon';
        name=client.ostag;
    }
    var message=client['login-time'] + ' ' + client.mac;
    clientDiv.set('html', CreateTerminal(name,message,icon,opType,opTypeName,ticket));
    if(pos==0) {
        clientDiv.inject($('Terminal'),'top');
    }else{
        $('Terminal').adopt(clientDiv);
    }
}

