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
var textStudying = 0;
var textName;
var textSurName;
var textAge;
var x = document.getElementById("myCheck");

var app = {
    initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        //document.addEventListener('backbutton',onBackButton,false);

        document.getElementById("b_create").addEventListener("touchstart",createPerson);
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

function createPerson (){


            textName = document.getElementById("inputName").value;
        textSurName = document.getElementById("inputSurname").value;
        textAge = document.getElementById("inputAge").value;

if (x.checked) {
    textStudying = 1;
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

//tx.executeSql("INSERT INTO DEMO (Name, Surname, Age, Studying) VALUES (\"" + textName + "\",\""+ textSurName + "\",\""+ textAge + "\",\""+ textStudying + "\")");

tx.executeSql('INSERT INTO DEMO (Name, Surname, Age, Studying) VALUES ("' + textName + '","'+ textSurName + '","'+ textAge + '","'+ textStudying + '")');

}


//function onPause(){
//    alert ("On pause");
//}

//function onResume(){
//    alert ("On Resume");
//}

//function onBackButton(){
//    alert ("On Back Button");
//}

app.initialize();
