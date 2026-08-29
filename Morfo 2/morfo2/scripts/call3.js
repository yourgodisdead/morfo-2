function MM_findObj(n, d) { 
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document); return x;
}
function MM_swapImage() { 
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
function MM_swapImgRestore() { 
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { 
 var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
   var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
   if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function fwLoadMenus() {
  window.fw_menu_0 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#F7B67F","#084A37");
  fw_menu_0.addMenuItem("Introducción","location='../Seminario-1/introduccion.htm'");
  fw_menu_0.addMenuItem("Objetivos","location='../Seminario-1/objetivos.htm'");
  fw_menu_0.addMenuItem("Sumario","location='../Seminario-1/sumario.htm'");
  fw_menu_0.addMenuItem("Preparación","location='../Seminario-1/preparacion.htm'");
  fw_menu_0.addMenuItem("Consulta Docente","location='../Seminario-1/consulta.htm'");
  fw_menu_0.addMenuItem("Autoevaluación","location='../Seminario-1/autoevaluacion.htm'");
  fw_menu_0.fontWeight="bold";
   fw_menu_0.hideOnMouseOut=true;


  window.fw_menu_1 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#F7B67F","#084A37");
    fw_menu_1.addMenuItem("Técnica","location='../Práctica-2/tecnicasdelaboratorio.htm'");
	fw_menu_1.addMenuItem("Autopreparación","location='../Práctica-2/autopreparacion.htm'");
  fw_menu_1.addMenuItem("Procedimiento","location='../Práctica-2/procedimiento.htm'");
  fw_menu_1.addMenuItem("Problema","location='../Práctica-2/problema.htm'");  
  fw_menu_1.fontWeight="bold";
  fw_menu_1.hideOnMouseOut=true;

  
  
  
  fw_menu_1.writeMenus();
} 