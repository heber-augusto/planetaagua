const opts = $('#answers');
const btnAnswer = $('#btnAnswer');
const MAX_ITENS = 3;

var currentQuestion;

var request = new XMLHttpRequest();
request.open('GET', 'https://sheet.best/api/sheets/72ecec25-fa8a-4710-a613-1a878d0cba4e', true);
request.onload = function () {

  // Begin accessing JSON data here
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    let q = data[0];
    currentQuestion = q;
    lastItemSelected = null;
    lastSelectedItemId = 0;
    let p = document.getElementById('pergunta');
    p.innerText = q.pergunta;

    for(let i = 1; i <= MAX_ITENS; i++){
        let opt = document.createElement('div');
        let txt = '<a href="#" onclick="onOptionSelected(this, ' + i + ')" class="list-group-item list-group-item-action">' + q['opcao' + i] + '</a>';
        opt.innerHTML = txt;
        opts.append(opt);
    }

  } else {
    alert("Algo deu errado!")
  }
}

request.send();

var lastItemSelected;
var lastSelectedItemId;
function onOptionSelected(item,  value){
    console.log("button " + value + " opcao = " + currentQuestion['opcao' + value]);
    if(lastItemSelected){
        lastItemSelected.classList.remove('active');
    }

    lastItemSelected = item;
    lastItemSelected.classList.add('active');
    lastSelectedItemId = value;
}

function postAnswer(){
    if(!currentQuestion){
        alert("Error: No question defiened");
        return;
    }

    if(!lastItemSelected){
        alert("Selecione uma resposta");
    }
    // This means 1 new row will be inserted into the Sheet
    const data = [
    {
      Id: 10,
      usuario: 'user',
      pergunta: currentQuestion.Id,
      resposta: currentQuestion['opcao'+lastSelectedItemId],
      valor: currentQuestion['valor'+lastSelectedItemId],    
    },
  ];
  
  fetch('https://sheet.best/api/sheets/72ecec25-fa8a-4710-a613-1a878d0cba4e/tabs/respostas', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(r => r.json())
    .then(data => {
      // The response comes here
      console.log(data);
    })
    .catch(error => {
      // Errors are reported there
      console.log(error);
    });
}