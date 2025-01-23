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


const novost1 = document.querySelectorAll('.novost1');
const novost2 = document.querySelectorAll('.novost2');
const novost3 = document.querySelectorAll('.novost3');

const novost1txt = document.getElementById('novost1txt');
const novost2txt = document.getElementById('novost2txt');
const novost3txt = document.getElementById('novost3txt');

novost1.forEach(novost => {
    novost.addEventListener('click', () => {
        novost1txt.classList.toggle('hidden');

    })
})

novost2.forEach(novost => {
    novost.addEventListener('click', () => {
        novost2txt.classList.toggle('hidden');

    })
})

novost3.forEach(novost => {
    novost.addEventListener('click', () => {
        novost3txt.classList.toggle('hidden');

    })
})




$(document).ready(() => {
    const currentPage = window.location.pathname;

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

    if (currentPage.includes('np.html')) {
        loadCurriculum();
    }
})

function loadCurriculum() {
    const token = localStorage.getItem('token');
    let predmeti = [];

    if (!token) {

        console.warn('Token is missing! Redirecting to login...');
        return;
    }

    $.ajax({
        url: "https://www.fulek.com/data/api/supit/curriculum-list/hr",
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        },
        success: (response) => {
            console.log('Data loaded successfully:', response);
            predmeti = response.data;

        },
        error: (xhr, error) => {
            console.error('Error fetching data:', error);
        }
    });

    $('#np-input').on('input', function () {
        const query = $(this).val().toLowerCase().trim();

        if (query === "") {
            $('#suggestions').html('').hide();
            return;
        }

        const matchingPredmeti = predmeti.filter(p =>
            p.kolegij.toLowerCase().includes(query)
        );

        if (matchingPredmeti.length > 0) {
            const suggestions = matchingPredmeti
                .map(p => `<li data-id="${p.id}">${p.kolegij}</li>`)
                .join('');
            $('#suggestions').html(suggestions).show();
        } else {


            $('#suggestions').html('').hide();
        }
    });
}