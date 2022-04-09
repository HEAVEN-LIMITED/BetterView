window.addEvent('domready', function() {
    $infoCenter.getConfigValue('system.ClientVer',false,function(Ver) {
	    if(Ver!=false)
        {
		    $('ClientVer').set('text', '版本号 ' + Ver);
	    }
    });
});