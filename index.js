let isMainButtonClicked = false;
let isMainButtonHovered = false;

const mousemove = (e) => {
  // console.log('mousemove', e);
}

const generateString = (length) => {
  let characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = ' ';
  const charactersLength = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.trim();
};

const createModalWindow = (currentInput, currentIndex) => {
  // console.log('createModalWindow');

  const modal = document.createElement('div')
  modal.className = 'modal';

  const modal__bg = document.createElement('label')
  modal__bg.className = 'modal__bg';

  const modal__inner = document.createElement('div')
  modal__inner.className = 'modal__inner';
  
  const modal__close = document.createElement('label')
  modal__close.className = 'modal__close';
  modal__close.addEventListener('click', () => {
    modal.remove();
    // modal.style.display = 'none'
  })

  const content = document.createElement('p');
  content.innerHTML = 'Set autocomplete content';

  const input = document.createElement('input');
  input.addEventListener('change', (e) => {
    currentInput.value = e.target.value;
    localStorage.setItem(
      "autofiller",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem('autofiller')),
        [currentInput.id]: e.target.value }),
        // ['input' + currentIndex]: e.target.value }),
      // JSON.stringify({ ['input' + currentIndex]: e.target.value }),
    );
  })

  modal__inner.append(modal__close, content, input)
  modal.append(modal__bg, modal__inner)

  document.body.prepend(modal);
}

const createAdditionalAutofillerButtons = () => {
  const fillAllPredefinedInputsBtn = document.createElement('button')
  fillAllPredefinedInputsBtn.id = 'fill_all_predefined_inputs_btn'
  fillAllPredefinedInputsBtn.innerHTML = 'Fill in all predefined inputs'
  fillAllPredefinedInputsBtn.style = `
    position: fixed;
    top: 10px;
    right: 125px;
    z-index: 9999;
    background-color: green;
    color: #fff;
    border-radius: 15px;
    display: flex;
    padding: 5px 10px;
  `;

  fillAllPredefinedInputsBtn.addEventListener('click', () => {
    const allInputs = document.querySelectorAll('input[type = text], input[type = email], input[type = password]');
    // console.dir(allInputs);
    const fieldsData = JSON.parse(localStorage.getItem('autofiller'))
    
    allInputs.forEach((input, index) => {
      // console.log('fieldsData', fieldsData, input.id);
      // console.dir(input);
      if (fieldsData[input.id]) {
      // if (fieldsData['input' + index]) {
        // input.value = fieldsData['input' + index]
        input.value = fieldsData[input.id]
      }
    })
  })

  fillAllPredefinedInputsBtn.addEventListener('mousemove', () => {
    isMainButtonHovered = true;
  })

  fillAllPredefinedInputsBtn.addEventListener('mouseleave', () => {
    isMainButtonHovered = false;

    setTimeout(() => {
      hideElement('fill_all_predefined_inputs_btn');
      hideElement('fill_all_inputs_btn');
    }, 2000);
  })

  document.body.prepend(fillAllPredefinedInputsBtn);
}

const hideElement = (id) => {
  const element = document.getElementById(id);
  if (!isMainButtonHovered && element) {
    element.style.display = 'none';
  }
}

const showElement = (id) => {
  const element = document.getElementById(id);
  element.style.display = 'block';
}

const autofiller = () => {
  console.log('init autofiller');
  // TODO: add developer mode !!!

  const mainAutoFillerBtn = document.createElement('button')
  mainAutoFillerBtn.innerHTML = 'Show auto-fill mode'
  mainAutoFillerBtn.style.position = 'fixed'
  mainAutoFillerBtn.style.top = '10px'
  mainAutoFillerBtn.style.left = 'calc(100% - 100px)'
  mainAutoFillerBtn.style['z-index'] = '99999'
  mainAutoFillerBtn.style['background-color'] = 'red';
  mainAutoFillerBtn.style['color'] = '#fff';
  mainAutoFillerBtn.style['border-radius'] = '10px';
  mainAutoFillerBtn.style['display'] = 'flex';
  mainAutoFillerBtn.style['padding'] = '5px 10px';

  mainAutoFillerBtn.addEventListener('mousemove', () => {
    isMainButtonHovered = true;

    if (localStorage.getItem("autofiller")) {
      // console.log(11111, JSON.parse(localStorage.getItem("autofiller")));
      if (!document.getElementById('fill_all_predefined_inputs_btn')) {
        createAdditionalAutofillerButtons();
      } else {
        showElement('fill_all_predefined_inputs_btn')
      }
    }
    showElement('fill_all_inputs_btn')
  });

  mainAutoFillerBtn.addEventListener('mouseleave', () => {
    // console.log('mouseleave');
    
    isMainButtonHovered = false;

    setTimeout(() => {
      hideElement('fill_all_predefined_inputs_btn');
      hideElement('fill_all_inputs_btn');
    }, 2000);
  });

  mainAutoFillerBtn.addEventListener('click', () => {
    // console.log('mainAutoFillerBtn click', isMainButtonClicked);
    
    if (!isMainButtonClicked) {
      const allInputs = document.querySelectorAll('input[type = text], input[type = email], input[type = password]');
      
      allInputs.forEach((input, index) => {
        // console.dir(input);
        const parentElement = input.parentElement;
        parentElement.style.position = 'relative'
        input.id = window.location.pathname + '/' + input.name; // TODO: придумать уникальный айдишник каждому инпуту (например : название страницы + индекс). Подумать не будет ли побочных эфектов от переназначения "id"

        const autoFillBtn = document.createElement('button')
        autoFillBtn.innerHTML = 'TEST'
        autoFillBtn.className = 'auxiliary_buttons'
        autoFillBtn.style.position = 'absolute'
        autoFillBtn.style.top = '0px'
        autoFillBtn.style.left = '-40px'

        autoFillBtn.addEventListener('click', () => {
          // console.log('click on autoFillBtn', input);
          // console.dir(input);
          // input.value = 'Auto Fill value-' + index
          // input.innerHTML = 'Auto Fill innerHTML'

          createModalWindow(input, index)
        });

        parentElement.prepend(autoFillBtn);
        // parentElement.append([autoFillBtn, ...parentElement.children]);
        // input.style.border = '1px solid red'
      })

      isMainButtonClicked = true;
    } else {
      const allInputs = document.querySelectorAll('.auxiliary_buttons');
      // console.dir(allInputs);

      allInputs.forEach((input, index) => {
        input.remove();
      })

      isMainButtonClicked = false;
    }
  })

  const fillAllInputsBtn = document.createElement('button')
  fillAllInputsBtn.id = 'fill_all_inputs_btn';
  fillAllInputsBtn.innerHTML = 'Fill all inputs'
  fillAllInputsBtn.style = `
    display: none;
    position: fixed;
    top: 50px;
    right: 125px;
    z-index: 9999;
    background-color: green;
    color: #fff;
    border-radius: 15px;
    padding: 5px 10px;
  `;

  fillAllInputsBtn.addEventListener('click', () => {
    const allInputs = document.querySelectorAll('input[type = text], input[type = email], input[type = password]');
    // console.dir(allInputs);

    allInputs.forEach((input, index) => {
      switch (input.type) {
        case 'text':
          input.value = generateString(6);
          break;
        case 'email':
          input.value = generateString(3) + '@example.com';
          break;
      
        default:
          input.value = generateString(5);
          break;
      }
    })
  })

  fillAllInputsBtn.addEventListener('mousemove', () => {
    isMainButtonHovered = true;
  })
  fillAllInputsBtn.addEventListener('mouseleave', () => {
    isMainButtonHovered = false;

    setTimeout(() => {
      hideElement('fill_all_predefined_inputs_btn');
      hideElement('fill_all_inputs_btn');
    }, 2000);
  })

  document.body.prepend(mainAutoFillerBtn, fillAllInputsBtn);

  // const appMode = process.env.NODE_ENV || import.meta.env.NODE_ENV;

  // console.log('onMounted App', appMode);

  // if (appMode === 'development') {
  //   // const allInputs = instance.vnode.el.parentElement.parentNode.querySelectorAll('input')
  //   // const allInputs = document.querySelectorAll('input[type = text]');')
  //   // console.log(1);
  //   // console.dir(allInputs);
  //   // console.log(2);
  // }
}

// autofiller();
export default autofiller;

/*
МОДАЛКА
1) предзаполнять инпут уже существующими данными из localstorage
2) добавить возможность закрывать модалку по нажатию на энтер
3) добавить возможность закрывать модалку кнопкой escape
4) предлагать автоматического подбора текста (например если тип инпута "email" - то предлагать сгенерировать валидный email)

ГЛАВНАЯ КНОПКА
1) добавить наборы пресетов
2) добавить возможность перетаскивать иконку главной кнопки (по нажатию и удержанию кнопки - переходить в режим "перетаскивания")
3) добавить возможность скрывать иконку главной кнопки
4) добавить возможность сбрасывать все настройки

ИКОНКА РЯДОМ С ИНПУТОМ
1) добавить возможность быстрого заполнения инпута

ОБЩИЕ
1) добавить хоткеи. (например заполнять все инпуты по комбинации "cmd+shift+v". Хоткеи должны переназначаться в настройках)
2) Добавить блок "Настройки".
Ожидаемые настройки:
1) выбор сложности пароля
2) выбор языка

*/
