'use strict'

//day one
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

let login = localStorage.getItem('foodDelivery');

function toggleModalAuth() {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  logInForm.reset();
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('foodDelivery')
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    buttonOut.removeEventListener('click', logOut)
    checkAuth();
  }
  userName.innerHTML = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';
  buttonOut.addEventListener('click', logOut);
  console.log('avtorizovan');
};

function noAuthorized() {
  console.log('ne avtorizovan');

  function logIn(event) {
    event.preventDefault();
    if (loginInput.value.trim()) {
      login = loginInput.value;
      toggleModalAuth();
      localStorage.setItem('foodDelivery', login);
      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      logInForm.removeEventListener('submit', logIn);
      logInForm.reset();
      checkAuth();

    } else {
      loginInput.style.borderColor = 'red';
      loginInput.value = '';
    }
  }


  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (e) {
    if (e.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  })
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    noAuthorized();
  }
};
//day2

function createCardsRestaurant() {
  const card = `
  <a class="card card-restaurant">
                        <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title">Пицца плюс</h3>
                                <span class="card-tag tag">50 мин</span>
                            </div>
                            <div class="card-info">
                                <div class="rating">
                                    4.5
                                </div>
                                <div class="price">От 900 ₽</div>
                                <div class="category">Пицца</div>
                            </div>
                        </div>
                    </a>
  `;
  cardsRestaurants.insertAdjacentHTML('afterbegin', card)
};

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
                         <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title card-title-reg">Пицца Классика</h3>
                            </div>
                            <div class="card-info">
                                <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.
                                </div>
                            </div>
                            <div class="card-buttons">
                                <button class="button button-primary button-add-cart">
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
                                <strong class="card-price-bold">510 ₽</strong>
                            </div>
                        </div>
   `);
  cardsMenu.insertAdjacentElement('afterbegin', card);
}

function openGoods(e) {
  const target = e.target;
  const restaurant = target.closest('.card-restaurant');
  toggleModalAuth();
  if (login) {
    if (restaurant) {
      console.log('++++');
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
      createCardGood();
      createCardGood();
      createCardGood();
      createCardGood();
      toggleModalAuth();
    }
  }
}
cardsRestaurants.addEventListener('click', openGoods);

function home() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}
logo.addEventListener('click', home);

checkAuth();

createCardsRestaurant();
createCardsRestaurant();
createCardsRestaurant();
createCardsRestaurant();