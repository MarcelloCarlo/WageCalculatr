$(document).ready(function() {
    //Options
    let numOTtype = 0;
    //Rates
    let numDailyrate = 0,
        numHourlyrate = 0,
        numRegHourRate = 0,
        numOvertimeRate = 0,
        numOTNDrate = 0;
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

    $("").on('click', function() {
        //getting value of Overtime type
        numOTtype = $('').val();
        //Dividing the daily rate by 8 hours
        numHourlyrate = numDailyrate / 8;
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
                break;
        }

    });

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
        //get regular rate
        numRegHourRate = numRegHours * numHourlyrate;
        //if there's an Overtime
        if (intOTFlag == 1) {
            //Overtime rate
            numOvertimeRate = numTotalOThrs * 1.25 * numHourlyrate;
            //if there's an night diff
            if (intIfNDFlag == 1) {
                //night diff rate
                numOTNDrate = numOTNDhrs * 0.1 * numHourlyrate * 1.25;
            }
        }

    }

    function calcRestOT(_numTotalTime, _numHourlyrate) {}

    function calcLegalHolOT(_numTotalTime, _numHourlyrate) {}




    $('button').on('click', function(e) {
        console.log('e', e.target.innerHTML);
    });
});