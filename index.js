const nameInput = document.querySelector('input[type="text"]');
const passInput = document.querySelector('.password');
const buttonInput = document.querySelector('button');
const resultOutput = document.querySelector('.result-output');
const loginForm = document.querySelector('.login-form');
const userPanel = document.querySelector('.user-panel');
const welcomeUser = document.querySelector('.welcome-user');
const userList = document.querySelector('.user-list');
const nothingText = document.querySelector('.nothing-text');
const svgContainer = document.querySelector('.svg-container');
const captchaInput = document.querySelector('.captcha-input');

const url = 'http://127.0.0.1:3000'

let captchaText = ''

const genCaptcha = () => {
  fetch(url + '/captcha', {
    method: 'GET',
  }).then((res) => {
    return res.json()
  }).then((data) => {
    svgContainer.innerHTML += data.svg
    captchaText = data.text
  })
}

genCaptcha()

buttonInput.onclick = function()  {
  if (passInput.value.length == 0) {
    return;
  }
  if (captchaInput.value !== captchaText) {
    resultOutput.classList.add('error');
    resultOutput.classList.remove('d-none');
    resultOutput.innerHTML = 'Wrong captcha!';
    svgContainer.innerHTML = '';
    passInput.value = '';
    genCaptcha()
    return;
  }
  const data = {username: nameInput.value, password: passInput.value};
  fetch(url + '/login', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  }).then((res) => {
    return res.json()
  }).then((data) => {
    if (data.status === 200) {
      loginForm.classList.add('d-none');
      userPanel.classList.remove('d-none');
      resultOutput.classList.add('d-none');

      welcomeUser.innerHTML = data.name

      if (data.name == "Admin" && data.users) {
        data.users.forEach(renderList)
      } else {
        nothingText.classList.remove('d-none');
      }
    } 
    if (data.status === 401) {
      resultOutput.classList.add('error');
      resultOutput.classList.remove('d-none');
      resultOutput.innerHTML = 'Wrong credentials!'
    }
  })
}

function renderList(element) {
  var li = document.createElement('li');

  userList.appendChild(li);

  const userData = `Username: ${element.name};`

  li.innerHTML = li.innerHTML + userData;
}
