var $MenuObject = {
    itemDefaultStatus:0,
    itemPreConnStatus:1,
    itemConnectStatus:2,
    ///*
    // label: 菜单显示名字
    // enableType: 0 'default' 默认显示，1 'preConn'  有网络显示，2 'connect' 登录后显示
    // id:对应服务器配置的id
    // status:enable,disable 后台控制是否显示，默认显示
    // enable: true 有效 ，false 无效
    // */
    menuItems:[
        { label: '设置',             enableType: 0                                    },
        { label: '检测修复工具',    enableType: 0 , status:'disable'                                   },
        { label: '自助排障工具', status:'disable',   enableType: 0                                   },
        { label: 'wifi清理工具', status:'disable',   enableType: 1,     id:FUN_CLEARTOOL              },
        { label: '错误上报',  status:'disable',       enableType: 1,     id:FUN_ERRORPOST              },
        { label: '宽带自助服务',  status:'disable', enableType: 1,     sub:[
            { label: '充值缴费',  status:'disable',       enableType: 1,     id:FUN_CHARGEURL      },
            { label: '修改密码',  status:'disable',       enableType: 1,     id:FUN_PASSWORDURL      },
            { label: '账单查询',  status:'disable',       enableType: 2,     id:FUN_SEARCHBILL      },
            { label: '充值记录查询',  status:'disable',       enableType: 2,     id:FUN_SEARCHCHARGE      },
            { label:'自助停复机', status:'disable', enable: true,  enableType: 1, id:FUN_SELFSTOPREPLY},
            { label:'宽带套餐办理', status:'disable', enable: true,  enableType: 2, id:FUN_BRANDBAND}
        ]
        },
        { label: '上网时长', status:'disable',        enableType: 2,     id:FUN_INTERNETTIME           },
        { label: '上网终端管理', status:'disable',   enableType: 2,     id:FUN_NETTERMINAL             },   
        { label: '在线客服',  enable: true,  enableType: 0                 }, 
        { label: '帮助',             enableType: 0,     sub:[
            {label:'反馈&建议', enableType: 1, id:FUN_FEEDBACKURL},
            {label:'帮助指引', enable: true,  enableType: 0},
            {label:'关于',     enable: true,   enableType: 0}
        ]
        }
    ],
    //真正显示的对象
    menuStatus:this.itemDefaultStatus,

    IconMenuJson: [
        { label: '打开主窗口', enable: true },
        //{ label: '-' },
        { label: '退出', enable: true }
    ],
    updateMenu:function(status){
        this.menuStatus=status;
    },

    setMenuItemStatus:function(name, status){
        var itemLen=this.menuItems.length;
        for(var i=0;i<itemLen;i++){
            var item=this.menuItems[i];
            if(item.label==name){
                item.status = status;
            }
        }
    },

    checkItembyFile:function(itemName, fileName){
        $cwe.plugin('IOUtil').call('IsFileExist', fileName ,function(flag){
            if(flag){ //存在
                $MenuObject.setMenuItemStatus(itemName, 'enable');
            }
        });
    },

    createMenuCfg:function(status,showFun){
        if(status==this.itemPreConnStatus ||status==this.itemConnectStatus ){
            var itemLen=this.menuItems.length;
            var checkItemLen=0;
            for(var i=0;i<itemLen;i++){
                var item=this.menuItems[i];
                if(item.id==undefined){
                    checkItemLen++;
                    if(item.sub != undefined){
                        for(var j=0;j<item.sub.length;j++){ //子菜单项校验
                            (function SetSubMenuStatus(_item, _itemSub){//异步，需要更改的值必须传进来
                                $funCtrl.getFunCfg(_itemSub.id, function(cfg){
                                    if(cfg!=null ) {//没有配置，用默认配置
                                        if(cfg[_itemSub.id + '_attributes'].enable == '0'){ //如果enable属性配置了0，则不显示
                                            _itemSub.status='disable';
                                        }else{
                                            _itemSub.status='enable';
                                            _item.status = 'enable'; //只要有一个子菜单，都必须开放父菜单
                                        }
                                    }  
                                })
                            })(item, item.sub[j]);
                        }
                    }
                    
                }
                (function SetMenuStatus(_item){
                    $funCtrl.getFunCfg(_item.id, function(cfg){
                        if(cfg!=null ) {//没有配置，用默认配置
                            if(cfg[_item.id + '_attributes'].enable == '0'){ //如果enable属性配置了0，则不显示
                                _item.status='disable';
                            }else{
                                _item.status='enable';
                            }
                        }

                        checkItemLen++;
                        if(checkItemLen==itemLen-1){
                            showFun($MenuObject._createMenuCfg(status));
                        }
                    })
                })(item);

            }
        }else{
            showFun($MenuObject._createMenuCfg(status));
        }
    },
    _createMenuCfg:function(status){
        var items=[];
        var itemLen=this.menuItems.length;
        for(var i=0;i<itemLen;i++){
            var item=this.menuItems[i];
            if(item.status=='disable') continue; //不显示
            if(item.enableType<=status){
                item.enable=true;
            }else{
                item.enable=false;
            }
            if(item.enable==true && item.sub != undefined && item.sub.length > 0){ //子菜单过滤
                var subItem=[];
                for(var j=0;j<item.sub.length;j++){
                    if(item.sub[j].status=='disable') continue; //不显示
                    if(item.sub[j].enableType<=status){
                        item.sub[j].enable=true;
                    }else{
                        item.sub[j].enable=false;
                    }
                    subItem.push(item.sub[j]);
                }
                var subItems = item;
                subItems.sub = subItem;
                items.push(subItems);
            }else{ //没有子菜单
                items.push(item);
            }
        }
        return items;
    }
}

/*!
 * @brief [菜单响应函数]
 *
 * [根据引擎提供的插件设置及显示菜单]
 * @return function
 * Edited by xzw in 12.21.2016
 */
function MenuItem() {
    $MenuObject.updateMenu($MenuObject.itemDefaultStatus);
    $MenuObject.checkItembyFile('自助排障工具', '\\SelfDebugTool\\SelfDebugTool.exe');
    $('menu').addEvent('click', function() {
        $MenuObject.createMenuCfg($MenuObject.menuStatus,function(menu){
            $cwe.popupMenu(menu, 240, 19, function(SelectedItem) {
                var moduleid = -1;
                if (SelectedItem.label === '设置') {
                    App.openWindow('SettingWnd',true,'modal', 'SettingWnd.html', '', function() { });
                    moduleid = CLICK_SETTING;
                }
                else if (SelectedItem.label === '错误上报') {
                    App.openWindow('DataSubmit',true,'thread', 'DataSubmit.html', '', function() { });
                    moduleid = CLICK_ERRORPOST;
                }
                else if (SelectedItem.label === '修改密码') {
                    OpenUrlWithParam(FUN_PASSWORDURL, 'url', 'action=modifyPassword');
                    moduleid = CLICK_PASSWORDURL;
                }
                else if (SelectedItem.label === '上网时长') {
                    ShowIntervalTime('url');
                    moduleid = CLICK_INTERNETTIME;
                }
                else if (SelectedItem.label === '检测修复工具') {
                    OpenCheckAndRepaireTool();
                    moduleid = CLICK_SELFDEBUGTOOL;
                    //App.openWindow('DetectionAndRepairTool',true,'thread', 'DetectionAndRepairTool.html', '', function() { });
                }
                else if (SelectedItem.label === '上网终端管理') {
                    App.openWindow('NetTerminal',true,'thread', 'NetTerminal.html', '', function() { });
                    moduleid = CLICK_NETTERMINAL;
                }
                else if (SelectedItem.label === 'wifi清理工具') {
                    ShowWifiClear();
                    moduleid = CLICK_CLEARTOOL;
                }
                else if(SelectedItem.label == '自助排障工具'){
                    OpenCheckAndRepaireTool();
                    moduleid = CLICK_SELFDEBUGTOOL;
                    //$cwe.plugin('IOUtil').call('OpenExe', '\\SelfDebugTool\\SelfDebugTool.exe', '', function() {});
                }
                else if (SelectedItem.label === '帮助指引') {
                    window.open('..\\ErrorView\\ErrorInfo.html');
                    moduleid = CLICK_HELPURL;
                }
                else if (SelectedItem.label === '关于') {
                    App.openWindow('AboutWnd',true,'thread','AboutWnd.html', '', function() { });
                }
				else if(SelectedItem.label == '反馈&建议'){
                    OpenServicePush('反馈&建议', 600, 450, 600, 450, FUN_FEEDBACKURL, false, 'failed_view');
                    moduleid = CLICK_FEEDBACKURL；
				}
                else if(SelectedItem.label === '自助停复机'){
                    OpenUrlWithParam(FUN_SELFSTOPREPLY, 'url');
                    moduleid = CLICK_SELFSTOPREPLY;
                }
                else if(SelectedItem.label === '宽带套餐办理'){
                    OpenUrlWithParam(FUN_BRANDBAND, 'url');
                    moduleid = CLICK_BRANDBAND;
                }
		        else if(SelectedItem.label == '在线客服'){
                    OpenQQ();
                    moduleid = CLICK_QQ;
                }
                // zlm 2020.04.08
		        else if (SelectedItem.label === '充值缴费') {
		        	OpenUrlWithParam(FUN_CHARGEURL, 'url');
                    moduleid = CLICK_CHARGEURL;
                }
             // zlm 2020.04.08
		        else if(SelectedItem.label == '账单查询'){
		        	$BillWnd.ShowBillWnd();
                    moduleid = CLICK_SEARCHBILL;
                }
                //zlm 2020.04.09
		        else if(SelectedItem.label == '充值记录查询'){
		        	$ChargeWnd.ShowChargeWnd();
                    moduleid = CLICK_SEARCHCHARGE;
                }
                
                SetClickModule(3, moduleid);
            });
        })

    });
}