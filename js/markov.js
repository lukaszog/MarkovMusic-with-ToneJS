$(document).ready(function() {

    console.log('ready');


    var synth = new Tone.Sampler({
        'A0': 'A0.[mp3|ogg]',
        'C1': 'C1.[mp3|ogg]',
        'D#1': 'Ds1.[mp3|ogg]',
        'F#1': 'Fs1.[mp3|ogg]',
        'A1': 'A1.[mp3|ogg]',
        'C2': 'C2.[mp3|ogg]',
        'D#2': 'Ds2.[mp3|ogg]',
        'F#2': 'Fs2.[mp3|ogg]',
        'A2': 'A2.[mp3|ogg]',
        'C3': 'C3.[mp3|ogg]',
        'D#3': 'Ds3.[mp3|ogg]',
        'F#3': 'Fs3.[mp3|ogg]',
        'A3': 'A3.[mp3|ogg]',
        'C4': 'C4.[mp3|ogg]',
        'D#4': 'Ds4.[mp3|ogg]',
        'F#4': 'Fs4.[mp3|ogg]',
        'A4': 'A4.[mp3|ogg]',
        'C5': 'C5.[mp3|ogg]',
        'D#5': 'Ds5.[mp3|ogg]',
        'F#5': 'Fs5.[mp3|ogg]',
        'A5': 'A5.[mp3|ogg]',
        'C6': 'C6.[mp3|ogg]',
        'D#6': 'Ds6.[mp3|ogg]',
        'F#6': 'Fs6.[mp3|ogg]',
        'A6': 'A6.[mp3|ogg]',
        'C7': 'C7.[mp3|ogg]',
        'D#7': 'Ds7.[mp3|ogg]',
        'F#7': 'Fs7.[mp3|ogg]',
        'A7': 'A7.[mp3|ogg]',
        'C8': 'C8.[mp3|ogg]'
    }, {
        'release': 1,
        'baseUrl': 'audio/piano/'
    }).toMaster();

    $("#notes").val('D5 D#5 D5 A#4 G4 A#4 D5 D#5 D5 A#4');
    var result = '';
    var keyresult = [];
    var valueresult = [];

    function trainMarkovChain(data) {
        const result = {};
        for (let i = 0; i < data.length - 1; i++) {
            const from = data[i];
            const to = data[i + 1];
            result[from] = result[from] || [];
            result[from].push(to);
        }
        return result;
    }

    function predictWithMarkovChain(chain, from) {

        let options;

        if (from && chain.hasOwnProperty(from)) {
            // wartosci danego klucza
            options = chain[from];
        } else {
            // klucze obiektu
            options = Object.keys(chain);
        }
        // losowanie danego elementu
        return options[Math.floor(Math.random() * options.length)];
    }

    $('#generatemusic').on('click', '#genmusicplay', function () {

        var notes = [];

        var key = predictWithMarkovChain(result);
        var tmpkey = key;
        notes.push(tmpkey);

        keyresult[0] = tmpkey;
        valueresult[0] = '';

        for (var i = 1; i < 20; i++) {
            key = predictWithMarkovChain(result, tmpkey);

            keyresult[i] = tmpkey;
            valueresult[i] = key;

            notes.push(key);
            tmpkey = key;
        }

        var time = 0;



        var i = 0;


        notes.forEach(function (value) {
            synth.triggerAttackRelease(value, "1n", Tone.now() + time);
            time += 1;
        });

        var i = 0;
        var putnotes = setInterval(function hello() {
            $("#txtnotes").append(notes[i] + ' ');
            $("#pairs").append('Klucz: ' + keyresult[i] + ' Wartość: ' + valueresult[i] + '<br>');
            i++;

            if (i >= notes.length) {
                clearInterval(putnotes)
            }

            return hello;
        }(putnotes), 1000);

    });


    $("#learn").click(function (event) {

        var notes = $("input[name=notes]").val().split(" ");
        console.log(notes);
        result = trainMarkovChain(notes);

        const table = document.querySelector('#matrix');

        const keys = new Set();
        const output = Object.keys(result).reduce((r, key) => {
            result[key].forEach(e => {
                keys.add(e);
                if (!r[key]) r[key] = {}
                r[key][e] = (r[key][e] || 0) + 1;
            })
            return r;
        }, {})

        table.innerHTML = ''
        table.innerHTML += '<tr><td></td>' + Array.from(keys).map(e => `<td>${e}</td>`).join('') + '<tr>';
        Object.keys(output).forEach(key => {
            let data = `<td>${key}</td>`;
            data += Array.from(keys, e => '<td>' + (output[key][e] ? output[key][e] : 0) + '</td>').join('')
            table.innerHTML += `<tr>${data}</tr>`;
        })

        var r = $('<button class="btn btn-primary mb-2" id="genmusicplay">Wygeneruj nową melodie (20 iteracji (nut))</button>');
        $("#generatemusic").html(r);

    });

    $("#play").click(function (event) {
        var notes = $("input[name=notes]").val().split(" ");

        var time = 0;
        notes.forEach(function (value) {
            synth.triggerAttackRelease(value, "2n", Tone.now() + time);
            console.log(value);
            time += 1;
        })
    })
});
