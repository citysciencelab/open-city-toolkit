/* global $, get, deleteMethod */

/**
 * result modal class
 */
class ResultModal {
  constructor(data = [], resultToDelete = '', currentView = 'ALL') {
    this.results = data;
    this.resultToDelete = resultToDelete;
    this.currentView = currentView;
  }

  get dataAll() {
    return this.results;
  }
  set dataAll(val) {
    this.results = val;
  }
  get dataTimeMap() {
    return this.results.filter(result => result.file.match(/^time/));
  }
  get dataQuery() {
    return this.results.filter(result => result.file.match(/^query/));
  }

  remove(file) {
    this.dataAll.splice(this.dataAll.findIndex(result => result.file == file), 1);
  }

  onClickTimeMap() {
    const tbody = $('#results-table table tbody').empty();
    $('#all-btn').removeClass('active');
    $('#query-btn').removeClass('active');
    $('#time-map-btn').addClass('active');

    this.currentView = 'TIMEMAP';
    this.dataTimeMap.sort((a, b) => b.date.valueOf() - a.date.valueOf()).forEach(result => {
      tbody.append(result.getTableRow());
    });
  }

  onClickQuery() {
    const tbody = $('#results-table table tbody').empty();
    $('#all-btn').removeClass('active');
    $('#query-btn').addClass('active');
    $('#time-map-btn').removeClass('active');

    this.currentView = 'QUERY';
    this.dataQuery.sort((a, b) => b.date.valueOf() - a.date.valueOf()).forEach(result => {
      tbody.append(result.getTableRow());
    });
  }

  onClickAll() {
    const tbody = $('#results-table table tbody').empty();
    $('#all-btn').addClass('active');
    $('#query-btn').removeClass('active');
    $('#time-map-btn').removeClass('active');

    this.currentView = 'ALL';
    this.dataAll.sort((a, b) => b.date.valueOf() - a.date.valueOf()).forEach(result => {
      tbody.append(result.getTableRow());
    });
  }

  onClickDeleteAll() {
    $('#delete-all-modal').show();
  }

  onClickDelete(btn) {
    $('#delete-modal').show();

    this.resultToDelete = btn.value;
    $('#result-to-delete-span').text(resultModal.resultToDelete);
  }

  updateResults() {
    get('/output/', {}, res => new Promise(resolve => {
      res.list.sort().reverse();
      this.dataAll = res.list.map(file => new Result(file));

      switch (this.currentView) {
        case 'QUERY':
          this.onClickQuery();
          break;
        case 'TIMEMAP':
          this.onClickTimeMap();
          break;
        default:
          this.onClickAll();
          break;
      }
      resolve();
    }));
  }

  hide() {
    $('#results-modal').hide();
  }
}

class Result {
  constructor(file) {
    this.file = file;
    const m = this.file.match(/.*(\d{4})-(\d{2})-(\d{2})_(\d{2})(\d{2})\.pdf$/);
    this.date = new Date(m[1], m[2] - 1, m[3], m[4], m[5]);
  }

  getTableRow() {
    return `<tr>
  <td>${this.date.toDateString()}</td>
  <td><a href="/output/${this.file}" target="_blank">${this.file}</a></td>
  <td><button type="button" class="btn btn-outline-danger" value="${this.file}" onclick="resultModal.onClickDelete(this)">Delete</button></td>
</tr>`;
  }
}

class DeleteModal {
  constructor(resultModal) {
    this.resultModal = resultModal;
  }

  hide() {
    $('#delete-modal').hide();
  }

  onClickDelete() {
    deleteMethod('/output', { file: this.resultModal.resultToDelete }, () => new Promise((resolve) => {
      this.resultModal.remove(this.resultModal.resultToDelete);
      resolve();
    }));
    this.resultModal.resultToDelete = '';
    this.resultModal.updateResults();
    this.hide();
  }
}

class DeleteAllModal {
  constructor(resultModal) {
    this.resultModal = resultModal;
  }

  onClickDelete() {
    deleteMethod('/output-all', {}, () => new Promise((resolve) => {
      resolve();
    }));
    this.resultModal.dataAll = []
    this.resultModal.resultToDelete = '';
    $('#results-table table tbody').empty();
    this.hide();
  }

  hide() {
    $('#delete-all-modal').hide();
  }
}

const resultModal = new ResultModal();
// eslint-disable-next-line no-unused-vars
const deleteModal = new DeleteModal(resultModal);
// eslint-disable-next-line no-unused-vars
const deleteAllModal = new DeleteAllModal(resultModal);
