$(document.forms['user-registration']).on('submit', function () {
    console.log("УРА");
    var form = $(this);

    $('.error', form).html('');
    // $(':submit').button("Загрузка");

    $.ajax({
        url: "/user-registration",
        method: "POST",
        data: form.serialize(),
        complete: function () {
            // $(":submit", form).button("reset");
        },
        statusCode: {
            "200": function () {
                form.html("Регистрация прошла успешно").addClass('alert-success');
                // window.location.href = "/login";
            },
            "444": function (err) {
                console.log(1);
                console.log(err.responseText);
                console.log(2);
                console.log(err);

                $("#error").text(err.responseText);
            },

            "403": function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
    return false;
});