var inputs = $('#textArea');
var googleSubmitBtn = $('#google-submit');
// var snackbar = $('#snackbar');

//var inputName = $('#textArea');

function isLoading(status){
  if(status){
    $('html, body').addClass('wait');
    googleSubmitBtn.attr('disabled', true).html('입력중...');
  } else {
    $('html, body').removeClass('wait');
    googleSubmitBtn.attr('disabled', false).html('저장하기');
  }
}

// function checkInput(){
//   var isEmpty = false;
//   $.each(inputs, function (index, element) {
//     if (element.value === '') {
//       alert('빈 칸이 있어요.');
//       isEmpty = true;
//       return false;
//     }
//   });
//   return isEmpty;
// }
function checkBlank(){
	var isEmpty=false;
	if(inputs.value===''){
		alert('저장할 내용이 없습니다.');
		isEmpty=true;
		return false;
	}
	return isEmpty;
}




$('#google-submit').click(function () {

  //빈값 체크
  if (checkBlank()) { return; }

  // 입력중..
  isLoading(true);

  $.ajax({
    type: "GET",
    url: "https://script.google.com/macros/s/AKfycbx0tjIO7EQPG9Dc53jRFa5kTvhFDyTZceDR_wHvN1Hhd2lxg4YKaPAg/exec",
    data: {
      "낱글자조합퀴즈": inputs.val()
    },
    success: function (response) {
      isLoading(false);

      // snackbar.html('입력이 완료됐습니다.').addClass('show');
      // setTimeout(function () {
      //   snackbar.removeClass('show');
      // }, 3000);

      //값 비워주기
      inputs.val('');
    },
    error: function (request, status, error) {
      isLoading(false);
      console.log("code:" + request.status + "\n" + "error:" + error);
      console.log(request.responseText);
    }
  });
});