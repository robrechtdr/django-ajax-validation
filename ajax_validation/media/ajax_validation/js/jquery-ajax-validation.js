(function($)    {
    function form_data(form)   {
        return form.find("input[checked], input[type='text'], input[type='hidden'], input[type='password'], input[type='submit'], select, textarea").filter(':enabled');
    }
    function inputs(form)   {
        return form.find("input, select, textarea");
    }
    
    $.fn.validate = function(url, settings) {
        settings = $.extend({
            type: 'table',
            callback: false,
            fields: false,
            dom: this,
            event: 'submit',
            onSuccess: false,
            onValid: false 
        }, settings);
        
        return this.each(function() {
            var form = $(this);
            settings.dom.bind(settings.event, function()  {
                var params = {};
                form_data(form).each(function() {
                    if (this.type === "radio"){
                        var $checkedDepthOne = $(this).parent().siblings().find(":checked");
                        var $checkedDepthTwo = $(this).parent().parent().siblings().find(":checked");
                        if (this.checked){
                            formElemValue = this.value;
                        }
                        else if ($checkedDepthOne.length !== 0){
                            formElemValue = $checkedDepthOne.prop("value"); 
                        }
                        else if ($checkedDepthTwo.length !== 0){
                            formElemValue = $checkedDepthTwo.prop("value"); 
                        }
                    }
                    else {
                        formElemValue = this.value;
                    }
                    params[ this.name || this.id || this.parentNode.name || this.parentNode.id ] = formElemValue;
                });
                
                var status = false;
                if (settings.fields) {
                    params.fields = settings.fields;
                }
                $.ajax({
                    async: false,
                    data: params,
                    dataType: 'json',
                    error: function(XHR, textStatus, errorThrown)   {
                        status = true;
                    },
                    success: function(data, textStatus) {
                        status = data.valid;
                        if (!status)    {
                            if (settings.callback)  {
                                settings.callback(data, form);
                            }
                            else    {
                                if (settings.type == 'p')    {
                                    inputs(form).parent().prev('ul').remove();
                                    inputs(form).parent().prev('ul').remove();
                                    $.each(data.errors, function(key, val)  {
                                        if (key == '__all__')   {
                                            var error = inputs(form).filter(':first').parent();
                                            if (error.prev().is('ul.errorlist')) {
                                                error.prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                            else    {
                                                error.before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                            }
                                        }
                                        else    {
                                            $('#' + key).parent().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    });
                                }
                                if (settings.type == 'table')   {
                                    inputs(form).prev('ul').remove();
                                    inputs(form).filter(':first').parent().parent().prev('tr').remove();
                                    $.each(data.errors, function(key, val)  {
                                        if (key == '__all__')   {
                                            inputs(form).filter(':first').parent().parent().before('<tr><td colspan="2"><ul class="errorlist"><li>' + val + '.</li></ul></td></tr>');
                                        }
                                        else    {
                                            $('#' + key).before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    });
                                }
                                if (settings.type == 'ul')  {
                                    inputs(form).prev().prev('ul').remove();
                                    inputs(form).filter(':first').parent().prev('li').remove();
                                    $.each(data.errors, function(key, val)  {
                                        if (key == '__all__')   {
                                            inputs(form).filter(':first').parent().before('<li><ul class="errorlist"><li>' + val + '</li></ul></li>');
                                        }
                                        else    {
                                            $('#' + key).prev().before('<ul class="errorlist"><li>' + val + '</li></ul>');
                                        }
                                    });
                                }
                            }
                            
                        }
                        else {
                            form.find('ul.errorlist').remove();
                            if (settings.onValid){
                                settings.onValid();
                            }
                        }
                        if (settings.onSuccess){
                            settings.onSuccess();
                        }
                    },
                    type: 'POST',
                    url: url
                });
                return status;
            });
        });
    };
})(jQuery);
