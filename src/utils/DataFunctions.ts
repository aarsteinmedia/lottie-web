import type {
  AnimationData,
  Characacter,
  DocumentData,
  LottieAsset,
  LottieLayer,
  Shape,
  ShapeColorValue,
  Vector3,
} from '@/types'
import type ShapePath from '@/utils/shapes/ShapePath'

import { ShapeType } from '@/utils/enums'

export function completeData(animationData: AnimationData) {
  if (animationData.__complete) {
    return
  }
  new CheckColors(animationData)
  new CheckText(animationData)
  new CheckChars(animationData)
  new CheckPathProperties(animationData)
  new CheckShapes(animationData)
  completeLayers(animationData.layers, animationData.assets)
  completeChars(animationData.chars ?? [], animationData.assets)
  animationData.__complete = true
}

export function completeLayers(layers: LottieLayer[],
  comps: (LottieLayer | LottieAsset)[]) {
  const { length } = layers

  for (let i = 0; i < length; i++) {
    if (!('ks' in layers[i]) || layers[i].completed) {
      continue
    }
    layers[i].completed = true
    if (layers[i].hasMask) {
      if (!layers[i].masksProperties) {
        continue
      }
      const { length: jLen } = layers[i].masksProperties ?? []

      for (let j = 0; j < jLen; j++) {
        if ((layers[i].masksProperties?.[j].pt?.k as ShapePath | undefined)?.i) {
          convertPathsToAbsoluteValues(layers[i].masksProperties?.[j].pt?.k as ShapePath)
          continue
        }
        if (!layers[i].masksProperties?.[j]) {
          continue
        }
        const { length: kLen } =
          (layers[i].masksProperties?.[j].pt?.k as ShapePath[] | undefined) ?? []

        for (let k = 0; k < kLen; k++) {
          convertPathsToAbsoluteValues((layers[i].masksProperties?.[j].pt?.k as ShapePath[])[k].s?.[0])
          convertPathsToAbsoluteValues((layers[i].masksProperties?.[j].pt?.k as ShapePath[])[k].e?.[0])
        }
      }
    }

    switch (layers[i].ty) {
      case 0: { // Precomposition Layer
        layers[i].layers = findCompLayers(layers[i].refId, comps) as LottieLayer[]
        completeLayers(layers[i].layers as LottieLayer[], comps)
        break
      }
      case 4: { // Shape Layer
        completeShapes(layers[i].shapes)
        break
      }
      case 5: // TextLayer
      //
    }
  }
}

export function completeShapes(arr: Shape[] = []) {
  const { length } = arr

  for (let i = length - 1; i >= 0; i--) {
    if (arr[i].ty === ShapeType.Group) {
      completeShapes(arr[i].it as Shape[])
      continue
    }
    if (arr[i].ty === ShapeType.Path) {
      if ((arr[i].ks?.k as ShapePath | undefined)?.i) {
        convertPathsToAbsoluteValues(arr[i].ks?.k as ShapePath)
        continue
      }
      const { length: jLen } = (arr[i].ks?.k as ShapePath[] | undefined) ?? []

      for (let j = 0; j < jLen; j++) {
        convertPathsToAbsoluteValues((arr[i].ks?.k as ShapePath[])[j]?.s?.[0])
        convertPathsToAbsoluteValues((arr[i].ks?.k as ShapePath[])[j]?.e?.[0])
      }
    }
  }
}

function completeChars(chars: Characacter[] | null,
  assets: (LottieLayer | LottieAsset)[]) {
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

function findComp(id: string, comps: (LottieLayer | LottieAsset)[]) {
  let i = 0
  const len = comps.length

  while (i < len) {
    if (comps[i].id === id) {
      return comps[i]
    }
    i++
  }

  return null
}

function findCompLayers(id?: string, comps?: (LottieLayer | LottieAsset)[]) {
  if (!id || !comps) {
    return
  }
  const comp = findComp(id, comps)

  if (comp?.layers) {
    if (!comp.layers.__used) {
      comp.layers.__used = true

      return comp.layers
    }

    return JSON.parse(JSON.stringify(comp.layers)) as (LottieLayer | LottieAsset)[]
  }

  return null
}

export function checkVersion(minimum: Vector3, animVersionString: string) {
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

abstract class CheckProperties {
  minimumVersion: Vector3 = [0,
    0,
    0]
  constructor(animationData: AnimationData) {
    if (!checkVersion(this.minimumVersion, animationData.v)) {
      return
    }
    this.iterateLayers(animationData.layers)
    const { length } = animationData.assets

    for (let i = 0; i < length; i++) {
      const { layers } = animationData.assets[i]

      if (!layers) {
        continue
      }
      this.iterateLayers(layers)
    }
  }

  iterateLayers(layers: LottieLayer[]) {
    const { length } = layers

    for (let i = 0; i < length; i++) {
      if (layers[i].ty === 5) {
        this.updateTextLayer(layers[i])
      }
    }
  }

  updateTextLayer(_textLayer: LottieLayer) {
    throw new Error(`${this.constructor.name}: Method updateTextLayer is not implemented`)
  }
}

class CheckText extends CheckProperties {
  override minimumVersion: Vector3 = [4,
    4,
    14]

  override updateTextLayer(textLayer: LottieLayer) {
    const documentData = textLayer.t?.d

    if (!textLayer.t?.d || !documentData) {
      return
    }
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

class CheckChars {
  private minimumVersion: Vector3 = [4,
    7,
    99]
  constructor(animationData: AnimationData) {
    if (
      !animationData.chars ||
      checkVersion(this.minimumVersion, animationData.v)
    ) {
      return
    }
    const { length } = animationData.chars

    for (let i = 0; i < length; i++) {
      const { data, t } = animationData.chars[i]

      if (!data?.shapes) {
        continue
      }
      completeShapes(data.shapes)
      data.ip = 0
      data.op = 99999
      data.st = 0
      data.sr = 1
      data.ks = {
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

      if (t) {
        continue
      }
      data.shapes.push({ ty: ShapeType.NoStyle } as Shape)
      data.shapes[0].it?.push({
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
          k: 0
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
      } as unknown as Shape)
    }
  }
}

class CheckPathProperties extends CheckProperties {
  override minimumVersion: Vector3 = [5,
    7,
    15]

  override updateTextLayer(textLayer: LottieLayer) {
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
}

class CheckColors extends CheckProperties {
  override minimumVersion: Vector3 = [4,
    1,
    9]

  override iterateLayers(layers: LottieLayer[]) {
    const len = layers.length

    for (let i = 0; i < len; i++) {
      if (layers[i].ty === 4) {
        this.iterateShapes(layers[i].shapes)
      }
    }
  }

  private iterateShapes(shapes?: Shape[]) {
    if (!shapes) {
      return
    }
    const { length } = shapes

    for (let i = 0; i < length; i++) {
      if (shapes[i].ty === ShapeType.Group) {
        this.iterateShapes(shapes[i].it)
        continue
      }
      if (shapes[i].ty !== ShapeType.Fill && shapes[i].ty !== ShapeType.Stroke) {
        continue
      }
      if (shapes[i].c?.k && (shapes[i].c?.k as ShapeColorValue[] | undefined)?.[0].i) {
        const { length: jLen } = (shapes[i].c?.k as ShapeColorValue[] | undefined) ?? []

        for (let j = 0; j < jLen; j++) {
          if ((shapes[i].c?.k as ShapeColorValue[] | undefined)?.[j].s) {
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[0] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[1] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[2] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[3] /= 255
          }
          if ((shapes[i].c?.k as ShapeColorValue[] | undefined)?.[j].e) {
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[0] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[1] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[2] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].e[3] /= 255
          }
        }
        continue
      }
      ;(shapes[i].c?.k as number[])[0] /= 255
      ;(shapes[i].c?.k as number[])[1] /= 255
      ;(shapes[i].c?.k as number[])[2] /= 255
      ;(shapes[i].c?.k as number[])[3] /= 255
    }
  }
}

class CheckShapes extends CheckProperties {
  override minimumVersion: Vector3 = [4,
    4,
    18]

  override iterateLayers(layers: LottieLayer[]) {
    const { length } = layers

    for (let i = 0; i < length; i++) {
      if (layers[i].hasMask) {
        const maskProps = layers[i].masksProperties,
          { length: jLen } = maskProps ?? []

        for (let j = 0; j < jLen; j++) {
          if (!maskProps) {
            continue
          }

          const isUnidiemntional = maskProps[j].pt?.k && !Array.isArray(maskProps[j].pt?.k)

          if (isUnidiemntional) {
            const kShapePath = maskProps[j].pt?.k

            if (!kShapePath || Array.isArray(kShapePath)) {
              continue
            }
            kShapePath.c = Boolean(maskProps[j].cl)
            continue
          }
          const { length: kLen } = (maskProps[j].pt?.k as ShapePath[] | undefined) ?? []

          for (let k = 0; k < kLen; k++) {

            const sShapePaths = (maskProps[j].pt?.k as ShapePath[])[k].s

            if (sShapePaths) {
              sShapePaths[0].c = Boolean(maskProps[j].cl)
            }

            const eShapePaths = (maskProps[j].pt?.k as ShapePath[])[k].e

            if (eShapePaths) {
              eShapePaths[0].c = Boolean(maskProps[j].cl)
            }
          }
        }
      }
      if (layers[i].ty === 4) {
        this.completeClosingShapes(layers[i].shapes)
      }
    }
  }

  private completeClosingShapes(arr: Shape[]) {
    const { length } = arr

    for (let i = length - 1; i >= 0; i--) {
      if (arr[i].ty === ShapeType.Group) {
        this.completeClosingShapes(arr[i].it as Shape[])
        continue
      }
      if (arr[i].ty !== ShapeType.Path) {
        continue
      }
      if ((arr[i].ks?.k as ShapePath | undefined)?.i) {
        ;(arr[i].ks?.k as ShapePath).c = Boolean(arr[i].closed)
        continue
      }
      const { length: jLen } = (arr[i].ks?.k as ShapePath[] | undefined) ?? []

      for (let j = 0; j < jLen; j++) {
        if ((arr[i].ks?.k as ShapePath[])[j]?.s) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ;(arr[i].ks?.k as ShapePath[])[j].s![0].c = Boolean(arr[i].closed)
        }
        if ((arr[i].ks?.k as ShapePath[])[j]?.e) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ;(arr[i].ks?.k as ShapePath[])[j].e![0].c = Boolean(arr[i].closed)
        }
      }
    }
  }
}
