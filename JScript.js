import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-91fda-default-rtdb.europe-west1.firebasedatabase.app"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl=document.getElementById("shopping-list");


function clearShoppingListEl() { 
    shoppingListEl.innerHTML ='';
 }

function clearInputFieldEl(){
    inputFieldEl.value ='';
}

function appendItemToShoppingListEl(item){
    
    let itemID = item[0];
    let itemValue = item[1];
    let newEl = document.createElement("li");
    newEl.textContent = itemValue;
    shoppingListEl.append(newEl)

    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        /* if(confirm(`Do you want to remove "${itemValue}"?`)==true){
         remove(exactLocationOfItemInDB);
           } */
           myConfirmBox(`Do you want to remove "${itemValue}"?`).then(response=>{
            if(response) // true or false response from the user
            remove(exactLocationOfItemInDB);
            
        })
    })

}
addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    push(shoppingListInDB, inputValue);
    
    clearInputFieldEl();
})

onValue(shoppingListInDB, function(snapshot) {
   
   if(snapshot.exists()){

        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();

        for (let i = 0; i < itemsArray.length; i++) 
            {
                let currentItem = itemsArray[i];
                let currentItemID = currentItem[0];
                let currentItemValue = currentItem[1]; 

                appendItemToShoppingListEl(currentItem);
            }
    }else{
            shoppingListEl.innerHTML = "No items here ... yet!"
    }   
})





function myConfirmBox(message) {
    let element = document.createElement("div");
    element.classList.add("box-background");
    element.innerHTML = `<div class="box">
                            ${message}
                            <div>
                                <button id="trueButton" class="btn green">Yes</button> <!-- Set Id for both buttons -->
                                <button id="falseButton" class="btn red">No</button>
                            </div>
                        </div>`;
    document.body.appendChild(element);
    return new Promise(function (resolve, reject) {
        document.getElementById("trueButton").addEventListener("click", function () {
            resolve(true);
            document.body.removeChild(element);
        });
        document.getElementById("falseButton").addEventListener("click", function () {
            resolve(false);
            document.body.removeChild(element);
        });
    })
}

