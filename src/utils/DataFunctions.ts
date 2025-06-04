import type {
  AnimationData,
  Characacter, DocumentData, LottieLayer, Shape,
  Vector3
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { isArray, isArrayOfNum } from '.'
import { ShapeType } from './enums'

function completeLayers(layers: LottieLayer[],
  comps: LottieLayer[]) {

  let layerData: LottieLayer

  const { length } = layers

  for (let i = 0; i < length; i++) {
    layerData = layers[i]
    if (!('ks' in layerData) || layerData.completed) {
      continue
    }
    layerData.completed = true
    if (layerData.hasMask) {
      const maskProps = layerData.masksProperties,
        { length: jLen } = maskProps ?? []

      for (let j = 0; j < jLen; j++) {

        const shapePath = maskProps?.[j].pt?.k

        if (!shapePath) {
          continue
        }

        if (!isArray(shapePath)) {
          convertPathsToAbsoluteValues(shapePath)
          continue
        }

        const { length: kLen } = shapePath

        for (let k = 0; k < kLen; k++) {
          const ePaths = shapePath[k].e,
            sPaths = shapePath[k].s

          if (ePaths) {
            convertPathsToAbsoluteValues(ePaths[0])
          }
          if (sPaths) {
            convertPathsToAbsoluteValues(sPaths[0])
          }
        }
      }
    }
    switch (layerData.ty) {
      case 0: { // Precomposition Layer
        layerData.layers = findCompLayers(layerData.refId, comps) as LottieLayer[]
        completeLayers(layerData.layers as LottieLayer[], comps)

        break
      }
      case 4: { // Shape Layer
        completeShapes(layerData.shapes)

        break
      }
      case 5: { // TextLayer
        completeText(layerData)

        break
      }
      default:
      // Do nothing
    }
  }
}

function completeChars(chars: Characacter[] | null,
  assets: LottieLayer[]) {
  if (!chars) {
    return
  }
  const { length } = chars

  for (let i = 0; i < length; i++) {
    if (chars[i].t !== 1) {
      continue
    }
    const { data } = chars[i]

    if (data) {
      data.layers = findCompLayers(data.refId, assets) as LottieLayer[]
    }
    completeLayers(chars[i].data?.layers ?? [], assets)
  }
}

function findComp(id: string, comps: LottieLayer[]) {
  let i = 0
  const { length } = comps

  while (i < length) {
    if (comps[i].id === id) {
      return comps[i]
    }
    i++
  }

  return null
}

function findCompLayers(id?: string, comps?: LottieLayer[]) {
  if (!id || !comps) {
    return
  }
  const comp = findComp(id, comps)

  if (comp?.layers) {
    if (!comp.layers.__used) {
      comp.layers.__used = true

      return comp.layers
    }

    return JSON.parse(JSON.stringify(comp.layers)) as LottieLayer[]
  }

  return null
}

function completeShapes(arr: Shape[] = []) {
  const { length } = arr

  for (let i = length - 1; i >= 0; i--) {
    if (arr[i].ty === ShapeType.Group) {
      completeShapes(arr[i].it)
      continue
    }
    if (arr[i].ty === ShapeType.Path) {
      const shapePath = arr[i].ks?.k

      if (!isArray(shapePath)) {
        convertPathsToAbsoluteValues(shapePath)

        continue
      }
      const { length: jLen } = shapePath

      for (let j = 0; j < jLen; j++) {
        const ePaths = shapePath[j].e,
          sPaths = shapePath[j].s

        if (ePaths) {
          convertPathsToAbsoluteValues(ePaths[0])
        }
        if (sPaths) {
          convertPathsToAbsoluteValues(sPaths[0])
        }
      }
    }
  }
}

function convertPathsToAbsoluteValues(path?: ShapePath) {
  if (!path) {
    return
  }

  const { length } = path.i

  for (let i = 0; i < length; i++) {
    path.i[i][0] += path.v[i][0]
    path.i[i][1] += path.v[i][1]
    path.o[i][0] += path.v[i][0]
    path.o[i][1] += path.v[i][1]
  }
}

function checkVersion(minimum: Vector3, animVersionString: string) {
  const animVersion = animVersionString
    ? animVersionString.split('.').map(Number)
    : [100,
      100,
      100]

  if (minimum[0] > animVersion[0]) {
    return true
  }
  if (animVersion[0] > minimum[0]) {
    return false
  }
  if (minimum[1] > animVersion[1]) {
    return true
  }
  if (animVersion[1] > minimum[1]) {
    return false
  }
  if (minimum[2] > animVersion[2]) {
    return true
  }
  if (animVersion[2] > minimum[2]) {
    return false
  }

  return null
}

const iterateLayers = (
  layers: LottieLayer[], updateData: (layer: LottieLayer) => void, type: number
) => {
  const { length } = layers

  for (let i = 0; i < length; i++) {
    if (layers[i].ty === type) {
      updateData(layers[i])
    }
  }
}

const checkText = (() => {
  const minimumVersion = [4,
    4,
    14] as Vector3

  const updateTextLayer = (textLayer: LottieLayer) => {
    const documentData = textLayer.t?.d

    if (textLayer.t && documentData) {
      textLayer.t.d = {
        k: [
          {
            s: documentData,
            t: 0,
          },
        ],
      } as DocumentData
    }
  }

  return (animationData: AnimationData) => {
    if (!checkVersion(minimumVersion, animationData.v)) {
      return
    }
    iterateLayers(
      animationData.layers, updateTextLayer, 5
    )
    const { length } = animationData.assets

    for (let i = 0; i < length; i++) {
      if (animationData.assets[i].layers) {
        iterateLayers(
          animationData.assets[i].layers as LottieLayer[], updateTextLayer, 5
        )
      }
    }
  }
})()

const checkChars = (() => {
  const minimumVersion = [4,
    7,
    99] as Vector3

  return (animationData: AnimationData) => {
    if (!animationData.chars || checkVersion(minimumVersion, animationData.v)) {
      return
    }

    const { length } = animationData.chars

    for (let i = 0; i < length; i++) {
      const charData = animationData.chars[i]

      if (!charData.data?.shapes) {
        continue

      }
      completeShapes(charData.data.shapes)
      charData.data.ip = 0
      charData.data.op = 99999
      charData.data.st = 0
      charData.data.sr = 1
      charData.data.ks = {
        a: {
          a: 0,
          k: [0, 0]
        },
        o: {
          a: 0,
          k: 100
        },
        p: {
          a: 0,
          k: [0, 0]
        },
        r: {
          a: 0,
          k: 0 as any
        },
        s: {
          a: 0,
          k: [100, 100]
        },
      } as Shape
      if (!animationData.chars[i].t) {
        charData.data.shapes.push({ ty: ShapeType.NoStyle } as Shape)
        charData.data.shapes[0].it?.push({
          a: {
            a: 0,
            k: [0, 0]
          },
          o: {
            a: 0,
            k: 100
          },
          p: {
            a: 0,
            k: [0, 0]
          },
          r: {
            a: 0,
            k: 0 as any
          },
          s: {
            a: 0,
            k: [100, 100]
          },
          sa: {
            a: 0,
            k: 0
          },
          sk: {
            a: 0,
            k: 0
          },
          ty: ShapeType.Transform,
        } as Shape)
      }
    }
  }
})()

const checkPathProperties = (() => {
  const minimumVersion = [5,
    7,
    15] as Vector3

  const updateTextLayer = (textLayer: LottieLayer) => {
    const pathData = textLayer.t?.p

    if (!pathData) {
      return
    }

    if (typeof pathData.a === 'number') {
      pathData.a = {
        a: 0,
        k: pathData.a,
      }
    }
    if (typeof pathData.p === 'number') {
      pathData.p = {
        a: 0,
        k: pathData.p,
      }
    }
    if (typeof pathData.r === 'number') {
      pathData.r = {
        a: 0,
        k: pathData.r,
      }
    }
  }

  return (animationData: AnimationData) => {
    if (!checkVersion(minimumVersion, animationData.v)) {
      return
    }
    iterateLayers(
      animationData.layers, updateTextLayer, 5
    )

    const { length } = animationData.assets

    for (let i = 0; i < length; i++) {
      if (animationData.assets[i].layers) {
        iterateLayers(
          animationData.assets[i].layers as LottieLayer[], updateTextLayer, 5
        )
      }
    }
  }
})()

const checkColors = (() => {
  const minimumVersion = [4,
    1,
    9] as Vector3

  const iterateShapes = (shapes: Shape[]) => {
      const { length } = shapes

      for (let i = 0; i < length; i++) {
        if (shapes[i].ty === ShapeType.Group) {
          iterateShapes(shapes[i].it ?? [])

          continue
        }

        if (shapes[i].ty !== ShapeType.Fill && shapes[i].ty !== ShapeType.Stroke) {
          continue
        }

        const shapeColorValue = shapes[i].c?.k

        if (!shapeColorValue || typeof shapeColorValue === 'number') {
          continue
        }

        if (isArray(shapeColorValue) && isArrayOfNum(shapeColorValue)) {
          shapeColorValue[0] /= 255
          shapeColorValue[1] /= 255
          shapeColorValue[2] /= 255
          shapeColorValue[3] /= 255

          continue
        }

        const { length: jLen } = shapeColorValue

        for (let j = 0; j < jLen; j += 1) {
        // if (shapeColorValue[j].s) {
          shapeColorValue[j].s[0] /= 255
          shapeColorValue[j].s[1] /= 255
          shapeColorValue[j].s[2] /= 255
          shapeColorValue[j].s[3] /= 255
          // }
          // if (shapeColorValue[j].e) {
          shapeColorValue[j].e[0] /= 255
          shapeColorValue[j].e[1] /= 255
          shapeColorValue[j].e[2] /= 255
          shapeColorValue[j].e[3] /= 255
        // }
        }
      }
    },

    _iterateLayers = (layers: LottieLayer[]) => {
      const { length } = layers

      for (let i = 0; i < length; i++) {
        if (layers[i].ty === 4) {
          iterateShapes(layers[i].shapes)
        }
      }
    }

  return (animationData: AnimationData) => {
    if (!checkVersion(minimumVersion, animationData.v)) {
      return
    }
    _iterateLayers(animationData.layers)

    const { length } = animationData.assets

    for (let i = 0; i < length; i++) {
      if (animationData.assets[i].layers) {
        _iterateLayers(animationData.assets[i].layers as LottieLayer[])
      }
    }
  }
})()

const checkShapes = (() => {
  const minimumVersion = [4,
    4,
    18] as Vector3

  const completeClosingShapes = (arr: Shape[]) => {

      const { length } = arr

      for (let i = length - 1; i >= 0; i--) {
        if (arr[i].ty === ShapeType.Group) {
          completeClosingShapes(arr[i].it ?? [])

          continue
        }

        if (arr[i].ty !== ShapeType.Path) {
          continue
        }

        const shapePath = arr[i].ks?.k

        if (!shapePath) {
          continue
        }

        const isClosed = Boolean(arr[i].closed)

        if (!isArray(shapePath)) {
          shapePath.c = isClosed
          continue
        }

        const { length: jLen } = shapePath

        for (let j = 0; j < jLen; j += 1) {
          const ePaths = shapePath[j].e,
            sPaths = shapePath[j].s

          if (ePaths) {
            ePaths[0].c = isClosed
          }
          if (sPaths) {
            sPaths[0].c = isClosed
          }
        }
      }
    },

    _iterateLayers = (layers: LottieLayer[]) => {
      let layerData

      const { length } = layers

      for (let i = 0; i < length; i++) {
        layerData = layers[i]
        if (layerData.hasMask) {
          const maskProps = layerData.masksProperties,

            { length: jLen } = maskProps ?? []

          for (let j = 0; j < jLen; j++) {
            const shapePath = maskProps?.[j].pt?.k

            if (!shapePath) {
              continue
            }


            const isClosed = Boolean(maskProps[j].cl)

            if (!isArray(shapePath)) {
              shapePath.c = isClosed
              continue
            }

            const { length: kLen } = shapePath

            for (let k = 0; k < kLen; k++) {
              const ePaths = shapePath[k].e,
                sPaths = shapePath[k].s

              if (ePaths) {
                ePaths[0].c = isClosed
              }
              if (sPaths) {
                sPaths[0].c = isClosed
              }
            }
          }
        }
        if (layerData.ty === 4) {
          completeClosingShapes(layerData.shapes)
        }
      }
    }

  return (animationData: AnimationData) => {
    if (!checkVersion(minimumVersion, animationData.v)) {
      return
    }
    _iterateLayers(animationData.layers)

    const { length } = animationData.assets

    for (let i = 0; i < length; i++) {
      if (animationData.assets[i].layers) {
        _iterateLayers(animationData.assets[i].layers as LottieLayer[])
      }
    }
  }
})()

function completeData(animationData: AnimationData) {
  if (animationData.__complete) {
    return
  }
  checkColors(animationData)
  checkText(animationData)
  checkChars(animationData)
  checkPathProperties(animationData)
  checkShapes(animationData)
  completeLayers(animationData.layers, animationData.assets as LottieLayer[])
  completeChars(animationData.chars, animationData.assets as LottieLayer[])
  animationData.__complete = true
}

function completeText(data: LottieLayer) {
  if (data.t?.a?.length === 0 && !('m' in (data.t.p ?? {}))) {
    // data.singleShape = true;
  }
}

const DataFunctions = {
  checkChars,
  checkColors,
  checkPathProperties,
  checkShapes,
  completeData,
  completeLayers
}

export default DataFunctions