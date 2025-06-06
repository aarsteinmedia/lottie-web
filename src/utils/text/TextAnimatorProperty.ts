import type {
  BezierPoint,
  DocumentData,
  ElementInterfaceIntersect,
  PathInfo,
  TextData,
  TextPathData,
  Vector3,
} from '@/types'
import type MultiDimensionalProperty from '@/utils/properties/MultiDimensionalProperty'
import type ValueProperty from '@/utils/properties/ValueProperty'
import type EllShapeProperty from '@/utils/shapes/properties/EllShapeProperty'
import type RectShapeProperty from '@/utils/shapes/properties/RectShapeProperty'
import type { ShapeProperty } from '@/utils/shapes/properties/ShapeProperty'
import type StarShapeProperty from '@/utils/shapes/properties/StarShapeProperty'

import { isArray } from '@/utils'
import { buildBezierData, type BezierData } from '@/utils/Bezier'
import { RendererType } from '@/utils/enums'
import { createSizedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import Matrix from '@/utils/Matrix'
import PropertyFactory from '@/utils/PropertyFactory'
import LetterProps from '@/utils/text/LetterProps'
import TextAnimatorDataProperty from '@/utils/text/TextAnimatorDataProperty'

const rgbToHSV = (
    r: number, g: number, b: number
  ): Vector3 => {
    const max = Math.max(
        r, g, b
      ),
      min = Math.min(
        r, g, b
      ),
      d = max - min
    let h = 0
    const s = max === 0 ? 0 : d / max,
      v = max / 255

    switch (max) {
      case min: {
        h = 0
        break
      }
      case r: {
        h = g - b + d * (g < b ? 6 : 0)
        h /= 6 * d
        break
      }
      case g: {
        h = b - r + d * 2
        h /= 6 * d
        break
      }
      case b: {
        h = r - g + d * 4
        h /= 6 * d
        break
      }
      default: {
        break
      }
    }

    return [h,
      s,
      v]
  },
  HSVtoRGB = (
    h: number, s: number, v: number
  ): Vector3 => {
    let r = 0,
      g = 0,
      b = 0
    const i = Math.floor(h * 6),
      f = h * 6 - i,
      p = v * (1 - s),
      q = v * (1 - f * s),
      t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0: {
        r = v
        g = t
        b = p
        break
      }
      case 1: {
        r = q
        g = v
        b = p
        break
      }
      case 2: {
        r = p
        g = v
        b = t
        break
      }
      case 3: {
        r = p
        g = q
        b = v
        break
      }
      case 4: {
        r = t
        g = p
        b = v
        break
      }
      case 5: {
        r = v
        g = p
        b = q
        break
      }
      default: {
        break
      }
    }

    return [r,
      g,
      b]
  },
  addBrightnessToRGB = (color: Vector3, offset: number) => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[2] += offset
    if (hsv[2] > 1) {
      hsv[2] = 1
    } else if (hsv[2] < 0) {
      hsv[2] = 0
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  },
  addHueToRGB = (color: Vector3, offset: number): Vector3 => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[0] += offset / 360
    if (hsv[0] > 1) {
      hsv[0] -= 1
    } else if (hsv[0] < 0) {
      hsv[0]++
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  },
  addSaturationToRGB = (color: Vector3, offset: number) => {
    const hsv = rgbToHSV(
      color[0] * 255, color[1] * 255, color[2] * 255
    )

    hsv[1] += offset
    if (hsv[1] > 1) {
      hsv[1] = 1
    } else if (hsv[1] <= 0) {
      hsv[1] = 0
    }

    return HSVtoRGB(
      hsv[0], hsv[1], hsv[2]
    )
  }

export default class TextAnimatorProperty extends DynamicPropertyContainer {
  _frameId: number
  _isFirstFrame: boolean
  defaultPropsArray: number[] = []
  lettersChangedFlag: boolean
  renderedLetters: LetterProps[]
  private _animatorsData: TextAnimatorDataProperty[]
  private _elem: ElementInterfaceIntersect
  private _hasMaskedPath: boolean
  private _moreOptions: { alignment: MultiDimensionalProperty }
  private _pathData: TextPathData
  private _renderType: RendererType
  private _textData: TextData
  private mHelper = new Matrix()

  constructor(
    textData: TextData,
    renderType: RendererType,
    elem: ElementInterfaceIntersect
  ) {
    super()
    this._isFirstFrame = true
    this._hasMaskedPath = false
    this._frameId = -1
    this._textData = textData
    this._renderType = renderType
    this._elem = elem
    this._animatorsData = createSizedArray(Number(this._textData.a?.length))
    this._pathData = {} as TextPathData
    this._moreOptions = { alignment: {} as MultiDimensionalProperty }
    this.renderedLetters = []
    this.lettersChangedFlag = false
    this.initDynamicPropertyContainer(elem)
  }

  getMeasures(documentData: DocumentData, lettersChangedFlag?: boolean) {
    try {
      this.lettersChangedFlag = Boolean(lettersChangedFlag)
      if (
        !this._mdf &&
        !this._isFirstFrame &&
        !lettersChangedFlag &&
        (!this._hasMaskedPath || !this._pathData.m?._mdf)
      ) {
        return
      }
      this._isFirstFrame = false
      const alignment = this._moreOptions.alignment.v,
        animators = this._animatorsData,
        textData = this._textData,
        matrixHelper = this.mHelper,
        renderType = this._renderType

      let renderedLettersCount = this.renderedLetters.length,
        xPos,
        yPos,
        i,
        len
      const letters = documentData.l

      let pathInfo: undefined | PathInfo,
        currentLength = 0,
        currentPoint: undefined | BezierPoint,
        segmentLength = 0,
        shouldMeasure,
        pointInd = 0,
        segmentInd = 0,
        prevPoint: undefined | BezierPoint,
        points: null | BezierPoint[] = null,
        segments: BezierData[] = [],
        partialLength = 0,
        totalLength = 0,
        perc,
        tanAngle,
        mask: null | ShapeProperty | StarShapeProperty | RectShapeProperty | EllShapeProperty = null

      if (this._hasMaskedPath && this._pathData.m) {
        mask = this._pathData.m
        if (!this._pathData.n || this._pathData._mdf) {
          let paths = mask.v

          if (paths) {
            if (this._pathData.r?.v) {
              paths = paths.reverse()
            }
            pathInfo = {
              segments: [],
              tLength: 0,
            }
            len = Number(paths._length) - 1
            let bezierData

            totalLength = 0
            for (i = 0; i < len; i++) {
              if (isArray(paths)) {
                continue
              }
              bezierData = buildBezierData(
                paths.v[i],
                paths.v[i + 1],
                [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
                [
                  paths.i[i + 1][0] - paths.v[i + 1][0], paths.i[i + 1][1] - paths.v[i + 1][1],
                ]
              )
              pathInfo.tLength += bezierData.segmentLength
              pathInfo.segments.push(bezierData)
              totalLength += bezierData.segmentLength
            }
            i = len
            if (mask.v?.c && !isArray(paths)) {
              bezierData = buildBezierData(
                paths.v[i],
                paths.v[0],
                [paths.o[i][0] - paths.v[i][0], paths.o[i][1] - paths.v[i][1]],
                [paths.i[0][0] - paths.v[0][0], paths.i[0][1] - paths.v[0][1]]
              )
              pathInfo.tLength += bezierData.segmentLength
              pathInfo.segments.push(bezierData)
              totalLength += bezierData.segmentLength
            }
            this._pathData.pi = pathInfo
          }
        }
        pathInfo = this._pathData.pi

        currentLength = this._pathData.f?.v ?? 0
        segmentInd = 0
        pointInd = 1
        segmentLength = 0
        // shouldMeasure = true
        segments = pathInfo?.segments ?? []

        if (currentLength > 0 && mask.v?.c) {
          if (pathInfo?.tLength ?? 0 < Math.abs(currentLength)) {
            currentLength = -Math.abs(currentLength) % (pathInfo?.tLength ?? 0)
          }
          segmentInd = segments.length - 1
          points = segments[segmentInd].points
          pointInd = points.length - 1

          while (currentLength < 0) {
            currentLength += points[pointInd]?.partialLength
            pointInd -= 1
            if (pointInd < 0) {
              segmentInd -= 1
              points = segments[segmentInd].points
              pointInd = points.length - 1
            }
          }
        }

        points = segments[segmentInd]?.points ?? []
        prevPoint = points[pointInd - 1]
        currentPoint = points[pointInd]

        // TODO: Canvas text layers break down here
        partialLength = currentPoint.partialLength // ?? 0

      }

      len = letters.length || 0
      xPos = 0
      yPos = 0
      const yOff = (documentData.finalSize || 0) * 1.2 * 0.714
      let isFirstLine = true,
        animatorProps,
        animatorSelector,
        j,
        letterValue: LetterProps

      const jLen = animators.length

      let mult: number | number[] | undefined,
        ind = -1,
        offf: number,
        xPathPos = 0,
        yPathPos = 0
      const initPathPos = currentLength,
        initSegmentInd = segmentInd,
        initPointInd = pointInd
      let currentLine = -1,
        elemOpacity,
        sc: Vector3 = [0,
          0,
          0],
        sw = 0,
        fc: Vector3 = [0,
          0,
          0],
        k,
        letterSw,
        letterSc,
        letterFc,
        letterM = '',
        letterP = this.defaultPropsArray,
        letterO

      if (documentData.j === 2 || documentData.j === 1) {
        let animatorJustifyOffset = 0
        let animatorFirstCharOffset = 0
        const justifyOffsetMult = documentData.j === 2 ? -0.5 : -1
        let lastIndex = 0
        let isNewLine = true

        for (i = 0; i < len; i++) {
          if (letters[i].n) {
            if (animatorJustifyOffset) {
              animatorJustifyOffset += animatorFirstCharOffset
            }
            while (lastIndex < i) {
              letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset
              lastIndex++
            }
            animatorJustifyOffset = 0
            isNewLine = true
            continue
          }
          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            if (!animatorProps?.t.propType) {
              continue
            }
            const { v: animVal } = animatorProps.t

            if (typeof animVal !== 'number') {
              continue
            }

            if (isNewLine && documentData.j === 2) {
              animatorFirstCharOffset += animVal * justifyOffsetMult
            }
            animatorSelector = animators[j].s
            mult = animatorSelector?.getMult(letters[i].anIndexes[j],
              textData.a?.[j].s?.totalChars)

            if (mult !== undefined) {
              if (isArray(mult)) {
                animatorJustifyOffset +=
                  animVal * mult[0] * justifyOffsetMult
              } else {
                animatorJustifyOffset +=
                  animVal * mult * justifyOffsetMult
              }
            }

          }
          isNewLine = false
        }
        if (animatorJustifyOffset) {
          animatorJustifyOffset += animatorFirstCharOffset
        }
        while (lastIndex < i) {
          letters[lastIndex].animatorJustifyOffset = animatorJustifyOffset
          lastIndex++
        }
      }

      for (i = 0; i < len; i++) {
        matrixHelper.reset()
        elemOpacity = 1
        if (letters[i].n) {
          xPos = 0
          yPos += documentData.yOffset || 0
          yPos += isFirstLine ? 1 : 0
          currentLength = initPathPos
          isFirstLine = false
          if (this._hasMaskedPath) {
            segmentInd = initSegmentInd || 0
            pointInd = initPointInd || 0
            points = segments[segmentInd]?.points ?? []
            prevPoint = points[pointInd - 1]
            currentPoint = points[pointInd]
            partialLength = currentPoint.partialLength
            segmentLength = 0
          }
          letterM = ''
          letterFc = ''
          letterSw = ''
          letterO = ''
          letterP = this.defaultPropsArray
        } else {
          if (this._hasMaskedPath) {
            if (currentLine !== letters[i].line) {
              switch (documentData.j) {
                case 1: {
                  currentLength +=
                  totalLength - documentData.lineWidths[letters[i].line]
                  break
                }
                case 2: {
                  currentLength +=
                  (totalLength - documentData.lineWidths[letters[i].line]) /
                  2
                  break
                }
                case undefined:
                default: {
                  break
                }
              }
              currentLine = letters[i].line || 0
            }
            if (ind !== letters[i].ind) {
              if (letters[ind]) {
                currentLength += Number(letters[ind].extra)
              }
              currentLength += (letters[i].an || 0) / 2
              ind = letters[i].ind || 0
            }
            currentLength += alignment[0] * (letters[i].an || 0) * 0.005
            let animatorOffset = 0

            for (j = 0; j < jLen; j++) {
              animatorProps = animators[j].a
              if (animatorProps?.p.propType) {
                animatorSelector = animators[j].s
                mult = animatorSelector?.getMult(letters[i].anIndexes[j],
                  textData.a?.[j].s?.totalChars)
                if (!mult) {
                  continue
                }
                if (isArray(animatorProps.p.v)) {
                  if (isArray(mult)) {
                    animatorOffset += animatorProps.p.v[0] * mult[0]
                  } else {
                    animatorOffset += animatorProps.p.v[0] * mult
                  }
                }
              }
              if (!animatorProps?.a.propType) {
                continue
              }
              animatorSelector = animators[j].s
              mult = animatorSelector?.getMult(Number(letters[i].anIndexes[j]),
                textData.a?.[j].s?.totalChars)
              if (!mult) {
                continue
              }
              if (!isArray(animatorProps.a.v)) {
                continue
              }
              if (isArray(mult)) {
                animatorOffset += animatorProps.a.v[0] * mult[0]
                continue
              }
              animatorOffset += animatorProps.a.v[0] * mult
            }
            shouldMeasure = true

            // Force alignment only works with a single line for now
            if (this._pathData.a?.v) {
              currentLength =
              (letters[0].an || 0) * 0.5 +
              (totalLength -
                Number(this._pathData.f?.v) -
                (letters[0].an || 0) * 0.5 -
                letters[letters.length - 1].an * 0.5) *
                ind /
                (len - 1)
              currentLength += Number(this._pathData.f?.v)
            }
            while (shouldMeasure) {
              if (
                segmentLength + partialLength >= currentLength + animatorOffset ||
                !points
              ) {
                perc =
                (currentLength + animatorOffset - segmentLength) /
                (currentPoint?.partialLength || 0)
                xPathPos =
                Number(prevPoint?.point[0]) +
                (Number(currentPoint?.point[0]) - Number(prevPoint?.point[0])) *
                perc
                yPathPos =
                Number(prevPoint?.point[1]) +
                (Number(currentPoint?.point[1]) - Number(prevPoint?.point[1])) *
                perc
                matrixHelper.translate(-alignment[0] * letters[i].an * 0.005,
                  -(alignment[1] * yOff) * 0.01)
                shouldMeasure = false
              } else if (points.length > 0) {
                segmentLength += Number(currentPoint?.partialLength)
                pointInd++
                if (pointInd >= points.length) {
                  pointInd = 0
                  segmentInd++
                  if (segments[segmentInd]) {
                    points = segments[segmentInd].points
                  } else if (mask?.v?.c) {
                    pointInd = 0
                    segmentInd = 0
                    points = segments[segmentInd].points
                  } else {
                    segmentLength -= Number(currentPoint?.partialLength)
                    points = null
                  }
                }
                if (points) {
                  prevPoint = currentPoint
                  currentPoint = points[pointInd]
                  partialLength = currentPoint.partialLength
                }
              }
            }
            offf = letters[i].an / 2 - letters[i].add
            matrixHelper.translate(
              -offf, 0, 0
            )
          } else {
            offf = letters[i].an / 2 - letters[i].add
            matrixHelper.translate(
              -offf, 0, 0
            )

            // Grouping alignment
            matrixHelper.translate(
              -alignment[0] * letters[i].an * 0.005,
              -alignment[1] * yOff * 0.01,
              0
            )
          }

          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            if (!animatorProps?.t.propType) {
              continue
            }
            animatorSelector = animators[j].s
            mult = animatorSelector?.getMult(Number(letters[i].anIndexes[j]),
              textData.a?.[j].s?.totalChars)
            // This condition is to prevent applying tracking to first character in each line. Might be better to use a boolean "isNewLine"
            if (xPos !== 0 || documentData.j !== 0) {
              if (this._hasMaskedPath) {
                if (isArray(mult)) {
                  currentLength += Number(animatorProps.t.v) * mult[0]
                } else {
                  currentLength += Number(animatorProps.t.v) * Number(mult)
                }
                continue
              }

              if (isArray(mult)) {
                xPos += Number(animatorProps.t.v) * mult[0]
                continue
              }
              xPos += Number(animatorProps.t.v) * Number(mult)
            }
          }
          if (documentData.strokeWidthAnim) {
            sw = documentData.sw || 0
          }
          if (documentData.strokeColorAnim) {
            if (documentData.sc) {
              sc = [
                Number(documentData.sc[0]),
                Number(documentData.sc[1]),
                Number(documentData.sc[2]),
              ]
            } else {
              sc = [0,
                0,
                0]
            }
          }
          if (documentData.fillColorAnim && documentData.fc) {
            fc = [
              Number(documentData.fc[0]),
              Number(documentData.fc[1]),
              Number(documentData.fc[2]),
            ]
          }
          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            if (animatorProps?.a.propType) {
              animatorSelector = animators[j].s
              mult = animatorSelector?.getMult(letters[i].anIndexes[j],
                textData.a?.[j].s?.totalChars)
              if (!mult || !isArray(animatorProps.a.v)) {
                continue
              }

              if (isArray(mult)) {
                matrixHelper.translate(
                  -animatorProps.a.v[0] * mult[0],
                  -animatorProps.a.v[1] * mult[1],
                  animatorProps.a.v[2] * mult[2]
                )
                continue
              }
              matrixHelper.translate(
                -animatorProps.a.v[0] * mult,
                -animatorProps.a.v[1] * mult,
                animatorProps.a.v[2] * mult
              )
            }
          }
          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            if (animatorProps?.s.propType) {
              animatorSelector = animators[j].s
              mult = animatorSelector?.getMult(letters[i].anIndexes[j],
                textData.a?.[j].s?.totalChars)
              if (!mult || !isArray(animatorProps.s.v)) {
                continue
              }
              if (isArray(mult)) {
                matrixHelper.scale(
                  1 + (animatorProps.s.v[0] - 1) * mult[0],
                  1 + (animatorProps.s.v[1] - 1) * mult[1],
                  1
                )
                continue
              }
              matrixHelper.scale(
                1 + (animatorProps.s.v[0] - 1) * mult,
                1 + (animatorProps.s.v[1] - 1) * mult,
                1
              )
            }
          }

          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a
            animatorSelector = animators[j].s
            mult = animatorSelector?.getMult(letters[i].anIndexes[j],
              textData.a?.[j].s?.totalChars)
            if (!mult) {
              continue
            }
            if (animatorProps?.sk.propType) {
              if (isArray(mult)) {
                matrixHelper.skewFromAxis(-Number(animatorProps.sk.v) * mult[0],
                  Number(animatorProps.sa.v) * mult[1])
              } else {
                matrixHelper.skewFromAxis(-Number(animatorProps.sk.v) * mult,
                  Number(animatorProps.sa.v) * mult)
              }
            }
            if (animatorProps?.r.propType) {
              if (isArray(mult)) {
                matrixHelper.rotateZ(-Number(animatorProps.r.v) * mult[2])
              } else {
                matrixHelper.rotateZ(-Number(animatorProps.r.v) * mult)
              }
            }
            if (animatorProps?.ry.propType) {
              if (isArray(mult)) {
                matrixHelper.rotateY(Number(animatorProps.ry.v) * mult[1])
              } else {
                matrixHelper.rotateY(Number(animatorProps.ry.v) * mult)
              }
            }
            if (animatorProps?.rx.propType) {
              if (isArray(mult)) {
                matrixHelper.rotateX(Number(animatorProps.rx.v) * mult[0])
              } else {
                matrixHelper.rotateX(Number(animatorProps.rx.v) * mult)
              }
            }
            if (animatorProps?.o.propType) {
              if (isArray(mult)) {
                elemOpacity +=
                (Number(animatorProps.o.v) * mult[0] - elemOpacity) * mult[0]
              } else {
                elemOpacity +=
                (Number(animatorProps.o.v) * mult - elemOpacity) * mult
              }
            }
            if (documentData.strokeWidthAnim && animatorProps?.sw.propType) {
              if (isArray(mult)) {
                sw += Number(animatorProps.sw.v) * mult[0]
              } else {
                sw += Number(animatorProps.sw.v) * mult
              }
            }
            if (
              documentData.strokeColorAnim &&
              animatorProps?.sc.propType &&
              isArray(animatorProps.sc.v)
            ) {
              for (k = 0; k < 3; k++) {
                if (isArray(mult)) {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult[0]
                } else {
                  sc[k] += (animatorProps.sc.v[k] - sc[k]) * mult
                }
              }
            }
            if (documentData.fillColorAnim && documentData.fc) {
              if (animatorProps?.fc.propType) {
                for (k = 0; k < 3; k++) {
                  if (!isArray(animatorProps.fc.v)) {
                    continue
                  }
                  if (isArray(mult)) {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult[0]
                  } else {
                    fc[k] += (animatorProps.fc.v[k] - fc[k]) * mult
                  }
                }
              }
              if (animatorProps?.fh.propType) {
                if (isArray(mult)) {
                  fc = addHueToRGB(fc, Number(animatorProps.fh.v) * mult[0])
                } else {
                  fc = addHueToRGB(fc, Number(animatorProps.fh.v) * mult)
                }
              }
              if (animatorProps?.fs.propType) {
                if (isArray(mult)) {
                  fc = addSaturationToRGB(fc,
                    Number(animatorProps.fs.v) * mult[0])
                } else {
                  fc = addSaturationToRGB(fc, Number(animatorProps.fs.v) * mult)
                }
              }
              if (animatorProps?.fb.propType) {
                if (isArray(mult)) {
                  fc = addBrightnessToRGB(fc,
                    Number(animatorProps.fb.v) * mult[0])
                } else {
                  fc = addBrightnessToRGB(fc, Number(animatorProps.fb.v) * mult)
                }
              }
            }
          }

          for (j = 0; j < jLen; j++) {
            animatorProps = animators[j].a

            if (animatorProps?.p.propType) {
              animatorSelector = animators[j].s
              mult = animatorSelector?.getMult(letters[i].anIndexes[j],
                textData.a?.[j].s?.totalChars)
              if (!mult || !isArray(animatorProps.p.v)) {
                continue
              }
              if (this._hasMaskedPath) {
                if (isArray(mult)) {
                  matrixHelper.translate(
                    0,
                    animatorProps.p.v[1] * mult[0],
                    -animatorProps.p.v[2] * mult[1]
                  )
                } else {
                  matrixHelper.translate(
                    0,
                    animatorProps.p.v[1] * mult,
                    -animatorProps.p.v[2] * mult
                  )
                }
              } else if (isArray(mult)) {
                matrixHelper.translate(
                  animatorProps.p.v[0] * mult[0],
                  animatorProps.p.v[1] * mult[1],
                  -animatorProps.p.v[2] * mult[2]
                )
              } else {
                matrixHelper.translate(
                  animatorProps.p.v[0] * mult,
                  animatorProps.p.v[1] * mult,
                  -animatorProps.p.v[2] * mult
                )
              }
            }
          }
          if (documentData.strokeWidthAnim) {
            letterSw = sw < 0 ? 0 : sw
          }
          if (documentData.strokeColorAnim) {
            letterSc = `rgb(${Math.round(sc[0] * 255)},${Math.round(sc[1] * 255)},${Math.round(sc[2] * 255)})`
          }
          if (documentData.fillColorAnim && documentData.fc) {
            letterFc = `rgb(${Math.round(fc[0] * 255)},${Math.round(fc[1] * 255)},${Math.round(fc[2] * 255)})`
          }

          if (this._hasMaskedPath) {
            matrixHelper.translate(0, -Number(documentData.ls))

            matrixHelper.translate(
              0, alignment[1] * yOff * 0.01 + yPos, 0
            )
            if (this._pathData.p?.v) {
              tanAngle =
              (Number(currentPoint?.point[1]) - Number(prevPoint?.point[1])) /
              (Number(currentPoint?.point[0]) - Number(prevPoint?.point[0]))
              let rot = Math.atan(tanAngle) * 180 / Math.PI

              if (Number(currentPoint?.point[0]) < Number(prevPoint?.point[0])) {
                rot += 180
              }
              matrixHelper.rotate(-rot * Math.PI / 180)
            }
            matrixHelper.translate(
              xPathPos, yPathPos, 0
            )
            currentLength -= alignment[0] * letters[i].an * 0.005
            if (letters[i + 1] && ind !== letters[i + 1].ind) {
              currentLength += letters[i].an / 2
              currentLength +=
              documentData.tr * 0.001 * Number(documentData.finalSize)
            }
          } else {
            matrixHelper.translate(
              xPos, yPos, 0
            )

            if (documentData.ps) {
              matrixHelper.translate(
                documentData.ps[0],
                documentData.ps[1] + Number(documentData.ascent),
                0
              )
            }
            switch (documentData.j) {
              case 1: {
                matrixHelper.translate(
                  letters[i].animatorJustifyOffset +
                  Number(documentData.justifyOffset) +
                  (Number(documentData.boxWidth) -
                    Number(documentData.lineWidths[letters[i].line])),
                  0,
                  0
                )
                break
              }
              case 2: {
                matrixHelper.translate(
                  letters[i].animatorJustifyOffset +
                  Number(documentData.justifyOffset) +
                  (Number(documentData.boxWidth) -
                    Number(documentData.lineWidths[letters[i].line])) /
                    2,
                  0,
                  0
                )
                break
              }
              case undefined:
              default: {
                break
              }
            }
            matrixHelper.translate(0, -Number(documentData.ls))
            matrixHelper.translate(
              offf, 0, 0
            )
            matrixHelper.translate(
              alignment[0] * Number(letters[i].an) * 0.005,
              alignment[1] * yOff * 0.01,
              0
            )
            xPos +=
            letters[i].l +
            documentData.tr * 0.001 * Number(documentData.finalSize)
          }
          if (renderType === RendererType.HTML) {
            letterM = matrixHelper.toCSS()
          } else if (renderType === RendererType.SVG) {
            letterM = matrixHelper.to2dCSS()
          } else {
            letterP = [
              matrixHelper.props[0],
              matrixHelper.props[1],
              matrixHelper.props[2],
              matrixHelper.props[3],
              matrixHelper.props[4],
              matrixHelper.props[5],
              matrixHelper.props[6],
              matrixHelper.props[7],
              matrixHelper.props[8],
              matrixHelper.props[9],
              matrixHelper.props[10],
              matrixHelper.props[11],
              matrixHelper.props[12],
              matrixHelper.props[13],
              matrixHelper.props[14],
              matrixHelper.props[15],
            ]
          }
          letterO = elemOpacity
        }

        if (renderedLettersCount <= i) {
          letterValue = new LetterProps(
            Number(letterO),
            Number(letterSw),
            letterSc,
            letterFc,
            letterM,
            letterP
          )
          this.renderedLetters.push(letterValue)
          renderedLettersCount++
          this.lettersChangedFlag = true

          continue
        }

        letterValue = this.renderedLetters[i]
        this.lettersChangedFlag =
        letterValue.update(
          Number(letterO),
          Number(letterSw),
          letterSc,
          letterFc,
          letterM, // matrix()-string
          letterP
        ) || this.lettersChangedFlag

      }
    } catch (error) {
      console.error(this.constructor.name, error)
    }
  }

  override getValue() {
    if (this._elem.globalData?.frameId === this._frameId) {
      return 0
    }
    this._frameId = this._elem.globalData?.frameId ?? 0
    this.iterateDynamicProperties()

    return 0
  }

  searchProperties(_: DynamicPropertyContainer[]) {
    const { length } = this._textData.a ?? [],
      { getProp } = PropertyFactory

    for (let i = 0; i < length; i++) {
      this._animatorsData[i] = new TextAnimatorDataProperty(
        this._elem,
        this._textData.a?.[i],
        this as unknown as ElementInterfaceIntersect
      )
    }

    if (this._textData.p && 'm' in this._textData.p && this._elem.maskManager) {
      this._pathData = {
        a: getProp(
          this._elem, this._textData.p.a, 0, 0, this as unknown as ElementInterfaceIntersect
        ) as ValueProperty,
        f: getProp(
          this._elem, this._textData.p.f, 0, 0, this as unknown as ElementInterfaceIntersect
        ) as ValueProperty,
        l: getProp(
          this._elem, this._textData.p.l, 0, 0, this as unknown as ElementInterfaceIntersect
        ) as ValueProperty,
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
        p: getProp(
          this._elem, this._textData.p.p, 0, 0, this as unknown as ElementInterfaceIntersect
        ) as ValueProperty,
        r: getProp(
          this._elem, this._textData.p.r, 0, 0, this as unknown as ElementInterfaceIntersect
        ) as ValueProperty,
      }
      this._hasMaskedPath = true

    } else {
      this._hasMaskedPath = false
    }
    this._moreOptions.alignment = getProp(
      this._elem, this._textData.m?.a, 1, 0, this as unknown as ElementInterfaceIntersect
    ) as MultiDimensionalProperty
  }
}
