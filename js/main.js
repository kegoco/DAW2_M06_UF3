var fm = this;
fm.contenedorFormularios = undefined;
fm.formularios = {};
fm.formularioSeleccionado = '';
fm.modificarCampo = false;
fm.campoSeleccionado = '';

/**
 * @name inicializar
 * @desc Coge la referencia al contenedor de formularios.
 */
function inicializar() {
    console.log('::: Aplicación inicializada :::');
    fm.contenedorFormularios = $('.contenedor-formularios')[0];
}

/**
 * @name crearFormulario
 * @desc Coge el nombre del campo de texto, le quita los espacios y lo guarda en el objeto de formularios.
 */
fm.crearFormulario = function () {
    let cfNombre = $('#cf-nombre').val();
    cfNombre = cfNombre.replace(/ /g, '_');
    if (fm.existeFormulario(cfNombre) == false && cfNombre != '') {
        // Exito: Se procede a generar la vista del formulario.
        fm.generarFormulario(cfNombre);
    }
    else if (cfNombre == '') {
        // Error: No se ha especificado ningún nombre.
        $('#mensaje-error').text('Para crear un formulario hay que especificar un nombre válido.');
        $('#modal').css('display', 'block');
    }
    else {
        // Error: Ya existe un formulario con ese nombre.
        $('#mensaje-error').text('Ya existe un formulario llamado: ' + cfNombre + '.');
        $('#modal').css('display', 'block');
    }
}

/**
 * @name generarFormulario
 * @desc Se crea un pequeño espacio en la vista para el nuevo formulario, le pone el nombre como título e introduce el formulario en el objeto de formularios.
 */
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

/**
 * @name abrirModalModificarForm
 * @desc Abre el modal de modificar formulario.
 */
fm.abrirModalModificarForm = function () {
    $('#modificar-formulario').val(fm.formularioSeleccionado);
    $('#modal-modificar-form').css('display', 'block');
}

/**
 * @name modificarFormulario
 * @desc Cambia el nombre del formulario seleccionado por uno nuevo.
 */
fm.modificarFormulario = function () {
    let nuevoNombre = $('#modificar-formulario').val();
    nuevoNombre = nuevoNombre.replace(/ /g, '_');
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

/**
 * @name borrarFormulario
 * @desc Borra el formulario seleccionado del objeto y de la vista.
 */
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

/**
 * @name crearListadoFormularios
 * @desc Muestra el objeto de formularios en formato lista en la vista.
 */
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

/**
 * @name seleccionarFormulario
 * @desc Selecciona el formulario que el usuario desee y le aplica un estilo a la vista.
 */
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

/**
 * @name abrirCrearCampo
 * @desc Abre el modal de crear campos.
 */
fm.abrirCrearCampo = function () {
    fm.modificarCampo = false;
    $('#modal-crear').css('display', 'block');
}

/**
 * @name mostrarCamposEnListado
 * @desc Muestra los campos del formulario seleccionado en forma de lista en la vista.
 */
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

/**
 * @name crearCampo
 * @desc Cuando el usuario le da a crear campo esta función se encarga de llamar a las funciones necesarias para generar el campo correctamente.
 */
fm.crearCampo = function () {
    let campo = $('#campo-val').val();
    switch (campo) {
        case 'input':
            fm.crearCampoInput();
            break;
        case 'select':
            fm.crearCampoSelect()
            break;
        case 'radio':
        case 'checkbox':
            fm.crearCampoRadioButton();
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

/**
 * @name generarElementos
 * @desc Recorre los campos del objeto formulario seleccionado y los va mostrando en la vista.
 */
fm.generarElementos = function () {
    // Vacía el formulario:
    $('#' + fm.formularioSeleccionado).empty();

    // Genera el título del formulario:
    let title = document.createElement('h2');
    title.appendChild(document.createTextNode(fm.formularioSeleccionado));
    $('#' + fm.formularioSeleccionado)[0].appendChild(title);

    // Recorre los campos del formulario seleccionado y va generando el formulario:
    for (let index in fm.formularios[fm.formularioSeleccionado]) {
        let formVal = fm.formularios[fm.formularioSeleccionado][index];

        let div = document.createElement('div');
        div.setAttribute('id', fm.formularioSeleccionado + '_' + index);
        let label       = document.createElement('label');
        let label_texto = document.createTextNode(index + ': ');
        label.appendChild(label_texto);
        let campo       = document.createElement(formVal.campo);

        if (formVal.tipo != undefined) {
            // Inputs:
            campo.setAttribute('type', formVal.tipo);
            campo.setAttribute('minLength', formVal.minLength);
            campo.setAttribute('maxLength', formVal.maxLength);
        }
        if (formVal.opciones != undefined) {
            // Selects:
            for (let i = 0; i < formVal.opciones.length; i++) {
                let value = formVal.opciones[i];
                let option = document.createElement('option');
                option.setAttribute('value', value);
                option.appendChild(document.createTextNode(value));
                campo.appendChild(option);
            }
        }
        if (formVal.radios != undefined) {
            // Radio buttons y checkbox:
            for (let i = 0; i < formVal.radios.length; i++) {
                let value = formVal.radios[i];
                let div = document.createElement('div');
                let input = document.createElement('input');
                input.setAttribute('name', index);
                input.setAttribute('type', formVal.campo);
                div.appendChild(input);
                div.appendChild(document.createTextNode(value));
                campo.appendChild(div);
            }
        }
        div.appendChild(label);
        div.appendChild(campo);
        $('#' + fm.formularioSeleccionado)[0].appendChild(div);
    }

    // Llama a la función de generar el listado de campos:
    fm.mostrarCamposEnListado();
}

/**
 * @name crearCampoInput
 * @desc Crea el campo de tipo input y lo guarda en el objeto diccionario.
 */
fm.crearCampoInput = function () {
    let _nombre = $('#campo-nombre').val();
    let _campo  = $('#campo-val').val();
    let _tipo   = $('#campo-tipo').val();
    let _minLength = $('#input-min-long').val();
    let _maxLength = $('#input-max-long').val();

    fm.formularios[fm.formularioSeleccionado][_nombre] = {
        campo: _campo,
        tipo: _tipo,
        minLength: _minLength,
        maxLength: _maxLength
    };
}

/**
 * @name crearCampoSelect
 * @desc Crea el campo de tipo select y lo guarda en el objeto diccionario.
 */
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

/**
 * @name crearCampoRadioButton
 * @desc Crea el campo de tipo radio button y checkbox, y lo guarda en el objeto diccionario.
 */
fm.crearCampoRadioButton = function () {
    // NOTA: Para crear los radio buttons se reutiliza los campos de la creación de los selects.
    let _nombre  = $('#campo-nombre').val();
    let _campo   = $('#campo-val').val();
    let _radios = $('.select-opciones');

    let radios = [];
    for (let i = 0; i < _radios.length; i++) {
        let value = $(_radios[i]).val();
        radios.push(value);
    }

    fm.formularios[fm.formularioSeleccionado][_nombre] = {
        campo: _campo,
        radios: radios
    };
}

/**
 * @name cambiarTipoCampo
 * @desc Activa uno u otro div en el modal de creación de campo.
 */
fm.cambiarTipoCampo = function () {
    let campo = $('#campo-val').val();
    fm.ocultarCampos();

    switch (campo) {
        case 'input':
            $('#input-tipo').css('display', 'table');
            break;
        case 'select':
        case 'radio':
        case 'checkbox':
            $('#select-tipo').css('display', 'table');
            break;
    }
}

/**
 * @name crearNuevaOpcion
 * @desc Añade una nueva opción en el apartado de crear un campo de tipo select.
 */
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

/**
 * @name abrirModificarCampo
 * @desc Abre el modal de modificar campos.
 */
fm.abrirModificarCampo = function () {
    fm.modificarCampo = true;
    $('#campo-nombre').val(fm.campoSeleccionado);
    $('#campo-nombre')[0].setAttribute('readonly', true);
    $('#modal-crear').css('display', 'block');
}

/**
 * @name seleccionarCampo
 * @desc Selecciona el campo que desee el usuario y le aplica un estilo en la vista.
 */
fm.seleccionarCampo = function (nombreCampo) {
    $('#li-' + fm.formularioSeleccionado + campoSeleccionado).removeClass('campo-seleccionado');
    fm.campoSeleccionado = nombreCampo;
    $('#li-' + fm.formularioSeleccionado + campoSeleccionado).addClass('campo-seleccionado');
}

/**
 * @name borrarCampo
 * @desc Borra el campo seleccionado del formulario seleccionado.
 */
fm.borrarCampo = function () {
    delete fm.formularios[fm.formularioSeleccionado][fm.campoSeleccionado];
    fm.campoSeleccionado = '';
    fm.generarElementos();
}

/**
 * @name ocultarCampos
 * @desc Oculta los divs de cada tipo de campo del modal de crear campos.
 */
fm.ocultarCampos = function () {
    $('#input-tipo').css('display', 'none');
    $('#select-tipo').css('display', 'none');
}

/**
 * @name existeFormulario
 * @desc Comprueba si el nombre del formulario existe en el objeto de formularios.
 */
fm.existeFormulario = function (nombre) {
    return fm.formularios.hasOwnProperty(nombre);
}

/**
 * @name cerrarModal
 * @desc Cierra el modal que le indiquemos.
 */
fm.cerrarModal = function (idModal) {
    $(idModal).css('display', 'none');
}

/**
 * @name limpiarCamposModal
 * @desc Limpia los campos del modal de crear campos.
 */
fm.limpiarCamposModal = function () {
    $('#campo-nombre').val('');
    $('#select-contenedor-opciones').empty();
    fm.crearNuevaOpcion();
}

inicializar();