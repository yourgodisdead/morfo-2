// Archivo: testengine.js
// Propósito: Contener las clases TTest, y TPregunta con las cuales 
//            representar un test con preguntas
// Autor: Emil Lima
// Fecha: 021003

//*************************** Constantes  *****************************

// estilos

var EstiloTextoPregunta = "textonegro";
var EstiloAlternativaPregunta = "texto";
var EstiloFrasePregunta = "texto";
var EstiloCampo = "texto";
var EstiloBotonAccion = "boton";
var EstiloCampoOK = "textoazul";
var EstiloCampoMal = "textororect";
var EstiloCaracterGraficoOK =  "caractergraficok";
var EstiloCaracterGraficoMal = "caractergraficomal"
var EstiloCalificacion = "textonegro";

// caracteres
var CharUnicoNoMarcado = "¡";
var CharUnicoMarcado = "¤";
var CharMultipleNoMarcado = "¨";
var CharMultipleMarcado = "þ";

// datos de los popups de chequeo y evaluacion
var POPUP_ANCHO = screen.width / 2;
var POPUP_ALTO = screen.height / 2;
var POPUP_X = Math.round(screen.width / 2 - POPUP_ANCHO / 2);
var POPUP_Y = Math.round(screen.height / 2 - POPUP_ALTO / 2); 

// plantillas HTML
var HTMLBoton = 
	  	"<table width='100%'  border='0'>" + 
		  "<tr>" +
			"<td><div align='center'>" +
			  "<input name='btnAccion' class='" + EstiloBotonAccion + "'  type='button' id='btnAccion' value='#accion#' onclick='#objeto#.Accion()'>" +
			"</div></td>" +
		  "</tr>" +
		"</table>";
var HTMLTablaExterior = 
	"<table width='100%' border='0' align='center' cellpadding='0' cellspacing='2' class='" + EstiloTextoPregunta + "'>" +
	  "<tr>" + 
		"<td>#texto pregunta#</td>" +
	  "</tr>" +
	  "<tr>" +
		"<td>#tabla interior#</td>" +
	  "</tr>" +
	"</table>";
var HTMLTablaInterior = 
	  "<table width='100%' border='0' cellspacing='2' cellpadding='0' class='" + EstiloAlternativaPregunta + "'>" +
	    "#filas#" +        
       "</table>";
var HTMLFilaTablaInteriorPregunta = 
		"<tr>" + 
          "<td width='10'><input type='#tipo control#' name='#nombre control#' id='#id control#' value='' #accionpregunta#></td>" +
          "<td>#texto alternativa#</td>" +
         "</tr>"
var HTMLFilaTablaInteriorRespuesta = 
		"<tr>" + 
          "<td width='10'><span class='#estilo#'>#caracter#</td>" +
          "<td>#texto alternativa#</td>" +
         "</tr>"
var HTMLTablaFrase = 
		"<table width='100%' border='0' cellspacing='2' cellpadding='0' class='" + EstiloFrasePregunta + "'>" +
	      "<tr>" +
		    "<td>#frase#</td>"+
		  "</tr>" +
       "</table>";
var HTMLPopup = 
		"<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01 Transitional//EN'>"+
		"<html><!-- InstanceBegin template='/Templates/popup.dwt' codeOutsideHTMLIsLocked='false' -->"+
		"<head>"+
		"<!-- InstanceBeginEditable name='doctitle' -->"+
		"<title>#titulo#</title>"+
		"<!-- InstanceEndEditable --><meta http-equiv='Content-Type' content='text/html; charset=iso-8859-1'>"+
		"<!-- InstanceBeginEditable name='head' --><!-- InstanceEndEditable -->"+
		"<link href='../../../estilos/biologicas.css' rel='stylesheet' type='text/css'>"+
		"</head>"+
		"<body rightmargin='0' leftmargin='0' topmargin='0' bottommargin='0' bgcolor='#FDF7E2'>"+
		"<!-- InstanceBeginEditable name='contenido' -->"+
		"#contenido#"+
		"<!-- InstanceEndEditable --></body>"+
		"<!-- InstanceEnd --></html>";
		
		

//***************************  funciones auxiliares **********************

function findObj(theObj, theDoc)
{
  var p, i, foundObj;
  
  if(!theDoc) theDoc = document;
  if( (p = theObj.indexOf("?")) > 0 && parent.frames.length)
  {
    theDoc = parent.frames[theObj.substring(p+1)].document;
    theObj = theObj.substring(0,p);
  }
  if(!(foundObj = theDoc[theObj]) && theDoc.all) foundObj = theDoc.all[theObj];
  for (i=0; !foundObj && i < theDoc.forms.length; i++) 
    foundObj = theDoc.forms[i][theObj];
  for(i=0; !foundObj && theDoc.layers && i < theDoc.layers.length; i++) 
    foundObj = findObj(theObj,theDoc.layers[i].document);
  if(!foundObj && document.getElementById) foundObj = document.getElementById(theObj);
  
  return foundObj;
}

//******************************** clase TTest  ***********************************
function TTest()
{
	// propiedades
	this.Id = ""; // Id del test
	this.Tipo = ""; // tipo del test
	this.Preguntas = new Array(); // preguntas del test
	this.Calificacion = 0; // calificacion obtenida en el test
	// metodos
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

// metodo TTest.Terminar
function TerminarTest(ABoton)
{
	if(ABoton)
	{
		var accion = (this.Tipo == "e") ? "Evaluate" : "Chequear";
		var objeto = "test";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		var htmlb = htmlb.replace(/#objeto#/, objeto);
		document.write(htmlb); 
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
	var titulo = (this.Tipo == "c") ? "Chequeo" : "Calificación";
	var html = "";
	for(var i = 0; i < this.Preguntas.length; i++)
	{
		html += this.Preguntas[i].HTMLRespuesta();
	}
	
	if(String(ACalif) != "undefined")
	{
		html += "<br><span class='" + EstiloCalificacion + "'>Mark: " + ACalif + "</span>";
	}

	html = HTMLPopup.replace(/#contenido#/, html);
	html = html.replace("#titulo#", titulo);
	var v = new TVentana();	
	v.HTML = html;
	v.width = POPUP_ANCHO;
	v.height = POPUP_ALTO;
	v.top = POPUP_Y;
	v.left = POPUP_X;
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
	this.Imagen = p[3];
	this.Accionpregunta = p[4];

	if(this.Subtipo == "m" || this.Subtipo == "u")
	{
		for(var i = 5; i < p.length; i++)
		{
			this.Alternativas[this.Alternativas.length] = new TAlternativa(this, p[i], "p" + String(this.Numero) + "_" + String(i-3));
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
	var ncontrol = "";
	for(var i = 0; i < this.Alternativas.length; i++)
	{
		if(this.Subtipo == "u")
		{
			ncontrol = "p_" + this.Numero;
		}
		else
		{
			ncontrol = "p_" + this.Numero + "_" + i;
		}
		fila = HTMLFTI.replace(/#nombre control#/, ncontrol);
		if((this.Alternativas[i].OK) && (this.Accion != '0'))
		{
			fila = fila.replace(/#accionpregunta#/, this.Accionpregunta);
		}
		fila = fila.replace(/#id control#/, this.Alternativas[i].ID);
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
		var accion = (this.Test.Tipo == "e") ? "Evaluar" : "Chequear";
		var objeto = "test.Preguntas[" + String(this.Numero-1) + "]";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		var htmlb = htmlb.replace(/#objeto#/, objeto);
		document.write(htmlb); 
	}
}

// function TPreguntaSimple.MostrarRespuesta
function MostrarRespuestaPreguntaSimple(ACalif)
{
	var titulo = (this.Test.Tipo == "c") ? "Chequeo" : "Calificación";
	var html =  this.HTMLRespuesta();
	if(String(ACalif) != "undefined")
	{
		html += "<br><span class='" + EstiloCalificacion + "'>Calificación: " + ACalif + "</span>";
	}
	html = HTMLPopup.replace(/#contenido#/, html);
	html = html.replace("#titulo#", titulo);
	var v = new TVentana();
	v.HTML = html;
	v.width = POPUP_ANCHO;
	v.height = POPUP_ALTO;
	v.top = POPUP_Y;
	v.left = POPUP_X;
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
	var estilo = "";
	var obj;
	for(var i = 0; i < this.Alternativas.length; i++)
	{
		obj = findObj(this.Alternativas[i].ID);
		switch(this.Subtipo)
		{
			case "u":
				if(obj.checked == this.Alternativas[i].OK)
				{
					estilo = EstiloCaracterGraficoOK;
				}
				else
				{
					estilo = EstiloCaracterGraficoMal;
				}
				break;
			case "m":
				if(obj.checked == this.Alternativas[i].OK)
				{
					estilo = EstiloCaracterGraficoOK;
				}
				else
				{
					estilo = EstiloCaracterGraficoMal;
				}
				break;
		}
		
		fila =  HTMLFTI.replace(/#caracter#/, MatCaracter[this.Subtipo + "," + this.Alternativas[i].OK]);
		fila = fila.replace(/#estilo#/, estilo)
		if((this.Alternativas[i].OK) && (this.Imagen != '0'))
		{
			fila += this.Imagen; 
		}
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
function EvaluarPreguntaSimple()
{
	var incr = this.Valor / this.Alternativas.length;
	var calif = 0;
	var obj;
	for(var a = 0; a < this.Alternativas.length; a++)
	{
		obj = findObj(this.Alternativas[a].ID);
		switch(this.Subtipo)
		{
			case "u":
				if(obj.checked && this.Alternativas[a].OK)
				{
					calif = this.Valor;
				}
				break;
			case "m":
				if((obj.checked == this.Alternativas[a].OK) )
				{
					calif += incr;
				}
				break;
		}
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
	this.Campos = new Array(); // Campos a completar
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
		this.Campos[this.Campos.length] = new TCampo(this, p[i], i-4);		
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
		var accion = (this.Test.Tipo == "e") ? "Evaluate" : "Chequear";
		var objeto = "test.Preguntas[" +  String(this.Numero-1) + "]";
		var htmlb = HTMLBoton.replace(/#accion#/, accion);
		htmlb = htmlb.replace(/#objeto#/, objeto);
		document.write(htmlb); 
	}
}

// metodo TPreguntaCompletar.HTMLFrase
function HTMLFrase()
{
	var html = HTMLTablaFrase.replace(/#frase#/,this.Frase);
	var htmlcontrol = "";
	for(var i = 1; i <= this.Campos.length; i++)
	{
		switch(this.Subtipo)
		{
			case "a":
				htmlcontrol = "<input type='text' name='" + this.Campos[i-1].ID + "' id='" + this.Campos[i-1].ID + "' class='" + EstiloCampo + "'>";
				break;
			case "c":
				//alert(this.Valores[i].Alternativas.length);
				htmlcontrol = "<select name='" + this.Campos[i-1].ID + "' id='" + this.Campos[i-1].ID + "' class='" + EstiloCampo + "'>";
				for(var a = 0; a < this.Campos[i-1].Alternativas.length; a++)
				{
					//htmlcontrol += this.Valores[i-1].Alternativas.length;
					htmlcontrol += "<option value='" + this.Campos[i-1].Alternativas[a].Texto + "'>" + this.Campos[i-1].Alternativas[a].Texto + "</option>"
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
	var html = HTMLTablaFrase.replace(/#frase#/,this.Frase);
	var htmlcampo = "";
	var estilo;
	var texto;
	var obj;
	for(var c = 0; c < this.Campos.length; c++)
	{   
		obj = findObj(this.Campos[c].ID);
		switch(this.Subtipo)
		{
			case "a":
				texto = this.Campos[c].RespuestaOK();
				estilo = (this.Campos[c].RespuestaOK() == obj.value) ? EstiloCampoOK : EstiloCampoMal;
				break;
			case "c":
				texto = this.Campos[c].RespuestaOK();
				estilo = (this.Campos[c].RespuestaOK().indexOf(obj.value) != -1) ? EstiloCampoOK : EstiloCampoMal;
				break;
		}
		htmlcampo = "<span class='" + estilo + "'>" + texto + "</span>";
		html = html.replace("%"+(c+1)+"%", htmlcampo);
	}
	return html;
}

// function TPregunatCompuesta.MostrarRespuesta
function MostrarRespuestaPreguntaCompletar(ACalif)
{
	var titulo = (this.Test.Tipo == "c") ? "Chequeo" : "Calificación";
	var html = this.HTMLRespuesta();
	if(String(ACalif) != "undefined")
	{
		html += "<br><span class='" + EstiloCalificacion + "'>Calificación: " + ACalif + "</span>";
	}
	
	html = HTMLPopup.replace(/#contenido#/, html);
	html = html.replace("#titulo#", titulo);
	var v = new TVentana();
	v.HTML = html;
	v.width = POPUP_ANCHO;
	v.height = POPUP_ALTO;
	v.left = POPUP_X;
	v.top = POPUP_Y
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
	var calif = 0;
	var incr = this.Valor / this.Campos.length;
	var obj;
	var ok;
	for(var c = 0; c < this.Campos.length; c++)
	{
		obj = findObj(this.Campos[c].ID);
		switch(this.Subtipo)
		{
			case "a":
				ok = this.Campos[c].RespuestaOK() == obj.value;
				break;
			case "c":
				ok = this.Campos[c].RespuestaOK().indexOf(obj.value) != -1;
				break;
		}
		if(ok)
		{
			calif += incr;
		}
	}
	return Math.round(calif);
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

//*****************************  clase TCampo  *********************************

// clase TCampo
function TCampo(APregunta, ADataCampo, ANumCampo)
{
	// propiedades	
	this.Pregunta = APregunta; // pregunta a la que pertenece el Campo
	this.ID = ""; // id del valor
	this.Alternativas = new Array();
	// metodos
	this.Cargar = CargarCampo; // carga un Campo de completamiento
	this.RespuestaOK = RespuestaOKCampo; // devuelve la respuesta de un campo de completar
	
	this.Cargar(ADataCampo, ANumCampo);
}

// metodo TCampo.Cargar
function CargarCampo(ADataCampo, ANumCampo)
{
	var v = ADataCampo.split(",");
	this.ID = "p_" + this.Pregunta.Numero + "_c_" + ANumCampo; 
	for(var i = 0; i < v.length; i++)
	{
		this.Alternativas[this.Alternativas.length] = new TAlternativa(this, v[i]);
	}
}


//metodo TCampo.RespuestaOK
function RespuestaOKCampo()
{
	var ok = "";
	for(var a = 0; a < this.Alternativas.length; a++)
	{
		if(this.Alternativas[a].OK)
		{
			ok += " o " + this.Alternativas[a].Texto;
		}
	}
	return ok.slice(3);
}

//*****************************  clase TAlternativa  *********************************

function TAlternativa(APadre, ADataAlternativa, AID)
{
	this.Padre = APadre; // padre de la alternativa, puede ser una pregunta o un valor
	if(String(AID) != "undefined")
	{
		this.ID = AID;
		//alert(this.ID);
	}
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
