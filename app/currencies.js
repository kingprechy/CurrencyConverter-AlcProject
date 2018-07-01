/* register service worker*/
function registerServiceWorker() {
  if (!navigator.serviceWorker)return;
  navigator.serviceWorker.register('./sw.js').then(function(){
    console.log('service worker registered!');
  }).catch(function(){
    console.log('e no work!');
  });
};
registerServiceWorker();



function loadCurrencies(){
    let from = document.getElementById('from');
    let to = document.getElementById('to');
    let xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = function(){
      if (this.readyState == 4 && this.status == 200){
        let obj = JSON.parse(this.responseText);
        let options='';
        for(let key in obj.results){
          options=`${options}<option>${key}</option>`;
          }
          from.innerHTML=options;
          to.innerHTML=options;
      }
  
    };
    xHttp.open('GET','https://free.currencyconverterapi.com/api/v5/currencies',true);
    xHttp.send();
}

function currencyConverter(){
    let from = document.getElementById('from').value;
    let to = document.getElementById('to').value;
    let amount = document.getElementById('amount').value;
    let result = document.getElementById('result');
    if(from.length>0 && to.length>0 && amount.length>0){
        let xHttp= new XMLHttpRequest();
        xHttp.onreadystatechange=function(){
          if (this.readyState == 4 && this.status == 200){
            let obj=JSON.parse(this.responseText);
            console.log(obj);
            let fact=obj[`${from}_${to}`];
            if (fact != undefined){
              result.innerHTML=parseFloat(amount)*parseFloat(fact);
            }
          }
        };
        xHttp.open('GET',`https://free.currencyconverterapi.com/api/v5/convert?q=${from}_${to}&compact=ultra`,true);
        xHttp.send();
    }
}
  