console.log('running delete');
const deleteCommentFormHandler = async (event) => {
    event.preventDefault();
    console.log('deleting');

    // collect values from the login form
    const comment_id = document.querySelector('#delete').dataset.comment_id;
    const post_id = document.querySelector('#delete').dataset.post_id;

    console.log(comment_id);
    console.log(post_id)

    if(comment_id){
        // consume the login endpoint with a post request
        const response = await fetch(`/api/comment/${comment_id}`, {
            method: 'DELETE',
            body: JSON.stringify({}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Post deleted successfully');
            document.location.replace(`/post/${post_id}`);
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
.addEventListener('click', deleteCommentFormHandler);