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



$(document).ready(() => {
    //Login/register switching
    $("#register-toggle").click((e) => {
        e.preventDefault();
        $('#login-form').fadeOut(300, () => { // Sakrij login sekciju
            $('#register-form').fadeIn(300); // Prikaži login sekciju
        });
    });

    $("#login-toggle").click((e) => {
        e.preventDefault();
        $('#register-form').fadeOut(300, () => { // Prikaži login sekciju
            $('#login-form').fadeIn(300); // Sakrij login sekciju
        });
    });

    //Obrada logina
    $("#login-btn").click(() => {
        //Pohrani podatke u varijable
        const username = $("#username").val();
        const password = $("#password").val();

        //Otkrij poruku prijave
        $("#login-msg").removeClass("hidden");

        $.ajax({
            url: "https://www.fulek.com/data/api/user/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({username: username, password: password}),     //pretvori varijable u JSON format
            success: (response) => {
                console.log(response);
                if (response.isSuccess) {
                    localStorage.setItem('token', response.data.token);
                    console.log("Pohranjen token");
                    $("#login-msg #login-text").text("Prijava uspješna!");          //promijeni tekst poruke
                } else {
                    console.warn("Netočan unos!");
                    $("#login-msg #login-text").text("Neuspješna prijava..." + response.errorMessages);
                }
            },
            error: (xhr, error) => {
                console.error('Error:', error.message);
                $("#login-msg #login-text").text("Neuspješna prijava..." + error.message);
            }
        });
    })

    //Obrada registracije
    $("#register-btn").click(() => {
        //Pohrani podatke u varijable
        const username = $("#username-reg").val();
        const password = $("#password-reg").val();

        //Otkrij poruku registracije
        $("#register-msg").removeClass("hidden");

        $.ajax({
            url: "https://www.fulek.com/data/api/user/register",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({username: username, password: password}),
            success: (response) => {
                console.log(response);
                if (response.isSuccess) {
                    console.log("Registracija uspješna");
                    $("#register-msg #register-text").text("Registracija uspješna! Molimo da se prijavite sa unesenim podacima");
                } else {
                    console.warn("Netočan unos!");
                    $("#register-msg #register-text").text("Neuspješna registracija..." + response.errorMessages);
                }
            },
            error: (xhr, error) => {
                console.error('Error:', error.message);
                $("#login-msg #login-text").text("Neuspješna prijava..." + error.message);
            }
        });
    })
})