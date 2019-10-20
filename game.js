const opts = $('#answers');
const btnAnswer = $('#btnAnswer');
const MAX_ITENS = 3;
const MAX_QUESTIONS = 5;
var questions;
var currentQuestion;
var currentId = 0;
var score = 0;

var labels_to_resultado = {};
labels_to_resultado[0] = 'Parece que ainda temos uma chance! Parabéns a todos nós!'
labels_to_resultado[1] = 'Precisamos fazer melhor do que isto para mudar o futuro de nossa ilha!'
labels_to_resultado[2] = 'Infelizmente, nossa ilha sofreu com o aumento da temperatura!'
labels_to_resultado[3] = 'Nossa ilha ainda não sobreviveu a nós!'

var request = new XMLHttpRequest();
request.open('GET', 'https://sheet.best/api/sheets/72ecec25-fa8a-4710-a613-1a878d0cba4e/tabs/perguntas', true);
request.onload = function () {

  // Begin accessing JSON data here
  questions = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    let q = questions[currentId];
    currentQuestion = q;
    lastItemSelected = null;
    lastSelectedItemId = 0;
    let p = document.getElementById('pergunta');
    p.innerText = q.pergunta;

    for(let i = 1; i <= MAX_ITENS; i++){
        let opt = document.createElement('div');
        let txt = '<a href="#" onclick="onOptionSelected(this, ' + i + ')" class="list-group-item list-group-item-action">' + q['opcao' + i] + '</a>';
        opt.innerHTML = txt;
        opt.setAttribute("id", "opcao"+i);        
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
        alert("Error: No question defined");
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
    },];
    score = score + parseInt(currentQuestion['valor'+lastSelectedItemId]); 
  
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
    if (currentId < (MAX_QUESTIONS - 1)){
      currentId = currentId + 1;
      let q = questions[currentId];
      currentQuestion = q;
      lastItemSelected = null;
      lastSelectedItemId = 0;
      let p = document.getElementById('pergunta');
      p.innerText = q.pergunta;

      for(let i = 1; i <= MAX_ITENS; i++){
          let opt = document.getElementById('opcao' + i);
          let txt = '<a href="#" onclick="onOptionSelected(this, ' + i + ')" class="list-group-item list-group-item-action">' + q['opcao' + i] + '</a>';
          opt.innerHTML = txt;
          opt.setAttribute("id", "opcao"+i);
          opts.append(opt);
      }
    }else{
      var element = document.getElementById("answers");
      element.parentNode.removeChild(element);

      let btn = document.getElementById('btnAnswer');
      btn.parentNode.removeChild(btn);

      let title_h2 = document.getElementById('title_h2');
      title_h2.innerText = 'Bom, chegamos ao fim de um século!';
      
      let p = document.getElementById('pergunta');
      p.innerText = 'E o resultado depende de todos!';
      
                        
      var request = new XMLHttpRequest();
      request.open('GET', 'https://sheet.best/api/sheets/72ecec25-fa8a-4710-a613-1a878d0cba4e/tabs/impacto/search?seculo=1', true);
      request.onload = function () {
        var resultado_atual = JSON.parse(this.response)[0];
        let p = document.getElementById('side');  
        let result_p1 = document.createElement('p');
        let txt1 = 'Seu indice de conscientização foi: ' + (score*100/25) + '%';
        result_p1.innerHTML = txt1;
        p.append(result_p1);
        
        let result_p2 = document.createElement('p');
        let txt2 = 'Registramos ' + resultado_atual.respostas + ' respostas e a pontuação da nossa ilha foi : ' + parseInt(resultado_atual.impacto)  + '%';
        result_p2.innerHTML = txt2;
        p.append(result_p2);        

        let result_p3 = document.createElement('p');
        let txt3 = labels_to_resultado[parseInt(resultado_atual.total_impacto)];
        result_p3.innerHTML = txt3;
        p.append(result_p3);

        document.getElementById("island_image").src = "imgs/island" + parseInt(resultado_atual.total_impacto) + ".png";

            
      }
      request.send();      
         
    }
    
}



