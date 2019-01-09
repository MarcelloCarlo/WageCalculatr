$(document).ready(function() {
        //Options
        let numOTtype = 0;
        //Rates
        let numDailyrate = 0,
            numHourlyrate = 0,
            numRegHourRate = 0,
            numOvertimeRate = 0,
            numTotalOTRate = 0,
            numOTNDrate = 0,
            numGrossSalary = 0,
            numPhilHealthAmt = 0,
            numCompensationLevel = 0,
            numWitholdingRate = 0,
            numWitholdingPercentRate = 0;;
        numSSSAmt = 0,
            numPagibigAmt = 100, numTotalTaxRate = 0, numTotalTaxDeduct = 0, numNetPay = 0;
        //Hours
        let numTimeInHrs = 0,
            numTimeOutHrs = 0,
            numTotalTime = 0;
        let numRegHours = 0;
        let numTotalOThrs = 0;
        let numRegOThrs = 0;
        let numOTNDhrs = 0;
        let numNightDiffHrsSet = [23, 0, 1, 2, 3, 4, 5];
        //Flags
        var intIfNDFlag = 0,
            intOTFlag = 0;

        //check the time out if the value is a candidate for night diff
        function getNightDiff() {
            for (var i = 0, l = numNightDiffHrsSet.length; i < l; i++) {
                if (numTimeOutHrs == numNightDiffHrsSet[i]) {
                    //Enable Night Diff flag if it exists
                    intIfNDFlag = 1;
                    //Getting regular Overtime hours
                    numRegOThrs = numTotalOThrs - (i + 1);
                    //Getting Overtime Night Diff
                    numOTNDhrs = i + 1;
                    break;
                }
            }

        }

        // Regular overtime
        function calcRegularOT() {
            //get regular numWitholdingPercentRate
            numRegHourRate.toFixed(2) = numRegHours * numHourlyrate;
            //Print the amount selected
            $('').text(numRegHourRate);
            //if there's an Overtime
            if (intOTFlag == 1) {
                //Overtime numWitholdingPercentRate
                numOvertimeRate.toFixed(2) = numTotalOThrs * 1.25 * numHourlyrate;
                //Print the amount selected
                $('').text(numOvertimeRate);
                //if there's an night diff
                if (intIfNDFlag == 1) {
                    //night diff numWitholdingPercentRate
                    numOTNDrate.toFixed(2) = numOTNDhrs * 0.1 * numHourlyrate * 1.25;
                    //Print the amount selected
                    $('').text(numOTNDrate);
                }
                //if there's no Night Diff
                else {
                    numOTNDrate.toFixed(2) = 0.00;
                }
                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = numOTNDrate + numOvertimeRate;
                //Print the amount selected
                $('').text(numTotalOTRate);
            }
            //if there's no overtime
            else {
                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = 0.00;
            }
            //gross salary
            numGrossSalary.toFixed(2) = numRegHourRate + numTotalOTRate;
            //Print the amount selected
            $('').text(numGrossSalary);
            fnPagibig();
            fnPhilHealth();
            fnSSS();
            calcTax();
        }

        //rest overtime
        function calcRestOT(_numTotalTime, _numHourlyrate) {
            //get regular numWitholdingPercentRate
            numRegHourRate.toFixed(2) = numRegHours * 1.3 * numHourlyrate;
            //Print the amount selected
            $('').text(numRegHourRate);
            //if there's an Overtime
            if (intOTFlag == 1) {
                //Overtime numWitholdingPercentRate
                numOvertimeRate.toFixed(2) = numTotalOThrs * 1.3 * numHourlyrate;
                //Print the amount selected
                $('').text(numOvertimeRate);
                //if there's an night diff
                if (intIfNDFlag == 1) {
                    //night diff numWitholdingPercentRate
                    numOTNDrate.toFixed(2) = numOTNDhrs * 0.1 * numHourlyrate * 1.3;
                    //Print the amount selected
                    $('').text(numOTNDrate);
                }
                //if there's no Night Diff
                else {
                    numOTNDrate.toFixed(2) = 0.00;
                }

                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = numOTNDrate + numOvertimeRate;
                //Print the amount selected
                $('').text(numTotalOTRate);
            }
            //if there's no overtime
            else {
                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = 0.00;
            }
            //gross salary
            numGrossSalary.toFixed(2) = numRegHourRate + numTotalOTRate;
            //Print the amount selected
            $('').text(numGrossSalary.toFixed(2));
            fnPagibig();
            fnPhilHealth();
            fnSSS();
            calcTax();
        }

        //Legal holiday
        function calcLegalHolOT() {
            //get regular numWitholdingPercentRate
            numRegHourRate.toFixed(2) = numRegHours * 2 * numHourlyrate;
            //Print the amount selected
            $('').text(numRegHourRate);
            //if there's an Overtime
            if (intOTFlag == 1) {
                //Overtime numWitholdingPercentRate
                numOvertimeRate.toFixed(2) = numTotalOThrs * 2 * numHourlyrate;
                //Print the amount selected
                $('').text(numOvertimeRate);
                //if there's an night diff
                if (intIfNDFlag == 1) {
                    //night diff numWitholdingPercentRate
                    numOTNDrate.toFixed(2) = numOTNDhrs * 0.1 * numHourlyrate * 2;
                }
                //if there's no Night Diff
                else {
                    numOTNDrate.toFixed(2) = 0.00;
                }

                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = numOTNDrate + numOvertimeRate;
            }
            //if there's no overtime
            else {
                //get total Overtime numWitholdingPercentRate
                numTotalOTRate.toFixed(2) = 0.00;
            }
            //gross salary
            numGrossSalary.toFixed(2) = numRegHourRate + numTotalOTRate;
            //Print the amount selected
            $('').text(numGrossSalary.toFixed(2));
            fnPagibig();
            fnPhilHealth();
            fnSSS();
            calcTax();
        }

        function fnPhilHealth() {
            //match the gross salary
            if (numGrossSalary < 9000)
                numPhilHealthAmt = 100;
            else if (numGrossSalary >= 9000 && numGrossSalary < 10000)
                numPhilHealthAmt = 112.5;
            else if (numGrossSalary >= 10000 && numGrossSalary < 11000)
                numPhilHealthAmt = 125;
            else if (numGrossSalary >= 11000 && numGrossSalary < 12000)
                numPhilHealthAmt = 137.5;
            else if (numGrossSalary >= 12000 && numGrossSalary < 13000)
                numPhilHealthAmt = 150;
            else if (numGrossSalary >= 13000 && numGrossSalary < 14000)
                numPhilHealthAmt = 162.5;
            else if (numGrossSalary >= 14000 && numGrossSalary < 15000)
                numPhilHealthAmt = 175;
            else if (numGrossSalary >= 15000 && numGrossSalary < 16000)
                numPhilHealthAmt = 187.5;
            else if (numGrossSalary >= 16000 && numGrossSalary < 17000)
                numPhilHealthAmt = 200;
            else if (numGrossSalary >= 17000 && numGrossSalary < 18000)
                numPhilHealthAmt = 212.5;
            else if (numGrossSalary >= 18000 && numGrossSalary < 19000)
                numPhilHealthAmt = 225;
            //Print the amount selected
            $('').text(numPhilHealthAmt.toFixed(2));
        }

        function fnSSS() {
            //value matching
            if (numGrossSalary > 999 && numGrossSalary < 1250)
                numSSSAmt = 36.3;
            else if (numGrossSalary >= 1250 && numGrossSalary < 1750)
                numSSSAmt = 54.5;
            else if (numGrossSalary >= 1750 && numGrossSalary < 2250)
                numSSSAmt = 72.7;
            else if (numGrossSalary >= 2250 && numGrossSalary < 2750)
                numSSSAmt = 90.8;
            else if (numGrossSalary >= 2750 && numGrossSalary < 3250)
                numSSSAmt = 109;
            else if (numGrossSalary >= 3250 && numGrossSalary < 3750)
                numSSSAmt = 127;
            else if (numGrossSalary >= 3750 && numGrossSalary < 4250)
                numSSSAmt = 145.3;
            else if (numGrossSalary >= 4250 && numGrossSalary < 4750)
                numSSSAmt = 163.5;
            else if (numGrossSalary >= 4750 && numGrossSalary < 5250)
                numSSSAmt = 181.7;
            else if (numGrossSalary >= 5250 && numGrossSalary < 5750)
                numSSSAmt = 199.8;
            else if (numGrossSalary >= 5750 && numGrossSalary < 6250)
                numSSSAmt = 218;
            //Print to label
            $('').text(numSSSAmt.toFixed(2));
        }

        function fnPagibig() {
            //print pagibig...
            $('').text(numPagibigAmt.toFixed(2));
        }

        function calcTax() {
            //value matching
            if (numGrossSalary > 685 && numGrossSalary < 1097) {
                numCompensationLevel = 685;
                numWitholdingRate = 0;
                numWitholdingPercentRate = .20;
            } else if (numGrossSalary > 1096 && numGrossSalary < 2192) {
                numCompensationLevel = 1096;
                numWitholdingRate = 82.19;
                numWitholdingPercentRate = .25;
            } else if (numGrossSalary > 2192 && numGrossSalary < 5479) {
                numCompensationLevel = 2192;
                numWitholdingRate = 1342.47;
                numWitholdingPercentRate = .32;
            } else if (numGrossSalary > 5479 && numGrossSalary < 21918) {
                numCompensationLevel = 5479;
                numWitholdingRate = 6602.74;
                numWitholdingPercentRate = .35;
            }
            //compute the tax deduction
            numTotalTaxDeduct = numSSSAmt + numPhilHealthAmt + numPagibigAmt;
            //Print to label
            $('').text(numTotalTaxDeduct);
        }
        // Get total tax rate
        if (numWitholdingRate == 0) {
            numTotalTaxRate = (numGrossSalary - numTotalTaxDeduct - numCompensationLevel) * numWitholdingPercentRate;
        } else if (numWitholdingRate != 0) {
            numTotalTaxRate = (numGrossSalary - numTotalTaxDeduct - numCompensationLevel) * numWitholdingPercentRate + numWitholdingRate;
        }
        //get net pay
        numNetPay.toFixed(2) = numGrossSalary - numTotalTaxDeduct;
        //Print to label
        $('').text(numNetPay);
    }
}



$('button').on('click', function(e) {
    console.log('e', e.target.innerHTML);
});

$("").on('click', function() {
//getting values from input
numOTtype = $('').val();
numDailyrate.toFixed(2) = $('').val();
numTimeInHrs = $('').val();
numTimeOutHrs = $('').val();

//Dividing the daily numWitholdingPercentRate by 8 hours
numHourlyrate.toFixed(2) = numDailyrate / 8;
//Getting absolute total work hours
numTotalTime = Math.abs(numTimeInHrs - numTimeOutHrs);

//Check the total hours if there's an OT
if (numTotalTime > 8) {
    //Overtime is ON
    intOTFlag = 1;
    //getting person hours (8)
    numRegHours = 8;
    //Retrieving total Overtime
    numTotalOThrs = Math.abs(numTotalTime - 8);
    getNightDiff();
} else

//selecting calculation based from Overtime type
    switch (numOTtype) {
    case 0:
        alert('Select Overtime Type');
        break;
    case 1:
        calcRegularOT();
        break;
    case 2:
        calcRestOT();
        break;
    case 3:
        calcLegalHolOT();
        break;
    default:
        alert('Select Overtime Type');
        break;
}

});
});