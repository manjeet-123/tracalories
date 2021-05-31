// storage controller.......................................
const StorageCtrl = (function(){

    // public method
    return {
        storeItem : function(item){
            let items ;
            // check if any item in local storage
            if(localStorage.getItem('items') === null){
            items = [];
            // push new item
            items.push(item);
            // set ls
            localStorage.setItem('items',JSON.stringify(items));
            }else{
                // get what is already in ls
                items= JSON.parse(localStorage.getItem('items'));
                // push new item
                items.push(item);
                // re set ls
                localStorage.setItem('items',JSON.stringify(items));

            }

        },
        getItemsFromStorage:function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];

            }else{
                
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
       updateItemFromStorage:function(updateItem){
           let items = JSON.parse(localStorage.getItem('items'));

           items.forEach(function(item,index){
               if(updateItem.id === item.id){
                   items.splice(index , 1, updateItem);
               }
           });
           localStorage.setItem('items',JSON.stringify(items));
       },
        deleteItemFromStorage:function(id){
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index , 1, );
                }
            });
            localStorage.setItem('items',JSON.stringify(items));

        },
        clearItemFromStorage:function(){
            localStorage.removeItem('items');
        },
    }
})();



// item controller......................................................................
const ItemCtrl =(function(){
// item constructor
    const Item = function(id, name , calories){
        this.id = id;
        this.name=name;
        this.calories=calories;
        
    }
// data constructor.........
const data ={
    // items:[
    //     // {id:0,name:'streak dinner',calories:1200},  
    //     // {id:1,name:'lunch meal',calories:1000},
    //     // {id:2,name:'morning shake',calories:750}
    // ],

    items:StorageCtrl.getItemsFromStorage(),
    currentItem :null,
    totalCalories :0
}
 return {
     getData: function(){
         return data.items;

     },
     addItem:function(name , calories){
    //    create id?
if(data.items.length > 0 ){
    ID = data.items[data.items.length - 1].id +1;

}else{
    ID = 0;
}

// create add calories
calories = parseInt(calories);

//create new item to store the input...
newItem = new Item(ID , name , calories);

// push the data on newitem
data.items.push(newItem);

return newItem;
     },
     getItemById:function(id){

        let found = null;
        data.items.forEach(function(item){
            if(item.id ===id){
                found= item;
            }

        });
        return found;
     },
    
     updateItem:function(name , calories){
        //  calories to number....
        calories = parseInt(calories);
        let found= null;
        data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
         item.name = name;
         item.calories =  calories;
          found = item ;
}
        });
        return found;
     },
     deleteItem:function(id){
        //  get ids
        const ids = data.items.map(function(item){
            return item.id;
        }); 
        // get index
        const index = ids.indexOf(id);
        // remove item
        data.items.splice(index , 1);
     },
     clearAllItems:function(){
         data.items= [];
     },

     setCurrentItem: function(item){
         data.currentItem= item;

     },
     getCurrentItem:function(){
         return data.currentItem;

     },
     getTotalCalories:function(){
         let total = 0;
         data.items.forEach(function(item){
             total += item.calories;
         });

         data.totalCalories= total;
         
         return data.totalCalories;

     },

     logData:function(){
         return data;
     }
 }

})();





// UI controller/...........................................................................
const UICtrl =(function(){

    const UIselector= {
        itemList: '#item-list',
        listItems:'#item-list li',
        addBtn:'.add-btn',
        updateBtn:'.update-btn',
        deleteBtn:'.delete-btn',
        backBtn:'.back-btn',
        clearBtn:'.clear-btn',
        itemNameInput: '#item-name',
        itemCalorieInput: '#item-calories',
        totalCalories:'.total-calories'
    }

    return{
        populateItemList: function(items){
            let html='';
            items.forEach(function(item){
                html +=` <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}:</strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            </li>`;
            });
            document.querySelector(UIselector.itemList).innerHTML = html;
        },
        
        getItemInput:function(){
            return {
                name:document.querySelector(UIselector.itemNameInput).value,
                calories:document.querySelector(UIselector.itemCalorieInput).value
            }
        },
      
        addListItem:function(item){
            // shoe item list 
            
            document.querySelector(UIselector.itemList).style.display ='block';
            // create a list item
            const li = document.createElement('li');
// give a class 
            li.className='collection-item';
// give a id
            li.id= `item-${item.id}`;
// insert item in html
            li.innerHTML=` <strong>${item.name}:</strong> <em>${item.calories} calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            document.querySelector(UIselector.itemList).insertAdjacentElement('beforeend',li);
        },
        updateListItem:  function(item){
            let listItems = document.querySelectorAll(UIselector.listItems);
            // trun node list into array
            listItems = Array.from(listItems);
            

            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');

                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML= `<strong>${item.name}:</strong> <em>${item.calories} calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });

        },
        deleteListItem:function(id){
           const itemID = `#item-${id}`;
           const item = document.querySelector(itemID);
           item.remove();

        },
        clearListItem:function(){
           
            document.querySelector(UIselector.itemNameInput).value = '';
            document.querySelector(UIselector.itemCalorieInput).value = '';
       
        },
        addItemToForm:function(){
   
            document.querySelector(UIselector.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UIselector.itemCalorieInput).value = ItemCtrl.getCurrentItem().calories;
          UICtrl.showEditState();

        },
        removeItems:function(){
            let listItems = document.querySelector(UIselector.listItems);

            // turn node lidt inyo array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();

            })
        },
        hideList: function(){
            document.querySelector(UIselector.itemList).style.display ='none';

        },
        showTotalCalories: function(totalCalories){
     document.querySelector(UIselector.totalCalories).textContent= totalCalories;
        },
        clearEditState:function(){
            UICtrl.clearListItem();
            document.querySelector(UIselector.updateBtn).style.display = 'none';
            document.querySelector(UIselector.deleteBtn).style.display = 'none';
            document.querySelector(UIselector.backBtn).style.display = 'none';
            document.querySelector(UIselector.addBtn).style.display = 'inline';
        },
        showEditState:function(){
            document.querySelector(UIselector.updateBtn).style.display = 'inline';
            document.querySelector(UIselector.deleteBtn).style.display = 'inline';
            document.querySelector(UIselector.backBtn).style.display = 'inline';
            document.querySelector(UIselector.addBtn).style.display = 'none';

        },

        getSelector:function(){
            return UIselector;
        }

    }


})();





//app controller........................................................................................
const app = (function(ItemCtrl ,StorageCtrl ,UICtrl){
 

    const loadEventListeners = function(){

        //add selector
        const UIselector = UICtrl.getSelector();

        // add item event.......
        document.querySelector(UIselector.addBtn).addEventListener('click',itemAddSubmit);


    //     // disable keypress
    //     document.addEventListener('keypress', function(e){
    //         if(e.keyboardEvent ===13 || e.UIEvent ===13){
    //       e.preventDefault();
    //         return false;

    //         }
    //    })
        // edit icon click 
        document.querySelector(UIselector.itemList).addEventListener('click', itemEditClick);

        // edit update button......
        document.querySelector(UIselector.updateBtn).addEventListener('click',itemUpdateSubmit);
   
          // edit back button......
          document.querySelector(UIselector.backBtn).addEventListener('click',UICtrl.clearListItem);
   
            // edit delete button......
        document.querySelector(UIselector.deleteBtn).addEventListener('click',itemDeleteSubmit);
   
         // edit clear button......
         document.querySelector(UIselector.clearBtn).addEventListener('click',clearAllItemClick);
   
        
    }

    //add item submit
    const itemAddSubmit = function(e){

        // get input from the ui controller.
        const input= UICtrl.getItemInput();
      
         //check for the namw and calorie input
         if( input.name !== '' && input.calories !== ''){

             const newItem = ItemCtrl.addItem(input.name , input.calories);
// get list item
             UICtrl.addListItem(newItem);
            // get total calories
             const totalCalories= ItemCtrl.getTotalCalories();
            // add total claories to UI
             UICtrl.showTotalCalories(totalCalories);

            //  store in local controller
            StorageCtrl.storeItem(newItem);


            //   clear fields
             UICtrl.clearListItem();
         }

        e.preventDefault();
    }
    // item edit click
    const itemEditClick = function(e){
        if(e.target.classList.contains('edit-item')){

        //    get list item id (item-0 , item-1)
        const listId = e.target.parentNode.parentNode.id;
       //brreak into the array
        const listArr = listId.split('-');
         //get the actual id
       const id= parseInt(listArr[1]);
       
       //get item
       const itemToEdit = ItemCtrl.getItemById(id);

       //    set current item 
        ItemCtrl.setCurrentItem(itemToEdit);

        UICtrl.addItemToForm();
      
}
        e.preventDefault();

    }

    // item update in list
    const itemUpdateSubmit = function(e){


        console.log('item');

        // get  input item
        const input = UICtrl.getItemInput();
        // update item

        const updateItem = ItemCtrl.updateItem(input.name ,input.calories);

        // update ui
        UICtrl.updateListItem(updateItem);

         // get total calories
         const totalCalories= ItemCtrl.getTotalCalories();
         // add total claories to UI
          UICtrl.showTotalCalories(totalCalories);

        //   update from local storage
        StorageCtrl.updateItemFromStorage(updateItem);
            //   clear fields
            UICtrl.clearListItem();


        e.preventDefault();
    }
    // delete button event....
    const itemDeleteSubmit = function(e){
        // get current item
         const currentItem =  ItemCtrl.getCurrentItem();

         // delete from the data structure
         ItemCtrl.deleteItem(currentItem.id );
        //  delte from ui...
         UICtrl.deleteListItem(currentItem.id);


             // get total calories
             const totalCalories= ItemCtrl.getTotalCalories();
             // add total claories to UI
              UICtrl.showTotalCalories(totalCalories);

            //   delete item from the local storage.
            StorageCtrl.deleteItemFromStorage(currentItem.id);
                //   clear fields
                UICtrl.clearListItem();
    
         
        
        e.preventDefault();
    }
    // clear item event.....
    const clearAllItemClick = function(){
        // clear all item from data structure..
        ItemCtrl.clearAllItems();

        // remove from ui
        UICtrl.removeItems();

          // get total calories
          const totalCalories= ItemCtrl.getTotalCalories();
          // add total claories to UI
           UICtrl.showTotalCalories(totalCalories);

        //    clear all item from the local storage
        StorageCtrl.clearItemFromStorage();

          //   clear fields
           UICtrl.clearListItem();
        //    hide the ul
        UICtrl.hideList();

    }



    return{
        init:function(){
            // clear edit state / set initial set 
            UICtrl.clearEditState();

        //   get data from item controller
            const items= ItemCtrl.getData();

            if(items.length=== 0){

UICtrl.hideList();
            }else{
                     // push data from ui controller
            UICtrl.populateItemList(items);
            }
                // // get total calories
                // const totalCalories= ItemCtrl.getTotalCalories();
                // // add total claories to UI
                //  UICtrl.showTotalCalories(totalCalories);
    
       

            // event listener
            loadEventListeners();
        }
    }

     

})(ItemCtrl,StorageCtrl,UICtrl);

//initialize app
app.init();

