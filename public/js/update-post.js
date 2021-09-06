const updatePostFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const title = document.querySelector('#title-update-post').value.trim();
    const id = document.querySelector('#title-update-post').dataset.id;
    const content = document.querySelector('#content-update-post').value.trim();
    const tagsString = document.querySelector('#tags-update-post').value.trim();
    var tag_list = [];
    if(title && content){

        if(tagsString){
            // split the tags up into their names
            tag_list = tagsString.split(',');
            // trim whitespace leftover
            tag_list = tag_list.map((tagName) => {
                return tagName.trim();
            })
        }
        // consume the login endpoint with a post request
        const response = await fetch(`/api/post/${id}`, {
            method: 'PUT',
            body: JSON.stringify({id, title, content, tag_list}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('Post successful');
        } else {
            console.log('Failed to update post');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit valid form fields');
    }
}

// attach the submit handler to the signup button
document
.querySelector('.update-post-form')
.addEventListener('submit', updatePostFormHandler);