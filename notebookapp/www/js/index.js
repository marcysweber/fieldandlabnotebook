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
        }
    },
    confirmcheck: function() {
        var checkname = $('#checkboxinput').val();
        if($('#checkboxcheckbox').is(':checked')) {
            $('#includelist').append("<li>Checkbox: </li>" + checkname);
        }
    },
    countsobservations: function() {
        observations++;
        var sesslengthinob = Number($('#sessionlength option:selected').val())/utilfunc.calcint();
        if(observations < sesslengthinob) {
            span = document.getElementById("thisob");
            span.innerHTML = "Observation # " + observations;
        }else if(observations >= sesslengthinob) {
           $.mobile.pageContainer.pagecontainer("change", "#finalobservation"); 
        }
    }
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
        $("#numfieldcheckbox").bind("change", utilfunc.numberfieldtog);
        $('#checkboxcheckbox').bind("change", utilfunc.checkboxtog);
        $('.req').bind("change", utilfunc.reqcheck);
        uidata.gethrs();
        uidata.getmins();
        uidata.getsecs();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    },
    buttonpress: function() {
        navigator.notification.alert('Hello!');
    },
    setuppage: function() {

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
        //a function that also shows the user how much time is left in this interval. Using 
        //the class .timeleftint, called from #startsession or when #stopalarm pressed?

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
//                var all = $(".timeleftint").map(function() {
//                   this.innerHTML = ret;
//                }).get();

               span1 = document.getElementById("timeleftint1");
               span1.innerHTML = (ret);
               //this is not ideal, by getElementsByClassName is not working.
               span2 = document.getElementById("timeleftint2");
               span2.innerHTML = ret;
            }
            if (counter === 0) {
                clearInterval(counter);
                $.mobile.pageContainer.pagecontainer("change", "#alarmpage");
            }
        }, 1000);

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
