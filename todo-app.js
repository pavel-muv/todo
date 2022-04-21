function index(element) {
  return Array.from(element.parentNode.children).indexOf(element);
}

function storage(name, value) {
  return (value) ? localStorage.setItem(name, JSON.stringify(value)) : JSON.parse(localStorage.getItem(name)) || [];
}

function createTodo(container, title = 'Список дел', defaultItems = [], sessionId = 'todo.html') {
  let session = [];

  let header = document.createElement('h2');
      header.textContent = title;

  let form = document.createElement('form');
      form.classList.add('input-group', 'mb-3');

  let formInput = document.createElement('input');
      formInput.classList.add('form-control');
      formInput.placeholder = 'Введите название нового дела';
      formInput.addEventListener('input', function() { formButton.disabled = this.value == '' });

  let formButtonGroup = document.createElement('div');
      formButtonGroup.classList.add('input-group-append');

  let formButton = document.createElement('button');
      formButton.classList.add('btn', 'btn-primary');
      formButton.textContent = 'Добавить дело';
      formButton.disabled = true;

  let list = document.createElement('ul');
      list.classList.add('list-group');

      formButtonGroup.append(formButton);
      form.append(formInput, formButtonGroup);
      container.append(header, form, list);

  function createItem(name, done) {
      let item = document.createElement('li');
          item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
          item.textContent = name;

      let itemButtonGroup = document.createElement('div');
          itemButtonGroup.classList.add('btn-group', 'btn-group-sm');

      let itemDoneButton = document.createElement('button');
          itemDoneButton.classList.add('btn', 'btn-success');
          itemDoneButton.textContent = 'Готово';
          itemDoneButton.addEventListener('click', function() {
              let done = item.classList.toggle('list-group-item-success');

              // storage setter: change item
              session[index(item)].done = done;
              storage(sessionId, session);
          });

      let itemDeleteButton = document.createElement('button');
          itemDeleteButton.classList.add('btn', 'btn-danger');
          itemDeleteButton.textContent = 'Удалить';
          itemDeleteButton.addEventListener('click', function() {
              if (!confirm('Вы уверены?')) return;

              // storage setter: delete item
              session.splice(index(item), 1);
              storage(sessionId, session);

              item.remove();
          });

          itemButtonGroup.append(itemDoneButton, itemDeleteButton);
          item.append(itemButtonGroup);
          list.append(item);

      // storage setter: create item
      session.push({ name, done });
      storage(sessionId, session);

      if (done) itemDoneButton.click();
  }

  form.addEventListener('submit', function(e) {
      e.preventDefault();
      if (formInput.value == '') return;
      createItem(formInput.value);
      formInput.value = '';
  });

  // storage getter: return items
  let storageItems = storage(sessionId);

  // restore session
  let sessionItems = (storageItems.length == 0) ? defaultItems : storageItems;
  for (let item of sessionItems) createItem(item.name, item.done);
}

window.createTodo = createTodo;