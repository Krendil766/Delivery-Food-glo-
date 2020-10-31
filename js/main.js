'use strict'
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'

//day one
const cartButton = document.querySelector("#cart-button");
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const clearCart = document.querySelector('.clear-cart');
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const passwordInput = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantCategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');



let login = localStorage.getItem('foodDelivery');
let password = localStorage.getItem('passPeople');

const cart = JSON.parse(localStorage.getItem(`foodDelivere_${login}`)) || [];

function saveCard(){
  localStorage.setItem(`foodDelivere_${login}`, JSON.stringify(cart));
}

function downloadCart(){
if(localStorage.getItem(`foodDelivere_${login}`)){
  const data = JSON.parse(localStorage.getItem(`foodDelivere_${login}`));
    cart.push(...data)
}
}

const getData = async function (url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Ошибка по адрессу ${url}, статус ошибки ${response.status}`)
  }
  return await response.json();
};

const validName = function (str) {
  const regName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regName.test(str);
};

const validPassword = function (str) {
  const regPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/;
  return regPassword.test(str);
};

const toggleModalAuth = function () {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  logInForm.reset();
  if (modalAuth.classList.contains('is-open')) {
    disableScroll();
  } else {
    enableScroll();
  }
};

const toggleModal = function () {
  modal.classList.toggle("is-open");
};

function home() {
  containerPromo.classList.remove('hide');
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
};

function authorized() {
  function logOut() {
    login = null;
    password = null;
    cart.length=0;
    localStorage.removeItem('foodDelivery');
    localStorage.removeItem('passPeople')
    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  userName.innerHTML = login;
  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';
  buttonOut.addEventListener('click', logOut);
  console.log('avtorizovan');
};

function noAuthorized() {
  console.log('ne avtorizovan');

  function logIn(event) {
    event.preventDefault();
    if (validName(loginInput.value) && validPassword(passwordInput.value)) {
      login = loginInput.value;
      password = passwordInput.value;
      toggleModalAuth();
      downloadCart();
      localStorage.setItem('foodDelivery', login);
      localStorage.setItem('passPeople', password);
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
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (e) {
    if (e.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  });
};

function checkAuth() {
  if (login) {
    authorized();
  } else {
    noAuthorized();
  }
};

function createCardsRestaurant(restaurant) {
  const {
    image,
    kitchen,
    name,
    price,
    products,
    stars,
    time_of_delivery: timeOfDelivery
  } = restaurant;

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = {
    name,
    kitchen,
    price,
    stars
  };

  const card = `
                        <img src="${image}" alt="image" class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title">${name}</h3>
                                <span class="card-tag tag">${timeOfDelivery}</span>
                            </div>
                            <div class="card-info">
                                <div class="rating">${stars}</div>
                                <div class="price">От ${price}</div>
                                <div class="category">${kitchen}</div>
                            </div>
                        </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card)
  cardsRestaurants.insertAdjacentElement('afterbegin', cardRestaurant);
};

function createCardGood(good) {
  const {
    id,
    name,
    description,
    price,
    image,
  } = good;
  console.log(good);
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
                         <img src=${image} alt=${name} class="card-image" />
                        <div class="card-text">
                            <div class="card-heading">
                                <h3 class="card-title card-title-reg">${name}</h3>
                            </div>
                            <div class="card-info">
                                <div class="ingredients">${description}
                                </div>
                            </div>
                            <div class="card-buttons">
                                <button class="button button-primary button-add-cart" id =${id}>
									<span class="button-card-text">В корзину</span>
									<span class="button-cart-svg"></span>
								</button>
                                <strong class="card-price card-price-bold">${price} ₽</strong>
                            </div>
                        </div>
   `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

function openGoods(e) {
  saveCard();
  const target = e.target;
  const restaurant = target.closest('.card-restaurant');
  toggleModalAuth();
  if (login) {
    if (restaurant) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');
      cardsMenu.textContent = '';
      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood)
      });
        toggleModalAuth();
        const { name, kitchen, price, stars} = restaurant.info;

        restaurantTitle.textContent = name;
        restaurantCategory.textContent = kitchen;
        restaurantPrice.textContent =`От ${price} ₽`;
        restaurantRating.textContent =stars;
    }
  }
};

function addToCart (e){
const target = e.target;
const buttonAddCart=target.closest('.button-add-cart');
if(buttonAddCart){
  const card = target.closest('.card');
  const title = card.querySelector('.card-title-reg').textContent;
  const cost = card.querySelector('.card-price').textContent;
  const id = buttonAddCart.id;
  const food = cart.find(function(item){
    return item.id === id;
  })
  if(food){
    food.count++
  }else{
  cart.push({id,title,cost, count: 1,})
}
saveCard();
}
}

function renderCart (){
  modalBody.textContent = '';
  cart.forEach(function({ id, title, cost, count}){
    const itemCart = `
        <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
            <button class="counter-button counter-minus" data-id=${id}>-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
        </div>
    `;
    modalBody.insertAdjacentHTML('afterbegin',itemCart)
  });
  const totalPrice = cart.reduce(function(result, item){
      return result+(parseFloat(item.cost)*item.count);
  }, 0);
  modalPrice.textContent = totalPrice + ' BY';

};

function changeCount(e){
  const target = e.target;
  if(target.classList.contains('counter-button')){
    const food = cart.find(function(item){
      return item.id === target.dataset.id;
    });
    if(target.classList.contains('counter-minus')){
      food.count--;
      if(food.count===0){
        cart.splice(cart.indexOf(food),1)
      }
    };
    if(target.classList.contains('counter-plus'))food.count++;
    renderCart();
    saveCard();
  }
}

function init() {
  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardsRestaurant);
  });

  cartButton.addEventListener("click", function(){
    renderCart();
    toggleModal();
  });
  modalBody.addEventListener('click',changeCount);
  close.addEventListener("click", toggleModal);
  clearCart.addEventListener("click", function(){
    cart.length = 0;
    renderCart();
    saveCard();
  });
  cardsRestaurants.addEventListener('click', openGoods);
  logo.addEventListener('click', home);
  menu.addEventListener('click', addToCart);

  inputSearch.addEventListener('keypress', function(e){
    if(e.charCode === 13){
      const value = e.target.value.trim();
      if(!value){
        e.target.style.backgroundColor='rgb(255,0,0)';
        e.target.value='';
        setTimeout(function(){
          e.target.style.backgroundColor='';
        },1500);
        return;
      }
      getData(`./db/partners.json`)
      .then(function(data){
       return  data.map(function(partner){
          return partner.products
        })
      })
      .then(function(linksProduckt){
        cardsMenu.textContent='';
        linksProduckt.forEach(function(link){
          getData(`./db/${link}`).then(function(data){
            const resultSearch = data.filter(function(item){
              const name = item.name.toLowerCase();
                return name.includes(value.toLowerCase());
              })

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');

            restaurantTitle.textContent = 'Введите название продукта';
            restaurantCategory.textContent = '';
            restaurantPrice.textContent ='';
            restaurantRating.textContent ='';

            resultSearch.forEach(createCardGood)
          })
        })
      })
    }
  })

  checkAuth();

  new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    effect: 'coverflow',
    grabCursor: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    }
  });
};
init();