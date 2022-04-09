/*工具文件 
*描述：和业务逻辑无关，纯功能接口
*/
//创建xml对象
function parseXML(data) {
    var xml, tmp;
    if (window.DOMParser) { // Standard
        tmp = new DOMParser();
        xml = tmp.parseFromString(data, "text/xml");
    } else { // IE
        xml = new ActiveXObject("Microsoft.XMLDOM");
        xml.async = "false";
        xml.loadXML(data);
    }
    tmp = xml.documentElement;
    if (!tmp || !tmp.nodeName || tmp.nodeName === "parsererror") {
        return null;
    }
    return xml;
}

/*
    将 xml 转换为JSON，参数为IXMLDOMDocument2对象　　
    不支持同名节点
 */
function xmlToJson(obj) {
    if (this == null) return null;
    if(obj == null) return null;
    var retObj = new Object;
    buildObjectNode(retObj,
        /*jQuery*/
        obj);
    return retObj;
    function buildObjectNode(cycleOBJ,
                             /*Element*/
                             elNode) {
        /*NamedNodeMap*/
        var nodeAttr = elNode.attributes;
        if (nodeAttr != null) {
            if (nodeAttr.length && cycleOBJ == null) cycleOBJ = new Object;
            for (var i = 0; i < nodeAttr.length; i++) {
                cycleOBJ[nodeAttr[i].name] = nodeAttr[i].value;
            }
        }
        var nodeText = "text";
        if (elNode.text == null) nodeText = "textContent";
        /*NodeList*/
        var nodeChilds = elNode.childNodes;
        if (nodeChilds != null) {
            if (nodeChilds.length && cycleOBJ == null) cycleOBJ = new Object;
            for (var i = 0; i < nodeChilds.length; i++) {
                if (nodeChilds[i].tagName != null) {
                    if (nodeChilds[i].childNodes[0] != null && nodeChilds[i].childNodes.length <= 1 && (nodeChilds[i].childNodes[0].nodeType == 3 || nodeChilds[i].childNodes[0].nodeType == 4)) {
                        if (cycleOBJ[nodeChilds[i].tagName] == null) {
                            cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                        } else {
                            if (typeof(cycleOBJ[nodeChilds[i].tagName]) == "object" && cycleOBJ[nodeChilds[i].tagName].length) {
                                cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = nodeChilds[i][nodeText];
                            } else {
                                cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                cycleOBJ[nodeChilds[i].tagName][1] = nodeChilds[i][nodeText];
                            }
                        }
                    } else {
                        if (nodeChilds[i].childNodes.length) {
                            if (cycleOBJ[nodeChilds[i].tagName] == null) {
                                cycleOBJ[nodeChilds[i].tagName] = new Object;
                                buildObjectNode(cycleOBJ[nodeChilds[i].tagName], nodeChilds[i]);
                            } else {
                                if (cycleOBJ[nodeChilds[i].tagName].length) {
                                    cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length] = new Object;
                                    buildObjectNode(cycleOBJ[nodeChilds[i].tagName][cycleOBJ[nodeChilds[i].tagName].length - 1], nodeChilds[i]);
                                } else {
                                    cycleOBJ[nodeChilds[i].tagName] = [cycleOBJ[nodeChilds[i].tagName]];
                                    cycleOBJ[nodeChilds[i].tagName][1] = new Object;
                                    buildObjectNode(cycleOBJ[nodeChilds[i].tagName][1], nodeChilds[i]);
                                }
                            }
                        } else {
                            cycleOBJ[nodeChilds[i].tagName] = nodeChilds[i][nodeText];
                            var attr=nodeChilds[i].attributes;
                            if (attr != null) {
                                if (attr.length){
                                    var attrOBJ = new Object;
                                    cycleOBJ[nodeChilds[i].tagName + '_attributes']=attrOBJ;
                                    for (var i = 0; i < attr.length; i++) {
                                        attrOBJ[attr[i].name] = attr[i].value;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

//创建xml对象
function createXMLDom(){
    if (window.ActiveXObject)  {
        var xmldoc=new ActiveXObject("Microsoft.XMLDOM");
    }
    else if (document.implementation&&document.implementation.createDocument)  {
        var xmldoc=document.implementation.createDocument("","doc",null);
    }
    xmldoc.async = false;
    //为了和FireFox一至，这里不能改为False;
    xmldoc.preserveWhiteSpace=true;
    return xmldoc;
}

//创建文件
function CreateFile(filePath, mode){
    var fso = new ActiveXObject("Scripting.FileSystemObject"); //创建FileSystemObject对象的
    var ts;
    if(fso.GetFile(filePath) == null){ //没有该文件
        ts = fso.CreateTextFile(filePath, true); //创建文件, true覆盖创建
    }else{
        ts = fso.OpenTextFile(filePath, mode, true); //打开文件
    }
    return ts;
}

//http请求函数 url:需要请求的地址  SuccFun:成功回调函数 FailFun:失败回调函数
function RequestHTTP(url,SuccFun,FailFun) {
    var myRequest = new Request({
        url: url,
        method: 'get',
        onRequest: function() { },
        onSuccess: function (responseText, responseXML) {
            SuccFun(responseText, responseXML);
        },
        onFailure: function() {
            if(FailFun != undefined) FailFun();
        },
        async:true
    });
    myRequest.send();
}

function PostHTTP(url,data,SuccFun,FailFun){
    var myRequest = new Request({
        url: url,
        method: 'post',
        onRequest: function() { },
        onSuccess: function (responseText, responseXML) {
            SuccFun(responseText, responseXML);
        },
        onFailure: function() {
            if(FailFun != undefined) FailFun();
        },
        async:true
    });
    if(data==null){
        myRequest.send();
    }else{
        myRequest.send(data);
    }
}

//http请求返回html页面 ybq 2012.12.27
// function AjaxDivRequest(url, divName){
//     var ajaxobj=new AJAXRequest;
//     ajaxobj.method="GET"; // 设置请求方式为GET
//     ajaxobj.url=url;
//     ajaxobj.callback=function(xmlobj) {
//     document.getElementById(divName).innerHTML = xmlobj.responseText;
//     }
//     ajaxobj.send();
// }

//http请求返回json数据 ybq 2012.12.27
function JsonHTTP(url,SuccFun,FailFun) {
    var myRequest = new Request({
        url: url, method: 'get', headers:{'Content-Type':'application/json'
        }, onRequest: function () {

        }, onSuccess: function (responseJSON) {
            SuccFun(responseJSON);
        }, onFailure: function (){
            if(FailFun != undefined) FailFun();
        },async:true
    });
    myRequest.send();
}

function JsonPostHTTP(url,datas, SuccFun,FailFun) {
    var myRequest = new Request({
        url: url, method: 'post',urlEncoded: false,headers:{'Content-Type':'application/json '
        }, onRequest: function () {
            //alert(JSON.encode(data));
        }, onSuccess: function (responseJSON) {
            SuccFun(responseJSON);
        }, onFailure: function (){
            if(FailFun != undefined) FailFun();
        },async:true
    });
    myRequest.post(JSON.encode(datas));
}

function AjaxDivRequest(url,  divName){
    var newAjax = new Request(url, {
        method: 'get',
        update: $(divName)
    }).send();
}


    /*
     * Javascript md5() 函数 用于生成字符串对应的md5值
     * 吴先成  www.51-n.com ohcc@163.com QQ:229256237
     * @param string string 原始字符串
     * @return string 加密后的32位md5字符串
     */
function md5(string,isLower){
    function md5_RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
    function md5_AddUnsigned(lX,lY){
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function md5_F(x,y,z){
        return (x & y) | ((~x) & z);
    }
    function md5_G(x,y,z){
        return (x & z) | (y & (~z));
    }
    function md5_H(x,y,z){
        return (x ^ y ^ z);
    }
    function md5_I(x,y,z){
        return (y ^ (x | (~z)));
    }
    function md5_FF(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_F(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_GG(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_G(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_HH(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_H(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_II(a,b,c,d,x,s,ac){
        a = md5_AddUnsigned(a, md5_AddUnsigned(md5_AddUnsigned(md5_I(b, c, d), x), ac));
        return md5_AddUnsigned(md5_RotateLeft(a, s), b);
    };
    function md5_ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
    function md5_WordToHex(lValue){
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for(lCount = 0;lCount<=3;lCount++){
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
    function md5_Utf8Encode(string){
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
    string = md5_Utf8Encode(string);
    x = md5_ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=md5_FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=md5_FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=md5_FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=md5_FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=md5_FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=md5_FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=md5_FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=md5_FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=md5_FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=md5_FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=md5_FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=md5_FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=md5_FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=md5_FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=md5_FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=md5_FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=md5_GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=md5_GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=md5_GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=md5_GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=md5_GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=md5_GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=md5_GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=md5_GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=md5_GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=md5_GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=md5_GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=md5_GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=md5_GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=md5_GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=md5_GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=md5_GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=md5_HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=md5_HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=md5_HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=md5_HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=md5_HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=md5_HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=md5_HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=md5_HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=md5_HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=md5_HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=md5_HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=md5_HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=md5_HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=md5_HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=md5_HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=md5_HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=md5_II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=md5_II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=md5_II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=md5_II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=md5_II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=md5_II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=md5_II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=md5_II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=md5_II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=md5_II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=md5_II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=md5_II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=md5_II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=md5_II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=md5_II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=md5_II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=md5_AddUnsigned(a,AA);
        b=md5_AddUnsigned(b,BB);
        c=md5_AddUnsigned(c,CC);
        d=md5_AddUnsigned(d,DD);
    }
    if(isLower){
        return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toLowerCase();
    }else{
        return (md5_WordToHex(a)+md5_WordToHex(b)+md5_WordToHex(c)+md5_WordToHex(d)).toUpperCase();
    }
}

/*
    扩展字符串格式化
    例子：var param='Account={0}&Version={1}&DialupType={2}&CID={3}'.format(1,2,3,4);
 */
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function log(format){
    alert(format);
}

//获取YY-MM-DD HH:MM:SS格式的时间
function GetLocalStringTime(){
    var myDate = new Date();
    return myDate.getFullYear() + '-' + (myDate.getMonth()+1) + '-' + myDate.getDate() + ' ' + myDate.toLocaleTimeString();
}

function GetLocalData(){
    var myDate = new Date();
    var months = (myDate.getMonth()+1);
    var days = myDate.getDate();

    if(months <= 9) months = '0'+months;
    if(days <= 9) days = '0'+days;
    return myDate.getFullYear() + '-' + months + '-' + days;
}

//获取昨天日期 YY-MM-DD
function GetYesterdayTime(){
    var date = new Date();
    var yesterday_milliseconds=date.getTime()-1000*60*60*24; //今天的时间减去24小时      
    var yesterday = new Date();           
    yesterday.setTime(yesterday_milliseconds);           
         
    var strYear = yesterday.getFullYear();        
    var strDay = yesterday.getDate();        
    var strMonth = yesterday.getMonth()+1;      
    if(strMonth<10){        
        strMonth="0"+strMonth;        
    }        
    datastr = strYear+"-"+strMonth+"-"+strDay;      
    return datastr;     
}

//生成UID唯一标识
function GenerateUUID() { 
    var d = new Date().getTime(); 
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {   
        var r = (d + Math.random()*16)%16 | 0;   
        d = Math.floor(d/16);   
        return (c=='x' ? r : (r&0x3|0x8)).toString(16); 
    }); 
    return uuid; 
}

//获取格式为YY-MM-DD HH:MM:SS的两个时间差
function TimeDifferent(oldday, newday){
    if(newday == undefined){ //如果没传该值，则默认为当前时间
        newday = new Date();
    }
    var new_day = newday;
    var old_day = oldday;
    if(newday.indexOf('-')){ //判断格式
        new_day = new Date(newday.replace("-", "/").replace("-", "/"))
    }
    if(oldday.indexOf('-')){
        old_day = new Date(oldday.replace("-", "/").replace("-", "/"));
    }
    return (new_day.getTime() - old_day.getTime()); //相差毫秒数
}