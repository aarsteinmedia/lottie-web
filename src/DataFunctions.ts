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

import { ShapeType } from '@/enums'

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
  completeChars(animationData.chars || [], animationData.assets)
  animationData.__complete = true
}

export function completeLayers(
  layers: LottieLayer[],
  comps: (LottieLayer | LottieAsset)[]
) {
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
      const { length: jLen } = layers[i].masksProperties || []
      for (let j = 0; j < jLen; j++) {
        if ((layers[i].masksProperties?.[j].pt?.k as ShapePath).i) {
          convertPathsToAbsoluteValues(
            layers[i].masksProperties?.[j].pt?.k as ShapePath
          )
          continue
        }
        if (!layers[i].masksProperties![j]) {
          continue
        }
        const { length: kLen } =
          (layers[i].masksProperties?.[j].pt?.k as ShapePath[]) || []
        for (let k = 0; k < kLen; k++) {
          convertPathsToAbsoluteValues(
            (layers[i].masksProperties?.[j].pt?.k as ShapePath[])[k].s?.[0]
          )
          convertPathsToAbsoluteValues(
            (layers[i].masksProperties?.[j].pt?.k as ShapePath[])[k].e?.[0]
          )
        }
      }
    }

    switch (layers[i].ty) {
      case 0: // Precomposition Layer
        layers[i].layers = findCompLayers(layers[i].refId, comps)
        completeLayers(layers[i].layers as LottieLayer[], comps)
        break
      case 4: // Shape Layer
        completeShapes(layers[i].shapes || [])
        break
      case 5: // TextLayer
      //
    }
  }
}

export function completeShapes(arr: Shape[]) {
  const { length } = arr
  for (let i = length - 1; i >= 0; i--) {
    if (arr[i].ty === 'gr') {
      completeShapes(arr[i].it as Shape[])
      continue
    }
    if (arr[i].ty === 'sh') {
      if ((arr[i].ks?.k as ShapePath).i) {
        convertPathsToAbsoluteValues(arr[i].ks?.k as ShapePath)
        continue
      }
      const { length: jLen } = (arr[i].ks?.k as ShapePath[]) || []
      for (let j = 0; j < jLen; j++) {
        convertPathsToAbsoluteValues((arr[i].ks?.k as ShapePath[])[j]?.s?.[0])
        convertPathsToAbsoluteValues((arr[i].ks?.k as ShapePath[])[j]?.e?.[0])
      }
    }
  }
}

function completeChars(
  chars: Characacter[],
  assets: (LottieLayer | LottieAsset)[]
) {
  if (!chars) {
    return
  }
  const { length } = chars
  for (let i = 0; i < length; i++) {
    if (chars[i].t !== 1) {
      continue
    }
    chars[i].data.layers = findCompLayers(chars[i].data.refId, assets)
    completeLayers(chars[i].data.layers || [], assets)
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
  if (comp) {
    if (!comp.layers?.__used) {
      comp.layers!.__used = true
      return comp.layers
    }
    return JSON.parse(JSON.stringify(comp.layers))
  }
  return null
}

export function checkVersion(minimum: Vector3, animVersionString: string) {
  const animVersion = animVersionString
    ? animVersionString.split('.').map((str) => Number(str))
    : [100, 100, 100]
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

class CheckText {
  private minimumVersion: Vector3 = [4, 4, 14]

  constructor(animationData: AnimationData) {
    if (checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const { length } = animationData.assets
        for (let i = 0; i < length; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    for (let i = 0; i < length; i++) {
      if (layers[i].ty === 5) {
        this.updateTextLayer(layers[i])
      }
    }
  }

  private updateTextLayer(textLayer: LottieLayer) {
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
  private minimumVersion: Vector3 = [4, 7, 99]
  constructor(animationData: AnimationData) {
    if (
      !animationData.chars ||
      checkVersion(this.minimumVersion, animationData.v)
    ) {
      return
    }
    const { length } = animationData.chars
    for (let i = 0; i < length; i++) {
      if (animationData.chars[i].data && animationData.chars[i].data.shapes) {
        completeShapes(animationData.chars[i].data.shapes || [])
        animationData.chars[i].data.ip = 0
        animationData.chars[i].data.op = 99999
        animationData.chars[i].data.st = 0
        animationData.chars[i].data.sr = 1
        animationData.chars[i].data.ks = {
          a: { a: 0, k: [0, 0] },
          o: { a: 0, k: 100 },
          p: { a: 0, k: [0, 0] },
          r: { a: 0, k: 0 as any },
          s: { a: 0, k: [100, 100] },
        } as any
        if (!animationData.chars[i].t) {
          animationData.chars[i].data.shapes?.push({
            ty: ShapeType.NoStyle,
          } as Shape)
          animationData.chars[i].data.shapes?.[0].it?.push({
            a: { a: 0, k: [0, 0] },
            o: { a: 0, k: 100 },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: 0 },
            s: { a: 0, k: [100, 100] },
            sa: { a: 0, k: 0 },
            sk: { a: 0, k: 0 },
            ty: ShapeType.Transform,
          } as unknown as Shape)
        }
      }
    }
  }
}

class CheckPathProperties {
  private minimumVersion: Vector3 = [5, 7, 15]

  constructor(animationData: AnimationData) {
    if (checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const { length } = animationData.assets
        for (let i = 0; i < length; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    for (let i = 0; i < length; i++) {
      if (layers[i].ty === 5) {
        this.updateTextLayer(layers[i])
      }
    }
  }

  private updateTextLayer(textLayer: LottieLayer) {
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

class CheckColors {
  private minimumVersion: Vector3 = [4, 1, 9]

  constructor(animationData: AnimationData) {
    if (checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const len = animationData.assets.length
        for (let i = 0; i < len; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i].layers!)
          }
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
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
      if (shapes[i].ty === 'gr') {
        this.iterateShapes(shapes[i].it)
        continue
      }
      if (shapes[i].ty !== 'fl' && shapes[i].ty !== 'st') {
        continue
      }
      if (shapes[i].c?.k && (shapes[i].c?.k as ShapeColorValue[])[0].i) {
        const { length: jLen } = (shapes[i].c?.k as ShapeColorValue[]) || []
        for (let j = 0; j < jLen; j++) {
          if ((shapes[i].c?.k as ShapeColorValue[])[j].s) {
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[0] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[1] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[2] /= 255
            ;(shapes[i].c?.k as ShapeColorValue[])[j].s[3] /= 255
          }
          if ((shapes[i].c?.k as ShapeColorValue[])[j].e) {
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

class CheckShapes {
  private minimumVersion: Vector3 = [4, 4, 18]

  constructor(animationData: AnimationData) {
    if (checkVersion(this.minimumVersion, animationData.v)) {
      this.iterateLayers(animationData.layers)
      if (animationData.assets) {
        const { length } = animationData.assets
        for (let i = 0; i < length; i++) {
          if (animationData.assets[i].layers) {
            this.iterateLayers(animationData.assets[i]?.layers || [])
          }
        }
      }
    }
  }

  private completeClosingShapes(arr: Shape[]) {
    const { length } = arr
    for (let i = length - 1; i >= 0; i--) {
      if (arr[i].ty === 'gr') {
        this.completeClosingShapes(arr[i].it as Shape[])
        continue
      }
      if (arr[i].ty !== 'sh') {
        continue
      }
      if ((arr[i].ks?.k as ShapePath).i) {
        ;(arr[i].ks?.k as ShapePath).c = !!arr[i].closed
        continue
      }
      const { length: jLen } = (arr[i].ks?.k as ShapePath[]) || []
      for (let j = 0; j < jLen; j++) {
        if ((arr[i].ks?.k as ShapePath[])[j]?.s) {
          ;(arr[i].ks?.k as ShapePath[])[j].s![0].c = !!arr[i].closed
        }
        if ((arr[i].ks?.k as ShapePath[])[j]?.e) {
          ;(arr[i].ks?.k as ShapePath[])[j].e![0].c = !!arr[i].closed
        }
      }
    }
  }

  private iterateLayers(layers: LottieLayer[]) {
    const { length } = layers
    for (let i = 0; i < length; i++) {
      if (layers[i].hasMask) {
        const maskProps = layers[i].masksProperties,
          { length: jLen } = maskProps || []
        for (let j = 0; j < jLen; j++) {
          if (!maskProps) {
            continue
          }
          if ((maskProps[j].pt?.k as ShapePath).i) {
            ;(maskProps[j].pt!.k as ShapePath).c = !!maskProps[j].cl
            continue
          }
          const { length: kLen } = (maskProps[j].pt?.k as ShapePath[]) || []
          for (let k = 0; k < kLen; k++) {
            // eslint-disable-next-line max-depth
            if ((maskProps[j].pt?.k as ShapePath[])[k].s) {
              ;(maskProps[j].pt?.k as ShapePath[])[k].s![0].c =
                !!maskProps?.[j].cl
            }
            // eslint-disable-next-line max-depth
            if ((maskProps[j].pt?.k as ShapePath[])[k].e) {
              ;(maskProps[j].pt?.k as ShapePath[])[k].e![0].c =
                !!maskProps?.[j].cl
            }
          }
        }
      }
      if (layers[i].ty === 4) {
        this.completeClosingShapes(layers[i].shapes || [])
      }
    }
  }
}
