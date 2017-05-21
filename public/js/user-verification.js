$(document.forms['user-verification']).on('submit', (th) => {
    var form = $(th.currentTarget);
    var id = document.getElementsByName("password").value;

    console.log(form);
    console.log(form.serialize());
    console.log(id);

    // $('.error', form).html('Опа');
    // $(':submit').button('Подождите...');

    $.ajax({
        url: '/verification&token=:id',
        method: 'POST',
        data: form.serialize(),
        complete: () => {
            $(":submit", form).button("reset");
        },
        statusCode: {
            '200': () => {
                console.log("wdkasdjkasd");
                window.location.href = "/inquiries";
            },
            '203': () => {
                console.log("Нормас");
            }
        }
    })
    return false;
});