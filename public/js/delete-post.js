const deletePostFormHandler = async (event) => {
    event.preventDefault();
    console.log('deleting');

    // collect values from the login form
    const post_id = document.querySelector('#delete').dataset.id;

    if(post_id){
        // consume the login endpoint with a post request
        const response = await fetch(`/api/post/delete`, {
            method: 'DELETE',
            body: JSON.stringify({post_id}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Post deleted successfully');
            document.location.replace('/profile');
        } else {
            console.log('Post failed to delete');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit valid form fields');
    }
}

// attach the submit handler to the signup button
document
.querySelector('#delete')
.addEventListener('click', deletePostFormHandler);