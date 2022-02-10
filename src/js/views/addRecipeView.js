import View from "./view";

class AddRecipeView extends View{
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');

    constructor() {
        super();
        this._addHandlerShowWindow()
        this._addHandlerHideWindow()
    }

    _toggleWindow(){
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }


    _addHandlerShowWindow(){
        this._btnOpen.addEventListener('click',this._toggleWindow.bind(this))
    }

    _addHandlerHideWindow(){
        this._overlay.addEventListener('click',this._toggleWindow.bind(this))
        this._btnClose.addEventListener('click',this._toggleWindow.bind(this))

    }
}


export default new AddRecipeView();