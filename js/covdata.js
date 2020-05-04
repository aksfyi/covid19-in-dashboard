
//current time is compared with cached time
var dateobj = new Date()
var currenttime = dateobj.getTime()
var cachedtime = localStorage.getItem("covtime")

//checking if the data is loaded from localStorage / API. API response is cached in localStorage for 60mins
//var cachemsg = "Fetching data from cache";
//var apimsg = "Fetching from API";
let statedatas = {}
let newstatedatas = {}
const searchstatebar = document.getElementById('searchstates')

searchstatebar.addEventListener('keyup',(e)=>{

  let newstatearray = statedatas.results.filter((statename)=>{
    return (
      
      statename.state.toLowerCase().includes(e.target.value.toLowerCase())
    
    );
    

  });
  newstatedatas.results = newstatearray;

  e.target.value==" "?populateStates(statedatas):populateStates(newstatedatas)

  if(newstatedatas.results.length == 0)
  {
    document.getElementById('statedata').innerHTML = `<center><h6 class="blue-text" style="margin-top:4%">No results</h6 ></center>`
  }

});


if(localStorage.getItem("covfetchcases")!=null)
{
 var cofetchcases =JSON.parse(localStorage.getItem("covfetchcases"))
 if(!(cofetchcases.hasOwnProperty('results')))
 {
   localStorage.removeItem("covfetchcases");
   localStorage.removeItem("covtime");
 }

}

if(localStorage.getItem("covfetchall")!=null)
{
 var cofetchall =JSON.parse(localStorage.getItem("covfetchall"))
 if(!(cofetchall.hasOwnProperty('results')))
 {
   localStorage.removeItem("covfetchall");
   localStorage.removeItem("covtime");
 }

}

if(localStorage.getItem("covfetchnews")!=null)
{
 var cofetchnews =JSON.parse(localStorage.getItem("covfetchnews"))
 if(!(cofetchnews.hasOwnProperty('results')))
 {
   localStorage.removeItem("covfetchnews");
   localStorage.removeItem("covtime");
 }

}

if(localStorage.getItem("covfetchdaily")!=null)
{
 var cofetchdaily =JSON.parse(localStorage.getItem("covfetchdaily"))
 if(!(cofetchdaily.hasOwnProperty('results')))
 {
   localStorage.removeItem("covfetchdaily");
   localStorage.removeItem("covtime");
 }

}


async function fetchcases()
{
  if(currenttime - cachedtime > 3600000 || localStorage.getItem("covfetchcases") == null)
  {
    //console.log(apimsg);
    const urlcase = "https://api-covid19-in.herokuapp.com/getdata";
    const responsecase = await fetch(urlcase);
    const datacase = await responsecase.json();
    localStorage.setItem("covtime",currenttime)
    
    return datacase;
  } 
  else{
   
    //console.log(cachemsg)
      return JSON.parse(localStorage.getItem("covfetchcases"))
      
    
  }
}

async function fetchall()
{
  if(currenttime - cachedtime > 3600000 || localStorage.getItem("covfetchall") == null)
  {
    //console.log(apimsg);
    const urlall = "https://api-covid19-in.herokuapp.com/getdata?state=all";
    const responseall = await fetch(urlall);
    const dataall = await responseall.json();
    return dataall;
  }
  else
  {
    //console.log(cachemsg)
    return JSON.parse(localStorage.getItem("covfetchall"))
  }

}

async function fetchdaily()
{
  if(currenttime - cachedtime > 3600000 || localStorage.getItem("covfetchdaily") == null)
  {
    //console.log(apimsg);
    const urldaily = "https://api-covid19-in.herokuapp.com/dailydata?len=30";
    const responsedaily = await fetch(urldaily);
    const datadaily = await responsedaily.json();
    return datadaily;
  }
  else
  {
    //console.log(cachemsg)
    return JSON.parse(localStorage.getItem("covfetchdaily"))
  }
}

async function fetchnews(){

  if(currenttime - cachedtime > 3600000 || localStorage.getItem("covfetchnews") == null)
  {
    //console.log(apimsg);
  const urlnews = "https://api-covid19-in.herokuapp.com/news";
    const responsenews = await fetch(urlnews);
    const datanews = await responsenews.json();
    return datanews;
  }
  else{
    //console.log(cachemsg)
    return JSON.parse(localStorage.getItem("covfetchnews"))

  }
}



fetchcases().then((data) => {
  localStorage.setItem("covfetchcases",JSON.stringify(data))
  document.getElementById('totalmain').innerHTML = data['results'][0]['total']
  document.getElementById('activemain').innerHTML = data['results'][0]['active']
  document.getElementById('deathsmain').innerHTML = data['results'][0]['deaths']
  document.getElementById('recoveriesmain').innerHTML = data['results'][0]['recoveries']
  var ctx = document.getElementById('overalldata');
var overallChart = new Chart(ctx, {
    type: 'doughnut',
    data: data = {
        datasets: [{
            data: [ data['results'][0]['active'],data['results'][0]['recoveries'],data['results'][0]['deaths']],

backgroundColor: [

    '#3f4c6b',
    'rgba(75, 192, 192, 1)',
                 '#FF6B6B',


            ],

          }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Active Cases',
            'Recoveries',
            'Deaths'
        ]
    },
    options: {
      title: {
          display: true,
          text: 'Overall data'
      }
  }
});
});



fetchall().then((datastate)=>{
  localStorage.setItem("covfetchall",JSON.stringify(datastate))
  statedatas.results = [...datastate.results] 
  populateStates(datastate)

  var newarray = datastate['results'].sort((a,b)=>parseInt(a.active) > parseInt(b.active)?-1:1)
  var sact=[];
  var sname = [];
  for(var elem of newarray)
  {
    sact.push(elem.active)
    sname.push(elem.state)
  }
 sact = sact.slice(0,10)
 sname = sname.slice(0,10)
 var ctx3 = document.getElementById('toptendata');
var topTenChart = new Chart(ctx3, {
    type: 'bar',
    data: data = {
        datasets: [{
            data: sact,
            label: 'Active Cases',
            backgroundColor:['#A37B72',
                '#e57373',
                '#f06292',
                '#ba68c8',
                '#29b6f6',
                '#26a69a',
                '#a5d6a7',
                '#c0ca33',
                '#ff8f00',
                '#757575']

        }
           ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels:sname

    },
    options: {
        title: {
            display: true,
            text: '10 states with most active cases'
        }
    }

});

  

});


function populateStates(datastate)
{
  var textnew ="";
  for(var i=0;i<datastate['results'].length;i++){
  var textall=`
  <div class="col s12 m12 l6 xl6">
  <div class="card">
    <div class="card-content">
      <span class="card-title blue-text text-darken-3">${datastate['results'][i]['state'].slice(0,19)}</span>
      <p class="blue-text">Total Cases : ${datastate['results'][i]['total']}</p>
  <canvas id='${datastate['results'][i]['state']}' style="margin: 1%" height="200"></canvas>
 
 
  </div>
  </div>
  </div>
`;

textnew+=textall;
  }

  document.getElementById('statedata').innerHTML = textnew;


  for(var i=0;i<datastate['results'].length;i++)
  {
   
    var ctx = document.getElementById(datastate['results'][i]['state']);
var stateCharts = new Chart(ctx, {
    type: 'doughnut',
    data: data = {
        datasets: [{
            data: [datastate['results'][i]['active'],datastate['results'][i]['recoveries'],datastate['results'][i]['deaths']],

backgroundColor: [

    '#3f4c6b',
    'rgba(75, 192, 192, 1)',
                 '#FF6B6B',

            ],
       }],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Active Cases',
            'Recoveries',
            'Deceased'
        ]
    },
});
  }

 
  
}



fetchdaily().then((datadaily)=>{
  localStorage.setItem("covfetchdaily",JSON.stringify(datadaily))
  var newdeaths=[]
  var newcases = []
  var totalcases = []
  var totaldeaths = []
  
  var datescd = []

  for (let k=0;k<datadaily['results'].length;k++)
  {

    newcases.push(datadaily.results[k].cases.new)
    totalcases.push(datadaily.results[k].cases.total)
    newdeaths.push(datadaily.results[k].deaths.new)
    totaldeaths.push(datadaily.results[k].deaths.total)
    datescd.push(datadaily.results[k].date)
  }

var xtotalcases = totalcases
var xtotaldeaths = totaldeaths
var xdates = datescd

// for 10 days
/*newcases=newcases.slice(-10,)
totaldeaths = totaldeaths.slice(-10,)
totalcases =totalcases.slice(-10,)
datescd = datescd.slice(-10,)
newdeaths = newdeaths.slice(-10,)
*/

  var ctx2 = document.getElementById('newcasesdata');
var newcasesChart = new Chart(ctx2, {
    type: 'line',
    data: data = {
        datasets: [{
            data: newcases,
label: 'New Cases',
borderColor: 'rgba(255, 99, 132, 1)',


   },
                ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels:xdates
    },
     options: {
        title: {
            display: true,
            text: 'New Cases ( Last 30 days )'
        }
    }
});
var ctx2 = document.getElementById('newdeathsdata');
var newDeathsChart = new Chart(ctx2, {
    type: 'line',
    data: data = {
        datasets: [{
            data: newdeaths,
label: 'New Deaths',
borderColor: '#E65100',


   },
                ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels:xdates
    },
     options: {
        title: {
            display: true,
            text: 'New Deaths ( Last 30 days )'
        }
    }
});
var ctx2 = document.getElementById('totalcasesdata');
var totalCasesChart = new Chart(ctx2, {
    type: 'line',
    data: data = {
        datasets: [{
            data:xtotalcases,
label: 'Cases',
borderColor: '#3F51B5',


   },
                ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels:xdates
    },
     options: {
        title: {
            display: true,
            text: 'Total Cases ( Last 30 days )'
        }
    }
});
var ctx2 = document.getElementById('totaldeathsdata');
var totalDeathsChart = new Chart(ctx2, {
    type: 'line',
    data: data = {
        datasets: [{
            data:xtotaldeaths,
label: 'Deaths',
borderColor: '#E040FB',


   },
                ],
        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels:xdates
    },
     options: {
        title: {
            display: true,
            text: 'Total Deaths ( Last 30 days )'
        }
    }
});



$(".loader").fadeOut("slow");
});

fetchnews().then((datanews)=>{

  localStorage.setItem("covfetchnews",JSON.stringify(datanews))
  var newscarousel = "";
  var newscontent = "";

  for(var i=0;i<datanews['results'].length;i++){
  
    newscontent = `<div>
    <div class="card" style="margin:3%;border-radius:10px;">
    <div class="card-image">
    <img style='border-radius:10px;' src="${datanews['results'][i]['image']}">
   
    </div>
    
    <div class="card-content deep-orange-text" style="height:150px;;overflow-y:scroll;">
    <p style="margin:2px;" class="red-text text-darken-4"><strong>${datanews['results'][i]['title']}</strong><p>
    <p>${datanews['results'][i]['snippet']}</p>
    </div>
    <div class="card-action" style="border-radius:10px;">
    <a class="deep-orange-text text-darken-2" target="_blank" href="${datanews['results'][i]['news_link']}">Read</a>
    </div>
  </div>
  </div>`
newscarousel+=newscontent;
 
}

try{
$('.slider').slick('slickAdd',newscarousel);
}
catch{
  document.getElementById('sliderr').innerHTML = newscarousel
}


});

