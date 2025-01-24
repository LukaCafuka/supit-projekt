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
    let totalECTS = 0;
    let totalHours = 0;
    let totalPredavanja = 0;
    let totalVjezbe = 0;

    if (!token) {

        console.warn('Token is missing! Redirecting to login...');
        $('#login-error').removeClass('opacity-0');
        $('#login-error').removeClass('opacity-100');
        $('#predmeti-data').remove();
        setTimeout(() => {
            document.location.href = 'prijava.html';
        }, 3000);
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
                .slice(0, 10)
                .map(p => `<li data-id="${p.id}" class="text-white">${p.kolegij}</li>`)
                .join('');
            $('#suggestions').html(suggestions).show();
        } else {


            $('#suggestions').html('').hide();
        }
    });

    $('#suggestions').on('click', 'li', function () {
        const predmetId = $(this).data('id');
        const curriculumName = $(this).text();

        const existingRow = $('#curriculum-table tbody tr').filter(function () {
            return $(this).find('td:first').text() === curriculumName;
        });

        if (existingRow.length > 0) {
            return;
        }


        $.ajax({
            url: `https://www.fulek.com/data/api/supit/get-curriculum/${predmetId}`,
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            success: (response) => {
                const newRow = `
                    <tr>
                        <td>${response.data.kolegij}</td>
                        <td>${response.data.ects}</td>
                        <td>${response.data.sati}</td>
                        <td>${response.data.predavanja}</td>
                        <td>${response.data.vjezbe}</td>
                        <td>${response.data.tip}</td>
                        <td><button class="remove-btn">Obriši</button></td>
                    </tr>
                `;
                $('#curriculum-table tbody').append(newRow);

                totalECTS += response.data.ects;
                totalHours += response.data.sati;
                totalPredavanja += response.data.predavanja;
                totalVjezbe += response.data.vjezbe;
                $('#total-ects').text(totalECTS);
                $('#total-hours').text(totalHours);
                $('#total-predavanja').text(totalPredavanja);
                $('#total-vjezbe').text(totalVjezbe);


                $('#curriculum-input').val('');
                $('#suggestions').hide();
            },
            error: (xhr, error) => {
                console.error("Error fetching curriculum details:", error);
            }
        });
    });

    // Handle removing a row from the table
    $('#curriculum-table').on('click', '.remove-btn', function () {
        const row = $(this).closest('tr');
        const ects = parseInt(row.find('td:nth-child(2)').text());
        const sati = parseInt(row.find('td:nth-child(3)').text());
        const predavanja = parseInt(row.find('td:nth-child(4)').text());
        const vjezbe = parseInt(row.find('td:nth-child(5)').text());

        // Subtract ECTS and remove the row
        totalECTS -= ects;
        totalHours -= sati;
        totalPredavanja -= predavanja;
        totalVjezbe -= vjezbe;
        $('#total-ects').text(totalECTS);
        $('#total-hours').text(totalHours);
        $('#total-predavanja').text(totalPredavanja);
        $('#total-vjezbe').text(totalVjezbe);
        row.remove();
    });
}