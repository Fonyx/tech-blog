const updateCommentFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const id = document.querySelector('#content-update-comment').dataset.id;
    const content = document.querySelector('#content-update-comment').value.trim();
    if(content){

        // consume the login endpoint with a Comment request
        const response = await fetch(`/api/comment/${id}`, {
            method: 'PUT',
            body: JSON.stringify({content}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Comment updated successfully');
            document.location.replace(`/comment/${id}`);
        } else {
            console.log('Failed to update Comment');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit valid form fields');
    }
}

// attach the submit handler to the signup button
document
.querySelector('.update-comment-form')
.addEventListener('submit', updateCommentFormHandler);