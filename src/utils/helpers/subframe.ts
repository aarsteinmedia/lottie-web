const isSubframeEnabled = { current: true },

  setSubframeEnabled = (flag: boolean) => {
    isSubframeEnabled.current = flag
  },
  getSubframeEnabled = () => isSubframeEnabled.current


export {
  getSubframeEnabled,
  setSubframeEnabled
}