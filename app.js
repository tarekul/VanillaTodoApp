//Model
class TodoData {
  constructor(){
    this.list = JSON.parse(localStorage.getItem('todolist')) || [];
  }

  save(value){
    this.list.unshift(value);
    localStorage.setItem('todolist',JSON.stringify(this.list));
  }

  delete(index){
    this.list.splice(index,1);
    localStorage.setItem('todolist',JSON.stringify(this.list));
  }
}

//View
class View {
  constructor(name,render){
    this.name = name;
    this.render = render;
  }
}

class App{
  constructor(){
    // Initialize model
    this.todos = new TodoData();
    // My list of views
    this.views = [];
  }

  initializeViews(){
    const root = document.querySelector('#root');
    let applicationHTML = '<div class = "container mt-5">';

    for(let view of this.views){
      applicationHTML += `<div id=${view.name}>${view.render()}</div>`;
    }

    root.innerHTML = applicationHTML + '</div>';
  }

  addView(name,html){
    this.views.push(new View(name,html));
  }

  addEvent(element,event,handler){
    //Selects element and adds event listener to it with handler
    const domE = document.querySelector(element);
    domE.addEventListener(event, handler)
  }

  rerenderView(name){
    for(let view of this.views){
      if(view.name === name){
        const domE = document.querySelector(`#${view.name}`)
        domE.innerHTML = view.render();
        const inputE = document.querySelector('.js-text-input')
        inputE.value = '';
      }
    }
  }

}

const app = new App();
app.addView('header', () => `
  <div class="jumbotron jumbotron-fluid">
      <div class="container">
        <h1 class="display-4">Todo List App</h1>
      </div>
    </div>
`)

app.addView('input', () => `
  <div class="input-group mb-3">
    <input type="text" class="js-text-input form-control" placeholder="Add...">
    <div class="input-group-append">
      <button class="js-add btn btn-outline-secondary" type="button" id="button-addon2">Add</button>
    </div>
  </div>
`)


app.addView('list',()=> {
  let list = '<ul class="list-group mx-3">'
  for(let i =0; i<app.todos.list.length;i++){
    list += `<li class="list-group-item">
      ${app.todos.list[i]}
      <button type="button" class="close" aria-label="Close" >
        <span aria-hidden="true" data-i="${i}">&times;</span>
      </button>
    </li>`
  }
  list += '</ul>'
  return list;
})

app.initializeViews();

app.addEvent('.js-add','click',(e)=>{
  e.preventDefault();
  const input = document.querySelector('.js-text-input')
  if(input.value.trim() !== ''){
    app.todos.save(input.value)
    app.rerenderView('list')
  }
})

app.addEvent('#list','click',(e)=>{
  e.preventDefault();
  if(e.target.attributes['data-i']){
    const index = e.target.attributes['data-i'].value
    app.todos.list.splice(index,1);
    app.rerenderView('list')
  }
})
