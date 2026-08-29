// 

// clase TVentana

function TVentana(AHTML)
{
	// propiedades
	this.HTML = AHTML;
	this.directories = "no";
	this.height = 0;
	this.location = "";
	this.menubar = "yes";
	this.resizable = "yes";
	this.scrollbars = "yes";
	this.status = "yes";
	this.toolbars = "no";
	this.width = 0;
	this.left = 0;
	this.top = "0";
	this.fullscreen = "no";
	this.channelmode = "no";
	// metodos
	this.Mostrar = MostrarVentana;
}

// metodo TVentana.Mostrar
function MostrarVentana()
{
	var features = "";
	features += "directories=" + this.directories;
	features += ",height=" + this.height;
	features += ",location=" + this.location;
	features += ",menubar=" + this.menubar;
	features += ",resizable=" + this.resizable;
	features += ",scrollbars=" + this.scrollbars;
	features += ",status=" + this.status;
	features += ",toolbars=" + this.toolbars;
	features += ",width=" + this.width;
	features += ",left=" + this.left;
	features += ",top=" + this.top;
	features += ",fullscreen=" + this.fullscreen;
	features += ",channelmode=" + this.channelmode;
	this.Handler = window.open("","",features);
	if(this.HTML != "undefined")
	{
		this.Handler.document.write(this.HTML);
	}
	
}