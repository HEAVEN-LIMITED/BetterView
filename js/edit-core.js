
var InputEx = new Class({
    id:"",
    inputValue:"",
    inputTip:"",
    isPassword:false,
    bShowPassword:true,
    pwInput:null,
    bShowInput:false,

    initialize: function (inputId,inputTip,isPassword,pwClass,keyupCallback) {
        $(inputId).ExObj=this;
        this.id = inputId;
        this.inputValue=$(this.id).value;
        this.inputTip=inputTip;
        this.isPassword= isPassword==undefined ? false : isPassword;

        //如果是密码则创建密码框
        if(isPassword){
            this.pwInput=new Element('input',{'type':'password'});
            this.pwInput.inject($(this.id),'after');
            this.pwInput.addClass(pwClass);
            $(inputId).addClass(pwClass);
            this.pwInput.value=this.inputValue;
            this.pwInput.ExObj=this;
            this.showPassword(false);
            this.pwInput.addEvent('focus', function() {});
            this.pwInput.addEvent('blur',function(){
                var inputObj=this.ExObj;
                inputObj.inputValue=this.value;
                if(inputObj.inputValue=="") {
                    $(inputObj.id).value= inputObj.inputTip;
                    $(inputObj.id).setStyle('color', '#C4C4C4');
                    inputObj.pwInput.setStyle("display", "none");
                    $(inputObj.id).setStyle("display", "block");
                }else{
                    $(inputObj.id).value=this.value;
                    $(inputObj.id).setStyle('color', '#000');
                }
            })
            this.pwInput.addEvent('keyup', function(e) {
                var inputObj=this.ExObj;
                inputObj.inputValue=this.value;
                if (typeof cbFun == "function") {
                    keyupCallback(this.pwInput, e);
                }
            });
        }

        $(this.id).addEvent('focus', function() {
            this.value=this.ExObj.inputValue;
            $(this.id).setStyle('color', '#000');
            if(this.ExObj.isPassword){
                this.ExObj._showPw(this.ExObj.bShowPassword);
                this.ExObj.focus(); 
            }
            this.ExObj.focus(); 
        });

        $(this.id).addEvent('blur',function(){
            var inputObj=this.ExObj;
            this.ExObj.inputValue=this.value;
            this.ExObj.value=this.value;
            if(inputObj.inputValue=="") {
                $(inputObj.id).value= inputObj.inputTip;
                $(inputObj.id).setStyle('color', '#C4C4C4');
            }
        });

        $(this.id).addEvent('keyup', function(e) {
            var inputObj=this.ExObj;
            inputObj.inputValue=this.value;
            if(inputObj.isPassword ){
                inputObj.pwInput.value=this.value;
            }
            if (typeof cbFun == "function") {
                keyupCallback(this.id, e);
            }
        });

        this.show(this);
    },

    show:function(inputObj){
        if(inputObj.inputValue==""){
            $(inputObj.id).value= inputObj.inputTip;
            $(inputObj.id).setStyle('color', '#C4C4C4');
            if(inputObj.isPassword) inputObj._showPw(true);
        }else{
            $(inputObj.id).value = inputObj.inputValue;
            $(inputObj.id).setStyle('color', '#000');
            if(inputObj.isPassword){
                inputObj._showPw(inputObj.bShowPassword);
                //this.pwInput.value = this.inputValue;
            } 
        }
        if(inputObj.isPassword){
            this.pwInput.value = this.inputValue;
        }
    },

    _showPw: function(bShow){
        if (bShow) {
            this.pwInput.setStyle("display", "none");
            $(this.id).setStyle("display", "block");
        } else {
            $(this.id).setStyle("display", "none");
            this.pwInput.setStyle("display", "block");
        }
    },

    focus:function(){
        var input=null;
        if(this.bShowPassword){
            input=$(this.id);
        }else{
            input=this.pwInput;
        }
        input.focus();
        var range = input.createTextRange(); 
            range.moveStart('character', input.value.length); 
            range.collapse(true);
            range.select();
    },

    getId:function(){return this.id;},

    getValue:function(){return this.inputValue;},

    setValue:function(value){
        if(typeof value != 'string') return;
        this.inputValue = value;
        this.show(this); 
    },

    showPassword:function(bShow) {
        if(!this.isPassword) return;
        this.bShowPassword = bShow;
        if(this.inputValue=="") return;
        this._showPw(bShow);
    },

    showInput:function(){
        if(this.bShowInput){
            this.showPassword(false);
        }
        else{
            this.showPassword(true);
        }
        this.bShowInput = !this.bShowInput;
    }
});