const menuBtn = document.querySelector('#menuBtn')

const collapseMenu = (menuBtn) => {
  const menu = document.querySelector('#menu')
  menu.classList.toggle('show')
  menuBtn.classList.toggle('header__menu-btn--close')
}


menuBtn.addEventListener('click', () => collapseMenu(menuBtn))