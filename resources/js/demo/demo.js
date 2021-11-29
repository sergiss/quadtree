/*
 * Copyright (c) 2021, Sergio S.- sergi.ss4@gmail.com http://sergiosoriano.com
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * 
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 * 
 * 3. Neither the name of the copyright holder nor the names of its
 *    contributors may be used to endorse or promote products derived from
 *    this software without specific prior written permission.
 *    	
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
 */
import { Circle } from "../circle.js";
import { Rectangle } from "../rectangle.js";
import { Vec2 } from "../vec2.js";
import { World } from "../world.js";

window.addEventListener("load", ()=> {
    
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const world = new World(new Vec2(0, 0));

    let shape = new Rectangle();

    // World limits
    const restitution = 0.57;
    let b1 = world.createBody(shape, 1, 1, 0).setRestitution(restitution);
    let b2 = world.createBody(shape, 1, 1, 0).setRestitution(restitution);
    let b3 = world.createBody(shape, 1, 1, 0).setRestitution(restitution);
    let b4 = world.createBody(shape, 1, 1, 0).setRestitution(restitution);

    const updateLimits = (w, h)=> {
        b1.shape.halfHeight = 10;
        b1.shape.halfWidth = w * 0.5;
        b1.position.x = b1.shape.halfWidth;
        b1.position.y = 0;

        b2.shape.halfHeight = 10;
        b2.shape.halfWidth = w * 0.5;
        b2.position.x = b2.shape.halfWidth;
        b2.position.y = h;

        b3.shape.halfHeight = h * 0.5;
        b3.shape.halfWidth = 10;
        b3.position.x = 0;
        b3.position.y = b3.shape.halfHeight;

        b4.shape.halfHeight = h * 0.5;
        b4.shape.halfWidth = 10;
        b4.position.x = w;
        b4.position.y = b4.shape.halfHeight;
    }

    var lastTime = 0;
    const render = (time = 1)=> {        
        requestAnimationFrame(render);

        let dt = 1.0 / (time - lastTime); // delta time
        lastTime = time;

        let rect = canvas.getBoundingClientRect();

        let w = rect.width;
        let h = rect.height;

        // Update canvas size
        canvas.width  = w;
        canvas.height = h;

        updateLimits(w, h);
 
        if(world.bodies.length < 50) {
            let shape;
            if(world.bodies.length % 2 == 0) {
                shape = new Rectangle(5 + Math.random() * 10);
            } else {
                shape = new Circle(5 + Math.random() * 10);
            }
            const x = w * 0.5;
            const y = h * 0.5;
            world.createBody(shape, x, y)
            .setRestitution(1)
            .setForce((0.5 - Math.random()) * 100, 
                      (0.5 - Math.random()) * 100);
        }   

        let remove = [];
        world.forEach(body=> {
            if(body.position.x < 0 || body.position.x > w
            || body.position.y < 0 || body.position.y > h) {
                remove.push(body);
            }
        });
        world.removeAll(remove);     

        // Clear screen
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, w, h);

        // Update & Render
        world.step(dt);
        world.render(ctx, true);
    }

    render();

});