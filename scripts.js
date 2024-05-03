document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('post-form');
  
    postForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(postForm);
      const postData = {};
      formData.forEach((value, key) => {
        postData[key] = value;
      });
  
      try {
        const response = await fetch('http://localhost:3000/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postData)
        });
        const data = await response.json();
        console.log(data); // Log the response from the server
        alert('Post created successfully!');
        postForm.reset(); // Reset the form after successful submission
      } catch (error) {
        console.error('Error creating post:', error);
        alert('Error creating post. Please try again later.');
      }
    });
  });
  