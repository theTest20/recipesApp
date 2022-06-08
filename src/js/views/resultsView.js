import View from './View.js';
import previewView from './previewView.js';
import icons from 'url:../../img/icons.svg';

class ResultsViews extends View {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipe found for your query!';
  _successMessage = '';
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsViews();
