/* global $, get, deleteMethod */
/**
 * results data model
 */
class ResultsModel {
  constructor(data = []) {
    this._data = data;
  }
  get dataAll() {
    return this._data;
  }
  set dataAll(val) {
    this._data = val;
  }
  get dataTimeMap() {
    return this._data.filter(str => str.match(/^time/));
  }
  get dataQuery() {
    return this._data.filter(str => str.match(/^query/));
  }
  remove(file) {
    this._data.splice(this._data.indexOf(file), 1);
  }
}

let resultsModel = new ResultsModel();

/**
 * initialization
 */
get('/output', {}, res => new Promise(resolve => {
  res.list.sort().reverse();
  resultsModel.dataAll = res.list;
  showAllResults();
  resolve();
}));

function showAllResults() {
  const tbody = $('#results-table table tbody').empty();

  resultsModel.dataAll.forEach(file => {
    appendItem(tbody, file);
  });
}

// eslint-disable-next-line no-unused-vars
function showTimeMapResults() {
  const tbody = $('#results-table table tbody').empty();

  resultsModel.dataTimeMap.forEach(file => {
    appendItem(tbody, file);
  });
}

// eslint-disable-next-line no-unused-vars
function showQueryResults() {
  const tbody = $('#results-table table tbody').empty();

  resultsModel.dataQuery.forEach(file => {
    appendItem(tbody, file);
  });
}

function appendItem(tbody, file) {
  const m = file.match(/.*(\d{4})-(\d{2})-(\d{2})_(\d{4})\.pdf$/);
  const date = new Date(m[1], m[2] - 1, m[3]);
  tbody.append(`<tr>
  <td>${date.toDateString()}</td>
  <td><a href="/output/${file}" target="_blank">${file}</a></td>
  <td><button type="button" class="btn btn-outline-danger" value="${file}" onclick="deleteResult(this)">Delete</button></td>
  </tr>`);
}

// eslint-disable-next-line no-unused-vars
function deleteResult(btn) {
  const file = btn.value
  deleteMethod('/output', { file }, () => new Promise((resolve) => {
    btn.parentNode.parentNode.remove();
    resultsModel.remove(file);
    resolve();
  }))
}

// eslint-disable-next-line no-unused-vars
function hideResults() {
  $('#results-modal').hide();
}
