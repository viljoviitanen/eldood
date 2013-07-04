// Eldood, a doodle.com inspired tool
// javascript/jquery frontend
//
// Copyright (C) 2013 Viljo Viitanen
// 
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

var ev
var usermax=0
var choicemax=0

$(document).ready(function () {
  window.onhashchange=init
  init()
})

function init() {
  if (location.hash=="" || location.hash=="#") { //chrome: hash # -> "", IE: hash # -> "#"
    location.hash='new'
    load()
  }
  else if (location.hash=='#new') {
    create()
  }
  else {
    $.getJSON('/get/'+location.hash.substr(1),function(data) {
      if(!data.get) {
        alert("Could not load event.")
        return
      }
      ev=data.get
      load()
    })

  }
}

function create() {
  if (location.hash!='#new') {
    location.hash='#new'
  }
  ev={}
  load()
}

function load() {
  html=''
  if(location.hash=='#new') {
    html+='<h1>Making a new event</h1>'
  }
  else {
    html+='<h1>Event '+location.hash.substring(1)+'</h1>'
  }
  var choices=new Array()
  var choiceids=new Array()
  var users=new Array()
  var userids=new Array()
  var keys=new Array()
  jQuery.each(ev,function(key){
    keys.push(key)
  })
  keys.sort()
  for (i = 0; i < keys.length; i++) {
    var key=keys[i]
    var value=ev[key]
    var parts=key.split(':')
    switch(parts[0]) {
    case 'c':
      choices.push(value)
      choiceids.push(parts[1]+':'+parts[2])
      if (parts[1] > choicemax) {
        choicemax=parts[1]
      }
      break
    case 'u':
      users.push(value)
      userids.push(parts[1]+':'+parts[2])
      if (parts[1] > usermax) {
        usermax=parts[1]
      }
      break
    }
  }
  html+="<table border=0>"
  for (var u=-1;u<users.length;u++) {
    html+="<tr>"
    for (var c=-1;c<choices.length;c++) {
      if (u==-1 && c==-1) {
        html+='<td></td>'
      }
      else if (u==-1) {
        html+='<td>'+escapehtml(choices[c])+'</td>'
      }
      else if (c==-1) {
        html+='<td>'+escapehtml(users[u])+'</td>'
      }
      else {
        if (ev['t-'+userids[u]+'-'+choiceids[c]]) {
	  check='checked'
        }
	else {
	  check=''
	}
        html+='<td><input class="choice" type="checkbox" data-user="'+userids[u]+'" data-choice="'+choiceids[c]+'" '+check+'></td>'
      }
      if (u==-1 && c==choices.length-1) {
        html+='<td id="addchoice"><button onclick="addchoice()">Add new choice</button></td>'
      }
    }
    html+="</tr>"
  }
  html+='<tr><td id="adduser"><button onclick="adduser()">Add new user</td></button></tr>'
  html+='</table>'
  if(location.hash=='#new') {
    html+='<button onclick="saveevent()">Save event</button>'
  }
  $('#event').html(html)
  $('.choice').on('change', function() {
    var chk=0
    if ($(this).prop('checked')) { chk=1 }
    var key='t-'+$(this).data('user')+'-'+$(this).data('choice')
    ev[key]=chk
    if(location.hash!='#new') {
      var update={}
      update[key]=chk
      $.getJSON('/update/'+location.hash.substr(1)+'/'+encodeURIComponent(JSON.stringify(update)),function(data) {
        if(!data.update) {
          alert("Could not save event.")
          return
        }
        ev=data.update
        load()
      })
    }
  })
}


function saveevent() {
  $.getJSON('/update/'+location.hash.substr(1)+'/'+encodeURIComponent(JSON.stringify(ev)),function(data) {
    if(!data.update) {
      alert("Could not save event.")
      return
    }
    ev=data.update
    location.hash=data.number
    load()
  })
}

function adduser() {
  $('#adduser').html('<input id="user"><button onclick="saveuser()">Save</button>')
  $("#user").focus().keyup(function (e) {
    if (e.keyCode == 13) {
      saveuser()
    }
  });
}

function saveuser() {
  var val=$('#user').val()
  if(val == '') {
    return
  }
  usermax++
  var id='u:'+addzero(usermax)+':'+hash($('#user').val())
  ev[id]=val
  if(location.hash=='#new') {
    load()
  }
  else {
    var update={}
    update[id]=val
    $.getJSON('/update/'+location.hash.substr(1)+'/'+encodeURIComponent(JSON.stringify(update)),function(data) {
      if(!data.update) {
        alert("Could not save event.")
        return
      }
      ev=data.update
      load()
    })
  }
}


function addchoice() {
  $('#addchoice').html('<input id="choice"><button onclick="savechoice()">Save</button>')
  $("#choice").focus().keyup(function (e) {
    if (e.keyCode == 13) {
      savechoice()
    }
  });
}

function savechoice() {
  var val=$('#choice').val()
  if(val == '') {
    return
  }
  choicemax++
  var id='c:'+addzero(choicemax)+':'+hash($('#choice').val())
  ev[id]=val
  if(location.hash=='#new') {
    load()
  }
  else {
    var update={}
    update[id]=val
    $.getJSON('/update/'+location.hash.substr(1)+'/'+encodeURIComponent(JSON.stringify(update)),function(data) {
      if(!data.update) {
        alert("Could not save event.")
        return
      }
      ev=data.update
      load()
    })
  }
}



//classic djb2 hash - mixed with time
function hash(s){
  var hash = 5381
  jQuery.each(s.split(""), function(i,e) {
    var char = e.charCodeAt(0)
    hash = ((hash<<5)+hash)+char
    hash &= hash
  })
  var t = new Date().getTime()
  //time needs to be an "integer".
  return hash^(t|0);
};

//sort goes wrong if more than 99 choices or users. too bad...
function addzero(a) {
  if (a<10) return "0"+a
  else return a
}

function escapehtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

