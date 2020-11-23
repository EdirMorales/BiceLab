function firestore() {

   // Firestore
   const email = "xxxxxx@bicelab-6a6da.iam.gserviceaccount.com";
   const key = "-----BEGIN PRIVATE KEY-----\x5Lqgu1fwcm3VMLkIGVNpms\n-----END PRIVATE KEY-----\n";
   const projectId = "bicelab-6a6da";
   var firestore = FirestoreApp.getFirestore (email, key, projectId);

   // obtener datos desde la hoja de google
   var ss = SpreadsheetApp.getActiveSpreadsheet();
   var sheetname = "Hoja1";
   var sheet = ss.getSheetByName(sheetname); 
 
   var sheetLR = sheet.getLastRow();
   var sheetLC = sheet.getLastColumn();

   var dataSR = 2; // the first row of data
   var sourceRange = sheet.getRange(2,1,sheetLR-dataSR+1,sheetLC);

   var sourceData = sourceRange.getValues();
   var sourceLen = sourceData.length;

   for (var i=0;i<sourceLen;i++){

     var data = {};
     data.fecha = sourceData[i][0];
     data.detalle = sourceData[i][1];
     data.monto = sourceData[i][2];

   firestore.createDocument("Movimientos",data);

  }

}