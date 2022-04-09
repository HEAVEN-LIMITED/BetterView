/*天气 ybq 2016.12.21
*功能描述：显示用户所在城市/用户设置的城市
*触发：连接准备事件完成后调用函数 1.检查本地有没有设置城市 2.检查省份code表是否存在 3.发起请求
*/
var wIsEnter=false;
var m_provCode; //当前设置的省份
var m_cityCode; //当前设置的城市
var m_VecProvCodes = {}; //省份code 以前保存到文件，现在不保存，每次启动客户端的时候重新下载
var m_VecWeatherData = {};

//更新省份code文件  
function updateProvinceXml(){
	/*$infoCenter.getGlobalValue('appPath', function(value){
		if(value == undefined) return;
		var apppath = value + '\\provinceCode.xml';
		var fso = new ActiveXObject("Scripting.FileSystemObject"); //创建FileSystemObject对象的
		if(fso.GetFile(apppath) == null){ //没有该文件，需要更新
			fso.CreateTextFile(apppath); //创建文件
		}
		var ts = fso.OpenTextFile(apppath, ForWriting, true); //打开文件

		//请求省份code
		getUrlData('Province', ParseProviceCode);
	});*/
	if(m_VecProvCodes[0] == undefined){
		getUrlData('Province', ParseProviceCode);
	}
	else{
		GetWeather();
	}
}
	

// @brief [获取用户所在的城市]
function getcurrentcity(){
	$infoCenter.getMulValue('global','DialAccount','schoolId',function(values){
		if(values == undefined) values = {};
		getUrlData('CurrentCity', ParseCurrentCity, '?sAccount='+values.DialAccount+'&CID='+values.schoolId);
	});
}

//从省份code中查找城市名
function FindCityName(cityCode, provCode){
	if(m_VecProvCodes[0] == undefined){
		log('province data is null');
		return false;
	}
	//先根据provCode去查找
	for(var i in m_VecProvCodes){
		if(m_VecProvCodes[i]['id'] == provCode){
			for(var j in m_VecProvCodes[i]['city']){
				if(m_VecProvCodes[i]['city'][j]['citycode'] == cityCode){
					m_cityCode = m_VecProvCodes[i]['city'][j]['name'];
					m_provCode = m_VecProvCodes[i]['name'];
					return true;
				}
			}
		}
	}
	//再全局查找
	for(var l in m_VecProvCodes){
		for(var k in m_VecProvCodes[l]['city']){
			var temp = m_VecProvCodes[l]['city'][k]['citycode'];
			if(temp == cityCode){
				m_cityCode = m_VecProvCodes[l]['city'][k]['name'];
				m_provCode = m_VecProvCodes[l]['name'];
				return true;
			}
		}
	}
	return false;
}

//天气入口
function GetWeather(){
	//判断城市
	$infoCenter.getMulConfig('', 'weather.province', 'weather.city', function(value){
		if(m_cityCode == undefined && (!value['weather.city'] || value['weather.city'] == undefined)){//城市编码或城市为空,则需要去获取城市信息
			getcurrentcity();
			return;
		}
		if(m_cityCode == value['weather.city']){//设置和缓存的城市一致，则不需要再去获取天气
			return;
		}
		m_provCode = value['weather.province'];
		m_cityCode = value['weather.city'];
	
		if(m_cityCode != undefined){
			var cityEncode = encodeURI(m_cityCode); //中文在ajax请求时会自动编码，太原编码后不对，所以要自己编码
			getUrlData('Param', ParseSevenData, '/'+cityEncode+'.xml');
			return;
		}
		getcurrentcity();
	});
}

//获取url并请求
function getUrlData(adUrlName, parseFun, externParam){
	$funCtrl.getFunCfg(FUN_WEATHER,function(cfg){
        if(cfg==null) return ;
        if(cfg[FUN_WEATHER + '_attributes']==undefined) return;
        if(cfg[FUN_WEATHER + '_attributes'][adUrlName]==undefined) return;
        var url=cfg[FUN_WEATHER + '_attributes'][adUrlName];

        if(url=='') return ;

        if(externParam != undefined){
        	url = url + externParam;
        }
        RequestHTTP(url, parseFun,function(){m_cityCode=undefined;});
    });
}

///////////////////////////////////////////////////////////////////////////////
//省份code解析函数
function ParseProviceCode(responseText, responseXML){
	//var object = createXMLDom();
	//object.load(responseXML); 
	var object = parseXML(responseText);
	if(object == undefined || object.documentElement == undefined) return;
	var ItemNode = object.documentElement.getElementsByTagName('province');

	m_VecProvCodes = {};
	for(var i=0;i<ItemNode.length;i++){ 
        //...遍历操作...  
        m_VecProvCodes[i] = new Object;

        m_VecProvCodes[i]['id'] = ItemNode[i].getAttribute('id');
        m_VecProvCodes[i]['name'] = ItemNode[i].getAttribute('name');
        m_VecProvCodes[i]['city'] = new Object;

        var CityNode = ItemNode[i].getElementsByTagName('city');

        for(var j=0;j<=CityNode.length - 1;j++){
        	m_VecProvCodes[i]['city'][j] = new Object;
        	m_VecProvCodes[i]['city'][j]['name'] = CityNode[j].getAttribute('name');
        	m_VecProvCodes[i]['city'][j]['areacode'] = CityNode[j].getAttribute('areacode');
        	m_VecProvCodes[i]['city'][j]['citycode'] = CityNode[j].getAttribute('citycode');
        	m_VecProvCodes[i]['city'][j]['weathercode'] = CityNode[j].getAttribute('weathercode');
        }
    }
    //此处发消息到设置窗口
    //$cwe.postNotify('weatherprovincecode', JSON.encode(m_VecProvCodes), function(){});
    GetWeather();
}

//获取当前城市解析函数
function ParseCurrentCity(responseText, responseXML){
	//var object = createXMLDom();
	//object.load(responseXML); 
	var object = parseXML(responseText);

	var currentCityJson = xmlToJson(object);
	if(currentCityJson == undefined || currentCityJson['GetVerifyCode'] == undefined) return;
	m_provCode = currentCityJson['GetVerifyCode']['ProvideID'];
	m_cityCode = currentCityJson['GetVerifyCode']['CityCode'];
	if(!FindCityName(m_cityCode, m_provCode)){
		m_cityCode = '北京';
		m_provCode = '北京';
	}

	$infoCenter.setConfigValue('weather.province', m_provCode, false, function() { });
    $infoCenter.setConfigValue('weather.city', m_cityCode, false, function() { });
	getUrlData('Param', ParseSevenData, '/'+m_cityCode+'.xml');
}

//获取7天天气解析函数
function ParseSevenData(responseText, responseXML){
	//var object = createXMLDom();
	//object.load(responseXML);
	var object = parseXML(responseText);
	
	m_VecWeatherData = new Object;
	m_VecWeatherData = xmlToJson(object);
	if(m_VecWeatherData == undefined || m_VecWeatherData['responseBody'] == undefined) return;
	SetDataToWnd();
	//log(currentCityJson['responseBody']['province']['city']['sevendays']['forecast'][0]['date']);
}

//设置天气窗口数据
function SetDataToWnd(){
	var cityName = m_VecWeatherData['responseBody']['province']['city']['name'];
	var weatherObject = m_VecWeatherData['responseBody']['province']['city']['sevendays']['forecast'];
	//2012-12-27
	$('weather_date').set('text',weatherObject[0]['date']);

	//第一行  广州 7-17
	var cityAndDetail = cityName+' '+weatherObject[0]['tmin']+'~'+weatherObject[0]['tmax']+'°C';
	$('weather_brief').set('text',cityAndDetail);

	//第二行 天气图标
	$('weather_image').src = 'img/'+weatherObject[0]['weatherIco1']+'.png';
	//第二行 温度
	//$('weather_temp').text = weatherObject[0]['tmin'];
	$('weather_detail').innerHTML = weatherObject[0]['weather']+'<br/>'+weatherObject[0]['wind'];

	//第三行
	

	$('weather_nd1_title').set('text',GetReturnData(weatherObject[1]['date']));//weatherObject[1]['date'];
	$('weather_nd1_img').src = 'img/'+weatherObject[1]['weatherIco1']+'.png';
	$('weather_nd1_detail').set('text',weatherObject[1]['tmin']+'~'+weatherObject[1]['tmax']+'°C');

	$('weather_nd2_title').set('text',GetReturnData(weatherObject[2]['date']));//weatherObject[2]['date'];
	$('weather_nd2_img').src = 'img/'+weatherObject[2]['weatherIco1']+'.png';
	$('weather_nd2_detail').set('text',weatherObject[2]['tmin']+'~'+weatherObject[2]['tmax']+'°C');
	
	$('weather_nd3_title').set('text',GetReturnData(weatherObject[3]['date']));//weatherObject[3]['date'];
	$('weather_nd3_img').src = 'img/'+weatherObject[3]['weatherIco1']+'.png';
	$('weather_nd3_detail').set('text',weatherObject[3]['tmin']+'~'+weatherObject[3]['tmax']+'°C');
	
	//此处发消息到主窗口，打开天气图标
	$cwe.postNotify('weatherIcon', cityAndDetail, 'img/'+weatherObject[0]['weatherIco1']+'.png');
}

function GetDetail(lowdetail, hightdetail){
	if(lowdetail == undefined || hightdetail == undefined){
		return '';
	}
	return lowdetail+'~'+hightdetail;
}

//日期 图片 最低温度 最高温度
function GetReturnData(str){
	var strs = str.split("-");
	return strs[1]+'月'+strs[2]+'日';
}

window.addEvent('domready', function() {
    var fHideWeather = function() {
        if (!wIsEnter) $cwe.feature('status:hide', function() { });
        $cwe.postNotify('weatherhide', true);
    };

    //发起请求
    $cwe.addNotify('cweui.weatherRequest', function() {
        updateProvinceXml();
    });

    $cwe.addNotify('cweui.weather', function(m, l, t, w) {
        if (m) {
            var ml = l + w - 2;
            if (ml + 220 > screen.availWidth) ml = l - 220 + 2;
            $cwe.feature('status:showna,position:' + ml + ' ' + (t + 3) + ' lefttop', function() { });
        } else {
            fHideWeather.delay(800);
        }
    });

    document.addEvent('mouseenter', function() {
        wIsEnter = true;
    });
    document.addEvent('mouseleave', function() {
        wIsEnter = false;
        fHideWeather.delay(500);
    });
    $('weather_refresh').addEvent('click', function() {
        return false;
    });
    $('weather_setting').addEvent('click', function() {
        //App.openWindow('SettingWnd', true, 'modal', 'SettingWnd.html', '', function() { });
        //return false;
        //    $cwe.open('modal', 'SettingWnd.html', '', function() { });
        $cwe.postNotify('opensettingwnd');
    });

    $('weather_more').addEvent('click', function() {
    	OpenUrl(FUN_WEATHER, 'MoreWeather');
    	SetClickModule(3, CLICK_WEATHER);
        //window.open('http://www.weather.com.cn/forecast/');
    });

    $cwe.addNotify('cweui.GetWeatherInfo', function(value) {
        $cwe.postNotify('SetWeatherInfo', JSON.encode(m_VecProvCodes), function() { });
    });
});
