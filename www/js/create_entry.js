/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var db = window.openDatabase("Database", "1.0", "CordovaDemo", 200000);

var isChipped = 0;
var eName;
var eDescription;
var eType;
var eFounder;
var eAge;
var x = document.getElementById("myCheck");
var eLat;
var eLong;
ePicture = "Not Available";
var cameraSource = 1;
var eId = null;

var app = {
    initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener('backbutton',onBackButton,false);
        document.getElementById("b_location").addEventListener("touchstart",getLocation);
        document.getElementById("b_image").addEventListener("touchstart",makeCameraSelector);
        document.getElementById("b_create").addEventListener("touchstart",createEntry);

        eId = getParameterByName("entry_id");

        if (eId != null){
          document.getElementById("t_title").innerHTML = "Modify Item";
          document.getElementById("b_create").innerHTML = "UPDATE";
          findItemInTable();

        }

    },

    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
    }
};

function createEntry (){

 eName = document.getElementById("inputName").value;
 eDescription = document.getElementById("inputDescription").value;
 eType = document.getElementById("inputType").value;
 eFounder = document.getElementById("inputFounder").value;
 eAge = document.getElementById("inputAge").value;
 eLat = document.getElementById("inputLat").value;
 eLong = document.getElementById("inputLong").value;
 

if (areFieldsEmpty()){

navigator.notification.alert("No fields can be empty");
} else if (eName.length > 50){
  navigator.notification.alert("Name must be shorter than 50 characters");
} else if (eType.length > 100){
  navigator.notification.alert("Type must be shorter than 100 characters");
} else if (eFounder.length > 200) {
  navigator.notification.alert("Founder must be shorter than 200 characters");
} else {
if (x.checked) {
    isChipped = 1;
} 

if (eId!=null){
  doUpdateItem();
} else {
  doAddItems();
}

window.location = "index.html";

}

}

function successCB() {
   alert("success!");
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code+" message: "+err.message);
}

function doAddItems(){
    db.transaction(addItemsDemoTx, errorCB, successCB);
}
function addItemsDemoTx(tx) {
tx.executeSql('INSERT INTO ANIMAL (Name, Description, Latitude, Longitude, Picture, Age, Type, Founder, Chipped) VALUES ("' + eName + '","'+ eDescription + '","'+ eLat + '","'+ eLong + '","'+ ePicture + '","'+ eAge + '","'+ eType + '","'+ eFounder + '","'+ isChipped + '")');

alert (eName + " " + eDescription + " " + eLat+ " " +eLong+ " " +ePicture + " " + eAge + " " + eType + " " + eFounder + " " + isChipped);
}


//function onPause(){
//    alert ("On pause");
//}

//function onResume(){
//    alert ("On Resume");
//}

function onBackButton(){
       window.location = "entries_list.html";
    }

function cameraGetPicture() {
  
   navigator.camera.getPicture(onSuccess, onFail, { quality: 100,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: cameraSource,
      encodingType: 0,
      correctOrienation: true

   });


   function onSuccess(imageURL) {
      var image = document.getElementById('myImage');
      image.src = "data:image/jpeg;base64," + imageURL;
      ePicture = imageURL;
   }

   function onFail(message) {
      alert('Failed because: ' + message);
   }

}

function getLocation () {

   var options = {                      
          enableHighAccuracy: true, 
          maximumAge: 3600000     //quanta estona es guarda el valor
   };

    function onSuccess(position) { 

        alert(position.coords.latitude + " " + position.coords.longitude);
        document.getElementById("inputLat").value = position.coords.latitude;
        document.getElementById("inputLong").value = position.coords.longitude;
    };


    function onError(error) { 
        var failure = 'code: '    + error.code    + '\n' + 'message: ' + error.message + '\n';
        document.getElementById("main_text").innerHTML = failure;
    };

    navigator.geolocation.getCurrentPosition(onSuccess,onError,options);
    var watchID = navigator.geolocation.watchPosition(onSuccess,onError,options);

     document.getElementById("seguiment").innerHTML = watchID;

}

function areFieldsEmpty(){
if (eName.trim() == "" ||
    eDescription.trim() == "" ||
    eType.trim() == "" ||
    eFounder.trim() == "" ||
    eAge.trim() == "" || 
    eLat.trim() == "" ||
    eLong.trim() == "") {
        return true;
        }
        return false;

}



function makeCameraSelector(){
    var message = "Choose Photo Source";
    var title = "SELECTOR";
    var buttonLabels = "GALLERY, CAMERA";
navigator.notification.confirm(message,selectorCallback,title,buttonLabels);
console.log("alert button pressed");

}

function selectorCallback(buttonIndex){
  if (buttonIndex == 1){
    cameraSource = 0;
  }
cameraGetPicture();
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}



function findItemInTable(){
     db.transaction(findById, errorCB, successCB);
}
function findById(tx) {
    tx.executeSql('SELECT * FROM ANIMAL WHERE Id =' + eId ,[], queryFoundSuccess, errorCB);
}

function queryFoundSuccess(tx, results){
    if (results.rows.item(0).Chipped==1){
        document.getElementById("myCheck").checked = true;
 
    }

    document.getElementById("inputName").value = results.rows.item(0).Name;;
    document.getElementById("inputDescription").value = results.rows.item(0).Description;
    document.getElementById("inputAge").value = results.rows.item(0).Age;
    document.getElementById("inputType").value = results.rows.item(0).Type;
    document.getElementById("inputFounder").value = results.rows.item(0).Founder;
    document.getElementById("inputLat").value = results.rows.item(0).Latitude; 
    document.getElementById("inputLong").value = results.rows.item(0).Longitude;
    

    if (results.rows.item(0).Picture == "Not Available"){
        document.getElementById('myImage').src ="img/no_image.png";  
        } else if (results.rows.item(0).Picture == "Top Cat"){
                  document.getElementById('myImage').src ="img/topcat.gif";
        }else{     
        document.getElementById('myImage').src = "data:image/jpeg;base64," + results.rows.item(0).Picture;
        }


}


 function doUpdateItem(){
  db.transaction(updateRowTx, errorCB, successUpdateCB);
}
function updateRowTx(tx) {
   tx.executeSql('UPDATE ANIMAL SET Name = "' + eName + '", Description = "' + eDescription + '",Latitude = "' + eLat + '",Picture = "' + ePicture + '",Age = "' + eAge + '",Name = "' + eName + '",Type = "' + eType + '",Founder = "' + eFounder + '", Chipped = "' + isChipped +'" WHERE Id ="' + eId +'"');
   // tx.executeSql('UPDATE ANIMAL SET Name = "' + eName +'" WHERE Id ="' + 10 +'"');


 }

function successUpdateCB()
 {
    alert("item modificat");
    doListItems(); //Crido al llistat per a que actualitzi.
 }



app.initialize();
