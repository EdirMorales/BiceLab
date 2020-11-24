var dolarHoy = 0;
var arrayMail = [];
arrayMail.push(["Filtro","Pesos","Dolar"]);

document.addEventListener("DOMContentLoaded", event =>{
    const app = firebase.app();
    getIndicadores();
    loadDataGrafico();
    
});

// verificacion estado
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        userInfoPage(user);
    }else{
        googleLogin();
    }
});

function googleLogin() {

    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(result => {
        const user = result.user;
        userInfoPage(user);
    })
        .catch(function (error) {
            console.log(error);
        })
}

function userInfoPage(user){
    document.getElementById("nomusuario").innerText = user.displayName;
    document.getElementById("emausuario").innerText = user.email;
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

    var result = [];
    var arrayTotal = [];
    var labelsArray = [];
    var arrayValores = [];

    db.collection("Movimientos/").orderBy("fecha","desc").get().then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            var item = doc.data();
            fecha = item.fecha.toDate().getDate() + '/' + (item.fecha.toDate().getMonth() + 1);
            arrayTotal.push({"monto":item.monto.toFixed(2),"fecha":fecha});
        })
        Array.from(new Set(arrayTotal.map(x => x.fecha))).forEach(x => {
            result.push(arrayTotal.filter(y => y.fecha === x).reduce((output,item) => {
                let val = output[x] === undefined?0:output[x];
                output[x] =  (parseFloat(item.monto) +  parseFloat(val)); 
               return output;
            },{}));
        })

        for (var prop in result) {
            nombre = Object.keys(result[prop])[0];
            valor =  result[prop][nombre];
            labelsArray.push(nombre);
            arrayValores.push(valor);
        }

        new Chartist.Line('#ct1-chart', {
            labels: labelsArray,
            series: [arrayValores]
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

        db2.collection("Movimientos/").orderBy("fecha","desc").get().then(function (querySnapshot) {
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
                    
                    var nf = Intl.NumberFormat();
                    content = "";
                    content += '<tr><td>' + element[0] + '</td>';
                    content += '<td>' + nf.format(element[1].toFixed(2)) + '</td>';
                    content += '<td>' + nf.format((element[1].toFixed(2) * dolarHoy).toFixed(0)) + '</td>';

                    arrayMail.push([element[0], element[1].toFixed(2), (element[1].toFixed(2) * dolarHoy).toFixed(0)]);
                    $('#tablaCompras').append(content);
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
    descripcion = descripcion.replace(/[^a-zA-Z ]/g, "");
    if(monto.trim() !="" && descripcion.trim() != ""){
        if(parseFloat(monto) > 0 && parseFloat(monto) < 999999){
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
                loadDataGrafico();
            }).catch(function(error) {
                console.error("Error adding document: ", error);
            })
        }else{
            document.getElementById("inputMonto").value = "";
        }
    }else{
        $(function() {
            if(monto.trim() ==""){
                document.getElementById("inputMonto").value = "";
            }else{
                if(monto <= 0){ document.getElementById("inputMonto").value = ""; };
            };
            if(descripcion.trim() ==""){ document.getElementById("inputDescripcion").value = ""; }
            M.updateTextFields();
        });
    }
}

guardarFiltro = function(){
    var filtro = document.getElementById("inputFiltro").value;
    filtro = filtro.replace(/[^a-zA-Z ]/g, "");
    existe = false;
    arrayFiltros.forEach(fil => {
        if(fil[0].includes(filtro) || filtro.includes(fil[0])){
            alert('El filtro debe ser unico');
            existe = true;
        }
    });

    if(filtro.trim() != "" && existe == false){
        const db = firebase.firestore();
        db.collection("Filtros").add({
            filtro: filtro.trim(),
        }).then(function(){
            document.getElementById("inputFiltro").value = "";
            fillTablaCompras();
        }).catch(function(error) {
            console.error("Error : ", error);
        })
    }else{
        $(function() {
            document.getElementById("inputFiltro").value = "";
            M.updateTextFields();
        });
    }
}