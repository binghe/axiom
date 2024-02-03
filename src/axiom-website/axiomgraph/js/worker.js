//
//  worker.js - version 0.91
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
// worker.js
//
// wraps physics.js in an onMessage/postMessage protocol that the
// Kernel object can deal with
//
importScripts('atoms.js');
importScripts('barnes-hut.js');  
importScripts('physics.js');  
// alias over the missing jquery utils so we can run in a worker
$ = {
  each:function(obj, callback){
    if ($.isArray(obj)){
      for (var i=0, j=obj.length; i<j; i++) callback(i, obj[i])
    }else{
      for (var k in obj) callback(k, obj[k])
    }
  },
  map:function(arr, fn){
    var out = []
    $.each(arr, function(i, elt){
      var result = fn(elt, i)
      if (result!==undefined) out.push(result)
    })
    return out
  },

  isArray:function(obj){
    return (obj.constructor.toString().indexOf("Array") != -1)
  },

  inArray:function(elt, arr){
    for (var i=0, j=arr.length; i<j; i++) if (arr[i]===elt) return i;
    return -1
  }    
}
// endalias
var PhysicsWorker = function(){
  var _timeout = 20
  var _physics = null
  var _physicsInterval = null
  var _lastTick = null
  
  var times = []
  var last = new Date().valueOf()
  
  var that = {  
    init:function(param){
      that.timeout(param.timeout)
      _physics = Physics(param.dt, param.stiffness, param.repulsion, param.friction, that.tock)
      return that
    },
    timeout:function(newTimeout){
      if (newTimeout!=_timeout){
        _timeout = newTimeout
        if (_physicsInterval!==null){
          that.stop()
          that.go()
        }
      }
    },
    go:function(){
      if (_physicsInterval!==null) return

      // postMessage('starting')
      _lastTick=null
      _physicsInterval = setInterval(that.tick, _timeout)
    },
    stop:function(){
      if (_physicsInterval===null) return
      clearInterval(_physicsInterval);
      _physicsInterval = null;
      // postMessage('stopping')
    },
    tick:function(){
      // iterate the system
      _physics.tick()    


      // but stop the simulation when energy of the system goes below a threshold
      var sysEnergy = _physics.systemEnergy()
      if ((sysEnergy.mean + sysEnergy.max)/2 < 0.05){
        if (_lastTick===null) _lastTick=new Date().valueOf()
        if (new Date().valueOf()-_lastTick>1000){
          that.stop()
        }else{
          // postMessage('pausing')
        }
      }else{
        _lastTick = null
      }
      
    },

    tock:function(sysData){
      sysData.type = "geometry"
      postMessage(sysData)
    },
    
    modifyNode:function(id, mods){
      _physics.modifyNode(id, mods)  
      that.go()
    },

    modifyPhysics:function(param){
      _physics.modifyPhysics(param)
    },
    
    update:function(changes){
      var epoch = _physics._update(changes)
    }
  }
  
  return that
}


var physics = PhysicsWorker()

onmessage = function(e){
  if (!e.data.type){
    postMessage("¿kérnèl?")
    return
  }
  
  if (e.data.type=='physics'){
    var param = e.data.physics
    physics.init(e.data.physics)
    return
  }
  
  switch(e.data.type){
    case "modify":
      physics.modifyNode(e.data.id, e.data.mods)
      break

    case "changes":
      physics.update(e.data.changes)
      physics.go()
      break
      
    case "start":
      physics.go()
      break
      
    case "stop":
      physics.stop()
      break
      
    case "sys":
      var param = e.data.param || {}
      if (!isNaN(param.timeout)) physics.timeout(param.timeout)
      physics.modifyPhysics(param)
      physics.go()
      break
    }  
}
