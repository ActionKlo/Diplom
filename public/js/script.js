/*=========== login ==============*/
$(document.forms['login-form']).on('submit', function () {
    var form = $(this);

    $('.error', form).html('');
    $(':submit').button("фв");

    $.ajax({
        url: "/login",
        method: "POST",
        data: form.serialize(),
        complete: function () {
            $(":submit", form).button("reset");
        },
        statusCode: {
            "200": function (status) {
                var s = JSON.parse(JSON.stringify(status));
                
                console.log(s.status[0] + " : " + s.status[1] + " : " + s.status);
                if (s.status[0] === "admin") {
                    window.location.href = "/admin";
                } else if (s.status[0] === "seo") {
                    window.location.href = "/seo";
                } else if (s.status[0] === "client") {
                    window.location.href = "/id" + s.status[1];
                }
            },
            "201": function () {
                $("#error").text("Неверная комбинация логина и пароля!");
            },
            "202": function () {
                $("#error").text("Ваш аккаунт не подтвержден администратором!");
            },
            "203": function () {
                $("#error").text("Ваш аккаунт заблокирован администратором!");
            },
            "403": function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
    return false;
});
/*=========== /login ==============*/

/*=========== signup ==============*/
$(document.forms['signup-form']).on('submit', function () {
    var form = $(this);

    $('.error', form).html('');
    $(':submit').button("loading");

    $.ajax({
        url: "/signup",
        method: "POST",
        data: form.serialize(),
        complete: function () {
            $(":submit", form).button("reset");
        },
        statusCode: {
            "200": function () {
                form.html("Вы успешно зарегистрировались").addClass('alert-success');
                window.location.href = "/login";
            },
            "201": function () {
                $("#error").text("Введенные пароли не совпадают!");
            },

            "403": function (jqXHR) {
                var error = JSON.parse(jqXHR.responseText);
                $('.error', form).html(error.message);
            }
        }
    });
    return false;
});