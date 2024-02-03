//
//  atom.js - version 0.91
//  a graph vizualization toolkit
//
//  Copyright (c) 2011 Samizdat Drafting Co.
//  Physics code derived from springy.js, copyright (c) 2010 Dennis Hotson
// 
//  Permission is hereby granted, free of charge, to any person
//  obtaining a copy of this software and associated documentation
//  files (the "Software"), to deal in the Software without
//  restriction, including without limitation the rights to use,
//  copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the
//  Software is furnished to do so, subject to the following
//  conditions:
// 
//  The above copyright notice and this permission notice shall be
//  included in all copies or substantial portions of the Software.
// 
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
//  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
//  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
//  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
//  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
//  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
//  OTHER DEALINGS IN THE SOFTWARE.
//

//
// atoms.js
//
// particle system- or physics-related datatypes
//

var Node = function(data){
	this._id = _nextNodeId++; // simple ints to allow the Kernel & ParticleSystem to chat
	this.data = data || {};  // the user-serviceable parts
	this._mass = (data.mass!==undefined) ? data.mass : 1
	this._fixed = (data.fixed===true) ? true : false
	this._p = new Point((typeof(data.x)=='number') ? data.x : null, 
                     (typeof(data.y)=='number') ? data.y : null)
  delete this.data.x
  delete this.data.y
  delete this.data.mass
  delete this.data.fixed
};
var _nextNodeId = 1

var Edge = function(source, target, data){
	this._id = _nextEdgeId--;
	this.source = source;
	this.target = target;
	this.length = (data.length!==undefined) ? data.length : 1
	this.data = (data!==undefined) ? data : {};
	delete this.data.length
};
var _nextEdgeId = -1

var Particle = function(position, mass){
  this.p = position;
  this.m = mass;
	this.v = new Point(0, 0); // velocity
	this.f = new Point(0, 0); // force
};
Particle.prototype.applyForce = function(force){
	this.f = this.f.add(force.divide(this.m));
};

var Spring = function(point1, point2, length, k)
{
	this.point1 = point1; // a particle
	this.point2 = point2; // another particle
	this.length = length; // spring length at rest
	this.k = k;           // stiffness
};
Spring.prototype.distanceToParticle = function(point)
{
  // see http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment/865080#865080
  var n = that.point2.p.subtract(that.point1.p).normalize().normal();
  var ac = point.p.subtract(that.point1.p);
  return Math.abs(ac.x * n.x + ac.y * n.y);
};

var Point = function(x, y){
  if (x && x.hasOwnProperty('y')){
    y = x.y; x=x.x;
  }
  this.x = x;
  this.y = y;  
}

Point.random = function(radius){
  radius = (radius!==undefined) ? radius : 5
	return new Point(2*radius * (Math.random() - 0.5), 2*radius* (Math.random() - 0.5));
}

Point.prototype = {
  exploded:function(){
    return ( isNaN(this.x) || isNaN(this.y) )
  },
  add:function(v2){
  	return new Point(this.x + v2.x, this.y + v2.y);
  },
  subtract:function(v2){
  	return new Point(this.x - v2.x, this.y - v2.y);
  },
  multiply:function(n){
  	return new Point(this.x * n, this.y * n);
  },
  divide:function(n){
  	return new Point(this.x / n, this.y / n);
  },
  magnitude:function(){
  	return Math.sqrt(this.x*this.x + this.y*this.y);
  },
  normal:function(){
  	return new Point(-this.y, this.x);
  },
  normalize:function(){
  	return this.divide(this.magnitude());
  }
}

