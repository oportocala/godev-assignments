var form = document.getElementById("form");
var city = document.getElementById("city");

var table = document.getElementById("table");
var tableBody = table.getElementsByTagName('tbody')[0];
var count = document.getElementById("count");
var loadingIndicator = document.getElementById('loading');
var store = [];

form.addEventListener("submit", function onSubmit (event) {
  event.preventDefault();

  var data = getValues();
  if (isValidData(data)) {
    lockForm();
    showLoading();
    isValidCityAccordingToGoogle(data.city);
    // se intampla imdiat, sync
    // iar io am nevoie sa se intample cand am un raspuns de la server


  } else {
    alert("Mãi, terminã cu prostiile. Pls. LOL ok.");
  }

  return false;
});

var onResponseFromGoogle = function (results) {
  if (results.length) {
    var data = {
      city: results[0].formatted_address
    };
    form.reset();
    city.focus();

    store.push(data);
    render(store);
  }
};

var getValues = function () {
  return {
    city: city.value
  }
};

var createRow = function (values) {
  var tr = document.createElement('tr');
  tr.innerHTML = tmpl("template", values);
  tableBody.appendChild(tr);
};

var isValidData = function (data) {
  return data.city != "";
};

tableBody.addEventListener("click", function onRemove(event) {
  if (isRemoveBtn(event.target)) {
    removeRow(event.target);
  }
});

var isRemoveBtn = function (target) {
  return target.classList.contains("remove-btn");
};

var updateTotal = function (arr) {
  count.innerHTML = arr.length;
};

var getIndexOfButton = function (target) {
  var tr = target.parentNode.parentNode;
  var allTrs = tableBody.getElementsByTagName('tr');
  allTrs = [].slice.call(allTrs);
  return allTrs.indexOf(tr);
};

var removeRow = function (target) {
  var index = getIndexOfButton (target);
  removeFromStore(store, index);
  render(store);
};


var render = function (store) {
  populateTable(store);
  updateTotal(store);
};

var removeFromStore = function (store, index) {
  store.splice(index, 1);
};

var populateTable = function (store) {
  tableBody.innerHTML = '';
  for (var i = 0; i < store.length; i++) {
    var data = store[i];
    createRow(data);
  }
};


var isValidCityAccordingToGoogle = function (address) {
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': address}, function (results, status) {
    unlockForm();
    hideLoading();

    if (status === google.maps.GeocoderStatus.OK) {
      onResponseFromGoogle(results);
    } else {
      city.focus();
      city.select();
      alert('Alerta care era a lu google inainte');
    }
  });
};


var lockForm = function () {
  var inputs = form.getElementsByTagName('input');
  for(var i = 0; i < inputs.length; i++){
    inputs[i].disabled = true;
  }
};

var unlockForm = function () {
  var inputs = form.getElementsByTagName('input');
  for(var i = 0; i < inputs.length; i++){
    inputs[i].disabled = false;
  }
};

var showLoading = function () {
  loadingIndicator.style.display = 'inline-block';
};

var hideLoading = function () {
  loadingIndicator.style.display = 'none';
};