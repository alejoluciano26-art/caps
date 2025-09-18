// JavaScript para funcionalidades adicionales
$(document).ready(function() {
    console.log("El documento está listo.");

    // Inicializar carousel automáticamente
    $('#carouselExample').carousel({
        interval: 3000,
        pause: 'hover'
    });
});
$(document).ready(function() {
    console.log("El documento está listo.");

    // Inicializar carousel automáticamente
    $('#carouselExample').carousel({
        interval: 3000,
        pause: 'hover'
    });

    // Inicializar AOS
    AOS.init({
        duration: 1000, // duración de la animación en ms
        once: true // animación solo la primera vez que aparece
    });

    // Formulario de consulta funcional
    $('#consultaForm').on('submit', function(event) {
        event.preventDefault(); // evita que se recargue la página

        // Capturar valores (opcional, para mostrar en consola)
        const nombre = $('#inputName').val();
        const email = $('#inputEmail').val();
        const telefono = $('#inputPhone').val();
        const mensaje = $('#inputMessage').val();
        console.log(`Consulta enviada:\nNombre: ${nombre}\nEmail: ${email}\nTeléfono: ${telefono}\nMensaje: ${mensaje}`);

        // Mostrar mensaje de éxito
        $('#formMessage').text('¡Gracias! Tu consulta ha sido enviada con éxito.').fadeIn();

        // Limpiar formulario
        $('#consultaForm')[0].reset();

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => {
            $('#formMessage').fadeOut();
        }, 5000);
    });
});
