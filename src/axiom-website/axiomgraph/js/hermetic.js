//
//  hermetic.js - version 0.91
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
// hermetic.js
//
// the parts of jquery i can't live without (e.g., while in a web worker)
//
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
      var result = fn(elt)
      if (result!==undefined) out.push(result)
    })
    return out
  },
  extend:function(dst, src){
    if (typeof src!='object') return dst
    
    for (var k in src){
      if (src.hasOwnProperty(k)) dst[k] = src[k]
    }
    
    return dst
  },
  isArray:function(obj){
    if (!obj) return false
    return (obj.constructor.toString().indexOf("Array") != -1)
  },

  inArray:function(elt, arr){
    for (var i=0, j=arr.length; i<j; i++) if (arr[i]===elt) return i;
    return -1
  },
  isEmptyObject:function(obj){
    if (typeof obj!=='object') return false
    var isEmpty = true
    $.each(obj, function(k, elt){
      isEmpty = false
    })
    return isEmpty
  },
}
