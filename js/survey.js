if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    };
}

Survey.dxSurveyService.serviceUrl = "http://91.221.37.63:8008";
Survey.Survey.cssType = "bootstrap";
//Survey.defaultBootstrapCss.navigationButton = "btn btn-raised"; $.material.init();

Survey.defaultBootstrapMaterialCss.navigationButton = "btn btn-outline-secondary";
Survey.defaultBootstrapMaterialCss.rating.item = "btn btn-default my-rating";
Survey.Survey.cssType = "bootstrapmaterial";
Survey.surveyStrings.progressText = "";

var surveyId = getParams()["id"] || "1";
var model = new Survey.Model({surveyId: surveyId, surveyPostId: surveyId});
window.survey = model;
// model.render("surveyElement"); // Load survey by id from url var xhr = new XMLHttpRequest();
// xhr.open('GET', "http://localhost:8000" + '/survey?surveyId=' + surveyId);
// xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded'); xhr.onload = function
// () {     var result = JSON.parse(xhr.response);     if(!!result) {         var surveyModel = new
// Survey.Model(result);         window.survey = surveyModel;
// ko.cleanNode(document.getElementById("surveyElement"));
// document.getElementById("surveyElement").innerText = ""; surveyModel.render("surveyElement"); }
// }; xhr.send(); window.survey = new Survey.Model(json);

survey.onTextMarkdown.add(function (survey, options) {
    //convert the mardown text to html
    var str = options.text;
    options.html = str;
});

survey.onAfterRenderQuestion.add(function () {
    $('[data-toggle="tooltip"]').tooltip();
    [].forEach.call(document.querySelectorAll('.sv_next_btn'), function (elem) {
        elem.setAttribute('value', "Продолжить");
    });

    [].forEach.call(document.querySelectorAll('.sv_prev_btn'), function (elem) {
        elem.setAttribute('value', "Назад");
    });
    [].forEach.call(document.querySelectorAll('.sv_complete_btn'), function (elem) {
        elem.setAttribute('value', "Завершить тест!");
    });
});

survey.onAfterRenderPage.add(function () {
    setTimeout(function () {
        [].forEach.call(document.querySelectorAll('.sv_next_btn'), function (elem) {
            elem.setAttribute('value', "Продолжить");
        });

        [].forEach.call(document.querySelectorAll('.sv_prev_btn'), function (elem) {
            elem.setAttribute('value', "Назад");
        });
        [].forEach.call(document.querySelectorAll('.sv_complete_btn'), function (elem) {
            elem.setAttribute('value', "Завершить тест!");
        });
    });
});

document.addEventListener('change', function () {
    $('[data-toggle="tooltip"]').tooltip('hide');
    setTimeout(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
});

$("#surveyElement").Survey({model: survey});

survey.onComplete.add(function (result) {
    var data = result.data;
    let resHtml = '<ul>';
    for (var i in data) {
        resHtml += '<li>';
        if (Array.isArray(data[i])) {
          	resHtml += i + ':';
            resHtml += '<ul>';
            data[i].forEach(function (value) {
                resHtml += '<li>' + value + '</li>';
            });
            resHtml += '</ul>';
        } else {
            resHtml += '' + i + ': ' + data[i];
        }

        resHtml += '</li>';
    }

    resHtml += '</ul>';
    window.emailjs.send("info", 'survey', {result: resHtml});
    //document.querySelector('#result').innerHTML = "result: " + JSON.stringify(result.data);
});

function getParams() {
    var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var result = {};
    url.forEach(function (item) {
        var param = item.split("=");
        result[param[0]] = param[1];
    });
    return result;
}
