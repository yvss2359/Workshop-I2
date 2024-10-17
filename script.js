document.addEventListener("DOMContentLoaded", function() {
    // Fetch the facts from the API
    fetch('http://127.0.0.1:5000/api/fact')
        .then(response => response.json())
        .then(data => {
            // Get the container where posts will be added
            const factContainer = document.getElementById('feed');
            
            // Clear any existing content (optional)
            // factContainer.innerHTML = '';

            // Loop through each fact and create a post for it
            data.forEach(fact => {
                // Create the main post div
                const postDiv = document.createElement('div');
                postDiv.classList.add('post');

                // Create avatar container
                const avatarDiv = document.createElement('div');
                avatarDiv.classList.add('post__avatar');

                // Generate a random number between 1 and 4
                const randomAvatarNumber = Math.floor(Math.random() * 4) + 1;  // Generates a number between 1 and 4

                // Set the avatar image source based on the random number
                const avatarImg = document.createElement('img');
                avatarImg.src = `images/profile${randomAvatarNumber}.png`;  // Use the random number to select between profile1.png to profile4.png
                avatarImg.alt = '';
                avatarDiv.appendChild(avatarImg);


                // Create the post body
                const bodyDiv = document.createElement('div');
                bodyDiv.classList.add('post__body');

                // Create header (username and verified badge)
                const headerDiv = document.createElement('div');
                headerDiv.classList.add('post__header');
                
                const headerTextDiv = document.createElement('div');
                headerTextDiv.classList.add('post__headerText');
                
                const headerTitle = document.createElement('h3');
                const userName = fact.author;  // Extract the author from the fact object
                headerTitle.innerHTML = `${userName} <span class="post__headerSpecial"><span class="material-icons post__badge">verified</span>@${userName}</span>`;
                headerTextDiv.appendChild(headerTitle);
                
                // Description (tweet content)
                const headerDescriptionDiv = document.createElement('div');
                headerDescriptionDiv.classList.add('post__headerDescription');
                const tweetContent = document.createElement('p');
                
                // Extract the content from the fact object
                tweetContent.textContent = fact.content;  // Use the content field of the fact object
                headerDescriptionDiv.appendChild(tweetContent);

                // Append header text and description to the header div
                headerDiv.appendChild(headerTextDiv);
                headerDiv.appendChild(headerDescriptionDiv);

                // Image (optional, you can replace with actual media if needed)
                const imgElement = document.createElement('img');
                imgElement.src = 'images/campus-hep-paris-2-1200x900.jpg';  // Placeholder image
                imgElement.alt = '';

                // Footer with icons (repeat, favorite, publish)
                const footerDiv = document.createElement('div');
                footerDiv.classList.add('post__footer');

                const repeatIcon = document.createElement('span');
                repeatIcon.classList.add('material-icons');
                repeatIcon.textContent = 'repeat';

                const favoriteIcon = document.createElement('span');
                favoriteIcon.classList.add('material-icons');
                favoriteIcon.textContent = 'favorite_border';

                const publishIcon = document.createElement('span');
                publishIcon.classList.add('material-icons');
                publishIcon.textContent = 'publish';

                footerDiv.appendChild(repeatIcon);
                footerDiv.appendChild(favoriteIcon);
                footerDiv.appendChild(publishIcon);

                // Append all parts to the post body
                bodyDiv.appendChild(headerDiv);
                // bodyDiv.appendChild(imgElement);  // Optional: You can remove this if no image
                bodyDiv.appendChild(footerDiv);

                // Append avatar and body to the main post div
                postDiv.appendChild(avatarDiv);
                postDiv.appendChild(bodyDiv);

                // Append the post at a random position in the container
                const randomIndex = Math.floor(Math.random() * (factContainer.children.length - 1)) + 1;  // Generate a random index between 1 and the number of children

                // Insert the post at the random position, keeping the first element fixed
                if (factContainer.children.length > 1) {
                    factContainer.insertBefore(postDiv, factContainer.children[randomIndex]);  // Insert before the randomly selected child (starting from index 1)
                } else {
                    factContainer.appendChild(postDiv);  // If only one child or the container is empty, append normally
                }

            });
        })
        .catch(error => {
            console.error('Error fetching the facts:', error);
            const factContainer = document.getElementById('feed');
            factContainer.innerHTML = '<p>Failed to load facts. Please try again later.</p>';
        });
});
