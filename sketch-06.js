const canvasSketch = require('canvas-sketch');
const random  = require('canvas-sketch-util/random') // Ruido de Pit
const math  = require('canvas-sketch-util/math')     // mapRange
const Tweakpane = require('tweakpane');              // Paqueteria de Tweakpane

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true         // da permiso de animar
};

const params = {        // Objeto de Tweakpane
  cols: 10,             // columnas
  rows: 10,             // líneas
  scaleMin: 1,          // Escala mínima
  scaleMax: 30,         // Escala máxima
  freq: 0.001,          // Frecuencia
  amp: 0.2,             // Amp
  frame: 0,             // Para el control de frames
  animate: true,        // Para el control de la animación
  lineCap: 'butt',      // Para el control de las formas
  backColor: '#ff0055', // Para el control de los colores
  stripeColor: '#ffff', // Para el control de los colores
  overlay: {r: 1, g: 0, b: 0.33},
};


const sketch = () => {
  return ({ context, width, height, frame }) => { // se declara frame para el uso de la animación
    context.fillStyle = params.backColor;
    context.fillRect(0, 0, width, height);
    
    
    const cols = params.cols;             // número de columnas
    const rows = params.rows;             // número de lineas
    const numCells = cols * rows ;        // número de celdas
    
    const gridw = width  * 0.8;           // Es el ancho multiplicado por  el tamaño de la dimensión del canvas
    const gridh = height * 0.8;           // Es al altura multiplicada por  el tamaño de la dimensión del canvas
    const cellw = gridw / cols;           // Es el ancho de la cuadricula dividido por el número de columnas
    const cellh = gridh / rows;           // Es la altura de la cuadrícula dividida por número de filas
    const margx = (width - gridw)  * 0.5; // Margen del eje X
    const margy = (height - gridh) * 0.5; // margen del eje Y
    
    for (let i = 0; i < numCells; i++) {
      const col = i % cols;               // Devuelve el resto de la división de i entre columnas
      const row = Math.floor(i / cols);   // Sirve para encontrar el final de la fila, verificando las N columnas. cada 4 pasos, el valor de la fila aumenta en 1
      
      const x = col * cellw;              // Encuentra el valor de x de cada celda
      const y = row * cellh;              // Encuentra el valor de y de cada celda
      const w = cellw * 0.8;              // Encuentra el valor del ancho
      const h = cellh * 0.8;              // Encuentra el valor de la altura

      const f = params.animate ? frame : params.frame; // Operador ternario para la animacion
      
      //El * N da la velocidad de la animación                   // Al multiplicarse por 0.001 y 0.2 or -0.2 logramos el efecto de agua en las celdas
      const n = random.noise3D(x, y, f * 10, params.freq);       // Es el número aleatorio para el ruido de Pit y también es el uso de la variable frame para la animación
      
  
      const angle = n * Math.PI * params.amp;                    // Le da un ángulo aleatorio a las celdas

      //const scale = (n + 1) / 2 * 30;                          // Le da una escala a las lineas
      //const scale = (n * 0.5 + 0.5) * 30; Esta es otra forma de hacerlo
      const scale = math.mapRange(n ,-1, 1, params.scaleMin, params.scaleMax);
      
      context.save();
      context.translate(x, y);
      context.translate(margx, margy);                // Ayudan a centrar la imágen en el centro
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);                          // Hace la rotación del ángulo 
      
      context.lineWidth = scale;                      // Ancho de las lineas
      context.lineCap = params.lineCap;

      context.strokeStyle = params.stripeColor;       // es la color de las lineas
      context.beginPath();
      context.moveTo(w * -0.5, 0);                    // Resta la mitad del ancho de la línea
      context.lineTo(w *  0.5, 0);                    // Es la mitad del ancho de la línea
      context.stroke();

      context.restore();
    }
    
  };
};

const createPane = () => {                            // Se almacena el panel como una variable
  const pane = new Tweakpane.Pane();
  let folder;

  
  
  folder = pane.addFolder({ title: 'Grid'});                    //Forlder para el control de escalas
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square'}});                           //Determina el line cap
  folder.addInput(params, 'cols',{ min: 2, max: 50, step: 1 }); //Determina los valores de la tabla en las columnas
  folder.addInput(params, 'rows',{ min: 2, max: 50, step: 1 }); //Determina los valores de la tabla en las filas
  folder.addInput(params, 'scaleMin',{ min: 1, max: 100 });
  folder.addInput(params, 'scaleMax',{ min: 1, max: 100 });

  folder = pane.addFolder({ title: 'Noise' });                  //Forlder para el control del ruido
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });   //Determina la frecuencia
  folder.addInput(params, 'amp', { min: 0, max: 1 });           //Determina la ampliación
  folder.addInput(params, 'animate');                           //Determina la animación booleanamente
  folder.addInput(params, 'frame', { min: 0, max: 999});        //Determina los frames
  folder = pane.addFolder({ title: 'Color' });                  //Forlder para el control del color
  folder.addInput(params, 'backColor');
  folder.addInput(params, 'stripeColor');
  //folder.addInput(params, 'overlay' , {
    //color: {type: 'float'},});                                //Determina los colores
};


createPane();
canvasSketch(sketch, settings);
