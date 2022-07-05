function doGet(e) {  

  if (e.parameters.type[0] == "update"){
    return ContentService.createTextOutput(get_update_time());
  }else{
    
  let js = json_generator();
  return ContentService.createTextOutput(js).setMimeType(ContentService.MimeType.JSON);

  } 


 
 
}


function set_update_time(){
  
  var day = Utilities.formatDate(new Date(), "GMT","dd");
  var month = Utilities.formatDate(new Date(), "GMT","MM");
  var year = Utilities.formatDate(new Date(), "GMT","yyyy");
  var time = Utilities.formatDate(new Date(), "GMT","HH:mm:ss");
  var date = year+','+month+','+day+' '+ time;


  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("update");


  var cell_name = sheet.getRange(5,5);
  cell_name.setValue(date);
   
}

function get_update_time(){
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("update");
var data = sheet.getDataRange().getValues();
Logger.log(data[4][4])
return data[4][4];

}

function server_func() {

var insert = some_network();
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("main");
var data = sheet.getDataRange().getValues();
let found = false;

for (var i = 0; i < data.length; i++) {
if (data[i][1] == insert[1]){

  Logger.log("found on index : "+i);
  var cell_name = sheet.getRange(i+1,1);
  cell_name.setValue(insert[0]);

  set_update_time();

  SpreadsheetApp.flush();
  found = true;
  break;

}

}


if(found == false){


Logger.log("append!")
sheet.appendRow([insert[0],insert[1]]);
set_update_time();

SpreadsheetApp.flush();

}




}



function json_generator(){
var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("main");

var data = sheet.getDataRange().getValues();  

arr = {cols:[{"label":"Date","type":"date"},{"label":"burn","type":"number"}],rows: []};

  

var new_fetch_data = sheet.getDataRange().getValues();
for (var i = 0; i < new_fetch_data.length; i++) {
        
    
    Logger.log(arr['rows']);
    arr['rows'].push({
         "c":[
            {
               "v":"Date("+new_fetch_data[i][1]+")",
               "f":null
            },
            {
               "v":new_fetch_data[i][0],
               "f":null
            }
         ]
      });
  }
  

  let res_json = JSON.stringify(arr);


return res_json;

}

function some_network(){
  let burn = 'https://api.terralunastats.com/api/transactions/burned';
  var day = Utilities.formatDate(new Date(), "GMT","dd");
  var month = Utilities.formatDate(new Date(), "GMT","MM");
  var year = Utilities.formatDate(new Date(), "GMT","yyyy");
  

  var response = UrlFetchApp.fetch(burn, {'muteHttpExceptions': true});
  var json = response.getContentText();
  var data = JSON.parse(json);
  
  let int_burn = float2int(data.burned);
  let total_burned = BigInt(int_burn);
  
  Logger.log(total_burned);

  date = year+',0'+(month-1)+','+day;
  return [total_burned,date];
}



function float2int (value) {
    return value | 0;
}
