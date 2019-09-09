'use strict'
/**
 * TodoListController.js
 * 
 * This file provides responses for all user interface interactions.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListController {
    /**
     * The constructor sets up all event handlers for all user interface
     * controls known at load time, meaning the controls that are declared 
     * inside index.html.
     */
    constructor() {
        // SETUP ALL THE EVENT HANDLERS FOR EXISTING CONTROLS,
        // MEANING THE ONES THAT ARE DECLARED IN index.html

        // FIRST THE NEW LIST BUTTON ON THE HOME SCREEN
        this.registerEventHandler(TodoGUIId.HOME_NEW_LIST_BUTTON, TodoHTML.CLICK, this[TodoCallback.PROCESS_CREATE_NEW_LIST]);

        // THEN THE CONTROLS ON THE LIST SCREEN
        this.registerEventHandler(TodoGUIId.LIST_HEADING, TodoHTML.CLICK, this[TodoCallback.PROCESS_GO_HOME]);
        this.registerEventHandler(TodoGUIId.LIST_NAME_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_NAME]); // Name

        // Owner TextField
        this.registerEventHandler(TodoGUIId.LIST_OWNER_TEXTFIELD, TodoHTML.KEYUP, this[TodoCallback.PROCESS_CHANGE_OWNER]);

        // Trash Can
        this.registerEventHandler(TodoGUIId.LIST_TRASH, TodoHTML.CLICK, this[TodoCallback.PROCESS_DELETE_LIST]);

    }

    /**
     * This function helps the constructor setup the event handlers for all controls.
     * 
     * @param {TodoGUIId} id Unique identifier for the HTML control on which to
     * listen for events.
     * @param {TodoHTML} eventName The type of control for which to respond.
     * @param {TodoCallback} callback The callback function to be executed when
     * the event occurs.
     */
    registerEventHandler(id, eventName, callback) {
        // GET THE CONTROL IN THE GUI WITH THE CORRESPONDING id
        let control = document.getElementById(id);

        // AND SETUP THE CALLBACK FOR THE SPECIFIED EVENT TYPE
        control.addEventListener(eventName, callback);
    }

    /**
     * This function responds to when the user changes the
     * name of the list via the textfield.
     */
    processChangeName() {
        let nameTextField = document.getElementById(TodoGUIId.LIST_NAME_TEXTFIELD);
        let newName = nameTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListName(listBeingEdited, newName);
    }

    /** 
     * HW #1. Task 1
     * Each List Should Have an Owner - 
     * each list currently has a name, make sure each list also has an Owner (i.e. a person's name) that can be edited in a text field beside the list name.
     */

    /**
     * This function responds to when the user changes the
     * owner of the list via the textfield.
     */
    processChangeOwner() {
        let ownerTextField = document.getElementById(TodoGUIId.LIST_OWNER_TEXTFIELD);
        let newOwner = ownerTextField.value;
        let listBeingEdited = window.todo.model.listToEdit;
        window.todo.model.updateListOwner(listBeingEdited, newOwner);
    }

    /**
     * This function is called when the user requests to create
     * a new list.
     */
    processCreateNewList() {
        // MAKE A BRAND NEW LIST
        window.todo.model.loadNewList();

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /**
     * This function responds to when the user clicks on a link
     * for a list on the home screen.
     * 
     * @param {String} listName The name of the list to load into
     * the controls on the list screen.
     */
    processEditList(listName) {
        // LOAD THE SELECTED LIST
        window.todo.model.loadList(listName);

        // CHANGE THE SCREEN
        window.todo.model.goList();
    }

    /** 
     * HW #1. Task 2
     * Add a Delete List Button to List Editing Screen - 
     * add a trash can button to the list edit screen such that when pressed it slides in a dialog to verify if one wishes to delete the list. 
     * If the user presses Yes, the list will be deleted and the user will be brought back to the Welcome screen. 
     * If the user presses No, the dialog will simply close. Note that your dialog must animated in and off screen. 
     * Also note your trash can should be located as shown in the GUI figures.
     */

    /**
     * This function responds to when the user clicks the trash can.
     */
    processDeleteList() {
        // Prompt window, slides a dialog
        // must be animated on and off screen

        /*
        if (confirm("Delete list?\nAre you sure you want to delete this list?\nThis list will not be retreivable.")) {
            this.processConfirmDeleteList();
        } else {
            this.processCancelDeleteList();
        }
        */
        if (confirm("Delete list?\nAre you sure you want to delete this list?\nThis list will not be retreivable.")) {
            let listBeingEdited = window.todo.model.listToEdit;
            window.todo.model.removeList(listBeingEdited);
            window.todo.model.goHome();
        } else {
            
        }
    }

    // PROCESS_CONFIRM_DELETE_LIST: "processConfirmDeleteList",
    // PROCESS_CANCEL_DELETE_LIST: "processCancelDeleteList",

    processConfirmDeleteList() {
        //let listBeingEdited = window.todo.model.listToEdit;
        //alert(listBeingEdited.name);
        //window.todo.model.removeList(listBeingEdited);
        //window.todo.model.goHome();
    }

    processCancelDeleteList() {

    }

    processMoveItemUp(itemArgs) {
        // itemArgs is the item card index
        let listBeingEdited = window.todo.model.listToEdit;
        let itemsArray = listBeingEdited.items;
        // swap
        // A is item at itemArgs
        // B, A. temp = B
        // A, A
        // A, temp = B
        let prevIndex = Number(itemArgs) - 1;
        let temp = listBeingEdited.getItemAtIndex(prevIndex);
        itemsArray[prevIndex] = listBeingEdited.getItemAtIndex(itemArgs);
        itemsArray[itemArgs] = temp;
        // update list
        window.todo.model.loadList(listBeingEdited.getName());
    }

    processMoveItemDown(itemArgs) {
        // itemArgs is the item card index
        let listBeingEdited = window.todo.model.listToEdit;
        let itemsArray = listBeingEdited.items;
        // swap
        // A is item at itemArgs
        // A, B. temp = B
        // A, A
        // temp = B, A
        let nextIndex = Number(itemArgs) + 1;
        let temp = listBeingEdited.getItemAtIndex(nextIndex);
        itemsArray[nextIndex] = listBeingEdited.getItemAtIndex(itemArgs);
        itemsArray[itemArgs] = temp;
        // update list
        window.todo.model.loadList(listBeingEdited.getName());
    }

    processDeleteItem(itemArgs) {
        // itemArgs is the item card index
        let listBeingEdited = window.todo.model.listToEdit;
        let itemBeingEdited = listBeingEdited.getItemAtIndex(itemArgs);
        listBeingEdited.removeItem(itemBeingEdited);
        // update list
        window.todo.model.loadList(listBeingEdited.getName());
        // console.log(listBeingEdited.items.length);
    }

    processEditItem(itemArgs) {
        // itemArgs is the item card index
        // alert(itemArgs);
        // alert(itemArgs.length);
    }

    /**
     * This function responds to when the user clicks on the
     * todo logo to go back to the home screen.
     */
    processGoHome() {
        window.todo.model.goHome();
    }

    /**
     * This function is called in response to when the user clicks
     * on the Task header in the items table.
     */
    processSortItemsByTask() {
        // IF WE ARE CURRENTLY INCREASING BY TASK SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_TASK_INCREASING);
        }
    }

    /**
     * This function is called in response to when the user clicks
     * on the Status header in the items table.
     */
    processSortItemsByStatus() {
        // IF WE ARE CURRENTLY INCREASING BY STATUS SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_DECREASING);
        }
        // ALL OTHER CASES SORT BY INCRASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_STATUS_INCREASING);
        }
    }

    // HW #1. Task 3
    /**
     * This function is called in response when the user clicks
     * on the Due Date header in the items table.
     */
    processSortItemsByDueDate() {
        // IF WE ARE CURRENTLY INCREASING BY STATUS SWITCH TO DECREASING
        if (window.todo.model.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING)) {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING);
        } 
        // ALL OTHER CASES SORT BY INCREASING
        else {
            window.todo.model.sortTasks(ItemSortCriteria.SORT_BY_DUE_DATE_INCREASING);
        }

    }
}