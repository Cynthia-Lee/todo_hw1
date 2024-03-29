'use strict'
/**
 * TodoListView.js
 * 
 * This class deals with the view of our Web application providing services
 * for loading data into our controls and building other UI controls.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListView {
    /**
     * This constructor initializes the view, keeping the model it will
     * use to pull data from to update the view.
     * 
     * @param {TodoListModel} initModel 
     */
    constructor(initModel) {
        this.model = initModel;
    }

    /**
     * Helper method for making and returning an HTML open tag.
     * 
     * @param {String} tagName HTML type of tag to make.
     */
    buildOpenTag(tagName) {
        return "<" + tagName + ">";
    }

    /**
     * Helper method for making and returing an HTML close tag.
     * 
     * @param {String} tagName HTML type of tag to make.
     */
    buildCloseTag(tagName) {
        return "</" + tagName + ">";
    }

    /**
     * This function builds and returns a DIV for a card in the list. A card
     * is a row in the list that we can interact with and contains information about
     * the list item.
     * 
     * @param {TodoListItem} listItem Item in the list to build card for.
     * @param {Number} listItemIndex Index location in the list of the item.
     */
    buildListItem(listItem, listItemIndex) {
        let newItemDiv = document.createElement(TodoHTML.DIV);
        newItemDiv.setAttribute(TodoHTML.ID, TodoGUIId.ITEM_CARD_ + listItemIndex);
        newItemDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD);
        let itemArgs = [listItemIndex];
        this.setupCallback(newItemDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_EDIT_ITEM, itemArgs); // call edit item

        // WE'LL PUT ITEMS INTO THIS CARD IN A GRID
        // task name
        let descriptionDiv = document.createElement(TodoHTML.DIV);
        descriptionDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_DESCRIPTION);
        descriptionDiv.innerHTML = listItem.getDescription();

        // assigned to
        let assignedToDiv = document.createElement(TodoHTML.DIV);
        assignedToDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_ASSIGNED_TO);
        assignedToDiv.innerHTML =
            'Assigned To: ' + this.buildOpenTag(TodoHTML.STRONG) + listItem.getAssignedTo() + this.buildCloseTag(TodoHTML.STRONG);

        // status
        let completedDiv = document.createElement(TodoHTML.DIV);
        if (listItem.isCompleted()) {
            completedDiv.innerHTML += "Completed";
            completedDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_COMPLETED);
        }
        else {
            completedDiv.innerHTML += "Pending";
            completedDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_NOT_COMPLETED);
        }

        // due date
        let dueDateDiv = document.createElement(TodoHTML.DIV);
        dueDateDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_DUE_DATE);
        dueDateDiv.innerHTML =
            listItem.getDueDate();

        // CARD TOOLBAR, ITEMS IN A GRID
        let listItemToolbarDiv = document.createElement(TodoHTML.DIV);
        listItemToolbarDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_TOOLBAR);
        // put items into this card in a grid
        
        // up button
        // let upButtonDiv = document.createElement(TodoHTML.DIV);
        let upButtonDiv = document.createElement(TodoHTML.DIV);
        upButtonDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_BUTTON);
        // upButtonDiv.setAttribute(TodoHTML.ID, TodoGUIId.LIST_ITEM_CARD_MOVE_UP); // added
        // upButtonDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_MOVE_UP);
        //upButtonDiv.innerHTML = this.buildOpenTag("button type='button' class='list_item_card_move_up'") + 
        //this.buildOpenTag("img src='images/icons/MoveUp.png' alt='up' class='icon_size_medium'")
        //+ this.buildCloseTag("button");
        upButtonDiv.innerHTML = "&#8679";
        this.setupCallback(upButtonDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_MOVE_ITEM_UP, itemArgs);

        // down button
        let downButtonDiv = document.createElement(TodoHTML.DIV);
        downButtonDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_BUTTON);
        downButtonDiv.innerHTML = "&#8681";
        this.setupCallback(downButtonDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_MOVE_ITEM_DOWN, itemArgs);

        // delete button
        let deleteButtonDiv = document.createElement(TodoHTML.DIV);
        deleteButtonDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_CARD_BUTTON);
        deleteButtonDiv.innerHTML = this.buildOpenTag("div class='list_item_card_delete'") + "&#10005" + this.buildCloseTag("div");
        this.setupCallback(deleteButtonDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_DELETE_ITEM, itemArgs); // itemArgs

        // THESE THREE SPANS GO IN THE DETAILS DIV
        newItemDiv.appendChild(descriptionDiv);
        newItemDiv.appendChild(assignedToDiv);
        newItemDiv.appendChild(completedDiv);
        newItemDiv.appendChild(dueDateDiv);
        // toolbar
        newItemDiv.appendChild(listItemToolbarDiv);
        // toolbar buttons
        listItemToolbarDiv.appendChild(upButtonDiv);
        listItemToolbarDiv.appendChild(downButtonDiv);
        listItemToolbarDiv.appendChild(deleteButtonDiv);

        if (listItemIndex == 0) {
            upButtonDiv.classList.add(TodoGUIClass.DISABLED);  
            // event.stopPropagation();
        }

        let editedListLength = window.todo.model.listToEdit.items.length;
        //alert(editedListLength);
        if (listItemIndex == editedListLength - 1) {
            downButtonDiv.classList.add(TodoGUIClass.DISABLED); 
        }

        return newItemDiv;
    }

    /**
     * This function builds and returns a DIV with the header in the
     * table of cards for the todo list.
     */
    buildListItemsHeader() {
        // WE'LL PUT ITEMS INTO THIS CARD IN A GRID
        let listItemHeaderDiv = document.createElement(TodoHTML.DIV);
        listItemHeaderDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_HEADER_CARD);

        // WE'LL PUT ITEMS INTO THIS CARD IN A GRID
        let taskHeaderDiv = document.createElement(TodoHTML.DIV);
        taskHeaderDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_TASK_HEADER);
        taskHeaderDiv.innerHTML = "Task";
        let callbackArguments = [];
        this.setupCallback(taskHeaderDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_SORT_ITEMS_BY_TASK, callbackArguments);

        // Due Date Header
        let dueHeaderDiv = document.createElement(TodoHTML.DIV);
        dueHeaderDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_DUE_DATE_HEADER);
        dueHeaderDiv.innerHTML = "Due Date";
        this.setupCallback(dueHeaderDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_SORT_ITEMS_BY_DUE_DATE, callbackArguments);

        let statusHeaderDiv = document.createElement(TodoHTML.DIV);
        statusHeaderDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_STATUS_HEADER);
        statusHeaderDiv.innerHTML = 'Status';
        this.setupCallback(statusHeaderDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_SORT_ITEMS_BY_STATUS, callbackArguments);

        // THESE GO IN THE DETAILS DIV
        listItemHeaderDiv.appendChild(taskHeaderDiv);
        listItemHeaderDiv.appendChild(statusHeaderDiv);
        listItemHeaderDiv.appendChild(dueHeaderDiv);
        return listItemHeaderDiv;
    }

    /**
     * This method is for building and returning a link on the front page
     * of the app. One will be built for each list.
     * 
     * @param {String} listName Name of the list to appear in the link.
     */
    buildListLink(listName) {
        let newA = document.createElement(TodoHTML.A);
        newA.setAttribute(TodoHTML.CLASS, TodoGUIClass.HOME_LIST_LINK);
        newA.setAttribute('href', '#');
        newA.innerHTML = listName;
        let br = document.createElement(TodoHTML.BR);
        newA.appendChild(br);
        let callbackArguments = [listName];
        this.setupCallback(newA, TodoHTML.ONCLICK, TodoCallback.PROCESS_EDIT_LIST, callbackArguments);
        return newA;
    }

    /**
     * This method is for taking the list item data out of the listToLoad
     * object and putting it into controls in the list screen.
     * 
     * @param {TodoList} listToLoad 
     */
    loadItems(listToLoad) {
        let listItemsDiv = document.getElementById(TodoGUIId.LIST_ITEMS_CONTAINER);
        this.removeAllChildren(listItemsDiv);

        let listItemsHeaderDiv = this.buildListItemsHeader();
        listItemsDiv.appendChild(listItemsHeaderDiv); // load the list header (task, due date, status)

        // LOAD THE ITEM CARDS
        for (let i = 0; i < listToLoad.items.length; i++) {
            let item = listToLoad.items[i];
            let itemCard = this.buildListItem(item, i);
            listItemsDiv.appendChild(itemCard);
        }

        // Load the item card add new item button
        // LIST_ITEM_ADD_CARD
        let addCardDiv = document.createElement(TodoHTML.DIV);
        addCardDiv.setAttribute(TodoHTML.CLASS, TodoGUIClass.LIST_ITEM_ADD_CARD);
        addCardDiv.innerHTML = "&#43";
        let callbackArguments = [];
        this.setupCallback(addCardDiv, TodoHTML.ONCLICK, TodoCallback.PROCESS_CREATE_NEW_ITEM, callbackArguments);
        listItemsDiv.appendChild(addCardDiv);
    }

    /**
     * This method is for taking the data out of the listToLoad
     * object and putting it into the appropriate controls in the list screen.
     * 
     * @param {TodoList} listToLoad 
     */
    loadListData(listToLoad) {
        // List Name
        let listNameTextField = document.getElementById(TodoGUIId.LIST_NAME_TEXTFIELD);
        listNameTextField.value = listToLoad.getName();
        // List Owner
        let listOwnerTextField = document.getElementById(TodoGUIId.LIST_OWNER_TEXTFIELD);
        listOwnerTextField.value = listToLoad.getOwner();
        this.loadItems(listToLoad);
    }

    /**
     * This method goes through all the todo lists managed by this application
     * and one at time extracts the name of each and then creates a link for
     * each on the welcome page such that the user may edit one of them.
     * 
     * @param {Array} todoLists 
     */
    loadListLinks(todoLists) {
        let yourListsList = document.getElementById(TodoGUIId.HOME_YOUR_LISTS_LIST);
        this.removeAllChildren(yourListsList);
        for (let i = 0; i < todoLists.length; i++) {
            let todoList = todoLists[i];
            this.appendListLink(todoList);
        }
    }

    /**
     * This method appends a link to the welcome page for the listToAppend argument provided.
     * 
     * @param {TodoList} listToAppend 
     */
    appendListLink(listToAppend) {
        let yourListsList = document.getElementById(TodoGUIId.HOME_YOUR_LISTS_LIST);
        let listName = listToAppend.getName();
        let newA = this.buildListLink(listName);
        yourListsList.appendChild(newA);
        let newBr = document.createElement(TodoHTML.BR);
        yourListsList.appendChild(newBr);
    }

    /**
     * This method goes through the node argument and removes all its child nodes.
     * 
     * @param {Node} node 
     */
    removeAllChildren(node) {
        if (!node)
            console.log("WHAT?");
        let child = node.firstElementChild;
        while (child) {
            child.remove();
            child = node.firstElementChild;
        }
    }

    /**
     * This method sets up a callback method for an element, registering the
     * elementCallbackName (e.g. click) function for the element control in the DOM, specifying
     * callbackFunctionName as the method to be called when that event occurs. The
     * args array is used to pass needed data to the callback.
     * 
     * @param {Element} element 
     * @param {String} elementCallbackName 
     * @param {String} callbackFunctionName 
     * @param {String[]} args 
     */
    setupCallback(element, elementCallbackName, callbackFunctionName, args) {
        let functionCallText = callbackFunctionName + "(";
        for (let i = 0; i < args.length; i++) {
            functionCallText += "'" + args[i] + "'";
            if (i < (args.length - 1)) {
                functionCallText += ", ";
            }
        }
        functionCallText += ")";
        element.setAttribute(elementCallbackName, functionCallText);
        return functionCallText;
    }

    /**
     * This method is for toggling the element argument to show it or hide it.
     * 
     * @param {Element} element 
     * @param {Boolean} show 
     */
    showElement(element, show) {
        if (!element)
            console.log("WHAT?");
        element.hidden = !show;
        if (show)
            console.log(element);

        // NOW HIDE FROM ALL THE CHILDREN
        if (element.hasChildNodes()) {
            for (let i = 0; i < element.childNodes.length; i++) {
                var child = element.childNodes[i];
                this.showElement(child, show);
            }
        }
    }

    /**
     * This method is for toggling the element in the DOM with the elementId id to
     * show it or hide it.
     * 
     * @param {String} elementId 
     * @param {Boolean} show 
     */
    showElementWithId(elementId, show) {
        let element = document.getElementById(elementId);
        this.showElement(element, show);
    }

    /**
     * This method is for hiding the yes/no dialog.
     */
    hideDialog() {
        let dialog = document.getElementById(TodoGUIId.MODAL_YES_NO_DIALOG);
        dialog.classList.remove(TodoGUIClass.IS_VISIBLE);
        // added for task 2
        dialog.classList.add(TodoGUIClass.IS_HIDDEN);
        // allow modal and modal buttons to be clicked 
        dialog.classList.remove("modal_container_open");
    }

    /**
     * This method is for showing the yes/no dialog.
     */
    showDialog() {
        let dialog = document.getElementById(TodoGUIId.MODAL_YES_NO_DIALOG);
        dialog.classList.add(TodoGUIClass.IS_VISIBLE);
        // added for task 2
        dialog.classList.remove(TodoGUIClass.IS_HIDDEN);
        window.todo.view.showElementWithId(TodoGUIId.MODAL_YES_NO_DIALOG, true);
        // allow modal and modal buttons to be clicked 
        dialog.classList.add("modal_container_open");
    }

    /**
     * This function can be used to disable on of the three buttons for each
     * list item, which are for moving an item up or down or for removing it.
     * 
     * @param {Number} itemIndex 
     * @param {TodoGUIId} buttonType 
     */
    disableButton(itemIndex, buttonType) {
        let buttonId = TodoGUIId.ITEM_CARD_ + itemIndex + buttonType;
        let button = document.getElementById(buttonId);
        button.classList.add(TodoGUIClass.DISABLED);        
    }

    /**
     * This function can be used to enable one of the three buttons for each
     * list item, which are for moving an item up or down or for removing it.
     * 
     * @param {Number} itemIndex 
     * @param {TodoGUIId} buttonType 
     */
    enableButton(itemIndex, buttonType) {
        let buttonId = TodoGUIId.ITEM_CARD_ + itemIndex + buttonType;
        let button = document.getElementById(buttonId);
        button.classList.remove(TodoGUIClass.DISABLED);        
    }
}