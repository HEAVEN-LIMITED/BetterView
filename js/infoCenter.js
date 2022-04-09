/*infocenter.dll 模块说明 ybq 2016.12.20
*功能：存储/获取内存值，config.xml文本值， 读写注册表
*读取内存值的key说明：
*global:{
*       appPath:程序安装目录的路径
        appdataPath:appdata的路径 
        tempPath:temp目录
        DialAccount:登录账号
        account:登录账号，未登录之前能拿到
        DialPassword:登录密码
        version:版本号
        DialType:拨号类型
        schoolId:学校ID
        domain:学校域名
        area:对应地市区号
        clientId:clientID
        hostName:计算机名
        authType:登录方式 支持账号/二维码的登录方式，可组合
        authDefautType:缺省登录方式 启动客户端时先显示账号界面还是二维码界面由该值来判断，该值为空时默认先显示账号界面
        language:语言包名称
        FUN_:功能对应url配置 xml格式
        wlanacip:bras ip
        wlanuserip:用户ip
        netcardType:上网方式
        ticket
        qqNumber qq账号
*   }
*againstList:共享列表
*/
var $infoCenter={
    getValue:function(module,key,cbFun){
        $cwe.plugin('infocentermodule').call('GetValue',module,key, cbFun);
    },
    setValue:function(module,key,value,cbFun){
        $cwe.plugin('infocentermodule').call('SetValue',module,key,value, cbFun);
    },
    getGlobalValue:function(key,cbFun){
        $cwe.plugin('infocentermodule').call('GetValue','global',key, cbFun);
    },
    setGlobalValue:function(key,value,cbFun){
        $cwe.plugin('infocentermodule').call('SetValue','global',key,value, cbFun);
    },
    getConfigValue:function(key,iscry,cbFun){
        $cwe.plugin('infocentermodule').call('GetEncryptValue',key,iscry,cbFun);
    },
    setConfigValue:function(key,value,iscry,cbFun){
        $cwe.plugin('infocentermodule').call('SetEncryptValue',key,value,iscry,cbFun);
    },
    getMulValue:function(){
        var module=arguments[0];
        var arg=arguments;
        var len = arguments.length - 1;
        var cb = arguments[len];
        if (typeof cb != "function") cb = function(){};
        else len--;
        var count=0;
        var values=new Object();
        for (var i = 1; i <= len; i++){
            $cwe.plugin('infocentermodule').call('GetValue',module,arguments[i], function(value){
                count++;
                values[arg[count]]=value?value:'';
                if(count==len){
                    cb(values);
                }
            });
        }
    },
    getMulConfig:function(){
        var arg=arguments;
        var len = arguments.length - 1;
        var cb = arguments[len];
        if (typeof cb != "function") cb = function(){};
        else len--;
        var count=0;
        var values=new Object();
        for (var i = 1; i <= len; i++){
            $cwe.plugin('infocentermodule').call('GetEncryptValue',arguments[i], function(value){
                count++;
                values[arg[count]]=value;
                if(count==len){
                    cb(values);
                }
            });
        }
    }
}