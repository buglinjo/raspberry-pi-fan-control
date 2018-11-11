let gpio = require('rpi-gpio')
let exec = require('child_process').exec

let fanState = 0;

gpio.setup(7, gpio.DIR_LOW)

setInterval(checkTemp, 1000)

function turnOn() {
    gpio.write(7, true, function(err) {
        if (err) throw err;
        fanState = 1;
        console.log('Fan turned on!')
    })
}

function turnOff() {
    gpio.write(7, false, function(err) {
        if (err) throw err;
        fanState = 0;
        console.log('Fan turned off!')
    })
}

function checkTemp() {
    exec('/opt/vc/bin/vcgencmd measure_temp', (err, stdout, stderr) => {
        let temp = stdout.trim().split('=')[1].split('\'')[0]
        console.log('Current temperature is: ' + temp + '\'C')
        if (temp > 55 && fanState !== 1) {
            turnOn()
        } else if (temp < 50 && fanState !== 0) {
            turnOff() 
        }
    })
}

