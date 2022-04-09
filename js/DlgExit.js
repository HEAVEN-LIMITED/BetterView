function InitData() 
{
    $infoCenter.getConfigValue('SystemSetting.Close', false, function(isMiniOrExit) {  
        if (isMiniOrExit === '0') {
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
            $('SaveCloseConfig').checked = ture;
            $('Lab_SaveCloseConfig').set('class', $('SaveCloseConfig').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
        }
        else if (isSaveClose === '0') {
            $('SaveCloseConfig').checked = false;
            $('Lab_SaveCloseConfig').set('class', $('SaveCloseConfig').get('checked') ? 'ChoiceBoxLabel' : 'NotChoiceBoxLabel');
        }
    });
}

window.addEvent('domready', function() {
    InitData();
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

    $('certain').addEvent('click', function() {
        var flag = true;
        if ($('Minisize').checked === true) {
            $infoCenter.setConfigValue('SystemSetting.Close', '0', false, function() { });
            flag = false;
        }
        else if ($('Exit').checked === true) {
            $infoCenter.setConfigValue('SystemSetting.Close', '1', false, function() { });
            flag = true;
        }

        if ($('SaveCloseConfig').checked) {
            $infoCenter.setConfigValue('SystemSetting.Prompt', '1', false, function() { });
        }
        else {
            $infoCenter.setConfigValue('SystemSetting.Prompt', '0', false, function() { });
        }

        //在回调函数里关闭自身窗口，消息才能发出去
        $cwe.postNotify('MainWnd', flag, function() {
            $cwe.close();
        });
    });

    $('cancel').addEvent('click', function() {
        $cwe.close();
    });
});
