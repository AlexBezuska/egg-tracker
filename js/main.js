var messages = {
  cartonNotFull: "The curent carton is not full yet.",
  noCartons: "Please start a new carton before adding eggs.",
  needNewCarton: "Please start a new carton before adding more eggs.",
  firstHen: "Welcome to egg tracker, to get started add a hen by adding a name and clicking the 'add Hen' button."
};

var henButtonHTML = "<div class='btnAddEgg btn btn-success' data-id='{{dataid}}' data-name='{{dataname}}'>{{henname}}</div>";

var cartonHTML = '<div class="col-sm-6">'+
'<div class="panel panel-default">' +
'<div class="panel-heading">Carton ({{id}})<br/><b>Start Date</b></br> {{datastart}}</b></div>' +
'<div class="panel-body">{{eggs}}</div></div>'+
'</div>';

var eggHTML = "<div class='egg'>{{eggID}}</div>";


$(document).ready(function() {

  $('#clearALL').on('click', function() {
    localStorage.clear();
    location.reload();
  });

  $('#btnAddHen').on('click', function() {
    addHen();
  });

  $('#btnAddCarton').on('click', function() {
    addCarton();
  });


  init();
});


function init() {
  if(!localStorage.cartons) {
    localStorage['cartons'] = new Array();
    var intialCartons = [];
    localStorage.setItem("cartons", JSON.stringify(intialCartons));
  }

  if(!localStorage.hens) {
    localStorage['hens'] = new Array();
    var intialHens = [];
    localStorage.setItem("hens", JSON.stringify(intialHens));
    displayMessage("Your First Hen", messages.firstHen, "Got it");
  }
  if(!localStorage.eggs) {
    localStorage['eggs'] = new Array();
    var intialeggs = [];
    localStorage.setItem("eggs", JSON.stringify(intialeggs));
  }


  var storedHens = JSON.parse(localStorage.getItem("hens"));
  $('.henList').empty();
  for (var i = 0; i < storedHens.length; i++) {
    $('.henList').append(
      henButtonHTML
      .replace('{{dataname}}', storedHens[i].name)
      .replace('{{henname}}', storedHens[i].name)
      .replace('{{dataid}}', storedHens[i].id)
    );
  }


  var storedCartons = JSON.parse(localStorage.getItem("cartons"));
  $('.cartonList').empty();
  for (var i = 0; i < storedCartons.length; i++) {
    var eggs = "";
    for (var j = 0; j < storedCartons[i].eggs.length; j++) {
      var eggHen = storedCartons[i].eggs[j].hen + "™ ";
      var eggDate = storedCartons[i].eggs[j].date
      eggs += '<i class="egg filled" title="'+ eggHen + eggDate + '"></i>';
    }
    var empties = storedCartons[i].capacity - storedCartons[i].eggs.length;
    for (var k = 0; k < empties; k++) {
      eggs += '<i class="egg empty"></i>';
    }

    $('.cartonList').prepend(
      cartonHTML
      .replace('{{eggs}}', eggs)
      .replace('{{datastart}}', moment(storedCartons[i].dateStart).format('MMMM Do YYYY'))
      .replace('{{dataid}}', storedCartons[i].id)
      .replace('{{id}}', storedCartons[i].id)
    );
  }

  $('.btnAddEgg').unbind().on('click', function(e) {
    addEgg($(this).data('name'), $(this).data('id'));
  });

  updateJSON();
}


function addCarton() {
  var storedCartons = JSON.parse(localStorage.getItem("cartons"));

  if (storedCartons.length === 0) {
    newCarton(storedCartons);
  } else {
    var mostRecentCarton = storedCartons[storedCartons.length -1];
    if (mostRecentCarton.eggs.length < mostRecentCarton.capacity){
      confirm(messages.cartonNotFull, mostRecentCarton.eggs.length, "/", mostRecentCarton.capacity);
    } else {
      newCarton(storedCartons);
    }
  }
  init();
}

function newCarton(storedCartons) {
  var date = new Date();
  var newCarton = {};
  newCarton.id = storedCartons.length + 1;
  newCarton.dateStart = moment().format('YYYYMMDD');
  newCarton.eggs = [];
  newCarton.capacity = getFormData("#cartonCapacity");
  $('#cartonCapacity').val("");
  storedCartons.push(newCarton);
  localStorage.setItem("cartons", JSON.stringify(storedCartons));
}


function addHen() {
  if (getFormData("#henName")){
    var storedHens = JSON.parse(localStorage.getItem("hens"));
    var newHen = {};
    newHen.name = getFormData("#henName");
    $('#henName').val("");
    newHen.id = "HID" + (storedHens.length + 1);
    storedHens.push(newHen);
    localStorage.setItem("hens", JSON.stringify(storedHens));
    init();
  }
}


function addEgg(henName, henID) {

  var storedEggs = JSON.parse(localStorage.getItem("eggs"));
  var newEgg = {};
  newEgg.hen = henName;
  newEgg.id = henID + "-" + moment().format('YYYYMMDD');
  newEgg.date =  moment().format('YYYYMMDD');
  storedEggs.push(newEgg);
  localStorage.setItem("eggs", JSON.stringify(storedEggs));

  var storedCartons = JSON.parse(localStorage.getItem("cartons"));
  if (storedCartons.length < 1) {
    displayMessage("No Cartons", messages.noCartons, "Got it");
    return;
  }
  var mostRecentCarton = storedCartons[storedCartons.length -1];
  if (mostRecentCarton.eggs.length >= mostRecentCarton.capacity){
    displayMessage("Need a new Carton", messages.needNewCarton, "Got it");
    return;
  }

  var storedCartons = JSON.parse(localStorage.getItem("cartons"));
  var mostRecentCarton = storedCartons[storedCartons.length -1];

  storedCartons[storedCartons.length -1].eggs.push(newEgg);
  localStorage.setItem("cartons", JSON.stringify(storedCartons));
  init();
}


function getFormData(fieldID) {
  return $(fieldID).val();
}


function updateJSON() {
  $("#henJSON").text(JSON.stringify(localStorage.getItem("hens"), undefined, 2));
  $("#eggJSON").text(JSON.stringify(localStorage.getItem("eggs"), undefined, 2));
  $("#cartonJSON").text(JSON.stringify(localStorage.getItem("cartons"), undefined, 2));
}


function displayMessage(title, message, btn) {
  $(".modal-title").text(title);
  $(".modal-body").text(message);
  $(".model-btn").text(btn);
  $('.message-box').modal();
}


