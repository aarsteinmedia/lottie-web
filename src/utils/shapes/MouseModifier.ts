import type SVGShapeData from '@/elements/helpers/shapes/SVGShapeData'
import type { ElementInterfaceUnion, Shape } from '@/types'

import ShapeModifier from '@/utils/shapes/ShapeModifier'
import { registerModifier } from '@/utils/shapes/ShapeModifiers'

export default class MouseModifier extends ShapeModifier {
  data?: Shape | Shape[]
  positions: unknown[] = []
  override addShapeToModifier(_shapeData: SVGShapeData) {
    this.positions.push([])
  }


  override initModifierProperties(_elem: ElementInterfaceUnion, data: Shape | Shape[]) {
    this.getValue = this.processKeys
    this.data = data
    this.positions = []
  }

  override processKeys(forceRender?: boolean) {
    if (this.elem?.globalData.frameId === this.frameId && !forceRender) {
      return
    }
    this._mdf = true
  }

  processPath(
    path, mouseCoords, positions
  ) {
    const { length } = path.v
    const vValues = []
    const oValues = []
    const iValues = []
    let theta
    let x
    let y

    /// / OPTION A
    for (let i = 0; i < length; i++) {
      if (!positions.v[i]) {
        positions.v[i] = [path.v[i][0], path.v[i][1]]
        positions.o[i] = [path.o[i][0], path.o[i][1]]
        positions.i[i] = [path.i[i][0], path.i[i][1]]
        positions.distV[i] = 0
        positions.distO[i] = 0
        positions.distI[i] = 0
      }
      theta = Math.atan2(path.v[i][1] - mouseCoords[1],
        path.v[i][0] - mouseCoords[0])

      x = mouseCoords[0] - positions.v[i][0]
      y = mouseCoords[1] - positions.v[i][1]
      let distance = Math.sqrt(x * x + y * y)

      positions.distV[i] += (distance - positions.distV[i]) * this.data.dc

      positions.v[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][0]
      positions.v[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distV[i]) / 2 + path.v[i][1]

      theta = Math.atan2(path.o[i][1] - mouseCoords[1],
        path.o[i][0] - mouseCoords[0])

      x = mouseCoords[0] - positions.o[i][0]
      y = mouseCoords[1] - positions.o[i][1]
      distance = Math.sqrt(x * x + y * y)
      positions.distO[i] += (distance - positions.distO[i]) * this.data.dc

      positions.o[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][0]
      positions.o[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distO[i]) / 2 + path.o[i][1]

      theta = Math.atan2(path.i[i][1] - mouseCoords[1],
        path.i[i][0] - mouseCoords[0])

      x = mouseCoords[0] - positions.i[i][0]
      y = mouseCoords[1] - positions.i[i][1]
      distance = Math.sqrt(x * x + y * y)
      positions.distI[i] += (distance - positions.distI[i]) * this.data.dc

      positions.i[i][0] = Math.cos(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][0]
      positions.i[i][1] = Math.sin(theta) * Math.max(0, this.data.maxDist - positions.distI[i]) / 2 + path.i[i][1]

      /// //OPTION 1
      vValues.push(positions.v[i])
      oValues.push(positions.o[i])
      iValues.push(positions.i[i])

      /// //OPTION 2
      // vValues.push(positions.v[i]);
      // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
      // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);

      /// //OPTION 3
      // vValues.push(positions.v[i]);
      // iValues.push(path.i[i]);
      // oValues.push(path.o[i]);

    /// //OPTION 4
    // vValues.push(path.v[i]);
    // oValues.push(positions.o[i]);
    // iValues.push(positions.i[i]);
    }

    /// / OPTION B
    /* for(i=0;i<len;i+=1){
        if(!positions.v[i]){
            positions.v[i] = [path.v[i][0],path.v[i][1]];
            positions.o[i] = [path.o[i][0],path.o[i][1]];
            positions.i[i] = [path.i[i][0],path.i[i][1]];
            positions.distV[i] = 0;

        }
        theta = Math.atan2(
            positions.v[i][1] - mouseCoords[1],
            positions.v[i][0] - mouseCoords[0]
        );
        x = mouseCoords[0] - positions.v[i][0];
        y = mouseCoords[1] - positions.v[i][1];
        var distance = this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

        positions.v[i][0] += Math.cos(theta) * distance + (path.v[i][0] - positions.v[i][0]) * this.data.dc;
        positions.v[i][1] += Math.sin(theta) * distance + (path.v[i][1] - positions.v[i][1]) * this.data.dc;

        theta = Math.atan2(
            positions.o[i][1] - mouseCoords[1],
            positions.o[i][0] - mouseCoords[0]
        );
        x = mouseCoords[0] - positions.o[i][0];
        y = mouseCoords[1] - positions.o[i][1];
        var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

        positions.o[i][0] += Math.cos(theta) * distance + (path.o[i][0] - positions.o[i][0]) * this.data.dc;
        positions.o[i][1] += Math.sin(theta) * distance + (path.o[i][1] - positions.o[i][1]) * this.data.dc;

        theta = Math.atan2(
            positions.i[i][1] - mouseCoords[1],
            positions.i[i][0] - mouseCoords[0]
        );
        x = mouseCoords[0] - positions.i[i][0];
        y = mouseCoords[1] - positions.i[i][1];
        var distance =  this.data.ss * this.data.mx / Math.sqrt( (x * x) + (y * y) );

        positions.i[i][0] += Math.cos(theta) * distance + (path.i[i][0] - positions.i[i][0]) * this.data.dc;
        positions.i[i][1] += Math.sin(theta) * distance + (path.i[i][1] - positions.i[i][1]) * this.data.dc;

        /////OPTION 1
        //vValues.push(positions.v[i]);
        // oValues.push(positions.o[i]);
        // iValues.push(positions.i[i]);

        /////OPTION 2
        //vValues.push(positions.v[i]);
        // iValues.push([path.i[i][0]+(positions.v[i][0]-path.v[i][0]),path.i[i][1]+(positions.v[i][1]-path.v[i][1])]);
        // oValues.push([path.o[i][0]+(positions.v[i][0]-path.v[i][0]),path.o[i][1]+(positions.v[i][1]-path.v[i][1])]);

        /////OPTION 3
        //vValues.push(positions.v[i]);
        //iValues.push(path.i[i]);
        //oValues.push(path.o[i]);

        /////OPTION 4
        //vValues.push(path.v[i]);
        // oValues.push(positions.o[i]);
        // iValues.push(positions.i[i]);
    } */

    return {
      c: path.c,
      i: iValues,
      o: oValues,
      v: vValues,
    }
  }

  processShapes() {
    const { mouseX, mouseY } = this.elem.globalData
    let shapePaths

    let i
    const len = this.shapes.length
    let j
    let jLen

    if (mouseX) {
      const localMouseCoords = this.elem.globalToLocal([mouseX,
        mouseY,
        0])

      let shapeData
      const newPaths = []

      for (i = 0; i < len; i += 1) {
        shapeData = this.shapes[i]
        if (!shapeData.shape._mdf && !this._mdf) {
          shapeData.shape.paths = shapeData.last
        } else {
          shapeData.shape._mdf = true
          shapePaths = shapeData.shape.paths
          jLen = shapePaths.length
          for (j = 0; j < jLen; j += 1) {
            if (!this.positions[i][j]) {
              this.positions[i][j] = {
                distI: [],
                distO: [],
                distV: [],
                i: [],
                o: [],
                v: [],
              }
            }
            newPaths.push(this.processPath(
              shapePaths[j], localMouseCoords, this.positions[i][j]
            ))
          }
          shapeData.shape.paths = newPaths
          shapeData.last = newPaths
        }
      }
    }
  }
}

registerModifier('ms', MouseModifier)
