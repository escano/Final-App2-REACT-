'use strict';

var initRecipeList = JSON.parse(localStorage.getItem('_initRecipeList')) || [];

var ReceipeBox = React.createClass({
  displayName: 'ReceipeBox',

  getInitialState: function getInitialState() {

    //console.log("testing: ",recipeInitList[0].ingredients);
    //var recipeInitList=[{id:1,name:"Tomato Soup",ingredients:["Tomato","Olie","Onion","Salt"]},{id:2,name:"Potato Soup",ingredients:["Potato","Olie","Onion","Salt"]},{id:3,name:"Carrot Soup",ingredients:["Carrot","Olie","Onion","Salt"]}];

    return { recipeList: initRecipeList };
  },
  componentDidMount: function componentDidMount() {
    var _data = this.props.initRecipeList;
    localStorage.setItem('_initRecipeList', JSON.stringify(_data));
    this.setState({ recipeList: _data });
  },
  onReceiptChanged: function onReceiptChanged(newReceipeState) {
    localStorage.setItem('_initRecipeList', JSON.stringify(newReceipeState));
    this.setState({ recipeList: newReceipeState });
  },
  render: function render() {

    return React.createElement(
      'div',
      { className: 'row' },
      React.createElement(
        'div',
        { className: 'col-xs-12' },
        React.createElement(
          'h2',
          null,
          'My Recipe List'
        )
      ),
      React.createElement(
        'div',
        { className: 'col-xs-12' },
        React.createElement(ReceiptList, { fulldata: this.state.recipeList, callbackParent: this.onReceiptChanged })
      ),
      React.createElement(
        'div',
        { className: 'col-xs-12' },
        React.createElement(
          'button',
          { type: 'button', className: 'btn btn-primary addRecipeButton', 'data-toggle': 'modal', 'data-target': '#RecipeContent', 'data-whatever': '@AddRecipe' },
          'Add Recipe'
        ),
        React.createElement(MainModal, { fullList: this.state.recipeList, callbackParent: this.onReceiptChanged })
      )
    );
  }
});

var ReceiptList = React.createClass({
  displayName: 'ReceiptList',

  getInitialState: function getInitialState() {
    return {
      recipeList: this.props.fulldata };
  },
  componentDidMount: function componentDidMount() {
    this.setState({ recipeList: this.props.fulldata });
  },

  deleteItem: function deleteItem(e, index) {
    //var updatedList=this.state.recipeList.splice(this.id,1);
    var newList = this.state.recipeList;
    newList.splice(parseInt(e.id) - 1, 1);
    for (var i = 0; i < newList.length; i++) {
      newList[i].id = i + 1;
    }
    this.setState({ recipeList: newList });
    $('.collapse.in').collapse('hide');
    return this.props.callbackParent(this.state.recipeList);
  },
  onReceiptChanged: function onReceiptChanged(newReceipeState) {
    return this.props.callbackParent(this.state.recipeList);
  },
  render: function render() {
    var listIngredients = function listIngredients(arr) {
      return arr.map(function (item, index) {
        return React.createElement(
          'li',
          { className: 'list-group-item' },
          item
        );
      });
    };
    return React.createElement(
      'div',
      null,
      this.props.fulldata.map(function (item, index) {
        var targetName = "#" + index;
        var targetIndex = "" + index;
        var item = item;
        return React.createElement(
          'div',
          null,
          React.createElement(
            'button',
            { type: 'button', className: 'btn btn-info', 'data-toggle': 'collapse', 'data-target': "#" + item.id },
            item.name
          ),
          React.createElement(
            'div',
            { className: 'panel panel-default collapse', id: item.id },
            React.createElement(
              'div',
              { className: 'panel-heading' },
              'Ingredients'
            ),
            React.createElement(
              'div',
              { className: 'panel-body' },
              React.createElement(
                'ul',
                { className: 'list-group' },
                listIngredients(item.ingredients)
              )
            ),
            React.createElement(
              'div',
              { className: 'panel-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-primary edit', id: 'Edit', 'data-toggle': 'modal', 'data-target': "#EditContent" + item.id },
                'Edit'
              ),
              React.createElement(
                'button',
                { type: 'button', value: item.id, className: 'btn btn-primary delete', id: "DeleteIngredientButton" + item.id, onClick: this.deleteItem.bind(this, item) },
                'Delete'
              ),
              React.createElement(EditModal, { fullList: this.state.recipeList, receiptID: item.id, callbackParent: this.onReceiptChanged })
            )
          )
        );
      }, this)
    );
  }

});

var MainModal = React.createClass({
  displayName: 'MainModal',

  getInitialState: function getInitialState() {
    // we ONLY set the initial state from the props
    return { recipeList: this.props.fullList };
  },
  AddRecipe: function AddRecipe() {
    var newReceipt = this.refs.myReceipt.value;
    var newIngredient = this.refs.myIngredient.value.split(",");
    var newdata = { id: this.props.fullList.length + 1, name: newReceipt, ingredients: newIngredient };
    this.props.fullList.push(newdata);
    this.setState({ recipeList: this.props.fullList });
    //var newState = !this.state.checked;
    //this.setState({ recipeList: newList });
    return this.props.callbackParent(this.state.recipeList);
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'modal fade', id: 'RecipeContent', tabindex: '-1', role: 'dialog', 'aria-labelledby': 'RecipeContent' },
        React.createElement(
          'div',
          { className: 'modal-dialog', role: 'document' },
          React.createElement(
            'div',
            { className: 'modal-content' },
            React.createElement(
              'div',
              { className: 'modal-header' },
              React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                React.createElement(
                  'span',
                  { 'aria-hidden': 'true' },
                  '×'
                )
              ),
              React.createElement(
                'h4',
                { className: 'modal-title', id: 'RecipeContent' },
                React.createElement(
                  'h2',
                  null,
                  'Add New Receipt:'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-body' },
              React.createElement(
                'form',
                null,
                React.createElement(
                  'div',
                  { className: 'form-group' },
                  React.createElement(
                    'label',
                    { htmlFor: 'Receipt-name', className: 'control-label' },
                    'Receipt Name:'
                  ),
                  React.createElement('input', { type: 'text', className: 'form-control', ref: 'myReceipt', id: 'Receipt-name', defaultValue: '' })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group' },
                  React.createElement(
                    'label',
                    { htmlFor: 'ingredient-text', className: 'control-label' },
                    'Ingredients:'
                  ),
                  React.createElement('textarea', { className: 'form-control', ref: 'myIngredient', id: 'ingredient-text', defaultValue: '' })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-default cancel', 'data-dismiss': 'modal' },
                'Cancel'
              ),
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-primary save', 'data-dismiss': 'modal', onClick: this.AddRecipe.bind(this) },
                'Save'
              )
            )
          )
        )
      )
    );
  }

});

var EditModal = React.createClass({
  displayName: 'EditModal',

  getInitialState: function getInitialState() {
    // we ONLY set the initial state from the props
    return { recipeList: this.props.fullList,
      itemID: this.props.receiptID };
  },
  EditRecipe: function EditRecipe() {
    var updatedReceipt = this.refs.myEditReceipt.value;
    var updatedIngredient = this.refs.myEditIngredient.value.split(",");
    var newdata = { id: this.state.itemID, name: updatedReceipt, ingredients: updatedIngredient };
    this.props.fullList[this.state.itemID - 1] = newdata;
    this.setState({ recipeList: this.props.fullList });
    return this.props.callbackParent(this.state.recipeList);
  },
  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'modal fade', id: "EditContent" + this.state.itemID, tabindex: '-1', role: 'dialog', 'aria-labelledby': "EditContent" + this.state.itemID },
        React.createElement(
          'div',
          { className: 'modal-dialog', role: 'document' },
          React.createElement(
            'div',
            { className: 'modal-content' },
            React.createElement(
              'div',
              { className: 'modal-header' },
              React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal', 'aria-label': 'Close' },
                React.createElement(
                  'span',
                  { 'aria-hidden': 'true' },
                  '×'
                )
              ),
              React.createElement(
                'h4',
                { className: 'modal-title', id: "EditContent" + this.state.itemID },
                React.createElement(
                  'h2',
                  null,
                  'Edit Receipt'
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-body' },
              React.createElement(
                'form',
                null,
                React.createElement(
                  'div',
                  { className: 'form-group' },
                  React.createElement(
                    'label',
                    { htmlFor: 'EditReceipt-name', className: 'control-label' },
                    'Receipt Name:'
                  ),
                  React.createElement('input', { type: 'text', className: 'form-control', ref: 'myEditReceipt', id: 'EditReceipt-name', defaultValue: this.state.recipeList[this.state.itemID - 1].name })
                ),
                React.createElement(
                  'div',
                  { className: 'form-group' },
                  React.createElement(
                    'label',
                    { htmlFor: 'Editingredient-text', className: 'control-label' },
                    'Ingredients:'
                  ),
                  React.createElement('textarea', { className: 'form-control', ref: 'myEditIngredient', id: 'Editingredient-text', defaultValue: this.state.recipeList[this.state.itemID - 1].ingredients })
                )
              )
            ),
            React.createElement(
              'div',
              { className: 'modal-footer' },
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-default cancel', 'data-dismiss': 'modal' },
                'Cancel'
              ),
              React.createElement(
                'button',
                { type: 'button', className: 'btn btn-primary save', 'data-dismiss': 'modal', onClick: this.EditRecipe.bind(this) },
                'Save'
              )
            )
          )
        )
      )
    );
  }

});

ReactDOM.render(React.createElement(ReceipeBox, { initRecipeList: initRecipeList }), RecipePanel);