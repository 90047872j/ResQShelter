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
    // Application Constructor
    initialize: function() {
     document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('resume',onResume,false); 
    document.getElementById("b_add_new").addEventListener("touchstart",openCreate);
    document.getElementById("b_delete_all").addEventListener("touchstart",doDeleteItems);
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

/*Callbacks compartits*/
function successCB() {
  //alert("success!");
}

function errorCB(err) {
    alert("Error processing SQL: "+err.code+" message: "+err.message);
}


/*Funcions per a CREATE TABLE*/
function doCreateTable() {
    db.transaction(createTableTx, errorCB, successCB);
}

function createTableTx(tx) {
    //tx.executeSql ('DROP TABLE IF EXISTS ANIMAL');
    tx.executeSql('CREATE TABLE IF NOT EXISTS ANIMAL (Id integer primary key, Name varchar (50), Description text, Latitude double, Longitude double, Picture text, Age int, Type varchar (100), Founder varchar (200), Chipped boolean)');
}

function doListItems(){
     db.transaction(listItemsTx, errorCB, successCB);
}
function listItemsTx(tx) {
    tx.executeSql('SELECT * FROM ANIMAL',[], queryListSuccess, errorCB);
}

function queryListSuccess(tx, results){
var len = results.rows.length;
var tblText='<table id="t_animals"><tr><th>Id</th><th>Name</th></tr>'; //capçalera de la taula
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                tblText +='<tr><td>' +
                 results.rows.item(i).Id +
                 '</td><td>' +
                  results.rows.item(i).Name +
                  '</td><td><button onclick=openDetails('+i+')>DETAILS</button></td></tr>';
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
var len = results.rows.length;
var tblText='<table id="t_animals"><tr><th>Id</th><th>Name</th></tr>'; //capçalera de la taula
            var len = results.rows.length;
            for (var i = 0; i < len; i++) {
                tblText +='<tr><td>' +
                 results.rows.item(i).Id +
                 '</td><td>' +
                  results.rows.item(i).Name +
                  '</td><td><button onclick=openDetails('+i+')>DETAILS</button></td></tr>';
            }
            tblText +="</table>";
            document.getElementById("tblDiv").innerHTML =tblText;
}






/*Funcions per a DELETE*/
function doDeleteItems(){
    db.transaction(deleteAllTx, errorCB, successDeleteCB);
}

function deleteAllTx(tx) {
    tx.executeSql('DELETE FROM ANIMAL');
 }

 function successDeleteCB()
 {
    alert("item/s eliminat/s!");
    doListItems(); //Crido al llistat per a que actualitzi.
 }


/*Funcions per a INSERT*/
function doAddDummyItems(){
    db.transaction(addDummyItemsTx, errorCB, successCB);
    doListItems();
}
function addDummyItemsTx(tx) {
    tx.executeSql('INSERT INTO ANIMAL (Name, Description, Latitude, Longitude, Picture, Age, Type, Founder, Chipped) VALUES ("Top Cat", "Leader of Manhattan Alley Cats","40.712775","-74.006835","https://pa1.narvii.com/6371/1fac1e8eb6930e43f0410280f38ce1bb0aa9a91c_hq.gif", "7","Yellow-Furred Cat", "Officer Dibble","0")');
}

function openCreate(){
    window.location = "create_entry.html";
}


function openDetails(){
    window.location = "details.html";
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

app.initialize();

