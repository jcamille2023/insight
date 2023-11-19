import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.5.0/firebase-auth.js";
import { getDatabase, set, ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";
var uid;
var dune;
 const firebaseConfig = {
    apiKey: "AIzaSyCqUDOyX-OrrrncNv5uABW8hiLndPsMDMg",
    authDomain: "insight-34bc8.firebaseapp.com",
    projectId: "insight-34bc8",
    storageBucket: "insight-34bc8.appspot.com",
    messagingSenderId: "652635905647",
    appId: "1:652635905647:web:05a5378b1f51f58a6d779a"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth(app);

function display_new_events(data) {
 console.log(data);
 if (Object.keys(data).length !== 0) {
  var time_section = document.getElementById("time-section");
  var event_div = document.createElement("div");
  console.log(event_div);
  var event_title = document.createElement("h3");
  var event_times = document.createElement("p");
  var time_text = "From " + data.start_time + " to " + data.end_time;
  event_times.appendChild(document.createTextNode("Times:"));
  event_times.appendChild(document.createTextNode(time_text));
  
  
  for(let n = 0; n < Object.keys(data.days_active).length; n++) {
   console.log(data.days_active[n]);
  }
  var title_text = document.createTextNode(data.name);
  event_title.appendChild(title_text);
  event_div.appendChild(event_title);
  event_div.appendChild(event_times);
  console.log(event_div);
  time_section.appendChild(event_div);
 }
 
}

function logout() {
  signOut(auth).then(() => {
  console.log("User is signed out.");
  window.location.href = "login.html";
  }).catch((error) => {
  // An error happened.
  });
}
window.logout = logout;

function add_times_to_schedule() {
  var div = document.getElementById("add-events");
  div.setAttribute("style","visiblity: visible;");
  div.innerHTML = "<div id='add-events-2'>" + 
  "<h1>Add an event</h1>" + 
  "<h4>Name</h4>" + 
  "<input type='text' id='name'></input>" + 
  "<p>Times</p>" + 
  '<table style="color: white;">' +
  '<tbody><tr><td>'+
  '<p>Start time</p>'+
  '<input type="time" id="start_time"></td>'+
  '<td><p>End time</p>'+
  '<input type="time" id="end_time">'+
  '</td></tr></tbody></table>'+
  '<h4>Event days</h4>'+
  '<table><tbody><tr>'+
  '<td><input type="checkbox" id="monday_active">Monday</input></td>'+
  '<td><input type="checkbox" id="tuesday_active">Tuesday</input></td>'+
  '</tr><tr>'+
  '<td><input type="checkbox" id="wednesday_active">Wednesday</input></td>'+
  '<td><input type="checkbox" id="thursday_active">Thursday</input></td>'+
  '</tr><tr>'+
  '<td><input type="checkbox" id="friday_active">Friday</input></td>'+
  '<td><input type="checkbox" id="saturday_active">Saturday</input></td></tr>'+
  '<tr><td colspan="2"><p style="text-align: center;"><input type="checkbox" id="sunday_active">Sunday</input></p></td>'+
  '</tr></tbody></table>'+
  '<button class="new_event_buttons" onclick="submit_new_events()">Submit</button>'+
  '<button onclick="cancel_new_events()" class="new_event_buttons">Cancel</button>'+
  '</div>';
   
}
window.add_times_to_schedule = add_times_to_schedule;

function submit_new_events() {
 var event_number = Math.floor(Math.random()*99999);
 var name = document.getElementById('name').value;
 var start_time = document.getElementById("start_time").value;
 var end_time = document.getElementById("end_time").value;
 var monday_active = document.getElementById("monday_active").checked;
 var tuesday_active = document.getElementById("tuesday_active").checked;
 var wednesday_active = document.getElementById("wednesday_active").checked;
 var thursday_active = document.getElementById("thursday_active").checked;
 var friday_active = document.getElementById("friday_active").checked;
 var saturday_active = document.getElementById("saturday_active").checked;
 var sunday_active = document.getElementById("sunday_active").checked;
 var days_active = {
   monday: monday_active,
   tuesday: tuesday_active,
   wednesday: wednesday_active,
   thursday: thursday_active,
   friday: friday_active,
   saturday: saturday_active,
   sunday: sunday_active,
 };
 var event = {
  name: name,
  event_number: event_number,
  start_time: start_time,
  end_time: end_time,
  days_active: days_active,
 };
 
 const db = getDatabase();
 set(ref(db, 'users/' + uid + "/" + event_number), event).then(console.log("Event successfully added"));
 var div = document.getElementById("add-events");
 div.innerHTML = "";
 div.setAttribute("style","visiblity: hidden;");
 
}
window.submit_new_events = submit_new_events;

function cancel_new_events() {
 console.log("New event cancelled");
 var div = document.getElementById("add-events");
 div.innerHTML = "";
 div.setAttribute("style","visiblity: hidden;");
}
window.cancel_new_events = cancel_new_events;
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/auth.user
    console.log(user);
    uid = user.uid;
    document.getElementById("username").innerHTML = user.displayName;
    document.getElementById("user-greeting").innerHTML = "Hi, " + user.displayName + "!";
    const eventRef = ref(database, 'users/' + uid);
    onValue(eventRef, (snapshot) => {
     var data = snapshot.val();
     console.log(data);
     if(data !== null && data !== dune) {
      for(let n = 0; n < Object.keys(data).length; n++) {
       var list_of_items = Object.keys(data);
       display_new_events(data[list_of_items[n]]);
      }
     }
     
     });

    
    
    // ...
  } else {
    window.location.href = "index.html";
    // ...
  }
});
