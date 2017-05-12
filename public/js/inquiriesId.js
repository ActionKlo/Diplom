$(document.forms['inquiriesId']).on('submit', (th) => {
    var form = $(th.currentTarget);
    console.log(form.serialize());

    $('.error', form).html('Опа');
    $(':submit').button('Подождите...');

    $.ajax({
        url: '/inquiries/:id',
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