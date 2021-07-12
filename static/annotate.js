var min = 99;
var max = 999999;
//Drawing Mode & Zoom
var polygonMode = false;
var rectMode = false;
var zoomMode = false;
//To Know which shape we are selecting
var activeShape = false;
//Array of points and lines of the polygon
var pointArray = new Array();
var lineArray = new Array();
//To know which line is been just drawed by the user 
var activeLine;

var canvas

//event is fired after whole content is loaded
$(window).load(function(){canvasCreation(image)});

function canvasCreation(image)
{
  //Create polygons and deactivate rectangle Mode
  prototypefabric.initCanvas(image);
  $('#create-polygon').click(function() 
  {
    prototypefabric.polygon.drawPolygon();
    rectMode = false
  });

  //Create Rectangles ==> Activate Rectangle mode , and deactivate polygon mode
  $('#create-rect').click(function() 
  {
    polygonMode = false
    rectMode = true
    var rect = new Rectangle(canvas);
  });

  //download the image with all the objects the user has drawn on it, under the name : download.png
  const download = document.getElementById('save_image');
  download.addEventListener('click', function(e) 
  {
    console.log(canvas.toDataURL());
    var link = document.createElement('a');
    link.download = 'download.png';
    link.href = canvas.toDataURL();
    link.click();
    link.delete;
  });

  //Activate and deactivate the Zoom mode
  //When you click the first time you enable making zoom and when u click another time you deactivate it
  $('#zoom-mode').click(function() 
  {
    zoomMode = !zoomMode
    // Call function of zoom
    zoomFun()
  })

  //Function For zoom in picture
  const zoomFun = () => 
  {
    //By using the mouse wheel, you can zoom in and zoom out the image
    canvas.on('mouse:wheel', function(opt) 
    {
      if(zoomMode)
      {
        var delta = opt.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 20) zoom = 20;
        if (zoom < 0.01) zoom = 0.01;
        // canvas.setZoom(zoom);
        canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
        opt.e.preventDefault();
        opt.e.stopPropagation();
      }
    })
  }
  zoomFun()
};

//A function  assigned to a variable prototypefabric
var prototypefabric = new function () 
{
  this.initCanvas = function (imageUrl) 
  {
    canvas = window._canvas = new fabric.Canvas('c');

    // set width and height for showing image in canvas
    canvas.setWidth(1300);
    canvas.setHeight(600);

    // Showing image in canvas and set parametrs of that picture
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), 
    {
      width: canvas.width,
      height: canvas.height,
      originX: 'left',
      originY: 'top'
    });

    // mousedown is triggered from an Element while the cursor is over the place
    canvas.on('mouse:down', function (options) 
    {
      if(options.target && options.target.id == pointArray[0].id)
      {
        prototypefabric.polygon.generatePolygon(pointArray);
      }
      if(polygonMode)
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
  addPoint : function(options) 
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
      originX:'center',
      originY:'center',
      id:id,
      objectCaching:false
    });

    if(pointArray.length == 0)
    {
      //First point user make for polygon will be red until he finish drawing by clicking on it at the end
      circle.set(
      {
        fill:'red'
      })
    }

    //Points of polygon
    var points = [(posX),(posY),(posX),(posY)];

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
    if(activeShape)
    {
      //getting the position of the cursor
      var pos = canvas.getPointer(options.e);
      // getting points if the polygon drawed
      var points = activeShape.get("points");

      //Push that coordinations to the array of points
      points.push(
      {
        x: pos.x,
        y: pos.y
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
      var polyPoint = [{x:(posX),y:(posY)}];
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
  generatePolygon : function(pointArray)
  {
    var points = new Array();

    $.each(pointArray,function(index,point)
    {
      points.push(
      {
        x:point.left,
        y:point.top
      });
      canvas.remove(point);
    });

    $.each(lineArray,function(index,line)
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
    var inst=this;
    this.canvas = canvas;
    this.className= 'Rectangle';
    this.isDrawing = false;
    this.bindEvents();
  }

	Rectangle.prototype.bindEvents = function() 
  {
    var inst = this;

    inst.canvas.on('mouse:down', function(o) 
    {
      inst.onMouseDown(o);
    });

    inst.canvas.on('mouse:move', function(o) 
    {
      inst.onMouseMove(o);
    });

    inst.canvas.on('mouse:up', function(o) 
    {
      inst.onMouseUp(o);
    });

    inst.canvas.on('object:moving', function(o) 
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

    if(!inst.isEnable())
    { 
      return;
    }
    //Get position of cursor
    var pointer = inst.canvas.getPointer(o.e);
    //get the rectangle we just drawed now
    var activeObj = inst.canvas.getActiveObject();

    //Color of the rectangle and width
    activeObj.stroke= '#FFFF00',
    activeObj.strokeWidth = 1;
    activeObj.fill = 'transparent';

    if(origX > pointer.x)
    {
      activeObj.set({ left: Math.abs(pointer.x) });
    }

    if(origY > pointer.y)
    {
      activeObj.set({ top: Math.abs(pointer.y) });
    }

    activeObj.set({ width: Math.abs(origX - pointer.x) });
    activeObj.set({ height: Math.abs(origY - pointer.y) });

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
      window.deleteObject = function() 
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
      initialize: function(element, options) 
      {
        this.callSuper('initialize', element, options);
        options && this.set('lockUniScaling', options.lockUniScaling);
        options && this.set('label', options.label || '');
      },

      toObject: function() 
      {
        return fabric.util.object.extend(this.callSuper('toObject'), 
        {
          label: this.label,
          lockUniScaling: this.lockUniScaling
        });
      },
      
      _render: function(ctx) 
      {
        this.callSuper('_render', ctx);
        ctx.font = '15px Times';
        ctx.fillStyle = '#FFFF00';
        ctx.fillText(this.label, -this.width / 2 + 4, -this.height / 2 + 20);
      }
    });

    rect_count += 1

    //Parameters of rectangle
    var rect = new fabric.Writebox(
    {
      left: origX,
      top: origY,
      originX: 'left',
      originY: 'top',
      width: pointer.x-origX,
      height: pointer.y-origY,
      angle: 0,
      transparentCorners: false,
      hasBorders: false,
      hasControls: true,
      label:`Rect ${rect_count}`
    });

  	inst.canvas.add(rect).setActiveObject(rect);
    console.log(coordinations);
    canvas.selection = false

  };

  Rectangle.prototype.isEnable = function()
  {
    return this.isDrawing;
  }

  Rectangle.prototype.enable = function()
  {
    this.isDrawing = true;
  }

  Rectangle.prototype.disable = function()
  {
    this.isDrawing = false;
  }

  return Rectangle;
}());

//delete selected object
function deleteObj()
{
  // get active object or active group
  var activeObject = canvas.getActiveObject(),
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
      objectsInGroup.forEach(function(object) 
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
  Data.objects.map((objects, index)=>
  {
    console.log(objects);
    coords.push(
    {
      "Shape":`${objects.type} ${index+1}`,
      "x":objects.left,
      "y":objects.top,
      "heigth":objects.height,
      "width":objects.width
    })
  })

  console.log(coords);

  $("<a />", 
  {
    "download": "data.json",
    "href" : "data:application/json," + encodeURIComponent(JSON.stringify(coords))
  }).appendTo("body")

  .click(function() 
  {
    $(this).remove()
  })[0].click()
}

$('#json-data').click(function() 
{
  getData()
})
   