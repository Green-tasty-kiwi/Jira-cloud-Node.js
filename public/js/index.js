$(document).ready(function () {

    let searchParams = new URLSearchParams(window.location.search);
    let param = searchParams.get('filter');

    $(`option[value = '${param}']`).attr("selected", "selected");
});

