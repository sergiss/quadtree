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
import { Vec2 } from "./vec2.js";

export class AABB {

    constructor(min = new Vec2(), max = new Vec2()) {
        this.min = min;
        this.max = max;
    }

    getWidth() {
        return this.max.x - this.min.x;
    }

    getHeight() {
        return this.max.y - this.min.y;
    }

    overlaps(aabb) {
        return aabb.min.x <= this.max.x && 
			   aabb.min.y <= this.max.y && 
			   aabb.max.x >= this.min.x &&
			   aabb.max.y >= this.min.y;
    }

    debug(ctx) {
        ctx.beginPath();
        ctx.rect(this.min.x, 
                 this.min.y, 
                 this.getWidth(), 
                 this.getHeight());
        ctx.stroke();
    }

}

export class Quadtree {

    static MAX_DEPTH = 12;

    constructor(aabb, depth = 0) {
        this.aabb = aabb;
        this.depth = depth;
        this.nodes = [];
        this.data = [];
    }
    
    split() { // create child nodes

        const d = this.depth + 1;
        const hw = this.aabb.getWidth() * 0.5;
        const hh = this.aabb.getHeight() * 0.5;
        const x1 = this.aabb.min.x, y1 = this.aabb.min.y;
        const x2 = this.aabb.max.x, y2 = this.aabb.max.y;
        this.nodes[0] = new Quadtree(new AABB(new Vec2(x1, y1), new Vec2(x1 + hw, y1 + hh)), d); // top    - left
        this.nodes[1] = new Quadtree(new AABB(new Vec2(x1 + hw, y1), new Vec2(x2, y1 + hh)), d); // top    - right
        this.nodes[2] = new Quadtree(new AABB(new Vec2(x1, y1 + hh), new Vec2(x1 + hw, y2)), d); // bottom - left
        this.nodes[3] = new Quadtree(new AABB(new Vec2(x1 + hw, y1 + hh), new Vec2(x2, y2)), d); // bottom - right
    
    }

    clear() { // Clear all data
        this.data = [];
        this.nodes = [];
    }

    indexOf(aabb) {
        let hw = this.aabb.getWidth() * 0.5;
        let hh = this.aabb.getHeight() * 0.5;

        let cx = this.aabb.min.x + hw;
        let cy = this.aabb.min.y + hh;

        if (aabb.max.y < cy) { // top
            if (aabb.max.x < cx) { // left
                return 0;
            } else if (aabb.min.x > cx) { // right
                return 1;
            }
        } else if (aabb.min.y > cy) { // bottom
            if (aabb.max.x < cx) { // left
                return 2;
            } else if (aabb.min.x > cx) { // right
                return 3;
            }
        }
        return -1;
    }

    hasChildrens() {
        return this.nodes.length > 0;
    }

    insert(aabb) {
        if(this.hasChildrens()) {
            const index = this.indexOf(aabb);
            if (index > -1) {
                this.nodes[index].insert(aabb);
                return;
            }
        }
        this.data.push(aabb);
        if(this.data.length > 8 && this.depth < Quadtree.MAX_DEPTH) {
            if(this.nodes.length === 0) {
                this.split();
            }
            let i = 0;
            while(i < this.data.length) {
                const index = this.indexOf(this.data[i]);
                if(index > -1) {
                    this.nodes[index].insert(this.data.splice(i, 1)[0]);
                } else {
                    i++;
                }
            }
        }
    }

    iterate(aabb, result = []) {

        if(this.hasChildrens()) {
            const index = this.indexOf(aabb);
            if (index > -1) {
                this.nodes[index].iterate(aabb, result);
            }
        }

        for(let i = 0; i < this.data.length; ++i) {
            if(this.data[i].overlaps(aabb)) {
                result.push(this.data[i]);
            }
        }     
        
        return result;
    }

    debug(ctx) {

        let debug = false;
        if(this.data.length > 0) {
            debug = true;
        }

        for(let i = 0; i < this.nodes.length; ++i) {
            debug |= this.nodes[i].debug(ctx);
        }
    
        if(debug ) {
            this.aabb.debug(ctx);
        }
        return debug;
    }

}