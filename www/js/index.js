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


var app = {
    // Application Constructor
    initialize: function() {

    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    document.addEventListener('backbutton',onBackButton,false);

        if (localStorage.getItem("signedUpUser") != null) {
            openList();
            }
    },

    onDeviceReady: function() {
        document.getElementById("b_login").addEventListener("touchstart",onLogIn);
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

function onLogIn (){
     textUser = document.getElementById("inputUser").value;
     textPassword = document.getElementById("inputPassword").value;
    if (textUser.trim() == "" || textPassword.trim() == "") {
        navigator.notification.alert("No fields can be empty");
        } else if (textPassword.length < 5){
            navigator.notification.alert("Password must have more than 5 characters");
              document.getElementById("inputPassword").value = "";
        } else {
            localStorage.setItem("signedUpUser", textUser + textPassword);
            makeToast('User: "' +  textUser + '" succesfully logged in');
            openList();
        }
}

function openList(){
    window.location = "entries_list.html";
}

function onBackButton(){
    navigator.app.exitApp();
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

app.initialize();