var fm = this;
fm.contenedorFormularios = undefined;
fm.formularios = {};
fm.formularioSeleccionado = '';
fm.modificarCampo = false;
fm.campoSeleccionado = '';

function inicializar() {
    console.log('::: Aplicación inicializada :::');
    fm.contenedorFormularios = $('.contenedor-formularios')[0];
}

fm.crearFormulario = function () {
    let cfNombre = $('#cf-nombre').val();
    cfNombre = cfNombre.replace(/ /g, '_');
    if (fm.existeFormulario(cfNombre) == false && cfNombre != '') {
        // Exito
        fm.generarFormulario(cfNombre);
    }
    else if (cfNombre == '') {
        // Error
        $('#mensaje-error').text('Para crear un formulario hay que especificar un nombre válido.');
        $('#modal').css('display', 'block');
    }
    else {
        // Error
        $('#mensaje-error').text('Ya existe un formulario llamado: ' + cfNombre + '.');
        $('#modal').css('display', 'block');
    }
}

fm.generarFormulario = function (nombre) {
    let div   = document.createElement('div');
    let h2    = document.createElement('h2');
    let texto = document.createTextNode(nombre);

    div.setAttribute('id', nombre);
    div.setAttribute('class', 'grupo-formulario');
    h2.appendChild(texto);
    div.appendChild(h2);
    fm.contenedorFormularios.appendChild(div);

    fm.formularios[nombre] = {};
    fm.crearListadoFormularios(nombre);
}

fm.abrirModalModificarForm = function () {
    $('#modificar-formulario').val(fm.formularioSeleccionado);
    $('#modal-modificar-form').css('display', 'block');
}

fm.modificarFormulario = function () {
    let nuevoNombre = $('#modificar-formulario').val();
    if (fm.existeFormulario(nuevoNombre) == false && nuevoNombre != '') {
        // Copia los campos y borra el formulario:
        let copia = fm.formularios[fm.formularioSeleccionado];
        delete fm.formularios[fm.formularioSeleccionado];
        $('#' + fm.formularioSeleccionado).remove();

        // Genera de nuevo el formulario y le añade los campos que tenía anteriormente:
        fm.generarFormulario(nuevoNombre);
        fm.formularioSeleccionado = nuevoNombre;
        fm.formularios[fm.formularioSeleccionado] = copia;
        fm.generarElementos();
        $('#modal-modificar-form').css('display', 'none');
    }
    else if (nuevoNombre == '') {
        // Error
        $('#mensaje-error').text('Para modificar un formulario hay que especificar un nombre válido.');
        $('#modal').css('display', 'block');
    }
    else {
        // Error
        $('#mensaje-error').text('Ya existe un formulario llamado: ' + nuevoNombre + '.');
        $('#modal').css('display', 'block');
    }
}

fm.borrarFormulario = function () {
    delete fm.formularios[fm.formularioSeleccionado];

    // Borra el formulario de la vista:
    $('#' + fm.formularioSeleccionado).remove();

    // Borra el contenedor de campos:
    $('#lc-contenedor').empty();

    // Genera la nueva lista de formularios:
    fm.crearListadoFormularios();

    fm.formularioSeleccionado = '';
}

fm.crearListadoFormularios = function () {
    $('#lf-contenedor').empty();
    for (let index in fm.formularios) {
        // index = nombre del formulario
        let li = document.createElement('li');
        let texto = document.createTextNode(index);

        li.appendChild(texto);
        li.setAttribute('onclick', 'fm.seleccionarFormulario("' + index +'")');
        li.setAttribute('class', 'cursor');
        li.setAttribute('id', 'lf-' + index);
        $('#lf-contenedor')[0].appendChild(li);
    }
}

fm.seleccionarFormulario = function (formulario) {
    // Aplica el estilo:
    $('#lf-' + fm.formularioSeleccionado).removeClass('campo-seleccionado');
    $('#lf-' + formulario).addClass('campo-seleccionado');

    // Selecciona el nuevo formulario:
    fm.formularioSeleccionado = formulario;
    fm.campoSeleccionado = '';
    $('#formulario-seleccionado').text(formulario);
    fm.mostrarCamposEnListado();
}

fm.abrirCrearCampo = function () {
    fm.modificarCampo = false;
    $('#modal-crear').css('display', 'block');
}

fm.mostrarCamposEnListado = function () {
    $('#lc-contenedor').empty();

    for (let index in fm.formularios[fm.formularioSeleccionado]) {
        let formVal = fm.formularios[fm.formularioSeleccionado][index];

        let li = document.createElement('li');
        let texto = document.createTextNode(index + ' [' + formVal.campo + ']');
        li.appendChild(texto);
        li.setAttribute('onclick', 'fm.seleccionarCampo("' + index +'")');
        li.setAttribute('class', 'cursor ' + ((fm.campoSeleccionado == index) ? 'campo-seleccionado' : ''));
        li.setAttribute('id', 'li-' + fm.formularioSeleccionado + index);
        $('#lc-contenedor')[0].appendChild(li);
    }
}

fm.crearCampo = function () {
    let campo = $('#campo-val').val();
    switch (campo) {
        case 'input':
            fm.crearCampoInput();
            break;
        case 'select':
            fm.crearCampoSelect()
            break;
    }

    fm.generarElementos();
    fm.limpiarCamposModal();
    if (fm.modificarCampo) {
        fm.cerrarModal('#modal-crear');
        $('#campo-nombre')[0].setAttribute('readonly', false);
        fm.modificarCampo = false;
    }
}

fm.generarElementos = function () {
    console.log(fm.formularios[fm.formularioSeleccionado]);
    $('#' + fm.formularioSeleccionado).empty();

    let title = document.createElement('h2');
    title.appendChild(document.createTextNode(fm.formularioSeleccionado));
    $('#' + fm.formularioSeleccionado)[0].appendChild(title);

    for (let index in fm.formularios[fm.formularioSeleccionado]) {
        let formVal = fm.formularios[fm.formularioSeleccionado][index];

        let div = document.createElement('div');
        div.setAttribute('id', fm.formularioSeleccionado + '_' + index);
        let label       = document.createElement('label');
        let label_texto = document.createTextNode(index + ': ');
        label.appendChild(label_texto);
        let campo       = document.createElement(formVal.campo);

        if (formVal.tipo != undefined) campo.setAttribute('type', formVal.tipo);
        if (formVal.opciones != undefined) {
            for (let i = 0; i < formVal.opciones.length; i++) {
                let value = formVal.opciones[i];
                let option = document.createElement('option');
                option.setAttribute('value', value);
                option.appendChild(document.createTextNode(value));
                campo.appendChild(option);
            }
        }
        div.appendChild(label);
        div.appendChild(campo);
        $('#' + fm.formularioSeleccionado)[0].appendChild(div);
    }

    fm.mostrarCamposEnListado();
}

fm.crearCampoInput = function () {
    let _nombre = $('#campo-nombre').val();
    let _campo  = $('#campo-val').val();
    let _tipo   = $('#campo-tipo').val();

    fm.formularios[fm.formularioSeleccionado][_nombre] = {
        campo: _campo,
        tipo: _tipo
    };
}

fm.crearCampoSelect = function () {
    let _nombre  = $('#campo-nombre').val();
    let _campo   = $('#campo-val').val();
    let _options = $('.select-opciones');

    let opciones = [];
    for (let i = 0; i < _options.length; i++) {
        let value = $(_options[i]).val();
        opciones.push(value);
    }

    fm.formularios[fm.formularioSeleccionado][_nombre] = {
        campo: _campo,
        opciones: opciones
    };
}

fm.cambiarTipoCampo = function () {
    let campo = $('#campo-val').val();
    fm.ocultarCampos();

    switch (campo) {
        case 'input':
            $('#input-tipo').css('display', 'table');
            break;
        case 'select':
            $('#select-tipo').css('display', 'table');
            break;
    }
}

fm.crearNuevaOpcion = function () {
    let div = document.createElement('div');
    let label = document.createElement('label');
    let input = document.createElement('input');
    
    label.appendChild(document.createTextNode('Opción: '));
    input.setAttribute('class', 'select-opciones');
    input.setAttribute('type', 'text');

    $('#select-contenedor-opciones')[0].appendChild(label);
    $('#select-contenedor-opciones')[0].appendChild(input);
    $('#select-contenedor-opciones')[0].appendChild(document.createElement('br'));
}

fm.abrirModificarCampo = function () {
    fm.modificarCampo = true;
    $('#campo-nombre').val(fm.campoSeleccionado);
    $('#campo-nombre')[0].setAttribute('readonly', true);
    $('#modal-crear').css('display', 'block');
}

fm.seleccionarCampo = function (nombreCampo) {
    $('#li-' + fm.formularioSeleccionado + campoSeleccionado).removeClass('campo-seleccionado');
    fm.campoSeleccionado = nombreCampo;
    $('#li-' + fm.formularioSeleccionado + campoSeleccionado).addClass('campo-seleccionado');
}

fm.borrarCampo = function () {
    delete fm.formularios[fm.formularioSeleccionado][fm.campoSeleccionado];
    fm.campoSeleccionado = '';
    fm.generarElementos();
}

fm.ocultarCampos = function () {
    $('#input-tipo').css('display', 'none');
    $('#select-tipo').css('display', 'none');
}

fm.existeFormulario = function (nombre) {
    return fm.formularios.hasOwnProperty(nombre);
}

fm.cerrarModal = function (idModal) {
    $(idModal).css('display', 'none');
}

fm.limpiarCamposModal = function () {
    $('#campo-nombre').val('');
    $('#select-contenedor-opciones').empty();
    fm.crearNuevaOpcion();
}

inicializar();