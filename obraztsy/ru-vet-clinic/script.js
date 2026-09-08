const emailInput = document.querySelector('.subscription-form__input');
const emailInput2 = document.querySelector('.question-email');

emailInput.addEventListener('input', function() {
  if (emailInput.checkValidity()) {
    emailInput.classList.remove('error');  
  } else {
    emailInput.classList.add('error'); 
  }
});
emailInput2.addEventListener('input', function() {
  if (emailInput2.checkValidity()) {
    emailInput2.classList.remove('error');  
  } else {
    emailInput2.classList.add('error'); 
  }
});