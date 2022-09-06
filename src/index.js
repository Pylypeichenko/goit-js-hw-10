import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import './css/styles.css';
import fetchCountries from './fetchCountries';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const singleCountryInfo = document.querySelector('.country-info');

const DEBOUNCE_DELAY = 300;
const BASIC_URL = 'https://restcountries.com/v3.1';

input.addEventListener('input', debounce(makeCountryList, DEBOUNCE_DELAY));
Notify.info('Please start typing the name of any country IN ENGLISH');

function makeCountryList() {
  fetchCountries()
    .then(countries => {
      renderCountryList(countries);
      if (countries.length > 10) {
        attemptToRenderTooManyCountries();
      }
      if (countries.length < 2) {
        renderSingleMarkup(countries);
      }
    })
    .catch(error => {
      onError(error);
    });
}

function renderSingleMarkup(countries) {
  countryList.innerHTML = '';

  const langs = Object.values(countries[0].languages).join(', ');

  const singleMarkup = countries.map(
    country => `<p class='js-country-name'><img src=${country.flags.svg} alt=${country.name.official} height=25 /> ${country.name.official}</p>
  <p>Capital: ${country.capital}</p>
  <p>Population: ${country.population}</p>
  <p>Languages: ${langs}</p>`
  );

  singleCountryInfo.innerHTML = singleMarkup;
}

function attemptToRenderTooManyCountries() {
  countryList.innerHTML = '';
  Notify.warning('Too many matches found. Please enter a more specific name.');
}

function renderCountryList(countries) {
  singleCountryInfo.innerHTML = '';

  const markup = countries
    .flatMap(
      country =>
        `<p  ><img src=${country.flags.svg} alt=${country.name.official} height=12 /> ${country.name.official}</p>`
    )
    .join('');

  countryList.innerHTML = markup;
}

function onError(error) {
  countryList.innerHTML = '';
  singleCountryInfo.innerHTML = '';

  console.log(error);

  if (input.value === '') {
    Notify.info('Please start typing the name of any country');
    throw new Error('This is an empty input');
  } else {
    Notify.failure('Oops, there is no country with that name :(');
    throw new Error('Some cat is typing qwe-qwe-qwe');
  }
}
