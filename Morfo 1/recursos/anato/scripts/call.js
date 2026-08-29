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
  window.fw_menu_0 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_0.addMenuItem("Introducción","location='../leccion1/introduccion.htm'");
  fw_menu_0.addMenuItem("Diálogo","location='../leccion1/dialogo.htm'");
  fw_menu_0.addMenuItem("Gramática","location='../leccion1/gramatica.htm'");
  fw_menu_0.addMenuItem("Práctica","location='../leccion1/practica.htm'");
  fw_menu_0.addMenuItem("Pon el español en acción","location='../leccion1/pon.htm'");
  fw_menu_0.fontWeight="bold";
   fw_menu_0.hideOnMouseOut=true;

  window.fw_menu_1 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
   fw_menu_1.addMenuItem("Introducción","location='../leccion2/introduccion.htm'");
  fw_menu_1.addMenuItem("Diálogo","location='../leccion2/dialogo.htm'");
  fw_menu_1.addMenuItem("Gramática","location='../leccion2/gramatica.htm'");
  fw_menu_1.addMenuItem("Práctica","location='../leccion2/practica.htm'");  
  fw_menu_1.addMenuItem("Pon el español en acción","location='../leccion2/pon.htm'");
  fw_menu_1.fontWeight="bold";
  fw_menu_1.hideOnMouseOut=true;

  window.fw_menu_2 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
    fw_menu_2.addMenuItem("Introducción","location='../leccion3/introduccion.htm'");
  fw_menu_2.addMenuItem("Diálogo","location='../leccion3/dialogo.htm'");
  fw_menu_2.addMenuItem("Gramática","location='../leccion3/gramatica.htm'");
  fw_menu_2.addMenuItem("Práctica","location='../leccion3/practica.htm'");  
  fw_menu_2.addMenuItem("Pon el español en acción","location='../leccion3/pon.htm'");
  fw_menu_2.fontWeight="bold";
  fw_menu_2.hideOnMouseOut=true;

  window.fw_menu_3 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_3.addMenuItem("Introducción","location='../leccion4/introduccion.htm'");
  fw_menu_3.addMenuItem("Diálogo","location='../leccion4/dialogo.htm'");
  fw_menu_3.addMenuItem("Gramática","location='../leccion4/gramatica.htm'");
  fw_menu_3.addMenuItem("Práctica","location='../leccion4/practica.htm'");  
  fw_menu_3.addMenuItem("Pon el español en acción","location='../leccion4/pon.htm'");
  fw_menu_3.fontWeight="bold";
  fw_menu_3.hideOnMouseOut=true;
   
 window.fw_menu_4 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_4.addMenuItem("Introducción","location='../leccion5/introduccion.htm'");
  fw_menu_4.addMenuItem("Diálogo","location='../leccion5/dialogo.htm'");
  fw_menu_4.addMenuItem("Gramática","location='../leccion5/gramatica.htm'");
  fw_menu_4.addMenuItem("Práctica","location='../leccion5/practica.htm'");
  fw_menu_4.addMenuItem("Pon el español en acción","location='../leccion5/pon.htm'");
  fw_menu_4.fontWeight="bold";
  fw_menu_4.hideOnMouseOut=true;
   
  window.fw_menu_5 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_5.addMenuItem("Introducción","location='../leccion6/introduccion.htm'");
  fw_menu_5.addMenuItem("Diálogo","location='../leccion6/dialogo.htm'");
  fw_menu_5.addMenuItem("Gramática","location='../leccion6/gramatica.htm'");
  fw_menu_5.addMenuItem("Práctica","location='../leccion6/practica.htm'");  
  fw_menu_5.addMenuItem("Pon el español en acción","location='../leccion6/pon.htm'");
  fw_menu_5.fontWeight="bold";
  fw_menu_5.hideOnMouseOut=true;
   
  window.fw_menu_6 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_6.addMenuItem("Introducción","location='../leccion7/introduccion.htm'");
  fw_menu_6.addMenuItem("Diálogo","location='../leccion7/dialogo.htm'");
  fw_menu_6.addMenuItem("Gramática","location='../leccion7/gramatica.htm'");
  fw_menu_6.addMenuItem("Práctica","location='../leccion7/practica.htm'");  
  fw_menu_6.addMenuItem("Pon el español en acción","location='../leccion7/pon.htm'");
  fw_menu_6.fontWeight="bold";
  fw_menu_6.hideOnMouseOut=true;
       
  window.fw_menu_7 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_7.addMenuItem("Introducción","location='../leccion8/introduccion.htm'");
  fw_menu_7.addMenuItem("Diálogo","location='../leccion8/dialogo.htm'");
  fw_menu_7.addMenuItem("Gramática","location='../leccion8/gramatica.htm'");
  fw_menu_7.addMenuItem("Práctica","location='../leccion8/practica.htm'");   
  fw_menu_7.addMenuItem("Pon el español en acción","location='../leccion8/pon.htm'");
  fw_menu_7.fontWeight="bold";
  fw_menu_7.hideOnMouseOut=true;
 
 window.fw_menu_8 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_8.addMenuItem("Introducción","location='../leccion9/introduccion.htm'");
  fw_menu_8.addMenuItem("Diálogo","location='../leccion9/dialogo.htm'");
  fw_menu_8.addMenuItem("Gramática","location='../leccion9/gramatica.htm'");
  fw_menu_8.addMenuItem("Práctica","location='../leccion9/practica.htm'");   
  fw_menu_8.addMenuItem("Pon el español en acción","location='../leccion9/pon.htm'");
  fw_menu_8.fontWeight="bold";
  fw_menu_8.hideOnMouseOut=true;

 window.fw_menu_9 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_9.addMenuItem("Introducción","location='../leccion10/introduccion.htm'");
  fw_menu_9.addMenuItem("Diálogo","location='../leccion10/dialogo.htm'");
  fw_menu_9.addMenuItem("Gramática","location='../leccion10/gramatica.htm'");
  fw_menu_9.addMenuItem("Práctica","location='../leccion10/practica.htm'");   
  fw_menu_9.addMenuItem("Pon el español en acción","location='../leccion10/pon.htm'");
  fw_menu_9.fontWeight="bold";
  fw_menu_9.hideOnMouseOut=true;
 
 window.fw_menu_10 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_10.addMenuItem("Introducción","location='../leccion11/introduccion.htm'");
  fw_menu_10.addMenuItem("Diálogo","location='../leccion11/dialogo.htm'");
  fw_menu_10.addMenuItem("Práctica","location='../leccion11/practica.htm'");
  fw_menu_10.addMenuItem("Pon el español en acción","location='../leccion11/pon.htm'");
  fw_menu_10.fontWeight="bold";
  fw_menu_10.hideOnMouseOut=true;
  
   window.fw_menu_11 = new Menu("root",160,22,"Verdana, Arial, Helvetica, sans-serif",10,"#000000","#EDD3B5","#919574","#511E26");
  fw_menu_11.addMenuItem("Introducción","location='../leccion12/introduccion.htm'");
  fw_menu_11.addMenuItem("Diálogo","location='../leccion12/dialogo.htm'");
  fw_menu_11.addMenuItem("Práctica","location='../leccion12/practica.htm'");
  fw_menu_11.addMenuItem("Pon el español en acción","location='../leccion12/pon.htm'");
  fw_menu_11.fontWeight="bold";
  fw_menu_11.hideOnMouseOut=true;
  
  
  
  fw_menu_11.writeMenus();
} 