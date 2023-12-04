import { database, ref, get } from "./Data.js";

const itemsRef = ref(database, "items");
const shop = document.getElementById("shop");
let basket = JSON.parse(localStorage.getItem("data")) || [];

const generateShop = (itemsData) => {
  shop.innerHTML = itemsData.map((x) => {
    const { id, name, desc, longdesc, img, price, gal1, gal2, gal3 } = x;

    const search = basket.find((y) => y.id === id) || { item: 0 };

    return `
      <div id="product-id-${id}" class="item">
        <img width="220" src="${img}" alt="" class="product-img" data-id="${id}">
        <h3 class="product-name" data-id="${id}">${name}</h3>
        <div class="details">
          <p class="product-desc" data-id="${id}">${desc}</p>
        </div>
        <div id="myModal-${id}" class="modal">
          <div class="modal-content">
            <span class="close-btn" data-id="${id}">&times;</span>
            <h2 id="modalName">${name}</h2>
            <img id="modalImg" src="${img}" alt="Product image">
            <p id="modalDesc">${longdesc}</p>
            <div class="price-quantity">
            <h5 class="product-price" data-id="${id}">₲ ${price}</h5>
            <div class="buttons">
              <i class="bi bi-dash-lg decrement" data-id="${id}"></i>
              <div id="${id}" class="quantity">${search.item}</div>
              <i class="bi bi-plus-lg increment" data-id="${id}"></i>
            </div>
          </div>
            <div id="modalGallery" class="modal-gallery">
              <img class="modal-gallery-img" src="${gal1}" alt="Product image">
              <img class="modal-gallery-img" src="${gal2}" alt="Product image">
              <img class="modal-gallery-img" src="${gal3}" alt="Product image">
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  attachEventListeners();
};

const attachEventListeners = () => {
  shop.addEventListener("click", (event) => {
    const id = event.target.dataset.id;
    if (id) {
      if (event.target.classList.contains("product-img") ||
          event.target.classList.contains("product-name") ||
          event.target.classList.contains("product-desc") ||
          event.target.classList.contains("product-price")) {
        openModal(id);
      } else if (event.target.classList.contains("decrement")) {
        decrement(id);
      } else if (event.target.classList.contains("increment")) {
        increment(id);
      }
    }
  });

  shop.addEventListener("click", (event) => {
    const id = event.target.dataset.id;
    if (id && event.target.classList.contains("close-btn")) {
      closeModal(id);
    }
  });
};

const openModal = (id) => {
  document.getElementById(`myModal-${id}`).style.display = 'flex';
};

const closeModal = (id) => {
  document.getElementById(`myModal-${id}`).style.display = 'none';
};

const increment = (id) => {
  const selectedItem = basket.find((x) => x.id === id);

  if (!selectedItem) {
    basket.push({ id, item: 1 });
  } else {
    selectedItem.item += 1;
  }

  update(id);
  saveBasket();
};

const decrement = (id) => {
  const selectedItem = basket.find((x) => x.id === id);

  if (!selectedItem || selectedItem.item === 0) {
    return;
  }

  selectedItem.item -= 1;
  update(id);
  basket = basket.filter((x) => x.item !== 0);
  saveBasket();
};

const update = (id) => {
  const selectedItem = basket.find((x) => x.id === id);
  document.getElementById(id).innerHTML = selectedItem.item;
  calculation();
};

const calculation = () => {
  const cartIcon = document.getElementById("cartAmount");
  cartIcon.innerHTML = basket.map((x) => x.item).reduce((x, y) => x + y, 0);
};

const saveBasket = () => {
  console.log(basket);
  localStorage.setItem("data", JSON.stringify(basket));
};

calculation();

shop.innerHTML = '<p>Cargando...</p>';

get(itemsRef)
  .then((snapshot) => {
    shop.innerHTML = "";

    if (snapshot.exists()) {
      const itemsData = [];
      snapshot.forEach((childSnapshot) => {
        const item = {
          id: childSnapshot.key,
          ...childSnapshot.val(),
        };
        itemsData.push(item);
      });
      generateShop(itemsData);
    } else {
      console.error("No data available in the database");
    }
  })
  .catch((error) => {
    console.error(error);
  });
