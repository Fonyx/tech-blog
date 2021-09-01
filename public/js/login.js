const clog = require('../../utils/cLogger');

const loginFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(email && password){

        // consume the login endpoint with a post request
        const response = await fetch('/api/user/login', {
            type: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            clog('User successfully logged in', 'green');
            document.location.replace('/profile');
        } else {
            clog('User failed to login with known credentials', 'red');
            alert(response.statusText);
        }

    } else {
        clog('User did not submit values for email and password during login', 'yellow');
    }
}

const signupFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const username = document.querySelector('#name-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if(username && email && password){

        // consume the login endpoint with a post request
        const response = await fetch('/api/user/', {
            type: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            clog('User successfully logged in', 'green');
            document.location.replace('/profile');
        } else {
            clog('User failed to signup', 'red');
            alert(response.statusText);
        }

    } else {
        clog('User did not submit values for username, email and password during login', 'yellow');
    }
}

// attach the login handler to the login button
document
.querySelector('.login-form')
.addEventListener('submit', loginFormHandler);

// attach the submit handler to the signup button
document
.querySelector('.signup-form')
.addEventListener('submit', signupFormHandler);