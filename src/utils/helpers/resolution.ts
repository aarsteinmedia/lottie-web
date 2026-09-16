const curveSegments = { default: 150 },

  setDefaultCurveSegments = (value: number) => {
    curveSegments.default = value
  },
  getDefaultCurveSegments = () => curveSegments.default,
  shouldRoundValues = { current: false },

  getShouldRoundValues = () => shouldRoundValues.current,
  setShouldRoundValues = (value: boolean) => {
    shouldRoundValues.current = value
  },
  setQuality = (value: string | number) => {
    if (typeof value === 'string') {
      switch (value) {
        case 'high': {
          setDefaultCurveSegments(200)
          break
        }
        case 'low': {
          setDefaultCurveSegments(10)
          break
        }
        case 'medium':
        default: {
          setDefaultCurveSegments(50)
          break
        }
      }
    } else if (!isNaN(value) && value > 1) {
      setDefaultCurveSegments(value)
    }

    setShouldRoundValues(getDefaultCurveSegments() < 50)
  }

export {
  getDefaultCurveSegments,
  getShouldRoundValues,
  setQuality
}