let usuarioLogueadoId = null; // Variable global para guardar el id del usuario logueado

$(document).ready(function () {

    // ------------------- MODAL DE EDAD -------------------
    $('#edadModal').modal('show');
    $('#btnEdad').on('click', function () {
        let edad = parseInt($('#inputEdad').val(), 10);
        if (!isNaN(edad) && edad > 0) {
            if (edad >= 18) {
                $('#edadModal').modal('hide');
            } else {
                alert("Eres menor de edad ❌");
                window.location.href = "https://www.google.com";
            }
        } else {
            $('#edadError').fadeIn();
            setTimeout(() => { $('#edadError').fadeOut(); }, 3000);
        }
    });

    // ------------------- LOGIN -------------------
    $("#loginForm").on("submit", function (e) {
        e.preventDefault();
        const email = $("#username").val().trim();
        const password = $("#password").val().trim();

        if (email === "" || password === "") {
            $("#loginMessage").css("color", "red").text("⚠️ Completa todos los campos").fadeIn();
            setTimeout(() => { $("#loginMessage").fadeOut(); }, 4000);
            return;
        }

        $.ajax({
            url: "login.php",
            type: "POST",
            data: { email, password },
            dataType: "json",
            success: function (response) {
                if (response.status === "ok") {
                    usuarioLogueadoId = response.id_usuario;
                    $("#loginMessage").css("color", "green").text("Inicio de sesión exitoso ✅").fadeIn();
                    $("#loginBtn, #registroBtn").hide();
                    $("#logoutBtn").show();
                    $("#loginModal").modal("hide");

                    cargarMedicos();
                    cargarTurnos();
                    cargarTurnosEnCalendario();
                } else {
                    $("#loginMessage").css("color", "red").text("❌ Usuario o contraseña incorrectos").fadeIn();
                    setTimeout(() => { $("#loginMessage").fadeOut(); }, 4000);
                }
            },
            error: function () {
                $("#loginMessage").css("color", "red").text("🚨 Error de conexión con el servidor").fadeIn();
                setTimeout(() => { $("#loginMessage").fadeOut(); }, 4000);
            }
        });
    });

    // ------------------- LOGOUT -------------------
    $("#logoutBtn").on("click", function () {
        $.ajax({
            url: "logout.php",
            type: "POST",
            dataType: "json",
            success: function (response) {
                if (response.status === "ok") {
                    usuarioLogueadoId = null;
                    $("#loginBtn, #registroBtn").show();
                    $("#logoutBtn").hide();
                    $("#tablaTurnos tbody").empty();
                    $("#medico").html('<option value="">-- Selecciona un médico --</option>');
                    alert(response.message);
                } else {
                    alert("Error: " + (response.message || "no se pudo cerrar sesión"));
                }
            },
            error: function () {
                alert("❌ Error al cerrar sesión. Intenta nuevamente.");
            }
        });
    });

    // ------------------- REGISTRO -------------------
    $("#registroForm").on("submit", function(e) {
        e.preventDefault();

        const nombre = $("#regNombre").val().trim();
        const email = $("#regEmail").val().trim();
        const password = $("#regPassword").val().trim();

        if (nombre === "" || email === "" || password === "") {
            $("#registroMessage").css("color", "red").text("⚠️ Completa todos los campos").fadeIn();
            setTimeout(() => { $("#registroMessage").fadeOut(); }, 4000);
            return;
        }

        $.ajax({
            url: "registro.php",
            type: "POST",
            data: { nombre, email, password },
            dataType: "json",
            success: function(response) {
                if (response.status === "ok") {
                    usuarioLogueadoId = response.id_usuario;

                    $("#registroMessage").css("color", "green")
                        .html(`✅ Te has registrado con éxito, ${response.nombre}. ¡Sesión iniciada!`)
                        .fadeIn();

                    $("#loginBtn, #registroBtn").hide();
                    $("#logoutBtn").show();

                    setTimeout(() => {
                        $("#registroModal").modal("hide");
                        $("#registroMessage").fadeOut();
                    }, 3000);

                    cargarMedicos();
                    cargarTurnos();
                    cargarTurnosEnCalendario();

                } else {
                    $("#registroMessage").css("color", "red").text("❌ " + response.message).fadeIn();
                    setTimeout(() => { $("#registroMessage").fadeOut(); }, 4000);
                }
            },
            error: function() {
                $("#registroMessage").css("color", "red")
                    .text("🚨 Error de conexión con el servidor").fadeIn();
                setTimeout(() => { $("#registroMessage").fadeOut(); }, 4000);
            }
        });
    });

    // ------------------- CARGAR MÉDICOS -------------------
    function cargarMedicos() {
        $.ajax({
            url: "obtener_medicos.php",
            type: "GET",
            success: function (data) {
                $("#medico").html(data);
            },
            error: function () {
                $("#medico").html('<option value="">Error al cargar médicos</option>');
            }
        });
    }

    // ------------------- CARGAR TURNOS -------------------
    function cargarTurnos() {
        if (!usuarioLogueadoId) return;

        $.ajax({
            url: "ver_turnos.php",
            type: "GET",
            data: { id_usuario: usuarioLogueadoId },
            dataType: "json",
            success: function (data) {
                const tbody = $("#tablaTurnos tbody");
                tbody.empty();

                if (!Array.isArray(data) || data.length === 0) {
                    tbody.append("<tr><td colspan='4' class='text-center'>No hay turnos agendados</td></tr>");
                } else {
                    data.forEach(turno => {
                        tbody.append(`<tr>
                            <td>${turno.fecha_turno}</td>
                            <td>${turno.hora_turno}</td>
                            <td>${turno.medico}</td>
                            <td>${turno.especialidad}</td>
                        </tr>`);
                    });
                }
            },
            error: function () {
                alert("Error al cargar los turnos.");
            }
        });
    }

    // ------------------- GUARDAR TURNO -------------------
    $("#turnoForm").on("submit", function (e) {
        e.preventDefault();

        if (!usuarioLogueadoId) {
            $("#turnoMessage").css("color", "red").text("⚠️ Debes iniciar sesión primero").fadeIn();
            setTimeout(() => { $("#turnoMessage").fadeOut(); }, 5000);
            return;
        }

        let datosTurno = $(this).serializeArray();
        datosTurno.push({ name: "id_usuario", value: usuarioLogueadoId });

        $.ajax({
            url: "pedir_turno.php",
            type: "POST",
            data: $.param(datosTurno),
            success: function (res) {
                if (res.trim() === "ok") {
                    $("#turnoMessage").css("color", "green").text("✅ Turno guardado correctamente").fadeIn();
                    $("#turnoForm")[0].reset();
                    cargarTurnos();
                    cargarTurnosEnCalendario();
                } else {
                    $("#turnoMessage").css("color", "red").text("❌ Error al guardar el turno").fadeIn();
                }
                setTimeout(() => { $("#turnoMessage").fadeOut(); }, 5000);
            },
            error: function () {
                $("#turnoMessage").css("color", "red").text("🚨 Error de conexión con el servidor").fadeIn();
                setTimeout(() => { $("#turnoMessage").fadeOut(); }, 5000);
            }
        });
    });

    // ------------------- CALENDARIO -------------------
    let calendar;

    function initCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl && !calendar) {
            calendar = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                locale: 'es',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                },
                events: []
            });
            calendar.render();
        }
    }

    function cargarTurnosEnCalendario() {
        if (!calendar) initCalendar();

        $.ajax({
            url: "ver_turnos.php",
            type: "GET",
            dataType: "json",
            success: function (data) {
                calendar.removeAllEvents();
                data.forEach(turno => {
                    calendar.addEvent({
                        title: `${turno.medico} (${turno.especialidad})`,
                        start: `${turno.fecha_turno}T${turno.hora_turno}`,
                        allDay: false
                    });
                });
            },
            error: function () {
                alert("Error al cargar los turnos en el calendario.");
            }
        });
    }

    // Inicializar calendario al abrir la pestaña de Fechas
    $('button[data-target="#pills-fechas"]').on('shown.bs.tab', function () {
        cargarTurnosEnCalendario();
    });

    // Si ya está activa la pestaña de Fechas, inicializa
    if ($('#pills-fechas').hasClass('active show')) {
        initCalendar();
    }
    // --- FORMULARIO DE CONSULTA ---
$("#consultaForm").on("submit", function(e) {
    e.preventDefault();

    let datosConsulta = $(this).serialize();

    $.ajax({
        url: "guardar_consulta.php",
        type: "POST",
        data: datosConsulta,
        dataType: "json",
        success: function(response) {
            if (response.status === "ok") {
                $("#formMessage").css("color", "green").text(response.message).fadeIn();
                $("#consultaForm")[0].reset();
            } else {
                $("#formMessage").css("color", "red").text(response.message).fadeIn();
            }
            setTimeout(() => { $("#formMessage").fadeOut(); }, 5000);
        },
        error: function() {
            $("#formMessage").css("color", "red").text("🚨 Error de conexión con el servidor").fadeIn();
            setTimeout(() => { $("#formMessage").fadeOut(); }, 5000);
        }
    });
});

});
