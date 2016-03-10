/*
 *= require tether/dist/js/tether.js
 *= require jquery/dist/jquery.js
 *= require bootstrap/dist/js/bootstrap.js
 */

 var lock = new Auth0Lock('pZJp3rVJ8wRvVLrX30HEOOHZ3HSEASec', 'hexlet-interviews.eu.auth0.com');




$(document).ready(function() {


  document.getElementById('btn-logout').addEventListener('click', function() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
    document.getElementById('name').textContent = '';
  })




  if (location.pathname.match(/add/)) {
    location.pathname = '/';
  }


  var hash = lock.parseHash(window.location.hash);
  if (hash) {
    if (hash.error) {
      console.log("There was an error logging in", hash.error);
      alert('There was an error: ' + hash.error + '\n' + hash.error_description);
    } else {
      //save the token in the session:
      localStorage.setItem('id_token', hash.id_token);
    }
  }


   //retrieve the profile:
 var id_token = localStorage.getItem('id_token');
 if (!id_token) {
   document.getElementById('btn-logout').textContent = '';
   $('.btn.btn-secondary.btn-lg').on('click',function(){
     lock.show({ authParams: { scope: 'openid' },
       connections: ['github'],
       closable: false,
       socialBigButtons: true,
       icon: 'https://d2vgcf2rm1on1i.cloudfront.net/assets/hexlet-logo-28972b250dd90cea0635d616174bfa717c9ee763e25138fe9cdb410bdbc186c2.svg'
     });
   })
 }


 if (id_token) {
   lock.getProfile(id_token, function (err, profile) {
     if (err) {
       return alert('There was an error geting the profile: ' + err.message);
     }
     document.getElementById('name').textContent = profile.name;
     document.getElementById('btn-logout').textContent = 'Выйти';
   });
 }

})
