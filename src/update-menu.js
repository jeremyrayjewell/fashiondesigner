import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { getDatabase, ref, push, onValue, remove, update, orderByChild, startAt } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

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
const itemsInDB = ref(database, "items");
const menuItemsInDB = ref(database, "menu-items");

// const itemsListEl = document.getElementById("items-list")
const onMenuItemsListEl = document.getElementById('on-menu-items-list');
const offMenuItemsListEl = document.getElementById('off-menu-items-list');

//ON MENU

onValue(itemsInDB, (snapshot) => {
    const onMenuItems = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        const id = childSnapshot.key;

        onMenuItems.push({ ...item, id });
    });

    // Sort onMenuItems by priority
    onMenuItems.sort((b, a) => a.priority - b.priority);

    // Render onMenuItems
    onMenuItemsListEl.innerHTML = '';
    onMenuItems.forEach((item) => renderOnMenuItems(item));
});


function renderOnMenuItems(item) {
    const itemEl = document.createElement("li");


        itemEl.style.position = "relative"; 

        const shadingEl = document.createElement("div");
        shadingEl.style.position = "absolute";
        shadingEl.style.top = "0";
        shadingEl.style.right = "0";
        shadingEl.style.bottom = "0";
        shadingEl.style.left = "0";
        shadingEl.style.backgroundColor = "green";
        shadingEl.style.opacity = "0.15";
        itemEl.appendChild(shadingEl);

        itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        </li></ol><br>
        <p>${item.priority}</p>`
        ;
        const offOfMenuButton = document.createElement("button");
        offOfMenuButton.style.backgroundColor = "red";
        offOfMenuButton.style.color = "red";
        offOfMenuButton.style.border = "none";
        offOfMenuButton.style.padding = "5px";
        offOfMenuButton.style.width = "37px";
        offOfMenuButton.style.height = "37px";
        offOfMenuButton.style.opacity = "0.2";
        offOfMenuButton.style.margin = "0px 20px 50px";
        offOfMenuButton.textContent = "❌";
        offOfMenuButton.style.fontSize = "20px";
        offOfMenuButton.className = "off-menu-button"; 
        offOfMenuButton.addEventListener('mouseover', function() {
            this.style.opacity = "0.5";
        });
        offOfMenuButton.addEventListener('mouseout', function() {
            this.style.opacity = "0.2";
        });           
        offOfMenuButton.addEventListener("click", () => {
            const itemRef = ref(database, 'items/' + item.id);
            const menuItemRef = ref(database, 'menu-items/' + item.id);

            // Remove the item from the items table
            remove(itemRef)
                .then(() => {
                    // Reset the item's priority
                    item.priority = 0;

                    // Add the item to the menu-items table
                    update(menuItemRef, item)
                        .then(() => {
                            // You can use onValue here if you want to listen for changes
                            onValue(menuItemRef, (snapshot) => {
                                const data = snapshot.val();
                                // Do something with data
                            });
                        });
                });
        });
    
        const upMenuButton = document.createElement("button");
        upMenuButton.style.backgroundColor = "blue";
        upMenuButton.style.color = "blue";
        upMenuButton.style.border = "none";
        upMenuButton.style.padding = "5px";
        upMenuButton.style.width = "37px";
        upMenuButton.style.height = "37px";
        upMenuButton.style.opacity = "0.2";
        upMenuButton.style.margin = "0px 0px 50px";
        upMenuButton.textContent = "🔺";
        upMenuButton.style.fontSize = "20px";
        upMenuButton.className = "up-menu-button";
        upMenuButton.addEventListener('mouseover', function() {
            this.style.opacity = "0.4";
        });
        upMenuButton.addEventListener('mouseout', function() {
            this.style.opacity = "0.2";
        });                
        let itemsArray = []; // Assume this is your array of items

        upMenuButton.addEventListener("click", () => {
            const updatedPriority = item.priority + 2;
            update(ref(database, 'items/' + item.id), {
                priority: updatedPriority
            }).then(() => {
                fetchUpdatedData();
            });
        });

        const downMenuButton = document.createElement("button");
        downMenuButton.style.backgroundColor = "blue";
        downMenuButton.style.color = "blue";
        downMenuButton.style.border = "none";
        downMenuButton.style.padding = "5px";
        downMenuButton.style.width = "37px";
        downMenuButton.style.height = "37px";
        downMenuButton.style.opacity = "0.2";
        downMenuButton.style.margin = "0px 5px 50px";
        downMenuButton.textContent = "🔻";
        downMenuButton.style.fontSize = "20px";
        downMenuButton.className = "down-menu-button";
        downMenuButton.addEventListener('mouseover', function() {
            this.style.opacity = "0.4";
        });
        downMenuButton.addEventListener('mouseout', function() {
            this.style.opacity = "0.2";
        });                
        downMenuButton.addEventListener("click", () => {
            const updatedPriority = item.priority - 2;
            update(ref(database, 'items/' + item.id), {
                priority: updatedPriority
            }).then(() => {
                fetchUpdatedData();
            });
        });

        itemEl.appendChild(offOfMenuButton);

        itemEl.appendChild(upMenuButton);

        itemEl.appendChild(downMenuButton);

        onMenuItemsListEl.appendChild(itemEl);
    }




// OFF MENU

onValue(menuItemsInDB, (snapshot) => {
    const offMenuItems = [];

    snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        const id = childSnapshot.key;

        if (item.priority <= 0) {
            offMenuItems.push({ ...item, id });
        }
    });

    // Clear existing items from the DOM
    offMenuItemsListEl.innerHTML = '';

    // Render new items
    offMenuItems.forEach(renderOffMenuItems);
});

function renderOffMenuItems(item) {
    const itemEl = document.createElement("li");
        itemEl.style.position = "relative"; 

        const shadingEl = document.createElement("div");
        shadingEl.style.position = "absolute";
        shadingEl.style.top = "0";
        shadingEl.style.right = "0";
        shadingEl.style.bottom = "0";
        shadingEl.style.left = "0";
        shadingEl.style.backgroundColor = "red";
        shadingEl.style.opacity = "0.2";
        itemEl.appendChild(shadingEl);

        itemEl.innerHTML += ` 
        <img src="../${item.img}" width="150" height="75">
        <span style="font-weight: bold; font-size: 25px;">${item.name} </span> <code>&#8212;</code> ₲${item.price} 
        </li></ul>`
        ;

        const ontoMenuButton = document.createElement("button");
        ontoMenuButton.style.backgroundColor = "green";
        ontoMenuButton.style.color = "white";
        ontoMenuButton.style.border = "none";
        ontoMenuButton.style.padding = "5px";
        ontoMenuButton.style.width = "37px";
        ontoMenuButton.style.height = "37px";
        ontoMenuButton.style.opacity = "0.2";
        ontoMenuButton.style.margin = "0px 20px 50px";
        ontoMenuButton.textContent = "🍽️";
        ontoMenuButton.style.fontSize = "20px";
        ontoMenuButton.className = "on-menu-button";
        ontoMenuButton.addEventListener('mouseover', function() {
            this.style.opacity = "0.5";
        });
        ontoMenuButton.addEventListener('mouseout', function() {
            this.style.opacity = "0.2";
        });            
        ontoMenuButton.addEventListener("click", () => {
            const itemRef = ref(database, 'items/' + item.id);
            const menuItemRef = ref(database, 'menu-items/' + item.id);

            // Remove the item from the menu-items table
            remove(menuItemRef)
                .then(() => {
                    // Add the item to the items table
                    update(itemRef, item)
                        .then(() => {
                            // You can use onValue here if you want to listen for changes
                            onValue(itemRef, (snapshot) => {
                                const data = snapshot.val();
                                // Do something with data
                            });
                        });
                });
        });
    itemEl.appendChild(ontoMenuButton);
    offMenuItemsListEl.appendChild(itemEl);
}

function fetchUpdatedData() {
    onValue(itemsInDB, (snapshot) => {
        const onMenuItems = [];

        snapshot.forEach((childSnapshot) => {
            const item = childSnapshot.val();
            const id = childSnapshot.key;

            onMenuItems.push({ ...item, id });
        });

        // Sort onMenuItems by priority in descending order
        onMenuItems.sort((a, b) => b.priority - a.priority);

        // Render onMenuItems
        onMenuItemsListEl.innerHTML = '';
        onMenuItems.forEach((item) => renderOnMenuItems(item));
    });
}