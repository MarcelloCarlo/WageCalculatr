$(document).ready(function () {
    var numOTtype = 0;
    var numDailyrate = 0, numHourlyrate = 0;
    var numTimeInHrs = 0, numTimeOutHrs = 0, numTotalTime = 0;
    var numRegHours = 0;
    var numTotalOThrs = 0;
    var numRegOThrs = 0;
    var numNightDiffhrs = [23, 0, 1, 2, 3, 4, 5]

    $("").on('click', function () {
        //function calculate(numOTtype,numDailyrate,numTimeInHrs,numTimeOutHrs);
        //getting value of Overtime type
        numOTtype = $('').val();
        //Dividing the daily rate by 8 hours
        numHourlyrate = numDailyrate / 8;
        //Getting absolute total work hours
        numTotalTime = Math.abs(numTimeInHrs - numTimeOutHrs);

        //check the time out if the value is a candidate for night diff
        for (var i = 0, l = numNightDiffhrs.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;
            }
        }

        //selecting calculation based from Overtime type
        switch (numOTtype) {
            case 0:
                alert('Select Overtime Type');
                break;
            case 1:
                calcRegularOT(numTotalTime, numHourlyrate);
                break;
            case 2:
                calcRestOT(numTotalTime, numHourlyrate);
                break;
            case 3:
                calcLegalHolOT(numTotalTime, numHourlyrate);
                break;
            default:
                break;
        }

    });

    function calcRegularOT(_numTotalTime, _numHourlyrate) {

    }

    function calcRestOT(_numTotalTime, _numHourlyrate) { }

    function calcLegalHolOT(_numTotalTime, _numHourlyrate) { }




    $('button').on('click', function (e) {
        console.log('e', e.target.innerHTML);
    });
});