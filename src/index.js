import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const singleCountryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const BASIC_URL = 'https://restcountries.com/v3.1';

input.addEventListener('input', debounce(makeCountryList, DEBOUNCE_DELAY));

function makeCountryList(countries) {
  fetchCountries()
    .then(countries => {
      renderCountryList(countries);
      if (countries.length > 10) {
        attemptToRenderTooManyCountries(countries);
      }
      if (countries.length < 2) {
        renderSingleMarkup(countries);
      }
    })
    .catch(onError);
}

function fetchCountries() {
  return fetch(`${BASIC_URL}/name/${input.value.trim()}`).then(response => {
    return response.json();
  });
}

function renderSingleMarkup(countries) {
  countryList.innerHTML = '';

  const langs = Object.values(countries[0].languages).join(', ');
}

function attemptToRenderTooManyCountries(countries) {
  countryList.innerHTML = '';
  Notify.warning('Too many matches found. Please enter a more specific name.');
}

function renderCountryList(countries) {
  singleCountryInfo.innerHTML = '';

  const markup = countries
    .flatMap(
      country =>
        `<p><img src=${country.flags.svg} alt=${country.name.official} height=12 /> ${country.name.official}</p>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function onError() {
  console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  Notify.failure('Oops, there is no country with that name :(');
  countryList.innerHTML = '';
  singleCountryInfo.innerHTML = '';
}
