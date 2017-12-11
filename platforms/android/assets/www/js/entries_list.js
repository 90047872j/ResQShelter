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
var search_by = "*";

var app = {
    initialize: function() {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('resume',onResume,false); 
    document.addEventListener('backbutton',onBackButton,false);
    document.getElementById("b_add_new").addEventListener("touchstart",openCreate);
    document.getElementById("b_delete_all").addEventListener("touchstart",makeDialogOnDelete);
    document.getElementById("b_add_dummy").addEventListener("touchstart",doAddDummyItems);
    document.getElementById("b_add_new").addEventListener("touchstart",openCreate);
    document.getElementById("b_search").addEventListener("touchstart",doSearchBy);
    document.getElementById("b_clear_filter").addEventListener("touchstart",doClearFilter);
    },


onDeviceReady: function() {
       doCreateTable();
       doListItems();
       
    }
};

function successCB() {
  console.log("Success");
}

function errorCB(err) {
    navigator.notification.alert("Error processing SQL: "+err.code+" message: "+err.message);
}


function doCreateTable() {
    db.transaction(createTableTx, errorCB, successCB);
}

function createTableTx(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS ANIMAL (Id integer primary key, Name varchar (50), Description text, Latitude double, Longitude double, Picture text, Age int, Type varchar (100), Founder varchar (200), Chipped boolean)');
}

function doListItems(){
     db.transaction(listItemsTx, errorCB, successCB);
}
function listItemsTx(tx) {
    tx.executeSql('SELECT * FROM ANIMAL',[], queryListSuccess, errorCB);
}

function queryListSuccess(tx, results){
var tblText='<table id="t_animals"><tr><th>Id</th><th>Name</th></tr>';
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                tblText +='<tr><td id="id_row" onclick = "openDetails('+results.rows.item(i).Id+');">' + 
                 results.rows.item(i).Id +
                 '</td><td>' +
                  results.rows.item(i).Name;
            }
            tblText +="</table>";
            document.getElementById("tblDiv").innerHTML =tblText;
}

function doListItemsBy(){
     db.transaction(listItemsByTx, errorCB, successCB);
}
function listItemsByTx(tx) {
    tx.executeSql('SELECT * FROM ANIMAL WHERE Name LIKE "%' + search_by + '%"',[], queryListBySuccess, errorCB);
}

function queryListBySuccess(tx, results){
var tblText='<table id="t_animals"><tr><th>Id</th><th>Name</th></tr>'; 
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                tblText +='<tr><td id="id_row" class="td" onclick = "openDetails('+results.rows.item(i).Id+');">' + 
                 results.rows.item(i).Id +
                 '</td><td>' +
                  results.rows.item(i).Name;
            }
            tblText +="</table>";
            document.getElementById("tblDiv").innerHTML =tblText;
}


function doDeleteItems(){
    db.transaction(deleteAllTx, errorCB, successDeleteCB);
}

function deleteAllTx(tx) {
    tx.executeSql('DELETE FROM ANIMAL');
 }

 function successDeleteCB() {
    makeToast('All entries deleted');
    doListItems();
 }


function doAddDummyItems(){
    db.transaction(addDummyItemsTx, errorCB, successAddDummy);


}
function addDummyItemsTx(tx) {
    tx.executeSql('INSERT INTO ANIMAL (Name, Description, Latitude, Longitude, Picture, Age, Type, Founder, Chipped) VALUES ("Top Cat", "Leader of Manhattan Alley Cats","40.712775","-74.006835","Top Cat", "7","Yellow-Furred Cat", "Officer Dibble","0")');
}


 function successAddDummy() {
    makeToast('Dummy item added');
    doListItems();
 }


function openCreate(){
    window.location = "create_entry.html";
}


function openDetails(id){
  window.location.href = 'details.html?entry_id='+id+'';
}


function doSearchBy(){
  search_by = document.getElementById("searchBy").value;
  doListItemsBy();
}

function doClearFilter(){
  document.getElementById("searchBy").value = "";
  doListItems();
}


function onResume(){
   doListItems();
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


function makeDialogOnDelete(){
    var message = "Delete All Entries?";
    var title = "Confirmation";
    var buttonLabels = "Yes, No";
navigator.notification.confirm(message,selectorCallback,title,buttonLabels);
console.log("alert button pressed");

}

function selectorCallback(buttonIndex){
  if (buttonIndex == 1){
   doDeleteItems();
}
}


function onBackButton(){
    navigator.app.exitApp();
}

app.initialize();

