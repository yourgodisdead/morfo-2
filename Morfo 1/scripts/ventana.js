// 

// clase TVentana

function TVentana()
{
	// propiedades
	this.URL = "";
	this.HTML = "";
	this.height = 0;
	this.width = 0;
	this.left = 0;
	this.top = 0;
	this.directories = "no";
	this.location = "";
	this.menubar = "no";
	this.resizable = "yes";
	this.scrollbars = "yes";
	this.status = "no";
	this.toolbars = "no";	
	this.fullscreen = "no";
	this.channelmode = "no";
	// metodos
	this.Mostrar = TVentana_Mostrar;
}

// metodo TVentana.Mostrar
function TVentana_Mostrar()
{
	var features = "";
	features += "directories=" + this.directories;
	features += ",height=" + this.height;
	features += ",width=" + this.width;
	features += ",left=" + this.left;
	features += ",top=" + this.top;
	features += ",location=" + this.location;
	features += ",menubar=" + this.menubar;
	features += ",resizable=" + this.resizable;
	features += ",scrollbars=" + this.scrollbars;
	features += ",status=" + this.status;
	features += ",toolbars=" + this.toolbars;	
	features += ",fullscreen=" + this.fullscreen;
	features += ",channelmode=" + this.channelmode;
	if(this.HTML != "")
	{
		this.Handler = window.open("","", features);
		this.Handler.document.write(this.HTML);
	}
	else
	{
		this.Handler = window.open(this.URL, "", features);
	}
}

function MostrarPopup(AURL, ARAspecto, APosicion)
{
	var v = new TVentana();
	v.URL = AURL;	
	v.width = Math.round(screen.width * ARAspecto);
	v.height = Math.round(screen.height * ARAspecto);
	v.left = Math.round((screen.width / 4) * (((APosicion-1) % 3 != 0)?(APosicion % 3):3));
	v.top = Math.round((screen.height / 4) * Math.ceil((APosicion-1) / 3));
	v.Mostrar();
}


// ********** se deja por compatibilidad con el cogigo ya escrito  ********
function MostrarVentana(lc,mb,r,sb,s,tb,h,w,l,t)
{		
	var features = "";	
	features += "directories= no";	
	features += ",location=" + "";	
	features += ",menubar=" + mb;
	features += ",resizable=" + r;
	features += ",scrollbars=" + sb;
	features += ",status=" + s;
	features += ",toolbars=" + tb;
	features += ",height=" + h;
	features += ",width=" + w;
	features += ",left=" + l;
	features += ",top=" + t;
	features += ",fullscreen= no";
	features += ",channelmode= no";
	window.open(lc,"",features);	
	
}