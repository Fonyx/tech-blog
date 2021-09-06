const createCommentFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const content = document.querySelector('#content-create-comment').value.trim();
    const post_id = document.querySelector('#content-create-comment').dataset.post_id;

    if(content){
        // consume the login endpoint with a post request
        const response = await fetch('/api/post/comment', {
            method: 'POST',
            body: JSON.stringify({content, post_id}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Post successful');
            document.location.replace(`/post/${post_id}`);
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
.querySelector('.create-comment-form')
.addEventListener('submit', createCommentFormHandler);