const createPostFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const title = document.querySelector('#title-create-post').value.trim();
    const content = document.querySelector('#content-create-post').value.trim();

    if(title && content){

        // consume the login endpoint with a post request
        const response = await fetch('/api/post', {
            method: 'POST',
            body: JSON.stringify({title, content}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Post successful');
            document.location.replace('/profile');
        } else {
            console.log('User failed to signup');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit valid form fields');
    }
}

// attach the submit handler to the signup button
document
.querySelector('.create-post-form')
.addEventListener('submit', createPostFormHandler);