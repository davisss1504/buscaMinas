const $tablero = $('#board');
const FILAS = 10;
const COLUMNAS = 10;

function crearTablero(filas, columnas) {
  $tablero.empty();
  for (let i = 0; i < filas; i++) {
    const $fila = $('<div>').addClass('row');
    for (let j = 0; j < columnas; j++) {
      const $columna = $('<div>')
        .addClass('col hidden')
        .attr('data-row', i)
        .attr('data-col', j);
      if (Math.random() < 0.1) {
        $columna.addClass('mine');
      }
      $fila.append($columna);
    }
    $tablero.append($fila);
  }
}

function reiniciar() {
  crearTablero(FILAS, COLUMNAS);
}

function terminado(ganador) {
  let mensaje = null;
  let icono = null;
  if (ganador) {
    mensaje = 'GANASTE!';
    icono = 'fa fa-flag';
  } else {
    mensaje = 'PERDISTE!';
    icono = 'fa fa-bomb';
  }
  $('.col.mine').append(
    $('<i>').addClass(icono)
  );
  $('.col:not(.mine)')
    .html(function() {
      const $celda= $(this);
      const contador = recuentoMinas(
        $celda.data('row'),
        $celda.data('col'),
      );
      return contador === 0 ? '' : contador;
    })
  $('.col.hidden').removeClass('hidden');
  setTimeout(function() {
    alert(mensaje);
    reiniciar();
  }, 1000);
}

function revelar(oi, oj) {
  const vista = {};

  function ayuda(i, j) {
    if (i >= FILAS || j >= COLUMNAS || i < 0 || j < 0) return;
    const key = `${i} ${j}`
    if (vista[key]) return;
    const $celda =
      $(`.col.hidden[data-row=${i}][data-col=${j}]`);
    const contadorMina = recuentoMinas(i, j);
    if (
      !$celda.hasClass('hidden') ||
      $celda.hasClass('mine')
    ) {
      return;
    }

    $celda.removeClass('hidden');

    if (contadorMina) {
      $celda.text(contadorMina);
      return;
    }
    
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        ayuda(i + di, j + dj);
      }      
    }
  }

  ayuda(oi, oj);
}

function recuentoMinas(i, j) {
  let contador = 0;
  for (let di = -1; di <= 1; di++) {
    for (let dj = -1; dj <= 1; dj++) {
      const ni = i + di;
      const nj = j + dj;
      if (ni >= FILAS || nj >= COLUMNAS || nj < 0 || ni < 0) continue;
      const $celda =
        $(`.col.hidden[data-row=${ni}][data-col=${nj}]`);
      if ($celda.hasClass('mine')) contador++;
    }      
  }
  return contador;
}

$tablero.on('click', '.col.hidden', function() {
  const $celda = $(this);
  const fila = $celda.data('row');
  const columna = $celda.data('col');
  
  if ($celda.hasClass('mine')) {
    terminado(false);
  } else {
    revelar(fila, columna);
    const isGameOver = $('.col.hidden').length === $('.col.mine').length
    if (isGameOver) terminado(true);
  }
})

reiniciar();
