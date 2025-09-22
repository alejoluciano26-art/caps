$(document).ready(function () {

    // --- FORMULARIO DE CONSULTA ---
    $('#consultaForm').on('submit', function (event) {
        event.preventDefault();
        $('#formMessage').text('¡Gracias! Tu consulta ha sido enviada con éxito.').fadeIn();
        $('#consultaForm')[0].reset();
        setTimeout(() => { $('#formMessage').fadeOut(); }, 5000);
    });

    // --- LOGIN / LOGOUT ---
    const loginForm = $("#loginForm");
    const loginBtn = $("#loginBtn");
    const logoutBtn = $("#logoutBtn");
    const loginMessage = $("#loginMessage");

    loginForm.on("submit", function (e) {
        e.preventDefault();
        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (username === "admin" && password === "1234") {
            loginMessage.show().css("color", "green").text("Inicio de sesión exitoso ✅");
            loginBtn.hide();
            logoutBtn.show();
            setTimeout(() => {
                $('#loginModal').modal('hide');
                loginMessage.hide();
                loginForm[0].reset();
            }, 1000);
        } else {
            loginMessage.show().css("color", "red").text("Usuario o contraseña incorrectos ❌");
        }
    });

    logoutBtn.on("click", function () {
        loginBtn.show();
        logoutBtn.hide();
        alert("Sesión cerrada correctamente.");
    });

    // --- CALENDARIO (FullCalendar) ---
    let calendarInitialized = false;

    function initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl && !calendarInitialized) {
            const calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: [
    { title: 'Campaña de Vacunación', start: '2025-12-01', end: '2025-12-15' },
    { title: 'Charlas de Nutrición', start: '2025-11-10' },
    { title: 'Fecha de Vacunación', start: '2025-09-30' } // <- nuevo evento
]

            });
            calendar.render();
            calendarInitialized = true;
        }
    }

    $('button[data-target="#pills-fechas"]').on('shown.bs.tab', function () {
        initCalendar();
    });

    if ($('#pills-fechas').hasClass('active show')) {
        initCalendar();
    }

});


