//Set Up Sliders
var slideramount = document.getElementById('slideramount');
var sliderAmountOptions = {
	start: 30000,
	step: 1000,
	min: 10000,
	max: 100000,
}

noUiSlider.create(slideramount, {
	start: sliderAmountOptions.start,
	connect: [true, false],
	step: sliderAmountOptions.step,
	range: {
		'min': sliderAmountOptions.min,
		'max': sliderAmountOptions.max
	}
});


var sliderterm = document.getElementById('sliderterm');
var sliderTermOptions = {
	start: 6,
	step: 1,
	min: 1,
	max: 12,
}

noUiSlider.create(sliderterm, {
	start: sliderTermOptions.start,
	connect: [true, false],
	step: sliderTermOptions.step,
	range: {
		'min': sliderTermOptions.min,
		'max': sliderTermOptions.max
	}
});


$(function(){

	$(".slider-value-amount").on("focus", function(){
		$(this).select();
	});

	$("#loanamount_text").on("keyup", debounce(function() {
		value = $(this).val();
		if(value < sliderAmountOptions.min || value > sliderAmountOptions.max) {
			return false;
		} else {
			slideramount.noUiSlider.set(value);	
		}
	}, 200));


	$("#loanamount_text").on("change", function(){
		value = $(this).val();
		if(value < sliderAmountOptions.min){
			slideramount.noUiSlider.set(sliderAmountOptions.min);
		} else if(value > sliderAmountOptions.max) {
			slideramount.noUiSlider.set(sliderAmountOptions.max);
		} else {
			slideramount.noUiSlider.set(value);
		}
	});

	$("#loanterm_text").on("keyup", debounce(function(){
		value = $(this).val();
		if(value < sliderTermOptions.min || value > sliderTermOptions.max) {
			return false;
		} else {
			sliderterm.noUiSlider.set(value);	
		}
	}, 200));

	$("#loanterm_text").on("change", function(){
		value = $(this).val();
		if(value < sliderTermOptions.min){
			sliderterm.noUiSlider.set(sliderTermOptions.min);
		} else if(value > sliderTermOptions.max) {
			sliderterm.noUiSlider.set(sliderTermOptions.max);
		} else {
			sliderterm.noUiSlider.set(value);
		}
	});

});



function calculateRepayment(loan_term, loan_amount){

	var interest = 0;
	var fee = 0;
	var repayment = 0;
	var monthly_repayment;
	
	//Calculate Repayment - More complex calculations would be here but this is just a demo
	repayment_amount = loan_amount;
	monthly_repayment = loan_amount / loan_term;

	//Calculate Repayment Date
	var dueDate = new Date();
	dueDate.setTime(dueDate.getTime() + loan_term * 24 * 60 * 60 * 1000);
	var repayment_date = dueDate.getDate() + " ";  
	repayment_date += getMonth(dueDate.getMonth());  




	payload = { amount: loan_amount, term: loan_term, interest: interest, fee: fee, repayment: repayment_amount, monthly_repayment: monthly_repayment, date: repayment_date, day: dueDate.getDate(), month: getMonth(dueDate.getMonth()) };

	return payload;
}



function displayLoanInfo(){

	//Get Term			
	var loan_term = parseFloat(sliderterm.noUiSlider.get());
	
	//Get Amount
	var loan_amount = parseFloat(slideramount.noUiSlider.get());

	//Get Payload
	var payload = calculateRepayment(loan_term, loan_amount);




	//Display Loan Amount
	$("#loanamount_text").val(moneyForm.to(payload.amount));
	$(".loan-amount-display").html(moneyForm.to(payload.amount));


	//Display Loan Term
	$("#loanterm_text").val(payload.term);
	$(".loan-term-display").html(payload.term);

	//Display Interest
	$(".loan-interest-display").html(moneyFormD.to(payload.interest));

	//Display Fee
	$(".loan-fee-display").html(moneyForm.to(payload.fee));

	$(".monthly-repayment-display").html(moneyForm.to(payload.monthly_repayment));

	//Display the Repayment Amount
	$(".loan-repayment-display").html(moneyForm.to(payload.repayment));
}


//Helper Functions

var moneyForm = wNumb({
	thousand: ',',
	decimals: 0
});

var moneyFormD = wNumb({
	thousand: ',',
	decimals: 2
});

function getMonth(month){
	var monthNames = ["January", "February", "March", "Aprix", "May", "June", "July", "August", "September", "October", "November", "December"];
	var monthNamesAbr = ["Jan", "Feb ", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

	var output = monthNamesAbr[month];
	return output;
}

function debounce(func, delay) {
	var inDebounce = void 0;
	return function () {
		var context = this;
		var args = arguments;
		clearTimeout(inDebounce);
		inDebounce = setTimeout(function () {return (
			func.apply(context, args));},
		delay);
	};
}

slideramount.noUiSlider.on('update', function(){
	displayLoanInfo();
});

sliderterm.noUiSlider.on('update', function(){
	displayLoanInfo();
});

