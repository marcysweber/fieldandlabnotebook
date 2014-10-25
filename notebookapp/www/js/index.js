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

var uidata = {
    gethrs: function() {
        var dropdown = $("#select-choice-hours");
        for(var i = 0; i <= 12; i++) {
            var op = new Option();
            op.value = i * 60;
            op.text = i + " hrs";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0
        dropdown.selectmenu("refresh"); 
    },
    getmins: function() {
        var dropdown = $("#select-choice-mins");
        for(var i = 0; i <= 59; i++) {
            var op = new Option();
            op.value = i;
            op.text = i + " mins";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0
        dropdown.selectmenu("refresh");
    },
    getsecs: function() {
        var dropdown = $("#select-choice-secs");
        for (var i = 0; i <= 59; i++) {
            var op = new Option();
            op.value = i/60;
            op.text = i + " secs";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0
        dropdown.selectmenu("refresh");
    },
};

var utilfunc = {
    calcsession: function() {
        var sessionlength = Number($('#select-choice-hours option:selected').val()) + 
            Number($('#select-choice-mins option:selected').val()) +
            Number($('#select-choice-secs option:selected').val());
        return sessionlength;
    },
    calcsessionDrop: function(event) {
        var sessionlength = utilfunc.calcsession();
        var dropdown = $('#sessionlength');
        dropdown.find('option').remove();
        var plzsel = new Option();
        plzsel.value = 0;
        plzsel.text = "Please Select:";
        dropdown.append(plzsel);
        for (var i = 2; i <= 50 ; i++) {
            var op = new Option();
            op.value = (i - 1) * sessionlength;
            op.text = i + " observations: " + utilfunc.sesslengtxt((i - 1) * sessionlength);
            dropdown.append(op);
        };
    },
    sesslengtxt: function(sessionlength) {
        var ret = null;
        if(sessionlength >= 60) {
            var mins = sessionlength % 60;
            var hrs = (sessionlength - mins)/60;
            ret = hrs + " hrs, " + mins + " mins";
        } else {
            ret = sessionlength + " mins";
        }
        return ret;
    },
    numberfieldtog: function(event) {
        $('#numfieldtype').toggleClass('ui-disabled');
    },
    checkboxtog: function(event) {
        $('#checkboxname').toggleClass('ui-disabled');
    },
    nameValid: function() {
        return($('#setupname').val() !== "");
    },
    intValid: function() {
        var sessionlength = utilfunc.calcsession();
        return(sessionlength !== 0);
    },
    sessionlengthValid: function() {
        return($('#sessionlength').val() !== "0");
    },
    alarmValid: function() {
        return($('#select-choice-alarm').val() !== "");
    },
    reqcheck: function(event) {
        if(utilfunc.intValid() && 
            utilfunc.nameValid() && 
            utilfunc.sessionlengthValid() &&
            utilfunc.alarmValid()) {
            $('#continuebutt').removeClass('ui-disabled');
        }else {
            $('#continuebutt').addClass('ui-disabled');
        }
    }
}

var app = {
    // Application Constructor
    initialize: function() {
        "use strict";
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        uidata.gethrs();
        uidata.getmins();
        uidata.getsecs();
        $('.interval').bind("change", utilfunc.calcsessionDrop);
        $("#numfieldcheckbox").bind("change", utilfunc.numberfieldtog);
        $('#checkboxcheckbox').bind("change", utilfunc.checkboxtog);
        $('.req').bind("change", utilfunc.reqcheck);
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    buttonpress: function() {
        navigator.notification.alert('Hello!');
    },
    setupbutton: function() {
        var setupname = $("input[name=setupname]").val();
    }
};
