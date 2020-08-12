function registro(){ 
    var usuario = document.getElementById("nombre").value   
    sessionStorage.setItem('usuario', usuario);
   window.location.replace("http://localhost/buscaminas/vista/juego.html");  
}