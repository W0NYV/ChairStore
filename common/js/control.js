//インターフェース周り.js

'use strict';

const control = {

    mouseMove(_x, _y) {
        window.addEventListener('mousemove', (evt) => {
            
            let x = evt.clientX;
            let y = evt.clientY;
            const width = window.innerWidth;
            const height = window.innerHeight;

            x = (x - width / 2.0) / (width / 2.0);
            y = (y - height / 2.0) / (height / 2.0);

            _x += x;
            _y += y;

        })
    },

    //ほんとはよくない書き方だが一時的に
    cameraControl() {
        window.addEventListener('mousedown', () => {
            mousePressed = true;
        })
    
        window.addEventListener('mouseup', () => {
            mousePressed = false;
        })
        
        window.addEventListener('mousemove', (evt) => {
            
            let x = evt.clientX;
            let y = evt.clientY;
            const width = window.innerWidth;
            const height = window.innerHeight;
    
            x = (x - width / 2.0) / (width / 2.0);
            y = (y - height / 2.0) / (height / 2.0);
    
            if(mousePressed) {
                mouseX -= x;
                mouseY += y;
            }
        })
    
        window.onmousewheel = function(e){
            let z = e.wheelDelta / Math.abs(e.wheelDelta);
            console.log(z);
            zoom += z;
        }
    },
    
    //ほんとはよくない書き方だが一時的に
    palette() {

        const colorPalette = document.getElementById('color-palette');
    
        colorPalette.addEventListener('change', function() {
            let elements = document.getElementsByName('color');
            let len = elements.length;
            let checkValue = '';
        
            for(let i = 0; i < len; i++) {
                if(elements.item(i).checked) {
                    checkValue = elements.item(i).value;
                }
            }
        
            //console.log(checkValue);
            currentColor = checkValue;
        });
    },

    pressNextChairButton() {
        chairNumber++;
        if(chairNumber > 1) {
            chairNumber = 0;
        } 
        console.log(chairNumber);
    }

};
