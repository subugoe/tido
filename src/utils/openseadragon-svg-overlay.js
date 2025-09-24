// OpenSeadragon SVG Overlay plugin 0.0.5

export default class SVGOverlay {
  $ = null;
  viewer = null;
  containerWidth = 0;
  containerHeight = 0;
  svg = null;
  svgNS = 'http://www.w3.org/2000/svg';
  node = null;

  constructor(viewer, openSeaDragon) {
    if (!openSeaDragon) {
      throw new Error('OpenSeadragon is missing.');
    }
    this.$ = openSeaDragon;
    this.createOverlay(viewer);
  }

  getNode() {
    return this.node;
  }

  createOverlay(viewer) {
    this.viewer = viewer;
    this.containerWidth = 0;
    this.containerHeight = 0;

    this.svg = document.createElementNS(this.svgNS, 'svg');
    this.svg.style.position = 'absolute';
    this.svg.style.left = 0;
    this.svg.style.top = 0;
    this.svg.style.width = '100%';
    this.svg.style.height = '100%';
    this.viewer.canvas.appendChild(this.svg);

    this.node = document.createElementNS(this.svgNS, 'g');
    this.svg.appendChild(this.node);

    this.viewer.addHandler('animation', () =>  {
      this.resize();
    });

    this.viewer.addHandler('open', () =>  {
      this.resize();
    });

    this.viewer.addHandler('rotate', () =>  {
      this.resize();
    });

    this.viewer.addHandler('flip', () =>  {
      this.resize();
    });

    this.viewer.addHandler('resize', () => {
      this.resize();
    });

    this.resize();
  }

  resize() {
    if (this.containerWidth !== this.viewer.container.clientWidth) {
      this.containerWidth = this.viewer.container.clientWidth;
      this.svg.setAttribute('width', this.containerWidth);
    }

    if (this.containerHeight !== this.viewer.container.clientHeight) {
      this.containerHeight = this.viewer.container.clientHeight;
      this.svg.setAttribute('height', this.containerHeight);
    }

    var p = this.viewer.viewport.pixelFromPoint(new this.$.Point(0, 0), true);
    var zoom = this.viewer.viewport.getZoom(true);
    var rotation = this.viewer.viewport.getRotation();
    var flipped = this.viewer.viewport.getFlip();
    // TODO: Expose an accessor for _containerInnerSize in the OSD API so we don't have to use the private variable.
    var containerSizeX = this.viewer.viewport._containerInnerSize.x
    const imageSize = this.viewer.world.getItemAt(0).getContentSize();
    var aspectRatio = imageSize.y / imageSize.x;
    var scaleX = containerSizeX * zoom;
    var scaleY = containerSizeX * aspectRatio * zoom;

    if (flipped){
      // Makes the x component of the scale negative to flip the svg
      scaleX = -scaleX;
      // Translates svg back into the correct coordinates when the x scale is made negative.
      p.x = -p.x + containerSizeX;
    }

    this.node.setAttribute('transform',
      'translate(' + p.x + ',' + p.y + ') scale(' + scaleX + ',' + scaleY + ') rotate(' + rotation + ')');
  }

  onClick(node, handler) {
    // TODO: Fast click for mobile browsers

    new this.$.MouseTracker({
      element: node,
      clickHandler: handler
    }).setTracking(true);
  }
}
