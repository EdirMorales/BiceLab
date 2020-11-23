var dolarHoy = 0;
var arrayMail = [];
arrayMail.push(["Filtro","Pesos","Dolar"]);

document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    getIndicadores();
    loadDataGrafico();
    
});

// verificacion estado de usuario
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // Usuario logeado
        userInfoPage(user);
    }else{
        // User no logeado.
        googleLogin();
    }
});

function googleLogin(){

        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider).then(result => {
            const user = result.user;
            userInfoPage(user);
        })
        .catch(function(error){
            //window.location = "/user-lock-screen.html";
            console.log(error);
        })
}

function userInfoPage(user){
    document.getElementById("nomusuario").innerText = user.displayName;
    document.getElementById("emausuario").innerText = user.email;

    /*
    document.getElementById("name").value = user.displayName;
    document.getElementById("email").value = user.email;

    $(function() {
        M.updateTextFields();
    });
    */
}

function getIndicadores(){
    var url = 'https://www.indecon.online/last';
    fetch(url, {
        method: 'GET',
        headers:{
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())
      .catch(error => console.error('Error:', error))
      .then(function(response){

        document.getElementById("indnomdolar").innerText = response.dolar.name;
        document.getElementById("indvaldolar").innerText = response.dolar.value;
        document.getElementById("indnomeuro").innerText = response.euro.name;
        document.getElementById("indvaleuro").innerText = response.euro.value;
        document.getElementById("indnomuf").innerText = response.uf.name;
        document.getElementById("indvaluf").innerText = response.uf.value;

        dolarHoy = response.dolar.value;

        fillTablaCompras();
      });
}

function loadDataGrafico() {
    const db = firebase.firestore();
    var labelsArray = [];
    var dataArray = [];
    ultimaFecha = "";
    ultimoMonto = 0;

    db.collection("Movimientos/").orderBy("fecha","desc").limit(20).get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var item = doc.data();

            fecha = item.fecha;
            if (fecha != "" && fecha != undefined) {
                fecha = item.fecha.toDate().getDate() + '/' + (item.fecha.toDate().getMonth() + 1);
            };

            monto = item.monto;

            if (ultimaFecha != fecha) {

                ultimoMonto = monto;
                ultimaFecha = fecha;

                dataArray.push(monto);
                labelsArray.push(fecha);

            } else {
                dataArray[dataArray.length - 1] = ultimoMonto + monto;
            }

        });

        new Chartist.Line('#ct1-chart', {
            labels: labelsArray,
            series: [dataArray]
        }, {
            fullWidth: true,
            chartPadding: {
                right: 40
            }
        });
    });
}

function fillTablaCompras(){
    const db2 = firebase.firestore();

    arrayFiltros = [];
    arraySimpleFiltros = [];
    cuantos = 0;

    db2.collection("Filtros/").get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
            var val = doc.data();
            arrayFiltros.push([val.filtro, 0, 0]);
            arraySimpleFiltros.push(val.filtro);
        });

        db2.collection("Movimientos/").orderBy("fecha").get().then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
                var val = doc.data();

                inde = arraySimpleFiltros.findIndex(x => val.detalle.includes(x));
                if(inde>-1){
                    arrayFiltros[inde][1] += val.monto;
                    cuantos += 1;
                }

            });


            if ( $.fn.DataTable.isDataTable('#tablaCompras') ){
                alert("acaaaa");
                var table = $('#tablaCompras').DataTable();
                table.clear();
                table.destroy();
            }

            var table = $('#tablaCompras').DataTable();
            table.clear();
            table.destroy();
    
            if (!$.fn.DataTable.isDataTable('#tablaCompras')) {
    
                arrayFiltros.forEach(function(element){
                    content = "";
                    content += '<tr><td>' + element[0] + '</td>';
                    content += '<td>' + element[1].toFixed(2) + '</td>';
                    content += '<td>' + (element[1].toFixed(2) * dolarHoy).toFixed(0) + '</td>';

                    arrayMail.push([element[0], element[1].toFixed(2), (element[1].toFixed(2) * dolarHoy).toFixed(0)]);
        
                    $('#tablaCompras').append(content);
        
                    /*
                    $('#tablaCompras').DataTable({
                        "responsive": true,
                        "sDom":"ltipr"
                    });
                    */
                })
            }
        });
    });
}


  
exportToCsv = function() {
    var Results = arrayMail;

    var CsvString = '"sep=,"\r\n';
    Results.forEach(function(RowItem, RowIndex) {
      RowItem.forEach(function(ColItem, ColIndex) {
        CsvString += ColItem + ',';
      });
      CsvString += "\r\n";
    });
    CsvString = "data:application/csv," + encodeURIComponent(CsvString);
   var x = document.createElement("A");
   x.setAttribute("href", CsvString );
   x.setAttribute("download","somedata.csv");
   document.body.appendChild(x);
   x.click();
}


guardarGasto = function(){

    var monto = document.getElementById("inputMonto").value;
    var descripcion = document.getElementById("inputDescripcion").value;

    if(monto!="" && descripcion != ""){
        const db = firebase.firestore();
        var ahora = firebase.firestore.Timestamp.now();

        db.collection("Movimientos").add({
            detalle: descripcion,
            fecha: ahora,
            monto: parseFloat(monto)
        }).then(function(){
            document.getElementById("inputMonto").value = "";
            document.getElementById("inputDescripcion").value = "";
            fillTablaCompras();
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        })
    }
}

guardarFiltro = function(){

    var filtro = document.getElementById("inputFiltro").value;

    if(filtro != ""){
        const db = firebase.firestore();

        db.collection("Filtros").add({
            filtro: filtro,
        }).then(function(){
            document.getElementById("inputFiltro").value = "";
            fillTablaCompras();
        }).catch(function(error) {
            console.error("Error adding document: ", error);
        })
    }
}