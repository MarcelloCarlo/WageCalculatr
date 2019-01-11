$(document).ready(function() {
    moment().format();
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
        numPagibigAmt = 100, numTotalTaxRate = 0, numTotalTaxDeduct = 0, numNetPay = 0, numTrioRate = 0, numTaxableIncome = 0, numNDrate = 0;
    //Hours
    var numTimeInHrs = 0,
        numTimeOutHrs = 0,
        numTotalTime = 0;
    var numRegHours = 0;
    var numTotalOThrs = 0;
    var numRegOThrs = 0;
    var numNightDiffHrs = 0;
    var numNightDiffHrsSet = [22, 23, 24, 1, 2, 3, 4, 5, 6];
    var numTIMESET = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
    //Flags
    var intIfNDFlag = 0,
        intOTFlag = 0;
    //Extra Variables
    newNumTotalTime = 0;

    $("#btn_refresh").on('click', function() {
        location.reload();
    });

    $("#btn_submit").on('click', function() {
        //getting values from input
        numOTtype = $("#OT_type").val();
        numDailyrate = $("#dailyrate").val();
        numTimeInHrs = $("#start_time").val();
        numTimeOutHrs = $("#end_time").val();

        //Dividing the daily numWitholdingPercentRate by 8 hours
        numHourlyrate = numDailyrate / 8;
        $('#ans_hourlyRate').text(numHourlyrate.toFixed(2));

        var startTime = moment.utc(numTimeInHrs, "HH:mm");
        var endTime = moment.utc(numTimeOutHrs, "HH:mm");

        if (endTime.isBefore(startTime)) endTime.add(1, 'day');

        var d = moment.duration(endTime.diff(startTime));
        var s = moment.utc(+d).format('HH');
        //Getting absolute total work hours
        numTotalTime = parseInt(s);

        //Check the total hours if there's an OT
        if (numTotalTime >= 8) {

            //Retrieving total Overtime
            if (numTotalTime == 8) {
                numTotalOThrs = Math.abs(numTotalTime - 8);
                //getting person hours (7)
                numRegHours = numTotalTime - 1;
            } else {
                numTotalOThrs = Math.abs(numTotalTime - 9);
                //getting person hours (7)
                numRegHours = 8;
                //Overtime is ON
                intOTFlag = 1;
            }
            $('#ans_hoursworked').text(numTotalTime - 1);
            getNightDiff();
        } else
        if (numTotalTime < 8) {
            if (numTotalTime >= 4) {
                numRegHours = numTotalTime;
                numRegHours - 1;
                $('#ans_hoursworked').text(numTotalTime);
                getNightDiff();
            } else if (numTotalTime < 4) {
                numRegHours = numTotalTime;
                $('#ans_hoursworked').text(numTotalTime);
                getNightDiff();
            }
        }
        //selecting calculation based from Overtime type
        switch (parseInt(numOTtype.trim())) {
            case 0:
                //alert('Select Overtime Type 1');
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
                //alert('Select Overtime Type 2');
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
                numNightDiffHrs = i;

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
                numOTNDrate = numNightDiffHrs * 0.1 * numHourlyrate * 1.25;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));

            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
                numNDrate = 0.00;
            }

        }
        //if there's Night diff only
        else if (intIfNDFlag == 1) {
            //night diff numWitholdingPercentRate
            numNDrate = numNightDiffHrs * 0.1 * numHourlyrate;
            //Print the amount selected
            $('#ans_nightDiff').text(numNDrate.toFixed(2));

        }
        //if there's no overtime
        else {
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = 0.00;
            numOTNDrate = 0.00;
            numNDrate = 0.00;
        }
        //get total Overtime numWitholdingPercentRate
        numTotalOTRate = numOTNDrate + numOvertimeRate;
        //Print the amount selected
        $('#ans_totalOT').text(numTotalOTRate.toFixed(2));

        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate + numNDrate;
        //Print the amount selected
        $('#ans_gross').text(numGrossSalary.toFixed(2));
        calcTax();
    }

    //rest overtime
    function calcRestOT() {
        //get regular numWitholdingPercentRate
        numRegHourRate = numRegHours * 1.3 * numHourlyrate;
        //Print the amount selected
        $('#ans_regtime').text(numRegHourRate.toFixed(2));
        //if there's an Overtime
        if (intOTFlag == 1) {
            //Overtime numWitholdingPercentRate
            numOvertimeRate = numTotalOThrs * 1.69 * numHourlyrate;
            //Print the amount selected
            $('#ans_overtime').text(numOvertimeRate.toFixed(2));
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff numWitholdingPercentRate
                numOTNDrate = numNightDiffHrs * 0.1 * numHourlyrate * 1.3;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));
            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
                numNDrate = 0.00;
            }

            //Print the amount selected
            $('#ans_totalOT').text(numTotalOTRate.toFixed(2));
        } else if (intIfNDFlag == 1) {
            //night diff numWitholdingPercentRate
            numNDrate = numNightDiffHrs * 0.1 * numHourlyrate * 1.3;
            //Print the amount selected
            $('#ans_nightDiff').text(numNDrate.toFixed(2));
        }
        //if there's no overtime
        else {
            numTotalOTRate = 0.00;
            numOTNDrate = 0.00;
            numNDrate = 0.00;
        }

        //get total Overtime numWitholdingPercentRate
        numTotalOTRate = numOTNDrate + numOvertimeRate;

        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate + numNDrate;
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
            numOvertimeRate = numTotalOThrs * 2.60 * numHourlyrate;
            //Print the amount selected
            $('#ans_overtime').text(numOvertimeRate.toFixed(2));
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff numWitholdingPercentRate
                numOTNDrate = numNightDiffHrs * 0.1 * numHourlyrate * 2;
                //Print the amount selected
                $('#ans_otND').text(numOTNDrate.toFixed(2));

            }
            //if there's no Night Diff
            else {
                numOTNDrate = 0.00;
                numNDrate = 0.00;
            }

            //Print the amount selected
            $('#ans_totalOT').text(numTotalOTRate.toFixed(2));
        } else if (intIfNDFlag == 1) {
            //night diff numWitholdingPercentRate
            numNDrate = numNightDiffHrs * 0.1 * numHourlyrate * 2;
            //Print the amount selected
            $('#ans_nightDiff').text(numNDrate.toFixed(2));

        }
        //if there's no overtime
        else {
            //get total Overtime numWitholdingPercentRate
            numTotalOTRate = 0.00;
            numOTNDrate = 0.00;
            numNDrate = 0.00;
        }

        //get total Overtime numWitholdingPercentRate
        numTotalOTRate = numOTNDrate + numOvertimeRate;

        //gross salary
        numGrossSalary = numRegHourRate + numTotalOTRate + numNDrate;
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
        else if (numGrossSalary >= 19000 && numGrossSalary < 20000)
            numPhilHealthAmt = 237.5;
        else if (numGrossSalary >= 20000 && numGrossSalary < 21000)
            numPhilHealthAmt = 250;
        else if (numGrossSalary >= 21000 && numGrossSalary < 22000)
            numPhilHealthAmt = 262.5;
        else if (numGrossSalary >= 22000 && numGrossSalary < 23000)
            numPhilHealthAmt = 275;
        else if (numGrossSalary >= 23000 && numGrossSalary < 24000)
            numPhilHealthAmt = 287.5;
        else if (numGrossSalary >= 24000 && numGrossSalary < 25000)
            numPhilHealthAmt = 300;
        else if (numGrossSalary >= 25000 && numGrossSalary < 26000)
            numPhilHealthAmt = 312.5;
        else if (numGrossSalary >= 26000 && numGrossSalary < 27000)
            numPhilHealthAmt = 325;
        else if (numGrossSalary >= 27000 && numGrossSalary < 28000)
            numPhilHealthAmt = 337.5;
        else if (numGrossSalary >= 28000 && numGrossSalary < 29000)
            numPhilHealthAmt = 350;
        else if (numGrossSalary >= 29000 && numGrossSalary < 30000)
            numPhilHealthAmt = 362.5;
        //Print the amount selected
        $('#ans_philhealth').text(numPhilHealthAmt.toFixed(2));
    }

    function fnSSS() {
        //value matching
        if (numGrossSalary > 999 && numGrossSalary <= 1249.99)
            numSSSAmt = 36.3;
        else if (numGrossSalary >= 1250 && numGrossSalary <= 1749.99)
            numSSSAmt = 54.5;
        else if (numGrossSalary >= 1750 && numGrossSalary <= 2249.99)
            numSSSAmt = 72.7;
        else if (numGrossSalary >= 2250 && numGrossSalary <= 2749.99)
            numSSSAmt = 90.8;
        else if (numGrossSalary >= 2750 && numGrossSalary <= 3249.99)
            numSSSAmt = 109;
        else if (numGrossSalary >= 3250 && numGrossSalary <= 3749.99)
            numSSSAmt = 127;
        else if (numGrossSalary >= 3750 && numGrossSalary <= 4249.99)
            numSSSAmt = 145.3;
        else if (numGrossSalary >= 4250 && numGrossSalary <= 4749.99)
            numSSSAmt = 163.5;
        else if (numGrossSalary >= 4750 && numGrossSalary <= 5249.99)
            numSSSAmt = 181.7;
        else if (numGrossSalary >= 5250 && numGrossSalary <= 5749.99)
            numSSSAmt = 199.8;
        else if (numGrossSalary >= 5750 && numGrossSalary <= 6249.99)
            numSSSAmt = 218;
        else if (numGrossSalary >= 6250 && numGrossSalary <= 6749.99)
            numSSSAmt = 236.20;
        else if (numGrossSalary >= 6750 && numGrossSalary <= 7249.99)
            numSSSAmt = 254.30;

        //Print to label
        $('#ans_sss').text(numSSSAmt.toFixed(2));
    }

    function fnPagibig() {
        //print pagibig...
        $('#ans_pagibig').text(numPagibigAmt.toFixed(2));
    }

    function calcTax() {

        if (numGrossSalary >= 500) {

            //Compute essentials
            fnPagibig();
            fnPhilHealth();
            fnSSS();

            //compute the three taxes
            numTrioRate = numSSSAmt + numPhilHealthAmt + numPagibigAmt;

            //Compute taxable income
            numTaxableIncome = numGrossSalary - numTrioRate;

            //value matching
            if (numTaxableIncome >= 685 && numTaxableIncome < 1097) {
                numCompensationLevel = 685;
                numWitholdingRate = 0;
                numWitholdingPercentRate = .2;
            } else if (numTaxableIncome >= 1096 && numTaxableIncome < 2192) {
                numCompensationLevel = 1096;
                numWitholdingRate = 82.19;
                numWitholdingPercentRate = .25;
            } else if (numTaxableIncome >= 2192 && numTaxableIncome < 5479) {
                numCompensationLevel = 2192;
                numWitholdingRate = 356.16;
                numWitholdingPercentRate = .30;
            } else if (numTaxableIncome >= 5479 && numTaxableIncome < 21918) {
                numCompensationLevel = 5479;
                numWitholdingRate = 1324.47;
                numWitholdingPercentRate = .32;
            } else if (numTaxableIncome >= 21918) {
                numCompensationLevel = 21918;
                numWitholdingRate = 6602.74;
                numWitholdingPercentRate = .35;
            }

            if (numTaxableIncome < 685) {
                numTotalTaxRate = 0;
                $('#ans_tax').text(numTotalTaxRate.toFixed(2));
            } else if (numTaxableIncome >= 685) {

                // Get total tax rate
                if (numWitholdingRate == 0) {
                    numTotalTaxRate = (numTaxableIncome - numCompensationLevel) * numWitholdingPercentRate;

                    //Print to label
                    $('#ans_tax').text(Number(Math.round(numTotalTaxRate + 'e2') + 'e-2'));
                } else if (numWitholdingRate != 0) {
                    numTotalTaxRate = (numTaxableIncome - numCompensationLevel) * numWitholdingPercentRate + numWitholdingRate;

                    //Print to label
                    $('#ans_tax').text(Number(Math.round(numTotalTaxRate + 'e2') + 'e-2'));
                }
            }


            numTotalTaxDeduct = numTrioRate + numTotalTaxRate;
            //Print to label
            $('#ans_totalded').text(Number(Math.round(numTotalTaxDeduct + 'e2') + 'e-2'));

            //get net pay
            numNetPay = numGrossSalary - numTotalTaxDeduct;
            //Print to label
            $('#ans_net').text(Number(Math.round(numNetPay + 'e2') + 'e-2'));
        }

        $("#btn_submit").prop("disabled", true);

    }

})