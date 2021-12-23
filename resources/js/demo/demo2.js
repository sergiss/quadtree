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

import { AABB, Quadtree } from "../quadtree.js";
import Time from "../time.js";
import { Vec2 } from "../vec2.js";


window.addEventListener("load", ()=> {
    
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");

    const quadtree = new Quadtree(new AABB());

    const time = new Time();

    const stars = [];
   
    const render = ()=> {
        requestAnimationFrame(render);

        const dt = time.getDeltaTime();

        let rect = canvas.getBoundingClientRect();

        let w = rect.width;
        let h = rect.height;

        // Update canvas size
        canvas.width  = w;
        canvas.height = h;

        quadtree.clear();
        quadtree.aabb.min.set(0, 0);
        quadtree.aabb.max.set(w, h);

        if(stars.length < 500) {
            const star = new AABB();
            star.position = new Vec2(Math.random() * w, Math.random() * h);
            star.velocity = new Vec2(1 - Math.random() * 2, 1 - Math.random() * 2).scl(2);
            star.radius = 0.5 + Math.random() * 3;
            star.update = (dt)=> {
                // Update position
                star.position.addScl(star.velocity, dt);
                // Update bounds
                star.min.set(star.position).sub(star.radius);
                star.max.set(star.position).add(star.radius);
            }
            stars.push(star);
        }
        
        for(let i = 0; i < stars.length;) {
            const star = stars[i];
            star.update(dt);
            if(star.position.x < 0 || star.position.y < 0
            || star.position.x > w || star.position.y > h) {
                stars.splice(i, 1); // remove star
            } else {
                star.childs = [];
                quadtree.insert(star);
                i++;
            }
        }

        // Clear screen
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, w, h);

        //ctx.strokeStyle = "#444";
        //quadtree.debug(ctx)

        ctx.fillStyle = '#2aF';
        ctx.strokeStyle = '#2aF';
        ctx.lineWidth = 0.1;

        let aabb = new AABB(new Vec2(), new Vec2());
        
        // render
        for(let i = 0; i < stars.length; ++i) {
            const star = stars[i];            
            const tmp = [];

            aabb.min.set(star.position).sub(100);
            aabb.max.set(star.position).add(100);

            quadtree.iterate(aabb, (next)=> {
                if(star !== next) {
                    tmp.push(next);
                }
            })

            tmp.sort((a, b)=> {
                return a.position.dst2(star.position) - b.position.dst2(star.position);
            })
           
            for(let n = 0, i = 0; i < tmp.length && n < 2; ++i) {
                let next = tmp[i];
                if(star.childs.indexOf(next) === -1) {
                    
                    star.childs.push(next);
                    next.childs.push(star);

                    ctx.beginPath();
                    ctx.moveTo(star.position.x, star.position.y);
                    ctx.lineTo(next.position.x, next.position.y);
                    ctx.stroke();

                    n++;
                }
            }
       
            ctx.beginPath();
            ctx.arc(star.position.x, 
                    star.position.y, 
                    star.radius, 0, 2 * Math.PI);
            ctx.fill();
        }
        
    }

   render();

});