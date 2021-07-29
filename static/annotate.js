var min = 99;
var max = 999999;
var canvas
//Drawing Mode & Zoom
var polygonMode = false;
var rectMode = false;
var zoomMode = false
//Array of points and lines of the polygon
var pointArray = new Array();
var lineArray = new Array();
//To know which line is been just drawed by the user 
var activeLine;
//To Know which shape we are selecting
var activeShape = false;

//event is fired after whole content is loaded
$(window).load(function (){canvasCreation(image)});

function canvasCreation(image)
{
  //Initialize canvas with image
  prototypefabric.initCanvas(image);

  //Create polygons and deactivate rectangle Mode
  $('#create-polygon').click(function(){buttonPoly()}); 
  function buttonPoly(){
    polygonMode = true
    rectMode = false
    prototypefabric.polygon.drawPolygon();
  };

  //Create Rectangles ==> Activate Rectangle mode , and deactivate polygon mode
  $('#create-rect').click(function()
  {
    buttonPoly();
    rectMode = true
    var rect = new Rectangle(canvas);
  });

  //download the image with all the objects the user has drawn on it, under the name : download.png
  const download = document.getElementById('save_image');
  download.addEventListener('click', function(e) 
  {
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });

  //Function For zoom in picture
  const zoomFun = () => 
  {
    //By using the mouse wheel, you can zoom in and zoom out the image
    canvas.on('mouse:wheel', function(opt) 
    {
      var delta = opt.e.deltaY;
      var zoom = canvas.getZoom();
      zoom = zoom + delta / 200;

      if (zoom > 20) zoom = 20;
      if (zoom < 1) zoom = 1;

      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();

      var vpt = this.viewportTransform;

      if (vpt[4] >= 0) 
      {
        this.viewportTransform[4] = 0;
      } else if (vpt[4] < canvas.getWidth() - imgWidth * zoom) 
      {
        this.viewportTransform[4] = canvas.getWidth() - imgWidth * zoom;
      }
      if (vpt[5] >= 0) 
      {
        this.viewportTransform[5] = 0;
      } 
      else if (vpt[5] < canvas.getHeight() - imgHeight * zoom) 
      {
        this.viewportTransform[5] = canvas.getHeight() - imgHeight * zoom;
      }
    })
  }
  zoomFun()
};

//A function  assigned to a variable prototypefabric
var prototypefabric = new function () 
{
  // commit code chagne here, imagUrl is the media, balance it everytime with the transport view
  // see the zoomFun code to better understanding
  this.initCanvas = function (imageUrl) 
  {
    canvas = window._canvas = new fabric.Canvas('c');

    fabric.Image.fromURL(imageUrl, function (img) 
    {
      canvas.setBackgroundImage(img, function () 
      {
        // use rendeAll() for a recursion calling, for the transformation 
        canvas.renderAll();
        imgWidth = img.width * img.scaleX;
        imgHeight = img.height * img.scaleY;
      }, 
      {
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
      });
    });

    // mousedown is triggered from an Element while the cursor is over the place
    canvas.on('mouse:down', function (options) 
    {
      if(options.target && options.target.id == pointArray[0].id)
      {
        prototypefabric.polygon.generatePolygon(pointArray);
      }
      if(polygonMode && !rectMode)
      {
        prototypefabric.polygon.addPoint(options);
      }
    });

    // While the cursor is released
    canvas.on('mouse:up', function (options) 
    {
    });

    //While the cursor is moving : draw the points and lines that connect between them to get our polygon
    canvas.on('mouse:move', function (options) 
    {
      if(activeLine && activeLine.class == "line")
      {
        var pointer = canvas.getPointer(options.e);
        activeLine.set({ x2: pointer.x, y2: pointer.y });

        var points = activeShape.get("points");
        points[pointArray.length] = 
        {
          x:pointer.x,
          y:pointer.y
        }
        activeShape.set(
        {
          points: points
        });
        canvas.renderAll();
      }
      canvas.renderAll();
    });
  };
};

//Polygon instructions : For Drawing POLYGONS
prototypefabric.polygon = 
{
  //Drawing polygons : Activate the mode and making an array for each of lines and points 
  drawPolygon : function() 
  {
    polygonMode = true;
    pointArray = new Array();
    lineArray = new Array();
    activeLine;
  },

  //Draw points when user click on the place
  addPoint: function (options) 
  {
    var random = Math.floor(Math.random() * (max - min + 1)) + min;
    var id = new Date().getTime() + random;
    var pointer = canvas.getPointer(event.e);
    var posX = pointer.x;
    var posY = pointer.y;
    //parametrs of the points
    var circle = new fabric.Circle(
    {
      radius: 5,
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 0.1,
      left: (posX),
      top: (posY),
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      id: id,
      objectCaching: false,
    });
    
    if (pointArray.length == 0) {
      //First point user make for polygon will be red until he finish drawing by clicking on it at the end
      circle.set(
      {
        fill: 'red'
      })
    }

    //Points of polygon
    var points = [(posX), (posY), (posX)
      , (posY)];

    //Drawing the lines that connect between the points
    line = new fabric.Line(points, 
    {
      strokeWidth: 1,
      fill: '#999999',
      stroke: 'green',
      class:'line',
      originX:'center',
      originY:'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching:false
    });

    //Getting the coordinations and making them in array
    if (activeShape) 
    {
      //getting the position of the cursor
      var pos = canvas.getPointer(options.e);
      // getting points if the polygon drawed
      var points = activeShape.get("points");

      //Push that coordinations to the array of points
      posX = pos.x
      posY = pos.y

      points.push(
      {
        x: posX,
        y: posY,
      });

      //Getting the polygon with the coordinations we saved and these instructions for design ( color .. )
      var polygon = new fabric.Polygon(points,
      {
        stroke:'#333333',
        strokeWidth:1,
        fill: '#cccccc',
        opacity: 0.5,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching:false
      });
      
      canvas.remove(activeShape);
      canvas.add(polygon);
      activeShape = polygon;
      canvas.renderAll();
    }
    else 
    {
      var polyPoint = [{ x: (posX), y: (posY) }];
      var polygon = new fabric.Polygon(polyPoint, 
      {
        stroke:'#333333',
        strokeWidth:0.5,
        fill: '#cccccc',
        opacity: 0,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching:false
      });

      activeShape = polygon;
      canvas.add(polygon);
    }

    activeLine = line;

    pointArray.push(circle);
    lineArray.push(line);

    canvas.add(line);
    canvas.add(circle);
    canvas.selection = false;
  },

  //Finish drawing the whole polygon 
  generatePolygon: function (pointArray) 
  {
    var points = new Array();
    $.each(pointArray, function (index, point) 
    {
      points.push(
      {
        x: point.left,
        y: point.top,
        translations:translations,
      });
      canvas.remove(point);
    });

    $.each(lineArray, function (index, line) 
    {
      canvas.remove(line);
    });

    canvas.remove(activeShape).remove(activeLine);
    var polygon = new fabric.Polygon(points, 
    {
      stroke: '#00FFFF',
      strokeWidth:2,
      fill: '#0000',
      opacity: 1,
      hasBorders: false,
      hasControls: false
    });

    canvas.add(polygon);

    //Nothing is active anymore just the polygone we draw now 
    activeLine = null;
    activeShape = null;
    polygonMode = false;
    canvas.selection = true;
  }
};

// Rectangle Function
var rect_count = 0;
var coordinations = []
var Rectangle = (function () 
{
  function Rectangle(canvas) 
  {
    var inst = this;
    this.canvas = canvas;
    this.className = 'Rectangle';
    this.isDrawing = false;
    this.bindEvents();
  }

  Rectangle.prototype.bindEvents = function () 
  {
    var inst = this;
    inst.canvas.on('mouse:down', function (o) 
    {
      inst.onMouseDown(o);
    });
    inst.canvas.on('mouse:move', function (o) 
    {
      inst.onMouseMove(o);
    });
    inst.canvas.on('mouse:up', function (o) 
    {
      inst.onMouseUp(o);
    });
    inst.canvas.on('object:moving', function (o) 
    {
      inst.disable();
    });
  }

  Rectangle.prototype.onMouseOver = function (o) 
  {
    var inst = this;
    inst.disable();
  };

  Rectangle.prototype.onMouseUp = function (o) 
  {
    var inst = this;
    inst.disable();
  };

  Rectangle.prototype.onMouseMove = function (o) 
  {
    var inst = this;


    if (!inst.isEnable()) 
    { 
      return; 
    }

    //Get position of cursor
    var pointer = inst.canvas.getPointer(o.e);
    //get the rectangle we just drawed now
    var activeObj = inst.canvas.getActiveObject();

    //Color of the rectangle and width
    activeObj.stroke= '#0040FF',
    activeObj.strokeWidth = 2;
    activeObj.fill = 'transparent';
    //Border
    activeObj.opacity = 0.8;
    activeObj.hasRotatingPoint = false
    activeObj.myCustomOptionKeepStrokeWidth = 2

    canvas.on(
    {
      'object:scaling': function (e) 
      {
        var obj = e.target;
        if (obj.myCustomOptionKeepStrokeWidth) 
        {
          var newStrokeWidth = obj.myCustomOptionKeepStrokeWidth / ((obj.scaleX + obj.scaleY) / 2);
          obj.set('strokeWidth', newStrokeWidth);
        }
      }
    });

    if (origX > pointer.x) 
    {
      activeObj.set({ left: Math.abs(pointer.x) });
    }

    if (origY > pointer.y) 
    {
      activeObj.set({ top: Math.abs(pointer.y) });
    }

    activeObj.set(
    { 
      width: Math.abs(origX - pointer.x) 
    });

    activeObj.set(
    { 
      height: Math.abs(origY - pointer.y) 
    });

    activeObj.setCoords();
    inst.canvas.renderAll();

  };

  Rectangle.prototype.onMouseDown = function (o) 
  {
    var inst = this;

    if (rectMode) 
    {
      inst.enable();
    }
    else 
    {
      inst.disable();
      window.deleteObject = function () 
      {
        canvas.getActiveObject().remove();
      }
    }

    var pointer = inst.canvas.getPointer(o.e);
    origX = pointer.x;
    origY = pointer.y;


    //Add labels to rectangles
    fabric.Writebox = fabric.util.createClass(fabric.Rect, 
    {
      type: 'rectangle',
      initialize: function (element, options) 
      {
        this.callSuper('initialize', element, options);
        options && this.set('lockUniScaling', options.lockUniScaling);
        options && this.set('translations', options.translations || '');
      },

      toObject: function () 
      {
        return fabric.util.object.extend(this.callSuper('toObject'), 
        {
          translations: this.translations,
          lockUniScaling: this.lockUniScaling
        });
      },

      _render: function (ctx) 
      {
        this.callSuper('_render', ctx);
        ctx.font = '15px Times';
        ctx.fillStyle = '#0040FF';
        ctx.fillText(this.translations, -this.width / 2 + 4, -this.height / 2 + 20);
      }
    });

    //Count rectangles
    rect_count += 1

    var rect = new fabric.Writebox(
    {
      left: origX,
      top: origY,
      originX: 'left',
      originY: 'top',
      width: pointer.x - origX,
      height: pointer.y - origY,
      angle: 0,
      transparentCorners: false,
      hasBorders: false,
      hasControls: true,
      hasRotatingPoint: false,
      translations:translations,
      key:key,
    });

    inst.canvas.add(rect).setActiveObject(rect);
    canvas.selection = false

  };

  Rectangle.prototype.isEnable = function () 
  {
    return this.isDrawing;
  }

  Rectangle.prototype.enable = function () 
  {
    this.isDrawing = true;
  }

  Rectangle.prototype.disable = function () 
  {
    this.isDrawing = false;
  }  

  return Rectangle;
}());

//delete selected object
function deleteObj() 
{
  // get active object or active group
  var activeObject = canvas.getActiveObject();
  
  activeGroup = canvas.getActiveGroup();
  
  //if its just one shape you want delete
  if (activeObject)
  {
    if (confirm('Are you sure?')) 
    {
      canvas.remove(activeObject);
    } 
  } 

  //if there is a group of shapes you want delete
  else if (activeGroup) 
  {
    if (confirm('Are you sure?')) 
    {
      var objectsInGroup = activeGroup.getObjects();
      canvas.discardActiveGroup();
      objectsInGroup.forEach(function (object) 
      {
        canvas.remove(object);
      });
    }
  }
}

//Getting coordinations of shapes in json file
var coords = []


const getData = () => 
{
  const Data = JSON.parse(JSON.stringify(canvas))
  Data.objects.map((objects, index) => 
  {
    // check if the object is polygon or not, because the shape is different 
    if (objects.type == 'rectangle' && objects.width) 
    
    {
      coords.push(
      {
        "Shape": `${objects.translations}`,
        "Type" : types,
        "Key" :`${objects.keys}`,
        "x": objects.left,
        "y": objects.top,
        "heigth": objects.height,
        "width": objects.width
      })
    }
    // else push just rec points
    else if(objects.type == 'polygon' && objects.width) 
    {
      coords.push(
      {
        "Shape": `Polygon ${objects.points[0].translations}`,
        "Type" : objects.types,
        "Key" : keys,
        'points': objects.points,
        "heigth": objects.height,
        "width": objects.width
      })
    }
  })

  $("<a />", 
  {
    "download": "data.json",
    "href": "data:application/json," + encodeURIComponent(JSON.stringify(coords,null, ' '))
  }).appendTo("body")

  .click(function () 
  {
    // for not duplicating the things 
    coords = []
    $(this).remove()
  })[0].click()
}

$('#json-data').click(function () 
{
  getData()
})

let translations = 'Rect'
let key = ' '
let types = ' '

// taking value and key from django template
function category(value,key,type)
{
  translations = value
  key = key
  types = type
}
