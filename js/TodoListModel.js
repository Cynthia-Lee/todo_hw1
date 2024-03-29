'use strict'
/**
 * TodoListModel.js
 * 
 * This class provides access to all the data, meaning all of the lists. Note
 * that in order to make testing easier we are loading all the lists at the
 * start when the page first loads and then we can edit those lists one at a
 * time. If this were a site with a backend we would only load the lists as
 * needed.
 * 
 * This class provides methods for changing data, including things like the 
 * current navigation state and which list is being edited as well as access
 * to all the lists data.
 * 
 * Note that we are employing a Model-View-Controller (MVC) design strategy
 * here so that when data in this class changes it is immediately reflected
 * inside the view of the page.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
class TodoListModel {
    /**
     * 
     * @param {TodoListView} initView 
     */
    constructor(initView) {
        this.view = initView;

        // WE DON'T HAVE A DATABASE SO WE NEED TO KEEP
        // ALL OF THE LISTS WE MAKE HERE
        this.todoLists = new Array();

        // NO LIST IS BEING EDITED JUST YET
        this.listToEdit = null;

        // edit or add item flag
        // edit = true when you want to edit
        // edit = false when you want to add an item
        this.editItem = false;
    }

    /**
     * Set the list that is to be edited so we can update it as the user makes changes.
     * 
     * @param {TodoList} initListToEdit List to edit.
     */
    setListToEdit(initListToEdit) {
        this.listToEdit = initListToEdit;
        if (this.listToEdit) {
            this.moveListToTop(this.listToEdit);            
            this.view.loadListData(this.listToEdit);
        }
    }

    /**
     * Appends the list to the list of lists.
     * 
     * @param {TodoList} listToAppend List to append to the list of lists.
     */
    appendList(listToAppend) {
        this.todoLists.push(listToAppend);
        this.view.appendListLink(listToAppend);
    }

    /**
     * Prepends the list to the list of lists.
     * 
     * @param {TodoList} listToPrepend List to prepend to the list of lists.
     */
    prependList(listToPrepend) {
        this.todoLists.unshift(listToPrepend);
        this.view.loadListLinks(this.todoLists);
    }

    /**
     * Removes the list from the list of lists.
     * 
     * @param {TodoList} listToRemove List to remove, presumably it's been deleted.
     */
    removeList(listToRemove) {
        // REMOVE IT IF IT EXISTS
        let indexOfList = this.todoLists.indexOf(listToRemove);
        if (indexOfList >= 0)
            this.todoLists.splice(indexOfList, 1);
        this.view.loadListLinks(this.todoLists);
    }

    /**
     * Gets and returns the number of items in the list being edited.
     */
    getNumItems() {
        if (this.listToEdit) {
            return this.listToEdit.items.length;
        }
        else {
            return 0;
        }
    }

    /**
     * Tests to see if an item is being edited. If it is, true is returned,
     * else false.
     */
    isEditingItem() {
        return this.editItem != null;
    }

    /**
     * This function moves listToMove to the top of the list of lists
     * that can be edited, which will be reflected on the welcome page.
     */
    moveListToTop(listToMove) {
        // REMOVE THE LIST IF IT EXISTS
        this.removeList(listToMove);

        // AND THEN ADD IT TO THE TOP OF THE STACK
        this.prependList(listToMove);
    }

    /**
     * This function will navigate the user to the home (i.e. welcome) screen.
     */
    goHome() {
        // THIS COULD HAPPEN ANYWHERE SO HIDE ALL THE OTHERS
        this.view.showElementWithId(TodoGUIId.TODO_LIST, false);
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, false); // perhaps?
        this.view.showElementWithId(TodoGUIId.MODAL_YES_NO_DIALOG, false); // added for task 2

        // hide the top home gray bar 
        document.getElementById(TodoGUIId.TODO_HOME).style.visibility = "visible";

        // AND GO HOME
        this.view.showElementWithId(TodoGUIId.TODO_HOME, true);        
    }

    /**
     * This function will navigate the user to the edit item screen where they can edit an item.
     */
    goItem() {
        // hide the list screen
        this.view.showElementWithId(TodoGUIId.TODO_LIST, false);
        // hide home screen
        this.view.showElementWithId(TodoGUIId.TODO_HOME, false); // not working

        // hide the top home gray bar 
        document.getElementById(TodoGUIId.TODO_HOME).style.visibility = "hidden";

        // go to new screen
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, true)
    }
    /**
     * This function will navigate the user to the list screen where they
     * may edit a list.
     */
    goList() {
        // THIS MIGHT HAVE OCCURED FROM HOME SO HIDE HOME
        this.view.showElementWithId(TodoGUIId.TODO_HOME, false);
        this.view.showElementWithId(TodoGUIId.TODO_ITEM, false); // added for task 7

        // hide the top home gray bar 
        document.getElementById(TodoGUIId.TODO_HOME).style.visibility = "visible";

        // SHOW THE TOOLBAR AND LIST EDIT
        this.view.showElementWithId(TodoGUIId.TODO_LIST, true);
    }

    /**
     * Changes the name of the list being edited.
     * 
     * @param {TodoList} listBeingEdited List in the process of being edited.
     * @param {String} newName The new name of the list.
     */
    updateListName(listBeingEdited, newName) {
        // WE'RE GOING TO CHANGE THE NAME TOO BUT ONLY UPDATE
        // THE LIST OF LIST LINKS IF IT'S CHANGED
        if (listBeingEdited.getName() != newName) {
            listBeingEdited.setName(newName);
            this.view.loadListLinks(this.todoLists);
        }
    }

    /** 
     * HW #1. Task 1
     * Each List Should Have an Owner - 
     * each list currently has a name, make sure each list also has an Owner (i.e. a person's name) that can be edited in a text field beside the list name.
    */

    /**
     * Changes the owner of the list being edited.
     * 
     * @param {TodoList} listBeingEdited List in the process of being edited.
     * @param {String} newOwner The new owner of the list.
     */
    updateListOwner(listBeingEdited, newOwner) {
        if(listBeingEdited.getOwner() != newOwner) {
            listBeingEdited.setOwner(newOwner);
            this.view.loadListLinks(this.todoLists);
        }
    }

    /**
     * This method creates a new list and sets it up so that it
     * can be edited.
     */
    loadNewList() {
        this.listToEdit = new TodoList();
        this.prependList(this.listToEdit);
        this.view.loadListData(this.listToEdit);
    }

    /**
     * This method will retrieve the list stored under the listName id
     * and will load it so it is ready to edit.
     * 
     * @param {String} listName The name of the list to load.
     */
    loadList(listName) {
        // FIRST FIND THE LIST WITH THE GIVEN NAME
        let listToLoad = null;
        for (let i = 0; i < this.todoLists.length; i++) {
            let testList = this.todoLists[i]; 
            if (testList.getName() === listName) {
                listToLoad = testList;
                i = this.todoLists.length;
            }
        }

        if (listToLoad != null) {
            this.setListToEdit(listToLoad);
        }
    }

    /**
     * This method sorts the todo list items according to the provided sorting criteria.
     * 
     * @param {ItemSortCriteria} sortingCriteria Sorting criteria to use.
     */
    sortTasks(sortingCriteria) {
        this.currentItemSortCriteria = sortingCriteria;
        this.listToEdit.items.sort(this.compare);
        this.view.loadItems(this.listToEdit);
    }

    /**
     * This method tests to see if the current sorting criteria is the same as the argument.
     * 
     * @param {ItemSortCriteria} testCriteria Criteria to test for.
     */
    isCurrentItemSortCriteria(testCriteria) {
        return this.currentItemSortCriteria === testCriteria;
    }

    /**
     * This method compares two items for the purpose of sorting according to what
     * is currently set as the current sorting criteria.
     * 
     * @param {TodoListItem} item1 First item to compare.
     * @param {TodoListItem} item2 Second item to compare.
     */
    compare(item1, item2) {
        let thisModel = window.todo.model;

        // IF IT'S A DECREASING CRITERIA SWAP THE ITEMS
        if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_DUE_DATE_DECREASING)) {
            let temp = item1;
            item1 = item2;
            item2 = temp;
        }
        // SORT BY ITEM DESCRIPTION
        if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_INCREASING)
            || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_TASK_DECREASING)) {
            if (item1.getDescription() < item2.getDescription())
                return -1;
            else if (item1.getDescription() > item2.getDescription())
                return 1;
            else
                return 0;
        }
        // SORT BY COMPLETED
        else if (thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_INCREASING)
        || thisModel.isCurrentItemSortCriteria(ItemSortCriteria.SORT_BY_STATUS_DECREASING)) {
            if (item1.isCompleted() < item2.isCompleted())
                return -1;
            else if (item1.isCompleted() > item2.isCompleted())
                return 1;
            else
                return 0;
        } 
        // SORT BY DUE DATE
        else {
            if (item1.getDueDate() < item2.getDueDate())
                return -1;
            else if (item1.getDueDate() > item2.getDueDate())
                return 1;
            else 
                return 0;
        }
    }

    // task 7
    clearItemForm() {
        // description
        let description = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        this.clearInput(description);
        // assigned to
        let assignedTo = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        this.clearInput(assignedTo);
        // due date
        let dueDate = document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER);
        this.clearInput(dueDate);
        // completed
        let completedBox = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);
        completedBox.checked = false;
    }

    clearInput(input) {
        input.value = "";
    }

    // task 5 
    /*
    addEditItem(list, descript, assigned, due, completed) {
        let newItem = new TodoListItem();
        newItem.setDescription(descript);
        newItem.setAssignedTo(assigned);
        newItem.setCompleted(completed);
        newItem.setDueDate(due);

        list.addItem(newItem);
    }
    */
    /*
    addEditItem() {
        let listBeingEdited = window.todo.model.listToEdit;
        // description
        let description = document.getElementById(TodoGUIId.ITEM_DESCRIPTION_TEXTFIELD);
        let newDescription = description.value;
        // assigned to
        let assignedTo = document.getElementById(TodoGUIId.ITEM_ASSIGNED_TO_TEXTFIELD);
        let newAssignedTo = assignedTo.value;
        // due date
        let dueDate = document.getElementById(TodoGUIId.ITEM_DUE_DATE_PICKER);
        let newDueDate = dueDate.value;
        // completed
        let completedBox = document.getElementById(TodoGUIId.ITEM_COMPLETED_CHECKBOX);
        let newCompletedBox = completedBox.value;

        let newItem = new TodoListItem();
        newItem.setDescription(newDescription);
        newItem.setAssignedTo(newAssignedTo);
        newItem.setCompleted(itemData.completed);
        newItem.setDueDate(itemData.due_date);

        listBeingEdited.addItem(newItem);
    }
    */

}