var numberOne = Math.ceil(Math.random() * 9);
var numberTwo = Math.ceil(Math.random() * 9);
var result = numberOne * numberTwo;
var word = document.createElement('div');
word.textContent = "".concat(numberOne, " \uACF1\uD558\uAE30 ").concat(numberTwo);
document.body.appendChild(word);
var form = document.createElement('form');
document.body.appendChild(form);
var input = document.createElement('input');
input.type = 'number';
form.append(input);
var button = document.createElement('button');
button.textContent = '입력!';
form.append(button);
var resultDiv = document.createElement('div');
document.body.append(resultDiv);
form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (result === Number(input.value)) {
        // 문제 맞춘 경우
        resultDiv.textContent = '딩동댕';
        numberOne = Math.ceil(Math.random() * 9);
        numberTwo = Math.ceil(Math.random() * 9);
        result = numberOne * numberTwo;
        word.textContent = "".concat(numberOne, " \uACF1\uD558\uAE30 ").concat(numberTwo);
        input.value = '';
        input.focus();
    }
    else {
        // 틀린 경우
        resultDiv.textContent = '땡';
        input.value = '';
        input.focus();
    }
});
