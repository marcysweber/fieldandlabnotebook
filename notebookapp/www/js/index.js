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

 //*Something wrong in confirmnumfield

var uidata = {
    gethrs: function() {
        var dropdown = $("#select-choice-hours");
        for(var i = 0; i <= 12; i++) {
            var op = new Option();
            op.value = i * 60;
            op.text = i + " hrs";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0;
        dropdown.selectmenu().selectmenu("refresh"); 
    },
    getmins: function() {
        var dropdown = $("#select-choice-mins");
        for(var i = 0; i <= 59; i++) {
            var op = new Option();
            op.value = i;
            op.text = i + " mins";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0;
        dropdown.selectmenu().selectmenu("refresh");
    },
    getsecs: function() {
        var dropdown = $("#select-choice-secs");
        for (var i = 0; i <= 59; i++) {
            var op = new Option();
            op.value = i/60;
            op.text = i + " secs";
            dropdown.append(op);
        };
        dropdown.selectedIndex = 0;
        dropdown.selectmenu().selectmenu("refresh");
    },
    //value of these dropdowns are all in mins
};

var observations = 0;
var thedate;
var thetime;

var utilfunc = {
    calcint: function() {
        var intlength = Number($('#select-choice-hours option:selected').val()) + 
            Number($('#select-choice-mins option:selected').val()) +
            Number($('#select-choice-secs option:selected').val());
        return intlength;
    },
    calcsessionDrop: function(event) {
        var sessionlength = utilfunc.calcint();
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
        var sessionlength = utilfunc.calcint();
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
    },
    setupbutton: function() {
        var intlength = utilfunc.calcint();

        $('.studyname').append($("#setupname").val());
        $('#confirmint').append(utilfunc.sesslengtxt(intlength));
        $('#confirmlength').append($("#sessionlength option:selected").text());
        $('#confirmalarm').append($("#select-choice-alarm option:selected").text());
        utilfunc.confirmnumfield();
        utilfunc.confirmcheck();
    },
    confirmnumfield: function() {
        var numtype = $("#numfieldtype :radio:checked").val();
        if($('#numfieldcheckbox').is(':checked')) {
            $('#includelist').append("<li>Number field: </li>" + numtype);
            $('#numberlabel').append(numtype);
            $('.xtras').append($("#numbersection"));
        }
    },
    confirmcheck: function() {
        var checkname = $('#checkboxinput').val();
        if($('#checkboxcheckbox').is(':checked')) {
            $('#includelist').append("<li>Checkbox: </li>" + checkname);
            $('#checkboxlabel').append(checkname);
            $('.xtras').append($("#checkboxsection"));
        }
    },
    dateandtime: function() {
        $('.date').empty();
        $('.time').empty();

        var d = new Date();
        var month = d.getMonth() + 1;
        var day = d.getDate();
        var hr = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();

        thedate = month + '/' + day + '/' + d.getFullYear();
        thetime = hr + ':' + min + ':' + sec;

        $('.date').append(thedate);
        $('.time').append(thetime);
    },
    saveob: function() {
        //this is where a function goes for LOCAL saving into database
        dataObject = {
            'notes': $('.thenotes').val(),
            'observationNumber': observations,
            'numberFieldData': $('#numberinput').val(),
            'checkBoxData': $('#customcheckbox').val(),
            'timeStamp': thedate + ' ' + thetime
        };
        database.addObservation(dataObject);
        $('.thenotes').val('');
        $('#numberinput').val('');
        $('#customcheckbox').prop('checked', false).checkboxradio('refresh');
    },
    exportdisabling: function() {
        choice = $('#exportoptions :radio:checked').val();

        if (choice === "db") {
            $("#dropboxinfo").removeClass("ui-disabled");
            $("#emailinfo").addClass("ui-disabled");
        } if (choice === "email") {
            $("#emailinfo").removeClass("ui-disabled");
            $("#dropboxinfo").addClass("ui-disabled");           
        }
    },
};

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
        $('.interval').bind("change", utilfunc.calcsessionDrop);
        $('[name="radio-choice"]').checkboxradio();
        $("#numfieldcheckbox").bind("change", utilfunc.numberfieldtog);
        $('#checkboxcheckbox').bind("change", utilfunc.checkboxtog);
        $('.req').bind("change", utilfunc.reqcheck);
        $('#exportoptions').bind("change", utilfunc.exportdisabling);
        uidata.gethrs();
        uidata.getmins();
        uidata.getsecs();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    buttonpress: function() {
        notification.beep();
        notification.vibrate();
    },
    
};

var timer = {
    countdown: function() {
        var counter = 4;
        setInterval(function() {
            counter--;
            if (counter >= 0) {
                span = document.getElementById("countdown");
                span.innerHTML = counter;
            }
            if (counter === 0) {
                $.mobile.pageContainer.pagecontainer("change", "#alarmpage");
                clearInterval(counter);

            }
        }, 1000);
    },
    intcountdown: function() {
        if (observations ==! 0) {
            if (dataObject.notes !== '') {
                utilfunc.saveob();
            }
        };
        observations++;
        var sesslengthinob = Number($('#sessionlength option:selected').val())/utilfunc.calcint();
        if(observations - 1 < sesslengthinob) {
            span = document.getElementById("thisob");
            span.innerHTML = "Observation # " + observations;
            var intlength = utilfunc.calcint();
            var counter = 60 * intlength;
            setInterval(function() {
                counter--;
                if (counter >= 0) {
                    var ret = null;
                    if(counter >= 60) {
                        var secs = counter % 60;
                        var mins = (counter - secs)/60;
                        ret = mins + " mins, " + secs + " secs";
                    } else {
                        ret = counter + " secs";
                    }

                   span1 = document.getElementById("timeleftint1");
                   span1.innerHTML = (ret);
                   //this is not ideal, by getElementsByClassName is not working.
                   span2 = document.getElementById("timeleftint2");
                   span2.innerHTML = ret;
                }
                if (counter === 0) {
                    clearInterval(counter);
                    $.mobile.pageContainer.pagecontainer("change", "#alarmpage");
                    timer.intcountdown();
                }
            }, 1000);
            
        }else if(observations - 1 >= sesslengthinob) {
           $.mobile.pageContainer.pagecontainer("change", "#finalalarm"); 
        }
    },
    sesscountdown: function() {
        var sesslength = Number($('#sessionlength option:selected').val());
        var counter = sesslength * 60;
        setInterval(function() {
            counter--;
            if (counter >= 0) {
                var ret = null;
                if(counter >= 3600) {
                    var secs = counter % 60;
                    var mins = ((counter - secs) % 3600);
                    var hrs = (counter - secs - mins);
                    ret = (hrs/3600) + " h " + (mins/60) + " m " + secs + " s";
                }
                else if(counter >= 60) {
                    var secs2 = counter % 60;
                    var mins2 = (counter - secs2)/60;
                    ret = mins2 + " m " + secs2 + " s";
                } else {
                    ret = counter + " s";
                }
                span1 = document.getElementById("timeleftsession1");
                span1.innerHTML = (ret);
                //this is not ideal, by getElementsByClassName is not working.
                span2 = document.getElementById("timeleftsession2");
                span2.innerHTML = ret;
            } if (counter === 0) {
                clearInterval(counter);
            }
        }, 1000);
    },
    obcountdowns: function() {
        timer.intcountdown();
        timer.sesscountdown();
    },
};

var database = {
    initialized: false,
    userName: '',
    sessionName: "",

    initialize: function(sessionName) {
        this.userName = 'default user';
        this.db = new PouchDB(this.userName);
        console.log("Database " + this.userName + " initialized");  
        var observations = {
            _id: sessionName,
            obs: []
        };
        this.db.put(observations);
        this.initialized = true;
        this.sessionName = sessionName;
    },

    addObservation: function(dataObject) {
        if (!this.initialized)
            throw ("Error: Database not initialized");

        var fields = ['observationNumber', 'timeStamp', 'numberFieldData', 
                      'numberFieldType', 'checkBoxData', 'checkBoxName',
                      'checkBoxChecked', 'notes'];
        //$.map(fields, function(field) {
        //    if (! (field in dataObject) ) {
        //        throw ("Error " + field + " not in dataobject.");
        //    }
        //});
            this.db.get(this.sessionName).then(function (observations) {
                observations.obs.push(dataObject);
                return database.db.put(observations);
            }).then(function () {
                return database.db.get(database.sessionName);
            }).then(function (observations) {
                console.log(observations);
            });

    },

    getAllObservations: function(sessionName){
        return this.db.get(sessionName);
    }
};

notification = {
    vibrate: function(){
        navigator.notification.vibrate(2500);
    },
    beep: function(){
        navigator.notification.beep(3);
    },
};

exportData = {
    saveData: function (data, email, success){
        var object_to_send = {
            obs: data,
            dest: email
        };

        $.ajax({
          type: "POST",
          url: "http://fieldandlabnotebook.herokuapp.com/senddata",
          data: object_to_send,
          success: success,
          dataType: "application/json"
        }); 
    }
};