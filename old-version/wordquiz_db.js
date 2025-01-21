const userQuizInput=document.querySelector('#textArea');
const userQuizInputBtn=document.querySelector('#userQuizInputBtn');
const problemcontainer=document.querySelector('.problemcontainer');
const answerArea=document.querySelector('.answerArea');
const nextBtn=document.querySelector('.nextBtn');
const letsPlayBtn=document.querySelector('#letsPlayBtn');
// const btnCloseModal=document.querySelector('#btnCloseModal');
// const btnCloseModal2=document.querySelector('#btnCloseModal2');

let quizNum=0;
let howmanyQuiz=0;
let textFromUser;
let text;
let answer;
let answerHidden;
let answerArray;
let answerCharArray=[];
let preHidden=[];
let hiddenArray=[]
let howmanyQ;
let getPoint=0;
let howmanyCard=15;
let isCard=false;

let clickFalg=true;
let selectedCard;

function initWhenIng(){
    answer=[];
    answerHidden=[];
    answerArray=[];
    preHidden=[];
    hiddenArray=[]
    howmanyQ=0;
    getPoint=0;
    clickFalg=true;
}

function init(){
    quizNum=0;
    textFromUser='';
    text=''; 
    initWhenIng();    
    answerCharArray=[];    
    if(!nextBtn.classList.contains('hide')) nextBtn.classList.add('hide');
}

function removeCard(){
	try{
        for(i=0;i<howmanyCard;i++){
            card=document.querySelector('.card');
            problemcontainer.removeChild(card);
        }
        for(j=0;j<answer.length;j++){
            anCard=document.querySelector('.anCard');
            answerArea.removeChild(anCard);
        }
        isCard=false;
	}catch(e){
		console.log('catch');
	}
}

function nextQuiz(){
    if(quizNum>=howmanyQuiz-1){
        removeCard();
        quizNum=0;
        alert('준비된 문제를 모두 풀었습니다.');
    }else{
        removeCard();
        quizNum+=1;
        nextBtn.classList.add('hide');
        initWhenIng();
        makeCard(quizNum);
    }
}

function cardSetting(num){
    for(i=0;i<answer.length;i++){
        let anCard=document.createElement('div');
        anCard.className='anCard';
        anCard.id='answer'+i;
        let anCardInner=document.createElement('div');
        anCardInner.className='anCard-inner';
        let anCardFront=document.createElement('div');
        anCardFront.className='anCard-front';
        anCardFront.innerHTML='?';
        let anCardBack=document.createElement('div');
        anCardBack.className='anCard-back';
        anCardBack.innerHTML=`${answer[i]}`;
        anCardInner.appendChild(anCardFront);
        anCardInner.appendChild(anCardBack);
        for(value in answerHidden){
            if(answer[i]===answerHidden[value]) anCard.classList.add('flipped');
        }
        anCard.appendChild(anCardInner);
        anCard.classList.toggle('flipped');
        answerArea.appendChild(anCard);
    }

    for(i=0;i<hiddenArray.length;i++){
        let card=document.createElement('div');
        card.className='card';
        let cardInner=document.createElement('div');
        cardInner.className='card-inner';
        let cardBack=document.createElement('div');
        cardBack.className='card-back';
        cardBack.innerHTML=`${hiddenArray[i]}`
        let cardFront=document.createElement('div');
        cardFront.className='card-front';
        cardFront.innerHTML=`${i+1}`
        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);
        
        (function(c){
            card.addEventListener('click',(e)=>{
                if(clickFalg && !c.classList.contains('OK')){
                    c.classList.toggle('flipped');
                    selectedText=c.querySelector('.card-back').textContent;                    
                    clickFalg=false;
                    if(answerHidden.includes(selectedText)) {
                        let okCardId='answer'+answer.indexOf(selectedText);
                        let findCardId=document.getElementById(okCardId);
                        findCardId.classList.toggle('flipped');
                        c.classList.add('OK');
                        clickFalg=true;
                            getPoint+=1;
                            if(getPoint===howmanyQ) {
                                getPoint=0; 
                                nextBtn.classList.remove('hide');
                            }
                    }else{
                        setTimeout(()=>{
                            c.classList.remove('flipped');
                            clickFalg=true;
                        },1000);
                    }
                }
            });
        })(card);
        problemcontainer.appendChild(card);
    }
    isCard=true;
}

function makeCard(num){
		let readyText='아족요지묘도카눈감몽머종공튀묵즈치딱필진게받술분샌지감수스족민공름도치쓰위레카랑동';
		let readyTextArr=readyText.split('');
    answer=answerCharArray[num];
    answer.length<=3 ? howmanyQ=1 : howmanyQ=2;
    let imsi0=answer.slice();
    for(i=0;i<howmanyQ;i++){        
        let imsi=imsi0.splice(Math.floor(Math.random()*imsi0.length),1)[0];
        preHidden.push(imsi);
        answerHidden=preHidden.slice();
    }
		console.log(`preHidden.length : ${preHidden.length}, howmanyCard=${howmanyCard}`);
    while(preHidden.length<howmanyCard){
        let imsi2=readyTextArr.splice(Math.floor(Math.random()*readyTextArr.length),1)[0];
        let chk=true;
        for(value in preHidden){  //배열 내의 중복값 체크
            if(preHidden[value]===imsi2) chk=false;
        }
        if(chk) preHidden.push(imsi2); // 중복값이 없으면 배열에 push
    }
    while(preHidden.length>0){
        let imsi3=preHidden.splice(Math.floor(Math.random()*preHidden.length),1)[0];
        hiddenArray.push(imsi3);   
    }
		console.log(hiddenArray);
    cardSetting(quizNum);
}

let isCardArr=[];

function makeQuiz(){
    if(quizNum!==0 || isCard) removeCard();
    init();
    textFromUser=userQuizInput.value;
    text=textFromUser.replace(/(\s*)/g, '');
    answerArray=text.split(',');
    howmanyQuiz=answerArray.length;
    for(i=0;i<answerArray.length;i++){
        let imsi=answerArray[i].split('');    
        answerCharArray.push(imsi);
    }
    makeCard(quizNum);
    alert(`총 ${howmanyQuiz} 문제가 준비되었습니다. [PLAY]버튼을 클릭하세요.`);
	letsPlayBtn.removeAttribute('disabled');
}

userQuizInputBtn.addEventListener('click', makeQuiz);
nextBtn.addEventListener('click', nextQuiz);
// btnCloseModal.addEventListener('click', removeCard);
// btnCloseModal2.addEventListener('click', removeCard);
init();
