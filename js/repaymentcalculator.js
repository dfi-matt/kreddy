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
	min: 3,
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

	//Set the variables
	var annual_rate = 52.15;
	var annual_rate_without = 60;
	var periods = loan_term;
	var rate = annual_rate / 100 / 12;
	var rate_without = annual_rate_without / 100 / 12;

	//Calculate the repayment amount
	var x = Math.pow(1 + rate, periods);
	var payment_amount = (loan_amount * x * rate) / (x - 1);

	var y = Math.pow(1 + rate_without, periods);
	var payment_amount_without = (loan_amount * y * rate_without) / (y - 1);

	//Create the loan schedule
	var schedule = "";
	var interest_accrued = 0;
	var interest_generated = 0;
	var repayment_amount = 0;
	var balance = loan_amount;
	var principal = 0;

	//Calculate Start Date
    var startDate = new Date();

	for ( var i=0; i < periods; i++) { 

		interest_generated = balance * rate;
		repayment_amount += payment_amount;
		interest_accrued += interest_generated;
	  	principal = payment_amount - interest_generated;
	  	balance = balance + interest_generated - payment_amount;
	  	var paymentDate = $("#isrepeat").val() === 'false' ? addMonths(startDate, (i+3)) : addMonths(startDate, (i+1));
	  	if(i == 0)
	  		var first_date = formatPaymentDate(paymentDate); 


	  // Append a row to the table
		schedule += '<tr>';
		schedule += '<td>'+(i+1)+'</td>';
		schedule += '<td>'+ formatPaymentDate(paymentDate) + '</td>';
		schedule += '<td>'+ moneyFormD.to(payment_amount) +'</td>';
		schedule += '<td>'+ moneyFormD.to(interest_generated) +'</td>';
		schedule += '<td>'+ moneyFormD.to(principal) +'</td>';
		schedule += '<td>'+ moneyFormD.to(balance) +'</td>';
		schedule += '</tr>';
	}

	var dueDate = new moment();
	dueDate.add(loan_term, 'months');
	var repayment_date = dueDate.format('DD.MM.YYYY');

	payload = { 
		amount: loan_amount,
		term: loan_term,
		interest_rate: annual_rate,
		interest: interest_accrued,
		guarantor_repayment: payment_amount_without,
		repayment: repayment_amount,
		monthly_repayment: payment_amount,
		first_date: first_date,
		schedule: schedule,
		date: repayment_date
	};


	return payload;
}

function addMonths (date, count) {
	if (date && count) {
		var m, d = (date = new Date(+date)).getDate();
		date.setMonth(date.getMonth() + count, 1);
		m = date.getMonth();
		date.setDate(d);
		if (date.getMonth() !== m) date.setDate(0);
	}
	return date;
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
	$(".loan-repayments-display").html(payload.term);

	//Display Interest
	$(".loan-interest-display").html(moneyForm.to(payload.interest));

	//Display APR
	$(".loan-rate-display").html(moneyFormD.to(payload.interest_rate));

	//Display Loan Date
	$('.loan-date-display').html(payload.date);

	//Monthy Repayment
	$(".monthly-repayment-display").html(moneyForm.to(payload.monthly_repayment));

	//Monthly Repayment Without Guarantor
	$(".monthly-repayment-guarantor-display").html(moneyForm.to(payload.guarantor_repayment));
	

	//Display the Repayment Amount
	$(".loan-repayment-display").html(moneyForm.to(payload.repayment));
}


//Helper Functions

var moneyForm = wNumb({
	thousand: ' ',
	decimals: 0
});

var moneyFormD = wNumb({
	thousand: ' ',
	decimals: 2
});

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

function formatPaymentDate(date){
	var output = (date.getDate() < 10) ? '0' : '';
	output += date.getDate() + '.';
	output += ((date.getMonth() + 1) < 10) ? '0' : '';
	output += (date.getMonth() + 1) + '.';
	output += date.getFullYear();
	return output;
}


slideramount.noUiSlider.on('update', function(){
	displayLoanInfo();
});

sliderterm.noUiSlider.on('update', function(){
	displayLoanInfo();
});

