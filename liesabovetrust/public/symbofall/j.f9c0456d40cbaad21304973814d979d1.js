window.addEventListener("load", () => {
    const canvas = document.getElementById('symbofall');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';

    const alphabet = latin + nums;

    const fontSize = 16;
    const columns = canvas.width/fontSize;

    const rainDrops = [];

    for( let x = 0; x < columns; x++ ) {
        rainDrops[x] = 1;
    }

    const pesterings = [];
    let iter = 0;

    for (let j = 0; j < canvas.width * canvas.height / 10000; j++) {
        pesterings[j] = [
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            0,
            1,
            1,
            1
        ];
    }

    // Source - https://stackoverflow.com/a/1349426
    // Posted by csharptest.net, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-08-26, License - CC BY-SA 4.0
    function makeid(length) {
        var result           = '';
        var characters       = '0123456789ABCDEF';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    // Source - https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
    
    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }
    // source end

    function colorFunction(a) {
        return Math.max(0, Math.round((Math.sin(a * Math.PI * 2) + .5) / 1.5 * 255))
    }

    const draw = () => {
        context.fillStyle = 'rgba(0, 0, 0, 0.25)';
        context.fillRect(0, 0, canvas.width, canvas.height);

        // for(let i = 0; i < rainDrops.length; i++)
        // {
        // 	const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        // 	context.fillText(text, i*fontSize + (Math.random() - .5) * fontSize * .7, rainDrops[i]*fontSize);
            
            
        // 	if(rainDrops[i]*fontSize > canvas.height && Math.random() > 0.975){
        // 		rainDrops[i] = 0;
        //     }
        // 	rainDrops[i]++;
        // }
        for (let i = 0; i < pesterings.length; i++) {
            const eminem = pesterings[i];
            let a = i / pesterings.length + eminem[3] * iter / 100;
            let r = colorFunction(a + 0 / 3);
            let g = colorFunction(a + 1 / 3);
            let b = colorFunction(a + 2 / 3);
            let rgb = rgbToHex(r, g, b);
            context.fillStyle = rgb;
            const text = alphabet.charAt(eminem[2]);
            let fonterSizer = eminem[3] * fontSize;
            context.font = Math.round(fonterSizer) + 'px monospace';
            context.fillText(text, eminem[0], eminem[1]);
            eminem[0] += eminem[4] * fontSize * .25 * eminem[3];
            eminem[1] += eminem[5] * fontSize * .5 * eminem[3];
            if (eminem[0] > canvas.width + fonterSizer) {
                eminem[0] -= canvas.width + fonterSizer * 2;
                eminem[2] = Math.floor(Math.random() * alphabet.length);
                eminem[3] = Math.pow(10, Math.random());
                eminem[4] = Math.random() * .2 + .3;
                eminem[5] = Math.random() * .2 + .3;
            }
            if (eminem[1] > canvas.height + fonterSizer) {
                eminem[1] -= canvas.height + fonterSizer * 2;
                eminem[2] = Math.floor(Math.random() * alphabet.length);
                eminem[3] = Math.pow(5, Math.random());
                eminem[4] = Math.random() * .2 + .3;
                eminem[5] = Math.random() * .2 + .3;
            }
        }
        iter++;
    };

    setInterval(draw, 30);
})