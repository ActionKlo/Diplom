$('body').on('change', '.upload', function () {
    var id = this.placeholder;
    var file = $(this).get(0).files[0];

    $("#" + id + " label").hide();
    $("#" + id).append(
        "<i class='fa fa-refresh fa-spin fa-2x' style='color: #4AB9DC'></i>"
    );

    var formData = new FormData();
    formData.append(id, file, id);

    $.ajax({
        url: '/seo',
        type: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function (data) {
            new Noty({
                text: 'Отчёт загружен',
                type: 'success',
                theme: 'relax',
                timeout: 2500
            }).show();

            $('#' + id).html("");
            $("#" + id).append(
                "<i class='fa fa-check-circle fa-2x' style='color: #8CC152'></i>"
            );
        },
        statusCode: {
            "500": function (err) {
                new Noty({
                    text: err.responseText,
                    type: 'error',
                    theme: 'relax',
                    timeout: 2500
                }).show();

                $("#" + id + " .fa-refresh").hide();
                $("#" + id + " label").show();
                this.value = "";
            }
        }
    });
})