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
ePicture = "hla";


var app = {
    initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener('backbutton',onBackButton,false);
        document.getElementById("b_location").addEventListener("touchstart",getLocation);
        document.getElementById("b_image").addEventListener("touchstart",cameraGetPicture);
        document.getElementById("b_create").addEventListener("touchstart",createEntry);
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
 

if (x.checked) {
    isChipped = 1;
} 

doAddItems();
window.location = "index.html";


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
  
   navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
      destinationType: Camera.DestinationType.DATA_URL,
      sourceType: Camera.PictureSourceType.CAMERA
   });

   //sourceType: Camera.PictureSourceType.PHOTOLIBRARY

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

app.initialize();
