var m_dataJson = {};
var m_province;

function InitData() 
{
    $infoCenter.getConfigValue('SystemSetting.Close', false, function(isMiniOrExit) {  
        if ( isMiniOrExit === '0') {
            $('Minisize').checked = true;
            $('Lab_Minisize').set('class', $('Minisize').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
            $('Exit').checked = false;
            $('Lab_Exit').set('class', $('Exit').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
        }
        else if (isMiniOrExit === '1') {
            $('Exit').checked = true;
            $('Lab_Exit').set('class', $('Exit').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
            $('Minisize').checked = false;
            $('Lab_Minisize').set('class', $('Minisize').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
          }
       });

       $infoCenter.getConfigValue('SystemSetting.Prompt', false, function(isSaveClose) {
        if (isSaveClose === '1') {
            $('SaveCloseConfig').checked = true;
            $('Lab_SaveCloseConfig').set('class', $('SaveCloseConfig').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
        }
        else if (isSaveClose === '0')
        {
            $('SaveCloseConfig').checked = false;
            $('Lab_SaveCloseConfig').set('class', $('SaveCloseConfig').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
        }
    });

    $infoCenter.getConfigValue('weather.province', false, function(value) {
        m_province = value;
        $('CurrentProvince').set('text', value); 
    });

    $infoCenter.getConfigValue('weather.city', false, function(value) {
        $('CurrentCity').set('text', value);
    });

    $cwe.plugin('InfoCenterModule').call('ReadRunRegister', function(isAutoRestart) {
        if (isAutoRestart) {
             $('RebootStart').checked = true;
             $('Lab_RebootStartText').set('class', 'ChoiceBoxLabel');
         }
         else{
             $('RebootStart').checked = false;
             $('Lab_RebootStartText').set('class', 'NotChoiceBoxLabel');
           }
       });
    $infoCenter.getConfigValue('OtherSetting.showRemindInfo', false, function(isShowRemindInfo) {
    if(isShowRemindInfo == '1') {
		
		$('RemindInfoStartDiv').setStyle('display', '');
		$('OtherSettingDiv').set('class', 'OtherSettingDivBig');
		$('Other_setting').set('class', 'Other_setting_Big');
		
		//zhangliangming 2019.12.23 添加自动弹出资讯界面标识
		$infoCenter.getConfigValue('OtherSetting.RemindInfo', false, function(isRemindInfoStart) {
			if(isRemindInfoStart == '1') {
				$('RemindInfoStart').checked = true;
				$('Lab_RemindInfoStartText').set('class', 'ChoiceBoxLabel');
			} else {
				$('RemindInfoStart').checked = false;
				$('Lab_RemindInfoStartText').set('class', 'NotChoiceBoxLabel');
			}
		});
	} else {
		$('RemindInfoStartDiv').setStyle('display', 'none');
	}
	});
      
       $('ProvinceOptions').setStyle('height', '10px');
       $('CityOptions').setStyle('height', '10px');
}

function Response() {
    $('sure').addEvent('click', function() {
        if ($('Minisize').checked === true) {
            $infoCenter.setConfigValue('SystemSetting.Close', '0', false, function() { });
        }
        else if ($('Exit').checked === true) {
            $infoCenter.setConfigValue('SystemSetting.Close', '1', false, function() { });
        }

        if ($('SaveCloseConfig').checked) {
            $infoCenter.setConfigValue('SystemSetting.Prompt','1', false, function() { });
        }
        else {
            $infoCenter.setConfigValue('SystemSetting.Prompt','0', false, function() { });

        }

        if ($('RebootStart').checked === true) {
            $cwe.plugin('InfoCenterModule').call('WriteRunRegister', function() { });
        }
        else {
            $cwe.plugin('InfoCenterModule').call('DeleteRunRegister', function() { });
        }
        
        //zhangliangming 2019.12.23 添加资讯开关
         if ($('RemindInfoStart').checked) {
            $infoCenter.setConfigValue('OtherSetting.RemindInfo','1', false, function() { });
        }
        else {
            $infoCenter.setConfigValue('OtherSetting.RemindInfo','0', false, function() { });

        }

        if ($('CurrentProvince').get('text') != '' && $('CurrentCity').get('text') != '') {
            $infoCenter.setConfigValue('weather.province', $('CurrentProvince').get('text'), false, function() { });
            $infoCenter.setConfigValue('weather.city', $('CurrentCity').get('text'), false, function() { });
        }

        //发起天气请求
        $cwe.postNotify('weatherupdate');
                
        try { window.external.close(); } catch (e) { }
    });

    $('cancel').addEvent('click', function() {
        try { window.external.close(); } catch (e) { }
    });

    $('Lab_Minisize').addEvent('click', function() {
        $('Minisize').checked = true;
        $('Lab_Minisize').set('class', $('Minisize').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
        $('Exit').checked = false;
        $('Lab_Exit').set('class', $('Exit').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
    })

    $('Lab_Exit').addEvent('click', function() {
        $('Exit').checked = true;
        $('Lab_Exit').set('class', $('Exit').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
        $('Minisize').checked = false;
        $('Lab_Minisize').set('class', $('Minisize').get('checked') ? 'ChoiceRadioLabel' : 'NotChoiceRadioLabel');
    })

    $('SaveCloseConfig').addEvent('click', function() {
        $('Lab_SaveCloseConfig').set('class', $('SaveCloseConfig').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
    })

    $('RebootStart').addEvent('click', function() {
        $('Lab_RebootStartText').set('class', $('RebootStart').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
    })
    
    
    $('RemindInfoStart').addEvent('click', function() {
        $('Lab_RemindInfoStartText').set('class', $('RemindInfoStart').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
    })

    $('SettingClose').addEvent('click', function() {
        $cwe.close();
    });
}

function Notify() {
    $cwe.postNotify('GetWeatherInfo', true, function() {
    });

    $cwe.addNotify('cweui.SetWeatherInfo', function(WeatherJson) {
        m_dataJson = new Object;
        m_dataJson = JSON.decode(WeatherJson);
        SetDataToOption();

        SetOption('Province');
        SetOption('City');
    });
}


window.addEvent('domready', function() {

    InitData();

    Response();

    Notify();

    document.onclick = function() {
        $('CityOptions').setStyle('display', 'none');
        $('ProvinceOptions').setStyle('display', 'none');
    }

});


var PROVINCE = "ProvinceOptions";
var CITY = "CityOptions";

function SetDataToOption(){
    if(m_dataJson[0] == undefined){
        return;
    }

    for(var i in m_dataJson){
        CreateSelectItem(PROVINCE, m_dataJson[i]['name']);
        if(m_province == m_dataJson[i]['name']){
            for (var j in m_dataJson[i]['city']) {
                CreateSelectItem(CITY, m_dataJson[i]['city'][j]['name']);
            }
        }
    }
}

function CreateSelectItem(uloptions, livalue) {
    $(uloptions).set('html', $(uloptions).get('html') + '<li>' + livalue + '</li>');
}

function ClearHtml(uloptions) {
    $(uloptions).set('html', '');
}


function SetOption(OptionValue) {
    var i;
    lis = $(OptionValue+'Options').getElementsByTagName("li");
    for (i = 0; i < lis.length; i++) {
        if (lis.length < 5) {
            $(OptionValue + 'Options').setStyle('height', 20 * lis.length+'px');
        }
        else {
            $(OptionValue + 'Options').setStyle('height','100px');
        } 
        if (OptionValue == 'Province') {
            lis[i].onclick = function() {
                $(OptionValue + 'Options').setStyle('display', 'none');
                $('Current' + OptionValue).set('text', this.innerHTML);
                ClearHtml(CITY);
                for (var i in m_dataJson) {
                    if (m_dataJson[i]['name'] == $('Current' + OptionValue).get('text')) {
                        for (var j in m_dataJson[i]['city']) {
                            CreateSelectItem(CITY, m_dataJson[i]['city'][j]['name']);
                        }
                       $('CurrentCity').set('text',m_dataJson[i]['city'][0]['name']); 
                    }
                    SetOption('City');
                }
            };
        }
        else if (OptionValue == 'City') {         
            lis[i].onclick = function() {
            $(OptionValue + 'Options').setStyle('display', 'none');
                $('Current' + OptionValue).set('text', this.innerHTML);
            };
        }
    }

    $('Current' + OptionValue).addEvent('click', function(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        } else {
            e.cancelBubble = true;
        }
        $$('.options').setStyle('display', 'none');
        if ($(OptionValue + 'Options').getStyle('display') == 'block') {
            $(OptionValue + 'Options').setStyle('display', 'none');
        }
        else if($(OptionValue + 'Options').getStyle('display') == 'none') {
            $(OptionValue + 'Options').setStyle('display', 'block');
        }         
    })
}

