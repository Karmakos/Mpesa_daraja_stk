document.addEventListener('DOMContentLoaded', () => {        
    
        const socket = io();  // Connect to the server

        
        socket.on('connect', () => {
          console.log('Connected to server with ID:', socket.id);


          socket.on('paymentStatus', (message) => {
            const failedSection = document.getElementById('failed');
            const successSection = document.getElementById('successful');



            if (message.code === 0) {
                failedSection.style.display = "block";
                document.getElementById("type").innerText = message.type;
                document.getElementById("heading").innerText = message.heading;
                document.getElementById("desc").innerText = message.desc

                setTimeout(() => {
                  window.location.pathname = "/";
                }, 5000);

            } else {
              successSection.style.display = "block"; 
              
              setTimeout(() => {
                window.location.pathname = "/dashboard";
              }, 5000);

            }


          });
        });

        if (window.location.pathname === '/') {
          console.log("Script on this route loaded");
          const form = document.getElementById('form')
          const submit = document.getElementById('submit-btn')

          const processingContainer = document.getElementById("processing")

          submit.addEventListener('click', () =>
          {
            console.log("Button Clicked");
            processingContainer.style.display = "block";
            form.submit();
            
          })        
          
        }

})