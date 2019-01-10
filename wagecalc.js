$(document).ready(function() {
    //Options
    var numOTtype = 0;
    //Rates
    var numDailyrate = 0,
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
    var numTimeInHrs = 0,
        numTimeOutHrs = 0,
        numTotalTime = 0;
    var numRegHours = 0;
    var numTotalOThrs = 0;
    var numRegOThrs = 0;
    var numOTNDhrs = 0;
    var numNightDiffHrsSet = [22, 23, 24, 1, 2, 3, 4, 5, 6];
    //Flags
    var intIfNDFlag = 0,
        intOTFlag = 0;

    $("#btn_submit").on('click', function() {
        //getting values from input
        numOTtype = $("#OT_type").val();
        numDailyrate = $("#dailyrate").val();
        numTimeInHrs = $("#start_time").val();
        numTimeOutHrs = $("#end_time").val();

        //Dividing the daily numWitholdingPercentRate by 8 hours
        numHourlyrate = numDailyrate / 8;
        $('#ans_hourlyRate').text(numHourlyrate.toFixed(2));
        //Getting absolute total work hours
        numTotalTime = Math.abs(numTimeInHrs - numTimeOutHrs);
        console.log("numTotalTime " + numTotalTime);
        //Check the total hours if there's an OT
        if (numTotalTime >= 8) {
            //Overtime is ON
            intOTFlag = 1;
            //getting person hours (7)
            numRegHours = 8;
            //Retrieving total Overtime
            numTotalOThrs = Math.abs(numTotalTime - 9);
            console.log("numTotalOThrs " + numTotalOThrs);
            getNightDiff();
        } else if (numTotalTime < 8) {
            if (numTotalTime >= 4) {
                numRegHours = numTotalTime;
                numRegHours - 1;
            } else if (numTotalTime < 4) {
                numRegHours = numTotalTime;
            }
        }

        //selecting calculation based from Overtime type
        switch (parseInt(numOTtype.trim())) {
            case 0:
                alert('Select Overtime Type 1');
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
                alert('Select Overtime Type 2');
                break;
        }

    });

    //check the time out if the value is a candidate for night diff
    function getNightDiff() {
        for (var i = 0, l = numNightDiffHrsSet.length; i < l; i++) {
            if (numTimeOutHrs == numNightDiffHrsSet[i]) {
                //Enable Night Diff flag if it exists
                intIfNDFlag = 1;

                //Getting Overtime Night Diff
                numOTNDhrs = i;
                console.log("OTNDHRS " +
                    numOTNDhrs);
                break;
            }
        }

    }

    // Regular overtime
    function calcRegularOT() {
        //get regular numWitholdingPercentRate
        numRegHourRate = numRegHours * numHourlyrate;
        //Print the amount selected
        $('#ans_regtime').text(numRegHourRate.toFixed(2));
        //if there's an Overtime
        if (intOTFlag == 1) {
            //Overtime numWitholdingPercentRate
            numOvertimeRate = numTotalOThrs * 1.25 * numHourlyrate;
            //Print the amount selected
            $('#ans_overtime').text(numOvertimeRate.toFixed(2));
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff numWitholdingPercentRate
                numOTNDrate = numOTNDhrs * 0.1 * numHourlyrate * 1.25;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));
                console.log(numOTNDrate.toFixed(2));
            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
            }
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = numOTNDrate + numOvertimeRate;
            //Print the amount selected
            $('#ans_totalOT').text(numTotalOTRate.toFixed(2));
        }
        //if there's no overtime
        else {
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = 0.00;
        }
        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate;
        //Print the amount selected
        $('#ans_gross').text(numGrossSalary.toFixed(2));
        calcTax();
    }

    //rest overtime
    function calcRestOT(_numTotalTime, _numHourlyrate) {
        //get regular numWitholdingPercentRate
        numRegHourRate = numRegHours * 1.3 * numHourlyrate;

        //Print the amount selected
        $('#ans_regtime').text(numRegHourRate.toFixed(2));
        //if there's an Overtime
        if (intOTFlag == 1) {
            //Overtime numWitholdingPercentRate
            numOvertimeRate = numTotalOThrs * 1.3 * numHourlyrate;
            //Print the amount selected
            $('#ans_overtime').text(numOvertimeRate.toFixed(2));
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff numWitholdingPercentRate
                numOTNDrate = numOTNDhrs * 0.1 * numHourlyrate * 1.3;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));
            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
            }

            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = numOTNDrate + numOvertimeRate;
            //Print the amount selected
            $('#ans_totalOT').text(numTotalOTRate.toFixed(2));
        }
        //if there's no overtime
        else {
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = 0.00;
        }
        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate;
        //Print the amount selected
        $('#ans_gross').text(numGrossSalary.toFixed(2));
        calcTax();
    }

    //Legal holiday
    function calcLegalHolOT() {
        //get regular numWitholdingPercentRate
        numRegHourRate = numRegHours * 2 * numHourlyrate;
        //Print the amount selected
        $('#ans_regtime').text(numRegHourRate.toFixed(2));
        //if there's an Overtime
        if (intOTFlag == 1) {
            //Overtime numWitholdingPercentRate
            numOvertimeRate = numTotalOThrs * 2 * numHourlyrate;
            //Print the amount selected
            $('#ans_overtime').text(numOvertimeRate.toFixed(2));
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff numWitholdingPercentRate
                numOTNDrate = numOTNDhrs * 0.1 * numHourlyrate * 2;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));

            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
            }

            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = numOTNDrate + numOvertimeRate;
            //Print the amount selected
            $('#ans_totalOT').text(numTotalOTRate.toFixed(2));
        }
        //if there's no overtime
        else {
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = 0.00;
        }
        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate;
        //Print the amount selected
        $('#ans_gross').text(numGrossSalary.toFixed(2));
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
        $('#ans_philhealth').text(numPhilHealthAmt.toFixed(2));
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
        $('#ans_sss').text(numSSSAmt.toFixed(2));
    }

    function fnPagibig() {
        //print pagibig...
        $('#ans_pagibig').text(numPagibigAmt.toFixed(2));
    }

    function calcTax() {
        //Compute essentials
        fnPagibig();
        fnPhilHealth();
        fnSSS();
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
        $('#ans_totalded').text(numTotalTaxDeduct.toFixed(2));

        // Get total tax rate
        if (numWitholdingRate == 0) {
            numTotalTaxRate = (numGrossSalary - numTotalTaxDeduct - numCompensationLevel) * numWitholdingPercentRate;
        } else if (numWitholdingRate != 0) {
            numTotalTaxRate = (numGrossSalary - numTotalTaxDeduct - numCompensationLevel) * numWitholdingPercentRate + numWitholdingRate;
        }
        //get net pay
        numNetPay = numGrossSalary - numTotalTaxDeduct;
        //Print to label
        $('#ans_net').text(numNetPay.toFixed(2));
    }

})