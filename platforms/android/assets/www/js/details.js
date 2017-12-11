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

var cIsChipped = "has no chip";

var app = {
    initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        document.addEventListener('backbutton',onBackButton,false);

        eId = getParameterByName("entry_id");
        
        document.getElementById("b_delete").addEventListener("touchstart",makeDialogOnDelete);
              document.getElementById("b_edit").addEventListener("touchstart",openCreate);
       findItemInTable();

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


function successCB() {
   console.log("Success");
}

function errorCB(err) {
    navigator.notification.alert("Error processing SQL: "+err.code+" message: "+err.message);
}

function findItemInTable(){
     db.transaction(findById, errorCB, successCB);
}
function findById(tx) {
    tx.executeSql('SELECT * FROM ANIMAL WHERE Id =' + eId ,[], queryFoundSuccess, errorCB);
}

function queryFoundSuccess(tx, results){
    if (results.rows.item(0).Chipped==1){
        cIsChipped = "Has chip"; 
    }

    document.getElementById("t_name").innerHTML = results.rows.item(0).Name;
    document.getElementById("t_description").innerHTML = results.rows.item(0).Description;
    document.getElementById("t_age").innerHTML = results.rows.item(0).Age;
    document.getElementById("t_type").innerHTML = results.rows.item(0).Type;
    document.getElementById("t_founder").innerHTML = results.rows.item(0).Founder;
    document.getElementById("t_chipped").innerHTML = cIsChipped;
    document.getElementById("t_loc").innerHTML = results.rows.item(0).Latitude + ", " + results.rows.item(0).Longitude;

    if (results.rows.item(0).Picture == "Not Available"){
        document.getElementById('myImage').src ="img/no_image.png";   
        } else if (results.rows.item(0).Picture == "Top Cat"){
                  document.getElementById('myImage').src ="img/topcat.gif";
        }else{     
        document.getElementById('myImage').src = "data:image/png;base64," + results.rows.item(0).Picture;
        }
}

function doDeleteCurrent(){
    db.transaction(deleteCurrentTx, errorCB, successDeleteCB);
}

function deleteCurrentTx(tx) {
    tx.executeSql('DELETE FROM ANIMAL WHERE Id =' + eId);

 }

 function successDeleteCB() {
     makeToast('Entry: ' + eId + ', "'+ document.getElementById("t_name").innerHTML + '" was deleted');
    window.location = "entries_list.html";
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


function openCreate(){
window.location.href = 'create_entry.html?entry_id='+eId+'';
}

function makeDialogOnDelete(){
    var message = "Delete this entry?";
    var title = "Confirmation";
    var buttonLabels = "Yes, No";
navigator.notification.confirm(message,selectorCallback,title,buttonLabels);
console.log("alert button pressed");

}

function selectorCallback(buttonIndex){
  if (buttonIndex == 1){
   doDeleteCurrent();
}
}

function makeToast(toastMessage) {
  window.plugins.toast.showWithOptions(
    {
      message: toastMessage,
      duration: "short", // which is 2000 ms. "long" is 4000. Or specify the nr of ms yourself.
      position: "bottom",
      addPixelsY: -40  // added a negative value to move it up a bit (default 0)
    }
)
}

function onResume(){
   findItemInTable();
}

function onBackButton(){
window.location.href = 'entries_list.html';
}

app.initialize();
