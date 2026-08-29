// Archivo: test.js
// Propósito: Contener las clases TTest, y TPregunta con las cuales 
//            representar un test con preguntas
// Autor: Emil Lima
// Fecha: 021003

// Constantes

var CharUnicoNoMarcado = "¡";
var CharUnicoMarcado = "¤";
var CharMultipleNoMarcado = "¨";
var CharMultipleMarcado = "þ";

// html del boton de accion
var HTMLBoton = 
	  	"<table width='80%'  border='0'>" + 
		  "<tr>" +
			"<td><div align='center'>" +
			  "<input name='btnAccion' type='button' id='btnAccion' value='#accion#' onclick='#objeto#.Accion()'>" +
			"</div></td>" +
		  "</tr>" +
		"</table>";
		
// plantilla de la tabla exterior de la pregunta
var HTMLTablaExterior = 
	"<table width='80%' border='0' align='center' cellpadding='0' cellspacing='2'>" +
	  "<tr>" + 
		"<td width='10'>#numero#.</td>" +
		"<td>#texto pregunta#</td>" +
	  "</tr>" +
	  "<tr>" +
		"<td width='10'>&nbsp;</td>" +
		"<td>#tabla interior#</td>" +
	  "</tr>" +
	"</table>";
	
// plantilla de la tabla interior de la pregunta 
var HTMLTablaInterior = 
	  "<table width='100%' border='0' cellspacing='2' cellpadding='0'>" +
	    "#filas#" +        
       "</table>";

// plantilla de las filas de la tabla interior de la pregunta
var HTMLFilaTablaInteriorPregunta = 
		"<tr>" + 
          "<td width='10'><input type='#tipo control#' name='#nombre input#' value=''></td>" +
          "<td>#texto alternativa#</td>" +
         "</tr>"

// plantilla de las filas de la tabla interior de la respuesta
var HTMLFilaTablaInteriorRespuesta = 
		"<tr>" + 
          "<td width='10'><font face='wingdings'>#caracter#</font></td>" +
          "<td>#texto alternativa#</td>" +
         "</tr>"

//******************************** clase TTest  ***********************************
function TTest()
{
	// propiedades
	this.Id = ""; // Id del test
	this.Tipo = ""; // tipo del test
	this.Preguntas = new Array(); // preguntas del test
	this.Calificacion = 0; // calificacion obtenida en el test
	// metodo
	this.Cargar = CargarTest; // carga un test desde un archivo
	this.AdicionarPregunta = AdicionarPregunta;
	this.Comenzar = ComenzarTest;
	this.Terminar = TerminarTest;
	this.Mostrar = MostrarTest; // mostrar el test completo
	this.Accion = AccionTest; // ejecuta la accion del test (evaluar o mostrar la respuesta)
	this.Evaluar = EvaluarRespuestaTest; // evaluar el test cargado
	this.MostrarRespuesta = MostrarRespuestaTest; // muestra la respuesta del test
}

//  metodo TTest.Cargar
function CargarTest()
{
	var t = DATOS_TEST.split("|");
	this.ID = t[0];
	this.Tipo = t[1];
	var p = DATOS_PREGUNTAS.split("||");
	for(var i = 0; i < p.length; i++)
	{
		this.AdicionarPregunta(i+1, p[i]);
	}
}

// metodo TTest.Comenzar
function ComenzarTest()
{
	document.write("<form name='" + this.ID + "'>");	
}

function TerminarTest(ABoton)
{
	if(ABoton)
	{
		var accion = (this.Tipo == "e") ? "Evaluate" : "Check";
		var objeto = "test";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		var htmlb = htmlb.replace(/#objeto#/, objeto);
		//document.write(HTMLBoton.replace(/#accion#/, accion)); 
	}
	document.write("</form>");
}

// metodo TTest.Mostrar
function MostrarTest()
{
	this.Comenzar();		
	for(var i = 0; i < this.Preguntas.length; i++)
	{
		this.Preguntas[i].Mostrar();
	}
	this.Terminar();	
}

// metodo TTest.Accion

function AccionTest()
{
	if(this.Tipo == "e")
	{
		var calif = this.Evaluar();
		this.MostrarRespuesta(calif);
	}
	else
	{
		this.MostrarRespuesta();
	}
}

// metodo TTest.Evaluar
function EvaluarRespuestaTest()
{
	var form = document.forms[this.ID];
	var cname = "";
	var cvalue = "";
	var calif = 0;
	for(var p = 0; p < this.Preguntas.length; p++)
	{
		calif += this.Preguntas[p].Evaluar();
	}
	return calif;
}

// metodo TTest.MostrarRespuesta
function MostrarRespuestaTest(ACalif)
{
	var html = "";
	for(var i = 0; i < this.Preguntas.length; i++)
	{
		html += this.Preguntas[i].HTMLRespuesta();
	}
	
	if(String(ACalif) != "undefined")
	{
		html += "<br>Calificacion: " + ACalif;
	}
	
	var v = new TVentana(html);
	v.HTML = html;
	v.width = 200;
	v.height = 100;
	v.status = "no";
	v.Mostrar();
}

// metodo TTest.AdicionarPregunta
function AdicionarPregunta(ANumPregunta, APreguntaData)
{
	switch(APreguntaData.charAt(0))
	{
		case "s": 
			this.Preguntas[this.Preguntas.length] = new TPreguntaSimple(this, ANumPregunta, APreguntaData);
			break;
		case "c":
			this.Preguntas[this.Preguntas.length] = new TPreguntaCompletar(this, ANumPregunta, APreguntaData);
			break;
	}
}

//************************  clase TPreguntaSimple    ************************************

function TPreguntaSimple(ATest, ANumPregunta, APreguntaData)
{
	// propiedades
	this.Test = ATest; // test a que pertenece la pregunta
	this.Numero = ANumPregunta; // numero de la pregunta
	this.Tipo = ""; // tipo de la pregunta (m - Multiple, u - Unica, a - Abierta)
	this.Texto = ""; // texto de la pregunta
	this.Alternativas = new Array(); // alternativas de respuesta de la pregunta
	this.Valor = 0; // valor de la pregunta
	// metodos
	this.Cargar = CargarPreguntaSimple; // carga una pregunta simple
	this.Mostrar = MostrarPreguntaSimple;
	this.Evaluar = EvaluarPreguntaSimple; // evalua una pregunta
	this.Accion = AccionPreguntaSimple; // checkea o evalua la pregunta segun el tipo
	this.HTMLRespuesta = HTMLRespuestaSimple; // devuelve el html de la respuesta de una pregunta simpel
	this.MostrarRespuesta = MostrarRespuestaPreguntaSimple; // muestra la respuesta de una pregunta simple
	//this.RespuetaU = RespuetaUSimple; // devuelve la respuesta que dio el usuario
	
	// cargar las preguntas
	this.Cargar(ANumPregunta, APreguntaData);
}

// metodo TPreguntaSimple.Cargar
function CargarPreguntaSimple(ANumPregunta, APreguntaData)
{
	this.Numero = ANumPregunta;
	var p = APreguntaData.split("|");
	this.Tipo = p[0].charAt(0);
	this.Subtipo = p[0].charAt(1);
	this.Texto = p[1];
	this.Valor = p[2]*1;
	if(this.Subtipo == "m" || this.Subtipo == "u")
	{
		for(var i = 3; i < p.length; i++)
		{
			this.Alternativas[this.Alternativas.length] = new TAlternativa(this, p[i]);
		}
	}
}

// metodo TPreguntaSimple.Mostrar
function MostrarPreguntaSimple(ABoton)
{
	var tipo_control = (this.Subtipo=="m") ? "checkbox" : "radio";
	var HTMLFTI = HTMLFilaTablaInteriorPregunta.replace(/#tipo control#/, tipo_control);
	
	// crear las filas de la tabla interior
	var filas = "";
	var fila = "";
	var ni = "";
	for(var i = 0; i < this.Alternativas.length; i++)
	{
		fila = HTMLFTI.replace(/#nombre input#/, "p" + this.Numero + "_" + i)
		fila = fila.replace(/#texto alternativa#/, this.Alternativas[i].Texto);
		filas += fila;
	}
	
	// llenar las plantillas
	var HTMLTI = HTMLTablaInterior.replace(/#filas#/, filas);
	var HTMLTE = HTMLTablaExterior.replace(/#numero#/, this.Numero);
	var HTMLTE = HTMLTE.replace(/#texto pregunta#/, this.Texto);
	
	var HTMLTodo = HTMLTE.replace(/#tabla interior#/, HTMLTI);
	
	document.write(HTMLTodo);
	
	if(ABoton)
	{
		var accion = (this.Tipo == "e") ? "Evaluate" : "Check";
		var objeto = "test.Preguntas[" + String(this.Numero-1) + "]";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		var htmlb = htmlb.replace(/#objeto#/, objeto);
		document.write(htmlb); 
	}
}

// function TPreguntaSimple.MostrarRespuesta
function MostrarRespuestaPreguntaSimple()
{
	var v = new TVentana();
	v.HTML = this.HTMLRespuesta();
	v.width = 200;
	v.height = 100;
	v.status = "no";
	v.Mostrar();
}

// metodo TPregunta.HTMLRespuesta
function HTMLRespuestaSimple()
{
	var MatCaracter = new Array();
	MatCaracter["u,true"] = CharUnicoMarcado;
	MatCaracter["u,false"] = CharUnicoNoMarcado;
	MatCaracter["m,true"] = CharMultipleMarcado;
	MatCaracter["m,false"] = CharMultipleNoMarcado;
	var char;
	var HTMLFTI = HTMLFilaTablaInteriorRespuesta;
	
	// crear las filas de la tabla interior
	var filas = "";
	var fila = "";
	var ni = "";
	for(var i = 0; i < this.Alternativas.length; i++)
	{
		fila =  HTMLFTI.replace(/#caracter#/, MatCaracter[this.Subtipo + "," + this.Alternativas[i].OK]);
		fila = fila.replace(/#texto alternativa#/, this.Alternativas[i].Texto);
		filas += fila;
	}
	
	// llenar las plantillas
	var HTMLTI = HTMLTablaInterior.replace(/#filas#/, filas);
	var HTMLTE = HTMLTablaExterior.replace(/#numero#/, this.Numero);
	var HTMLTE = HTMLTE.replace(/#texto pregunta#/, this.Texto);
	
	var HTMLTodo = HTMLTE.replace(/#tabla interior#/, HTMLTI);
	return HTMLTodo;
}

// metodo TPregunta.Evaluar
function EvaluarPreguntaSimple(AForm)
{
	var incr = this.Valor / this.Alternativas.length;
	var calif = 0
	switch(this.Subtipo)
	{
		case "u":
				for(var a = 0; a < this.Alternativas.length; a++)
				{
					if(AForm.elements[this.Alternativas[a].ID].checked && this.Alernativas[a].OK)
					{
						calif = this.Valor;
					}
				}
			break;
		case "m":
			break;
				return this.Valor;
	}
	return calif;
}

// metodo TPreguntaCompuesta.Accion
function AccionPreguntaSimple()
{
	if(this.Test.Tipo == "e")
	{
		var calif = this.Evaluar();
		this.MostrarRespuesta(calif);
	}
	else
	{
		this.MostrarRespuesta();		
	}
}

//*************************** clase TPreguntaCompletar ********************************

function TPreguntaCompletar(ATest, ANumPregunta, APreguntaData)
{
	// propiedades
	this.Test = ATest; // test a que pertenece la pregunta
	this.Numero = ANumPregunta; // numero de la pregunta
	this.Tipo = ""; // tipo de la pregunta (m - Multiple, u - Unica, a - Abierta)
	this.Texto = ""; // texto de la pregunta
	this.Frase = ""; // frase a completar
	this.Valores = new Array(); // valores a completar
	this.Valor = 0; // valor de la pregunta
	// metodos
	this.Cargar = CargarPreguntaCompletar; // carga una pregunta de comletar
	this.Mostrar = MostarPreguntaCompletar;  // muestra la pregunta
	this.MostrarRespuesta = MostrarRespuestaPreguntaCompletar;  // muestra la pregunta
	this.Evaluar = EvaluarPreguntaCompletar; // evalua una pregunta de completar
	this.Accion = AccionPreguntaCompletar; // checkea o evalua la pregunta segun el tipo
	this.HTMLFrase = HTMLFrase; // genera el HTML de la frase con los controles necesarios
	this.HTMLFraseRespuesta = HTMLFraseRespuesta; // genera el HTML de la frase ya completada
	this.HTMLRespuesta = HTMLRespuestaCompletar; // devuelve le HTML de la respuesta de una pregunta de completar
	// cargar las preguntas
	this.Cargar(ANumPregunta, APreguntaData);
}

// metodo TPreguntaCompletar.Cargar
function CargarPreguntaCompletar(ANumPregunta, APreguntaData)
{
	this.Numero = ANumPregunta;
	var p = APreguntaData.split("|");
	this.Tipo = p[0].charAt(0);
	this.Subtipo = p[0].charAt(1);
	this.Texto = p[1];
	this.Valor = p[2]*1;
	this.Frase = p[3];
	var a;
	for(var i = 4; i < p.length; i++)
	{
		this.Valores[this.Valores.length] = new TValor(this, p[i]);		
	}
}

// metodo TPreguntaCompletar.Mostrar
function MostarPreguntaCompletar(ABoton)
{
	var HTMLTE = HTMLTablaExterior.replace(/#numero#/, this.Numero);
	var HTMLTE = HTMLTE.replace(/#texto pregunta#/, this.Texto);
	
	var HTMLTodo = HTMLTE.replace(/#tabla interior#/, this.HTMLFrase());
	
	document.write(HTMLTodo);
	
	if(ABoton)
	{
		var accion = (this.Tipo == "e") ? "Evaluate" : "Check";
		var objeto = "test.Preguntas[" +  String(this.Numero-1) + "]";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		var htmlb = htmlb.replace(/#objeto#/, objeto);
		document.write(htmlb); 
	}
}

// metodo TPreguntaCompletar.HTMLFrase
function HTMLFrase()
{
	var html = this.Frase;
	var htmlcontrol = "";
	for(var i = 1; i <= this.Valores.length; i++)
	{
		switch(this.Subtipo)
		{
			case "a":
				htmlcontrol = "<input type='text' name='" + this.Valores[i-1].ID + "'>";
				break;
			case "c":
				//alert(this.Valores[i].Alternativas.length);
				htmlcontrol = "<select name='" + this.Valores[i-1].ID + "'>";
				for(var a = 0; a < this.Valores[i-1].Alternativas.length; a++)
				{
					//htmlcontrol += this.Valores[i-1].Alternativas.length;
					htmlcontrol += "<option value='" + this.Valores[i-1].Alternativas[a].Texto + "'>" + this.Valores[i-1].Alternativas[a].Texto + "</option>"
				}
				htmlcontrol += "</select>";
				break;
		}
		html = html.replace("%"+i+"%", htmlcontrol)
	}
	return html;
}

// metodo TPreguntaCompletar.HTMLFraseRespuesta
function HTMLFraseRespuesta()
{
	var html = this.Frase;
	var htmlvalor = "";
	for(var i = 1; i <= this.Valores.length; i++)
	{
		switch(this.Subtipo)
		{
			case "a":
				htmlvalor = "<b>" + this.Valores[i-1].Alternativas[0].Texto + "</b>";
				break;
			case "c":
				for(var a = 0; a < this.Valores[i-1].Alternativas.length; a++)
				{
					if(this.Valores[i-1].Alternativas[a].OK)
					{
						htmlvalor = "<b>" + this.Valores[i-1].Alternativas[a].Texto + "</b>";
					}
				}
				break;
		}
		html = html.replace("%"+i+"%", htmlvalor)
	}
	return html;
}

// function TPregunatCompuesta.MostrarRespuesta
function MostrarRespuestaPreguntaCompletar()
{
	var v = new TVentana();
	v.HTML = this.HTMLRespuesta();
	v.width = 200;
	v.height = 100;
	v.status = "no";
	v.Mostrar();
}

// metodo TPreguntaCompletar.HTMLRespuesta
function HTMLRespuestaCompletar()
{
	var HTMLTE = HTMLTablaExterior.replace(/#numero#/, this.Numero);
	var HTMLTE = HTMLTE.replace(/#texto pregunta#/, this.Texto);
	
	var HTMLTodo = HTMLTE.replace(/#tabla interior#/, this.HTMLFraseRespuesta());
	
	return HTMLTodo;
}

// metodo TPreguntaCompuesta.Evaluar
function EvaluarPreguntaCompletar()
{
	return this.Valor;
}

// metodo TPreguntaCompuesta.Accion
function AccionPreguntaCompletar()
{
	if(this.Test.Tipo == "e")
	{
		var calif = this.Evaluar();
		this.MostrarRespuesta(calif);
	}
	else
	{
		this.MostrarRespuesta();		
	}
}

//*****************************  clase TValor  *********************************

// clase TValor
function TValor(APregunta, ADataValor)
{
	// propiedades	
	this.Pregunta = APregunta; // pregunta a la que pertenece el valor
	this.ID = ""; // id del valor
	this.Alternativas = new Array();
	// metodos
	this.Cargar = CargarValor; // carga un valor de completamiento
	
	this.Cargar(ADataValor)
}

// metodo TValor.Cargar
function CargarValor(ADataValor)
{
	var v = ADataValor.split(",");
	this.ID = v[0]; 
	for(var i = 1; i < v.length; i++)
	{
		this.Alternativas[this.Alternativas.length] = new TAlternativa(this, v[i]);
	}
}

//*****************************  clase TAlternativa  *********************************

function TAlternativa(APadre, ADataAlternativa)
{
	this.Padre = APadre; // padre de la alternativa, puede ser una pregunta o un valor
	if(ADataAlternativa.charAt(0) == "*")
	{
		this.Texto = ADataAlternativa.slice(1);
		this.OK = true;
	}
	else
	{
		this.Texto = ADataAlternativa;
		this.OK = false;
	}
}
