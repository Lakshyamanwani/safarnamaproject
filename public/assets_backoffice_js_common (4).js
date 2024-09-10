alerts = {
    alert: function(type, message){
        Swal.fire({
            text: message,
            icon: type,
            buttonsStyling: false,
            customClass: {
                confirmButton: "btn btn-primary"
            }
        });
    },
    confirm: function(message, route){
        Swal.fire({
            text: message,
            icon: 'warning',
            buttonsStyling: false,
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: 'Nope',
            allowOutsideClick: false,
            closeOnEsc: false,
            customClass: {
                confirmButton: "btn btn-md btn-primary btn-confirmed m-2",
                cancelButton: "btn btn-md btn-danger m-2"
            },
            showLoaderOnConfirm: true,
            preConfirm: () => {
                $btn = $('.btn-confirmed');
                $btn_html = $btn.html();
                    $.ajax({
                        url: route,
                        method: 'DELETE',
                        data: {},
                        dataType: 'json',
                        headers: {
                            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                        },
                        beforeSend: function(){
                            $btn.prop('disabled', true);
                            $btn.html('<span class="indicator-label">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');
                        },
                        success: function(json){
                            if(json.redirect){
                                location.href = json.redirect;
                            }
                        },
                        complete: function(){
                            $btn.prop('disabled', false);
                            $btn.html($btn_html);
                        },
                        error: function(response) {
                            Swal.close();
                            alerts.alert('error', response.responseJSON.message);
                        }
                    });
                
                return false;
            }
        });
    }
}
function toast(type, message){
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toastr-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    if(type == 'success'){
        toastr.success(message);
    }else if(type == 'warning'){
        toastr.warning(message);
    }else if(type == 'error'){
        toastr.error(message);
    }else if(type == 'info'){
        toastr.info(message);
    }
}
function json_error_handling($form, $response_json) {
    if($response_json.errors){
        $.each($response_json.errors, function (key, item) {
            if ($('[name="' + key + '"]').parent('.input-group').length) {
                $form.find('[name="' + key + '"]').closest('.input-group').after('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[name="' + key + '"]').parent('.input-field').length) {
                $form.find('[name="' + key + '"]').closest('.input-field').after('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[name="' + key + '"][type="file"]').closest('.image-input').length) {
                $form.find('[name="' + key + '"]').closest('.image-input').after('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[name="' + key + '"][data-control="select2"]').length) {
                $form.find('[name="' + key + '"]').parent().append('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[name="' + key + '[]"][data-control="select2"]').length) {
                $form.find('[name="' + key + '[]"]').parent().append('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[name="' + key + '"][type="checkbox"]').length || $('[name="' + key + '"][type="radio"]').length) {
                $form.find('[name="' + key + '"]').parent().after('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('textarea[name="' + key + '"]').length) {
                $form.find('[name="' + key + '"]').parent().append('<div class="text-danger">' + item[0] + '</div>');
            } else if ($('[id="' + key + '"][type="file"]').closest('.image-input').length) {
                $form.find('[id="' + key + '"]').closest('.image-input').after('<div class="text-danger">' + item + '</div>');
            } else if($('[id="' + key + '"]').length){
                $form.find('[id="' + key + '"]').after('<div class="text-danger">' + item + '</div>');
            } else {
                $form.find('[name="' + key + '"]').after('<div class="text-danger">' + item[0] + '</div>');
            }
        });
    }else if($response_json.message){
        alerts.alert('error', $response_json.message);
    }
}

function json_error_message_handling($form, $json_errors){
    if($json_errors){
        $.each($json_errors, function(key, value){
            // console.log(key, key.indexOf('.'))
            if(key.indexOf('.') > 0){
                // var key = key.replace('.*', '');
                var key = key.split('.')[0];
                if ($("[name^='" + key + "'][type='file']").closest('.image-input').length) {
                    $form.find("[name^='" + key + "']").closest('.image-input').parent().after('<div class="text-danger">' + value + '</div>');
                } else if ($("[name^='" + key + "'][data-control='select2']").length) {
                    console.log($("[name^='" + key + "'][data-control='select2']"));
                    // console.log(key);
                    $form.find("[name^='" + key + "'][data-control='select2']").parent().append('<div class="text-danger">' + value + '</div>');
                } 
            }else{
                if ($('[name="' + key + '"]').parent('.input-group').length) {
                    $form.find('[name="' + key + '"]').closest('.input-group').after('<div class="text-danger">' + value + '</div>');
                } else if ($('[name="' + key + '"]').parent('.input-field').length) {
                    $form.find('[name="' + key + '"]').closest('.input-field').after('<div class="text-danger">' + value + '</div>');
                } else if ($('[name="' + key + '"][type="file"]').closest('.image-input').length) {
                    $form.find('[name="' + key + '"]').closest('.image-input').after('<div class="text-danger">' + value + '</div>');
                } else if ($('[name="' + key + '"][data-control="select2"]').length) {
                    $form.find('[name="' + key + '"]').parent().append('<div class="text-danger">' + value + '</div>');
                } else if ($('[name="' + key + '[]"][data-control="select2"]').length) {
                    $form.find('[name="' + key + '[]"]').parent().append('<div class="text-danger">' + value + '</div>');
                } else if ($('[name="' + key + '"][type="checkbox"]').length || $('[name="' + key + '"][type="radio"]').length) {
                    $form.find('[name="' + key + '"]').parent().after('<div class="text-danger">' + value + '</div>');
                } else if ($('textarea[name="' + key + '"]').length) {
                    $form.find('[name="' + key + '"]').parent().append('<div class="text-danger">' + value + '</div>');
                } else if ($('[id="' + key + '"][type="file"]').closest('.image-input').length) {
                    $form.find('[id="' + key + '"]').closest('.image-input').after('<div class="text-danger">' + value + '</div>');
                } else if($('[id="' + key + '"]').length){
                    $form.find('[id="' + key + '"]').after('<div class="text-danger">' + value + '</div>');
                } else {
                    $form.find('[name="' + key + '"]').after('<div class="text-danger">' + value + '</div>');
                }
            }
        })
    }

}

function json_front_error_message_handling($form, $json_errors){
    if($json_errors){
        $.each($json_errors, function(key, value){
            if ($('[name="' + key + '"][data-control="ivory-select"]').length) {
                $form.find('[name="' + key + '"]').parent().append('<div class="text-danger">' + value + '</div>');
            } else if ($('[name="' + key + '"]').closest('.contact-us-mob-number').length) {
                $form.find('.contact-us-mob-number').append('<div class="text-danger fs-6">' + value + '</div>');
            } else if ($('[name="' + key + '"]').closest('.contact-us-wed-date').length) {
                $form.find('.contact-us-wed-date').append('<div class="text-danger fs-6">' + value + '</div>');
            } else if ($('[name="' + key + '"]').length) {
                $form.find('[name="' + key + '"]').after('<div class="text-danger fs-6">' + value + '</div>');
            } else if ($('textarea[name="' + key + '"]').length) {
                $form.find('[name="' + key + '"]').append('<div class="text-danger fs-6">' + value + '</div>');
            } else if ($('[name="' + key + '"][type="file"]').length) {
                $form.find('[name="' + key + '"]').after('<div class="text-danger fs-6">' + value + '</div>');
            } else if ($('[id="' + key + '"]').length) {
                $form.find('[id="' + key + '"]').after('<div class="text-danger fs-6">' + value + '</div>');
            }else {
                $form.find('[name="' + key + '"]').after('<div class="text-danger fs-6">' + value + '</div>');
            }
        })
    }

}

function ajax_request(e, form){
    e.preventDefault();
    $form = $(form);
    $form_id = $form.attr('id');
    $btn = $form.find('[type="submit"]');
    $btn_html = $btn.html();
    $top_btn = $('[form="'+ $form_id +'"]');
    $top_btn_html = $top_btn.html();
    $form.find('.alert').remove();
    $form.find('.text-danger').remove();

    $.ajax({
        url: $form.attr('action'),
        method: $form.attr('method'),
        data: $form.serialize(),
        dataType: 'json',
        beforeSend: function(){
            $btn.prop('disabled', true);
            $btn.html('<span class="indicator-label d-flex align-items-center">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');

            $top_btn.prop('disabled', true);
            $top_btn.html('<span class="indicator-label">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');
        },
        success: function(json){
            if(json.redirect){
                location.href = json.redirect;
            }else if(json.filter_data){
                if (typeof json.html !== 'undefined') {
                    $('[type="data-table"]').DataTable().destroy();
                    $('table tbody').html(json.html);
                    $('[type="data-table"]').DataTable({ ordering: false });
                }
            }

            if(json.success_message){
                $.each(json.success_message, function(key, value){
                    if ($('[id="' + key + '"]').length) {
                        $form.find('[id="' + key + '"]').after('<div id="success" class="text-success">' + value + '</div>');
                    }
                    if ($('[id="' + key + '"]').length) {
                        setTimeout(function(){
                            $form.find('[id="' + "success" + '"]').fadeOut('fast');
                        }, 5000);
                    }
                })
            }

            if(json.html){
                if(json.selector){
                    $('#' + json.selector).html(json.html);
                }
            } else if(json.redirect){
                location.href = json.redirect;
            } else if(json.append) {
                $('#' + json.selector).append(json.append);
            } else if (json.prepend) {
                $('#' + json.selector).prepend(json.prepend);
            } 

            // Filter
            
            if(json.selectorRecent){
                $('#' + json.selectorRecent).html(json.recentHtml);
            } 

            if(json.selectorFeatured){
                $('#' + json.selectorFeatured).html(json.featuredHtml);
            }

            if (json.show_recent_button == false) {
                $('#recent-blogs-button').hide();
            }
            if (json.show_recent_button == true) {
                $('#recent-blogs-button').show();
            }

            if (json.show_featured_button == false) {
                $('#featured-blogs-button').hide();
            }
            if (json.show_featured_button == true) {
                $('#featured-blogs-button').show();
            }

            if (json.form_reset) {
                $form.trigger('reset');
            }

            if(json.success){
                if(json.message){
                    toast('success', json.message);
                }
            }else{
                if(json.message){
                    toast('error', json.message);
                }
            }

            if(json.errors){
                json_error_message_handling($form, json.errors);
            }

            if(json.frontErrors){
                json_front_error_message_handling($form, json.frontErrors);
            }
        },  
        complete: function(){
            $btn.prop('disabled', false);
            $btn.html($btn_html);

            $top_btn.prop('disabled', false);
            $top_btn.html($top_btn_html);
        },
        error: function(response) {
            json_error_handling($form, response.responseJSON);
        }
    });
}

function multipart_ajax_request(e, form){
    e.preventDefault();
    $form = $(form);
    $form_id = $form.attr('id');
    $btn = $form.find('[type="submit"]');
    $btn_html = $btn.html();
    $top_btn = $('[form="'+ $form_id +'"]');
    $top_btn_html = $top_btn.html();
    $form.find('.alert').remove();
    $form.find('.text-danger').remove();
    var formData = new FormData(form);

    $.ajax({
        url: $form.attr('action'),
        method: $form.attr('method'),
        data: formData,
        dataType: 'json',
        cache:false,
        contentType: false,
        processData: false,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function(){
            $btn.prop('disabled', true);
            $btn.html('<span class="indicator-label">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');

            $top_btn.prop('disabled', true);
            $top_btn.html('<span class="indicator-label">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');
        },
        success: function(json){
            if(json.redirect){
                location.href = json.redirect;
            }

            if(json.errors){
                json_error_message_handling($form, json.errors);
            }

            if(json.editorial_errors){
                $.each(json.editorial_errors, function(key, value){
                    if($('[id="' + key + '"]').length){
                        $form.find('[id="' + key + '"]').after('<div class="text-danger">' + value + '</div>');
                    }

                });
            }            
        },
        complete: function(){
            $btn.prop('disabled', false);
            $btn.html($btn_html);

            $top_btn.prop('disabled', false);
            $top_btn.html($top_btn_html);
            if($form_id == 'form-products-upload-asset'){
                $('.progress').hide();
                $('#loaded_n_total').hide();
                $('#status').hide();
            }
        },
        error: function(response) {
            json_error_handling($form, response.responseJSON);
        }
    });
}

function ajax_show_more_product_request(button, form){
    $btn = $(button);
    $form = $(form);
    $btn_html = $btn.html();
    $btn_id = $btn.attr('id');
    $route = $btn.data('route');
    $page_count = $btn.attr("data-page-count");
    $product_id = $btn.data('product-id') ?? null;

    $.ajax({
        url: $route,
        type: 'POST',
        dataType: 'json',
        data: $(form).serialize()+ "&paginate="+$page_count+ "&btn_page_count="+$page_count,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        beforeSend: function(){
            $btn.prop('disabled', true);
            $btn.html('<span class="indicator-label">Please wait... <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>');
        },
        success: function(json) {
            if (json.success == true) {
                $('#'+json.selector).append(json.html);
            }
            if (json.show_more_button == false) {
                $btn.hide();
            }
            if (json.html == '') {
                $btn.hide();
            }
            if(json.page_count){
                // $btn.attr("data-page-count", json.page_count);
                 $form.find('[name="page_count"]').val(json.page_count);
            }
            if(json.featuredPageCount){
                console.log($btn);
                $btn.attr("data-page-count", json.featuredPageCount);
            }
            if(json.recentPageCount){
                $btn.attr("data-page-count", json.recentPageCount);
            }
            if( json.more_audio_product){
                $('#'+json.more_audio_product).append(json.audio_html);
            }
        },
        complete: function(){
            $btn.prop('disabled', false);
            $btn.html($btn_html);
        },
        error: function(response) {
            toast('error', response.responseJSON.message);
        }
    });
}

function ckeditor(){
    CKEDITOR.ClassicEditor.create(document.getElementById("editor"), {
        toolbar: {
            items: [
                'exportPDF','exportWord', '|',
                'findAndReplace', 'selectAll', '|',
                'heading', '|',
                'bold', 'italic', 'strikethrough', 'underline', 'code', 'subscript', 'superscript', 'removeFormat', '|',
                'bulletedList', 'numberedList', 'todoList', '|',
                'outdent', 'indent', '|',
                'undo', 'redo',
                '-',
                'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', 'highlight', '|',
                'alignment', '|',
                'link', 'insertImage', 'blockQuote', 'insertTable', 'codeBlock', 'htmlEmbed', '|',
                'specialCharacters', 'horizontalLine', 'pageBreak', '|',
            ],
            shouldNotGroupWhenFull: true
        },
        list: {
            properties: {
                styles: true,
                startIndex: true,
                reversed: true
            }
        },
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
                { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
                { model: 'heading4', view: 'h4', title: 'Heading 4', class: 'ck-heading_heading4' },
                { model: 'heading5', view: 'h5', title: 'Heading 5', class: 'ck-heading_heading5' },
                { model: 'heading6', view: 'h6', title: 'Heading 6', class: 'ck-heading_heading6' }
            ]
        },
        placeholder: 'Description',
        fontFamily: {
            options: [
                'default',
                'Arial, Helvetica, sans-serif',
                'Courier New, Courier, monospace',
                'Georgia, serif',
                'Lucida Sans Unicode, Lucida Grande, sans-serif',
                'Tahoma, Geneva, sans-serif',
                'Times New Roman, Times, serif',
                'Trebuchet MS, Helvetica, sans-serif',
                'Verdana, Geneva, sans-serif'
            ],
            supportAllValues: true
        },
        fontSize: {
            options: [ 10, 12, 14, 'default', 18, 20, 22 ],
            supportAllValues: true
        },
        htmlSupport: {
            allow: [
                {
                    name: /.*/,
                    attributes: true,
                    classes: true,
                    styles: true
                }
            ]
        },
        htmlEmbed: {
            showPreviews: true
        },
        link: {
            decorators: {
                addTargetToExternalLinks: true,
                defaultProtocol: 'https://',
                toggleDownloadable: {
                    mode: 'manual',
                    label: 'Downloadable',
                    attributes: {
                        download: 'file'
                    }
                }
            }
        },
        mention: {
            feeds: [
                {
                    marker: '@',
                    feed: [
                        '@apple', '@bears', '@brownie', '@cake', '@cake', '@candy', '@canes', '@chocolate', '@cookie', '@cotton', '@cream',
                        '@cupcake', '@danish', '@donut', '@dragée', '@fruitcake', '@gingerbread', '@gummi', '@ice', '@jelly-o',
                        '@liquorice', '@macaroon', '@marzipan', '@oat', '@pie', '@plum', '@pudding', '@sesame', '@snaps', '@soufflé',
                        '@sugar', '@sweet', '@topping', '@wafer'
                    ],
                    minimumCharacters: 1
                }
            ]
        },
        removePlugins: [
            'CKBox',
            'CKFinder',
            'EasyImage',
            'RealTimeCollaborativeComments',
            'RealTimeCollaborativeTrackChanges',
            'RealTimeCollaborativeRevisionHistory',
            'PresenceList',
            'Comments',
            'TrackChanges',
            'TrackChangesData',
            'RevisionHistory',
            'Pagination',
            'WProofreader',
            'MathType',
            'SlashCommand',
            'Template',
            'DocumentOutline',
            'FormatPainter',
            'TableOfContents'
        ]
    }).then(editorInstance => {
        editorInstance.ui.focusTracker.on('change:isFocused', (evt, name, isFocused) => { 
            if (!isFocused) { 
                editorInstance.updateSourceElement(); 
            } 
        }); 
    });
}