var media=false;
var notes='';
var likely_death=1;
var minimum_death=0;
function preset() {
    localStorage.setItem("population", 230000);
    localStorage.setItem("infected", 70);
    localStorage.setItem("hospital capacity", 0);
    localStorage.setItem("day", 1);
    localStorage.setItem("event", false);
    localStorage.setItem("action",JSON.stringify([0,0,0]));
    localStorage.setItem("number of cases",0);
    localStorage.setItem("number of death",0);
    localStorage.setItem("notes","There are currently 70 cases in your city.");
    localStorage.setItem("point",40);
    localStorage.setItem("maximum capacity",20000);
    if ((localStorage.getItem('high score'))==null) {
        localStorage.setItem("high score",JSON.stringify([]));
    } else if (JSON.parse(localStorage.getItem('high score')).length!=0){
        high_score_update();
    }

}
function start_game() {
    document.getElementById('game').style.display="flex";
    document.getElementById('game_button').style.display="none";


}
function restart(){
    location.reload()
}
function next_day(){
    update_population();
    update_hospital_capacity();
    update_day();
    updadte_point();
    update_UI();
    end_game();
}
function update_population () {
    var pop=JSON.parse(localStorage.getItem('population'));
    var inf=JSON.parse(localStorage.getItem('infected'));
    var day=JSON.parse(localStorage.getItem('day'));
    var action=JSON.parse(localStorage.getItem('action'));
    var number_of_cases=JSON.parse(localStorage.getItem('number of cases'));
    var notes=JSON.stringify(localStorage.getItem('notes'));
    var hos_cap=JSON.parse(localStorage.getItem('hospital capacity'));
    var number_of_death=JSON.parse(localStorage.getItem('number of death'));
    number_of_cases=number_of_cases+inf;
    notes='';
    ad_notes='';
    ad_notes+=' The total number of infected case is ' + "<span style='color:red;'>"+number_of_cases.toString()+'</span>'+'.'+'<br>';
    ad_notes+=' The total number of death is ' + "<span style='color:red;'>"+number_of_death.toString()+'</span>'+'.'+'<br>';

    //DEATH RATE OF 3.4%
    var death= 0;
    var recovered=0;
    var ad_inf=0;
    
    if (action[2]==1 || action[1]==1 || action[0]==1) {
        
        //LOW INFECT RATE WITH ACTION
        ad_inf=Math.floor((Math.random()* Math.round(inf/2)) + 1);
        ad_notes+=' There are ' +"<span style='color:red;'>"+ ad_inf.toString()+'</span>' +' additional infected today.'+'<br>';
        inf=inf+ad_inf;
        if (day%7==0){
            //2 WEEK FOR RECOVER OR DEAD
            if (hos_cap>100) {
                minimum_death=2;
                death=Math.round(inf*0.05)+Math.floor((Math.random()* Math.round(inf/2)) + minimum_death);
            } else {
                minimum_death=0;
                death=Math.round(inf*0.05)+Math.floor((Math.random()* likely_death) + minimum_death);
            }
            ad_notes+=' There are ' +"<span style='color:red;'>"+ death.toString()+'</span>' +' death today.'+'<br>';
            inf=inf-death;
            recovered=Math.round(inf*0.95);
            ad_notes+=' There are '+"<span style='color:red;'>" + recovered.toString()+'</span' +' recovered today.'+'<br>';
            inf=inf-recovered;

        }
    } else if(action[2]==1 && action[1]==1 && action[0]==1){
    //LOW INFECT RATE WITH ACTIONs
    ad_inf=Math.floor((Math.random()* 2 + 0));
    ad_notes+=' There are ' +"<span style='color:red;'>"+ ad_inf.toString()+'</span>' +' additinal infected today.'+'<br>';
    inf=inf+ad_inf;
    if (day%7==0){
    //2 WEEK FOR RECOVER OR DEAD
        if (hos_cap>100) {
            minimum_death=2;
            death=Math.round(inf*0.05)+Math.floor((Math.random()* Math.round(inf/2)) + minimum_death);

        } else {
            minimum_death=0;
            death=Math.round(inf*0.05)+Math.floor((Math.random()* likely_death) + minimum_death);
        }
        ad_notes+=' There are '  +"<span style='color:red;'>"+ death.toString()+'</span>' +' death today.'+'<br>';
        inf=inf-death;
        recovered=Math.round(inf*0.95);
        ad_notes+=' There are ' +"<span style='color:red;'>" + recovered.toString()+'</span' +' recovered today.'+'<br>';
        inf=inf-recovered;
    }

    } else {
        
        // INFECT RATE OF 1:2 WITH NO ACTION
        ad_inf=Math.floor((Math.random()* inf) + (inf/2));
        ad_notes+=' There are ' +"<span style='color:red;'>"+ ad_inf.toString()+'</span>' +' additinal infected today.'+'<br>';
        inf=inf+ad_inf;
        if (day%7==0){
            //2 dayS FOR RECOVER OR DEAD
            if (hos_cap>100) {
                minimum_death=2;
                death=Math.round(inf*0.05)+Math.floor((Math.random()* Math.round(inf/2)) + minimum_death);

            } else {
                minimum_death=0;
                death=Math.round(inf*0.05)+Math.floor((Math.random()* likely_death) + minimum_death);
            }
            ad_notes+=' There are ' +"<span style='color:red;'>"+ death.toString()+'</span>' +' death today.'+'<br>';
            inf=inf-death;
            recovered=Math.round(inf*0.95);
            ad_notes+=' There are ' + "<span style='color:red;'>" + recovered.toString()+'</span' +' recovered today.'+'<br>';
            inf=inf-recovered;

        }
    }

    //EVEN CAUSE MORE CONTACT BUT NO EVENT WHEN SOCIAL DISTANCING
    if (event() && action[0]!=1) {
        ad_inf=Math.floor((Math.random()* 50) + 10);
        ad_notes+=' An event caused '+ "<span style='color:red;'>"+ ad_inf.toString() +'</span>'+' infected today.'+'<br>';
        inf=inf+ad_inf;
    }
    //CASES FROM FOREINER, NO FOREIGNER WHEN BORDER CLOSED
    if (action[1]!=1) {
        ad_inf=Math.floor((Math.random()* 5) + 2);
        ad_notes+=' There are '+"<span style='color:red;'>" + ad_inf.toString() +'</span>'+' infected foreigners arrived to the city.'+'<br>';
        inf=inf+ad_inf;
    }
    number_of_death=number_of_death+death;
    pop=pop-death;
    notes=ad_notes;
    if (inf<0) {
        localStorage.setItem("infected", 0);
    } else {
        localStorage.setItem("infected", Math.round(inf));
    }
    localStorage.setItem("population", Math.round(pop));
    localStorage.setItem("number of cases", Math.round(number_of_cases));
    localStorage.setItem("notes",notes);
    localStorage.setItem("number of death", Math.round(number_of_death));



}
function update_hospital_capacity() {
    var inf=JSON.parse(localStorage.getItem('infected'));
    var hos_cap=JSON.parse(localStorage.getItem('hospital capacity'));
    var notes=JSON.stringify(localStorage.getItem('notes'));
    var max_cap=JSON.parse(localStorage.getItem('maximum capacity'));
    hos_cap=((inf)/max_cap)*100;
    var ad_notes='';
    if (hos_cap>100) {
        ad_notes='The hospital is unable to handle the infected.'+'<br>' ;
        notes+=ad_notes;
        localStorage.setItem("notes",notes.replace(/"|"/g,""));
        likely_death=inf-max_cap;
    }
    localStorage.setItem("hospital capacity", Math.round(hos_cap));
    
}
function update_day(){
    var day=JSON.parse(localStorage.getItem('day'));
    day+=1;
    localStorage.setItem("day", day);
    document.getElementById('day').innerHTML='Day: ';
    document.getElementById('day').innerHTML+= day.toString()+' <i class="fas fa-calendar-day"></i>';
    
}
function updadte_point() {
    var point=JSON.parse(localStorage.getItem('point'));
    var action=JSON.parse(localStorage.getItem('action'));
    if (action[2]==0 && action[1]==0 && action[0]==0) {
        point=point+3;
    } else {
        point=point+1;
    }
    if(action[0]==1){
        point=point-3;
    }
    if(action[1]==1){
        point=point-5;

    }
    if(action[2]==1){
        point=point-2;

    } 
    localStorage.setItem("point",point);
}
function event() {
    var day=JSON.parse(localStorage.getItem('day'));
    if (day==Math.floor((Math.random()* 14) + 0)) {
        var event=JSON.parse(localStorage.getItem('event'));
        event=true;
        localStorage.setItem("event", event);
    } else {
        var event=JSON.parse(localStorage.getItem('event'));
        event=false;
        localStorage.setItem("event", event);
    }
    return event
}
function social_distancing() {
    var action=JSON.parse(localStorage.getItem('action'));
    if (action[0]!=1) {
        action[0]=1;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('social distancing').innerHTML='Social distancing: ';
        document.getElementById('social distancing').innerHTML+='ON';
        document.getElementById('social distancing').classList.add('button_clicked');
        document.getElementById('social distancing').classList.remove('button_no_clicked');

        
    } else {
        action[0]=0;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('social distancing').innerHTML='Social distancing: ';
        document.getElementById('social distancing').innerHTML+='OFF';
        document.getElementById('social distancing').classList.remove('button_clicked');
        document.getElementById('social distancing').classList.add('button_no_clicked');
    }
    

}
function close_border() {
    var action=JSON.parse(localStorage.getItem('action'));    
    if (action[1]!=1) {
        action[1]=1;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('close border').innerHTML='Close border: ';
        document.getElementById('close border').innerHTML+='ON';
        document.getElementById('close border').classList.add('button_clicked');
        document.getElementById('close border').classList.remove('button_no_clicked');
    } else {
        action[1]=0;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('close border').innerHTML='Close border: ';
        document.getElementById('close border').innerHTML+='OFF';
        document.getElementById('close border').classList.remove('button_clicked');
        document.getElementById('close border').classList.add('button_no_clicked');
    }


}
function quarantine() {
    var action=JSON.parse(localStorage.getItem('action'));
    if (action[2]!=1) {
        action[2]=1;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('quarantine').innerHTML='Quarantine: ';
        document.getElementById('quarantine').innerHTML+='ON';
        document.getElementById('quarantine').classList.add('button_clicked');
        document.getElementById('quarantine').classList.remove('button_no_clicked');
    } else {
        action[2]=0;
        localStorage.setItem("action",JSON.stringify(action));
        document.getElementById('quarantine').innerHTML='Quarantine: ';
        document.getElementById('quarantine').innerHTML+='OFF';
        document.getElementById('quarantine').classList.remove('button_clicked');
        document.getElementById('quarantine').classList.add('button_no_clicked');
    }
    

}
function expand_capacity() {
    var max_cap=JSON.parse(localStorage.getItem('maximum capacity'));
    var point=JSON.parse(localStorage.getItem('point'));
    max_cap=max_cap + 1000;
    point=point-10;
    localStorage.setItem("maximum capacity",max_cap);
    localStorage.setItem("point",point);


}
function end_game(){ 
    var pop=JSON.parse(localStorage.getItem('population'));
    var point=JSON.parse(localStorage.getItem('point'));
    var day=JSON.parse(localStorage.getItem('day'));
    var high_score=JSON.parse(localStorage.getItem('high score'));
    var date=new Date();
    var current_score={
        'days':day,
        'time':date.getDate().toString() +'/'+ (date.getMonth()+1).toString() +'/'+date.getFullYear().toString(),
        'population': pop,
    }

    if (pop<0) {
        document.getElementById('game').style.display="none";
        document.getElementById('game_over').style.display="flex";
        document.getElementById('cause').innerHTML="Everybody died";
    } else if (point<0) {
        document.getElementById('game').style.display="none";
        document.getElementById('game_over').style.display="flex";
        document.getElementById('cause').innerHTML="You have no points";
    }
    if(pop<0 || point<0) {
        document.getElementById('day_end').style.display="flex";
        document.getElementById('day_end').innerHTML+=day.toString()+'  <i class="fas fa-calendar-day"></i>     ';
        high_score.push(current_score);
        localStorage.setItem("high score",JSON.stringify(high_score));
        high_score_update()
    }
    
    
}
function high_score_update() {
    var high_score=JSON.parse(localStorage.getItem('high score'));
    var max=high_score[0].days;
    var high_pos=0;
    for (i=0; i<high_score.length; i++) {
        if (max<high_score[i].days) {
            max=high_score[i].days;
            high_pos=i;
        }
    }
    document.getElementById('high score').innerHTML= '<i class="fas fa-crown ye"></i>'+" Survived "+ max.toString()+' days '+'with '+high_score[high_pos].population+' people'+ ' in '+ high_score[high_pos].time;
    
}
function update_UI() {
    var pop=JSON.parse(localStorage.getItem('population'));
    var inf=JSON.parse(localStorage.getItem('infected'));
    var hos_cap=JSON.parse(localStorage.getItem('hospital capacity'));
    var notes=JSON.stringify(localStorage.getItem('notes'));
    var point=JSON.parse(localStorage.getItem('point'));
    

    document.getElementById('hospital capacity').innerHTML='Hospital capacity: ';
    document.getElementById('infected').innerHTML='Infected: ';
    document.getElementById('poplulation').innerHTML='Population: ';
    document.getElementById('hospital capacity').innerHTML+=(hos_cap.toString()+'%')+' <i class="fas fa-clinic-medical"></i>';
    document.getElementById('infected').innerHTML+=inf.toString()+' <i class="fas fa-viruses"></i>';
    document.getElementById('poplulation').innerHTML+=pop.toString()+' <i class="fas fa-user"></i>';
    document.getElementById('notes').innerHTML='';
    document.getElementById('notes').innerHTML+=notes.slice(2,notes.length-3);
    document.getElementById('point').innerHTML="Points: ";
    document.getElementById('point').innerHTML+=point.toString()+' <i class="fas fa-dollar-sign"></i>';
}
