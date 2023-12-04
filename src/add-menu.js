import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAlQrgx_Jt9utW1XVuM90OuSS6y2YHWWN4",
  authDomain: "saborcaribe-b3d6f.firebaseapp.com",
  projectId: "saborcaribe-b3d6f",
  storageBucket: "saborcaribe-b3d6f.appspot.com",
  messagingSenderId: "536011684254",
  appId: "1:536011684254:web:cbd83b4eda113b81ba7e8f",
  databaseURL: "https://saborcaribe-b3d6f-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const itemsInDB = ref(database, "menu-items");

// rest of your code...

const nameFieldEl = document.getElementById("name-field")
const priceFieldEl = document.getElementById("price-field")
const descFieldEl = document.getElementById("desc-field")
const longdescFieldEl = document.getElementById("longdesc-field")
const prefixFieldEl = document.getElementById("prefix-field")
const addButtonEl = document.getElementById("add-button")
const itemsListEl = document.getElementById("items-list")


onValue(itemsInDB, (snapshot) => {
    const data = snapshot.val();
    itemsListEl.innerHTML = "";
    for (let id in data) {
        renderItems(data[id], id);
    }
});


addButtonEl.addEventListener("click", () => {
    // console.log("add button clicked");
    let nameValue = nameFieldEl.value.toLowerCase();    
    let priceValue = priceFieldEl.value;
    let descValue = descFieldEl.value;
    let longdescValue = longdescFieldEl.value;
    let prefixValue = prefixFieldEl.value;


    if (nameValue.trim() === "" || descValue.trim() === "" || longdescValue.trim() === "" || prefixValue.trim() === "" || priceValue === 0 || isNaN(priceValue)) {
    alert("Por favor, complete todas las secciones.");
    }else {
        let item = {
            name: nameValue,
            price: priceValue,
            desc: descValue,
            longdesc: longdescValue,
            img: "images/menu/" + prefixValue + ".png",            
            gal1: "images/menu/" + prefixValue + "1.png",
            gal2: "images/menu/" + prefixValue + "2.png",
            gal3: "images/menu/" + prefixValue + "3.png",
            priority: 0,
        };

        push(itemsInDB, item);
        clearNameFieldEl();  
        clearPriceFieldEl();
        clearDescFieldEl();
        clearlongdescFieldEl();
        clearPrefixFieldEl();
    }
});

function clearItemsListEl() {
    itemsListEl.innerHTML = ""
}

// clear fields

function clearNameFieldEl() {
    nameFieldEl.value = ""
}

function clearPriceFieldEl() {
    priceFieldEl.value = ""
}

function clearDescFieldEl() {
    descFieldEl.value = ""
}

function clearlongdescFieldEl() {
    longdescFieldEl.value = ""
}

function clearPrefixFieldEl() {
    prefixFieldEl.value = ""
}



function renderItems(item, id) {
    const itemEl = document.createElement("li");
    
    itemEl.innerHTML = ` 
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        <br><span style="font-style: italic;">Breve (desc):</span> ${item.desc} 
        <br><span style="font-style: italic;">Larga (longdesc):</span> ${item.longdesc} 
        <br><span style="font-style: italic;">Imágenes:</span><ul><li>${item.img}
            </li><li>${item.gal1}
            </li><li>${item.gal2}
            </li><li>${item.gal3} 
        </li></ul>
        <span style="font-style: italic;">Posición del menú:</span> ${item.priority}
        <br><span style="font-style: italic;">ID de base de datos:</span> ${id}`
    ;

    const deleteButton = document.createElement("button");
    deleteButton.style.backgroundColor = "red";
    deleteButton.style.color = "white";
    deleteButton.style.border = "none";
    deleteButton.style.padding = "5px";
    deleteButton.style.width = "15px";
    deleteButton.style.height = "15px";
    deleteButton.style.opacity = "0.5";
    deleteButton.textContent = "X";
    deleteButton.style.fontSize = "7px";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", () => {
        const userConfirmed = confirm("⚠️⚠️¿Quieres eliminar permanentemente este artículo?⚠️⚠️");
        if (userConfirmed) {
            itemEl.remove();
            const itemRef = ref(database, 'items/' + id);
            remove(itemRef);
        }
    });
    
    let modal = document.getElementById('myModal');
    let span = document.getElementsByClassName("close")[0];


    const editButton = document.createElement("button");
    editButton.style.backgroundColor = "blue";
    editButton.style.color = "white";
    editButton.style.border = "none";
    editButton.style.padding = "5px";
    editButton.style.width = "15px";
    editButton.style.height = "15px";
    editButton.style.opacity = "0.5";
    editButton.textContent = "E";
    editButton.style.fontSize = "7px";
    editButton.className = "edit-button";
    editButton.addEventListener("click", () => {
        modal.style.display = "block";
        document.getElementById('edit-name-field').value = item.name;
        document.getElementById('edit-price-field').value = item.price;
        document.getElementById('edit-desc-field').value = item.desc;
        document.getElementById('edit-longdesc-field').value = item.longdesc;
        document.getElementById('edit-img-field').value = item.img;
        document.getElementById('edit-gal1-field').value = item.gal1;
        document.getElementById('edit-gal2-field').value = item.gal2;
        document.getElementById('edit-gal3-field').value = item.gal3;
        span.onclick = function() {
            modal.style.display = "none";
        }
        const saveButton = document.getElementById('save-button');
        saveButton.addEventListener("click", () => {
            let editNameValue = document.getElementById('edit-name-field').value.toLowerCase();    
            let editPriceValue = document.getElementById('edit-price-field').value;
            let editDescValue = document.getElementById('edit-desc-field').value;
            let editLongdescValue = document.getElementById('edit-longdesc-field').value;
            let editImgValue = document.getElementById('edit-img-field').value;
            let editGal1Value = document.getElementById('edit-gal1-field').value;
            let editGal2Value = document.getElementById('edit-gal2-field').value;
            let editGal3Value = document.getElementById('edit-gal3-field').value;
            if (editNameValue.trim() === "" || editDescValue.trim() === "" || editLongdescValue.trim() === "" || editImgValue.trim() === "" || editGal1Value.trim() === "" || editGal2Value.trim() === "" || editGal3Value.trim() === "" || editPriceValue === 0 || isNaN(editPriceValue)) {
                alert("Por favor, complete todas las secciones.");
            } else {
                let item = {
                    name: editNameValue,
                    price: editPriceValue,
                    desc: editDescValue,
                    longdesc: editLongdescValue,
                    img: editImgValue,            
                    gal1: editGal1Value,
                    gal2: editGal2Value,
                    gal3: editGal3Value,
                };
                const itemRef = ref(database, 'items/' + id);
                update(itemRef, item);
                modal.style.display = "none";
            }
        });
    });

    

    itemEl.appendChild(deleteButton);
    itemEl.appendChild(editButton);
    itemsListEl.appendChild(itemEl);
}

// editing

