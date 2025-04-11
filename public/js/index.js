document.addEventListener('DOMContentLoaded', () => {        
    
        if (window.location.pathname === '/') {
          console.log("Script on this route loaded");
          const form = document.getElementById('form');
          const submit = document.getElementById('submit-btn');

          const processingContainer = document.getElementById("processing")

          submit.addEventListener('click', () =>
          {
            processingContainer.style.display = "block";
            form.submit();
            
          })   
        }

        const failedSection = document.getElementById('failed');
        const successSection = document.getElementById('successful');


        // Show Failed Page
        if (failedSection && window.getComputedStyle(failedSection).display === "block") {
          setTimeout(() => {
            window.location.pathname = "/";
          }, 10000);
        }
        if (successSection && window.getComputedStyle(successSection).display === "block") {              
          setTimeout(() => {
            window.location.pathname = "/dashboard";
          }, 10000);
        } 
        


  });
