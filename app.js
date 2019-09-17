class TodoData{
  constructor(){
    this.list = JSON.parse(localStorage.getItem('todolist')) || [];
  }
  save(todo){
    this.list.unshift(todo);
    localStorage.setItem('todolist',JSON.stringify(this.list));
  }
  delete(index){
    this.list.splice(index,1);
    localStorage.setItem('todolist',JSON.stringify(this.list));
  }
}

class View{
  constructor(name,render){
    this.name = name;
    this.render = render;
  }
}

class App{
  constructor(){
    //todo object with save and delete capabilities
    this.todoData = new TodoData();
    this.views = [];
  }
  addView(name,html){
    this.views.push(new View(name,html));
  }
  addEvent(element,event,handler){
    const domE = document.querySelector(element);
    domE.addEventListener(event,handler);
  }

  initializeViews(){
    const root = document.querySelector('#root');
    let applicationHTML = '<div class="container mt-5">';

    for(let view of this.views){
      applicationHTML += `<div id=${view.name}>${view.render()}</div>`;
    }

    root.innerHTML = applicationHTML + '</div>'
  }

  rerenderView(name){
    for(let view of this.views){
      if(name === view.name){
        const domE = document.querySelector(`#${name}`)
        domE.innerHTML = view.render();
      }
    }
    
    const inputE = document.querySelector('.js-text-input')
    inputE.value = '';
    
  }
}

const app = new App();

app.addView('header',()=> `
  <div class="jumbotron jumbotron-fluid">
    <div class="container">
      <h1 class="display-4">Todo List App</h1>
    </div>
  </div>
`)

app.addView('input',()=>{
  return `<div class="input-group mb-3">
    <input type="text" class="js-text-input form-control" placeholder="Add...">
    <div class="input-group-append">
      <button class="js-add btn btn-outline-secondary" type="button" id="button-addon2">Add</button>
    </div>
  </div>`
})

app.addView('list',()=>{
  let list = `<ul class="list-group">`
  for(let i=0;i<app.todoData.list.length;i++){
    list += `<li class="list-group-item d-flex justify-content-between align-items-center">
      ${app.todoData.list[i]}
      <span class="badge badge-primary badge-pill" data-i=${i}>X</span>
    </li>`
  }
  list += '</ul>';
  return list;
})

app.initializeViews();

app.addEvent('.js-add','click',(e)=>{
  const input = document.querySelector('.js-text-input')
  if(input.value.trim() !== ''){
    app.todoData.save(input.value);
    app.rerenderView('list');
  }
})

app.addEvent('.js-text-input','keydown',(e)=>{
  if(e.target.value.trim() !== '' && e.code === 'Enter'){
    app.todoData.save(e.target.value);
    app.rerenderView('list');
  }
})

app.addEvent('#list','click',(e)=>{
  if(e.target.attributes['data-i']){
    const index = e.target.attributes['data-i'].value;
    console.log(index)
    app.todoData.delete(index);
    app.rerenderView('list');
  }
})