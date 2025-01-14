/*
---Glavna Javascript datoteka---

|Luka Filipić|
---luka@z.com.hr---
*/

//Prikaz elemenata na navbaru klikom na hmburger bar
const menuBtn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
    menu.classList.toggle('hidden');
});