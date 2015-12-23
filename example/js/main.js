var form = document.getElementById("form");
var city = document.getElementById("city");

var table = document.getElementById("table");
var tableBody = table.getElementsByTagName('tbody')[0];
var count = document.getElementById("count");
var rowId = document.getElementById("rowId");
var loadingIndicator = document.getElementById('loading');
var store = {};

var storeLength = 0;

form.addEventListener("submit", function onSubmit (event) {
  event.preventDefault();

  var data = getValues();
  if (isValidData(data)) {
    lockForm();
    showLoading();
    isValidCityAccordingToGoogle(data.city);
  } else {
    alert("Mãi, terminã cu prostiile. Pls. LOL ok.");
  }

  return false;
});

var onResponseFromGoogle = function (results) {
  if (results.length) {
    var data;
    var currentId = rowId.value;
    if (currentId === '') {
      // INSERT !
      data = {
        id: generateId(),
        city: results[0].formatted_address
      };

      store[id] = data;
      storeLength++;
    } else {
      // EDIT!
      store[id].city = results[0].formatted_address;
      rowId.value = "";
    }

    form.reset();
    city.focus();
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

tableBody.addEventListener("click", function handleActionClick(event) {
  var target = event.target;

  if (isRemoveBtn(target)) {
    removeRow(target);
  }

  if (isEditBtn(target)) {
    editRow(target);
  }

});

var editRow = function (target) {
  var id = getIdOfButton(target);
  var data = getDataFromStore(store, id);
  populateForm(data);
};

var getDataFromStore = function (store, id) {
  return store[id];
};

var populateForm = function (data) {
  city.value = data.city;
  rowId.value = data.id;
};



var isRemoveBtn = function (target) {
  return target.classList.contains("remove-btn");
};

var isEditBtn = function (target) {
  return target.classList.contains("edit-btn");
};

var updateTotal = function () {
  count.innerHTML = storeLength;
};

var getIdOfButton = function (target) {
  return parseInt(target.getAttribute('data-id'));
};


var removeIdFromStore = function (store, id) {
  delete store[id];
  storeLength--;
};

var removeRow = function (target) {
  var id = getIdOfButton (target);
  removeIdFromStore(store, id);
  render(store);
};


var render = function (store) {
  populateTable(store);
  updateTotal(store);
};

var populateTable = function (store) {
  tableBody.innerHTML = '';

  for (var key in store) {
    var data = store[key];
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

var id = 0;
var generateId = function () {
  id ++;
  return id;
};